import uuid
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from docx import Document
from openai import OpenAI
import os
import shutil
import traceback
import json

router = APIRouter()

UPLOAD_FOLDER = "./output_contracts"
VERIFIED_FOLDER = "./verified_con"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(VERIFIED_FOLDER, exist_ok=True)

client = OpenAI(api_key="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")


def extract_text_from_docx(docx_path):
    doc = Document(docx_path)
    return "\n".join(para.text.strip() for para in doc.paragraphs if para.text.strip())

def ai_verify_contract(contract_text):
    prompt = (
    "You are a strict legal contract verification expert.\n"
    "Analyze the following M&A contract and validate whether the following required sections exist and contain non-placeholder values (no 'N/A', 'TBD', or empty):\n"
    "1. Acquirer name and address\n"
    "2. Seller name and address\n"
    "3. Jurisdiction for both parties\n"
    "4. Effective Date\n"
    "5. Closing Date\n"
    "6. Governing Law\n"
    "7. Purchase Price or Payment Method\n"
    "8. Warranty Survival Period\n"
    "9. Arbitration Organization and Location\n"
    "10. Signatory Names and Titles\n\n"
    "Instructions:\n"
    "- Return a strict JSON object only.\n"
    "- If ALL fields are present and valid, return:\n"
    "{ \"status\": \"Verified\", \"issues\": [] }\n"
    "- If ANY field is missing or contains placeholder/blank values, return:\n"
    "{ \"status\": \"Not Verified\", \"issues\": [ { \"field\": \"...\", \"issue\": \"...\", \"suggestion\": \"...\" } ] }\n\n"
    f"Contract:\n{contract_text}"
)

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            temperature=0.2,
            messages=[
                {"role": "system", "content": "You are a legal contract verification assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        reply = response.choices[0].message.content
        return json.loads(reply)
    except Exception as e:
        return {
            "status": "Not Verified",
            "issues": [{
                "field": "OpenAI",
                "issue": "Failed to parse or receive a valid response",
                "suggestion": str(e)
            }]
        }

@router.post("/verify-contract")
async def verify_contract(file: UploadFile = File(...)):
    # Save uploaded file with a unique name to avoid WinError 32
    unique_name = f"{uuid.uuid4().hex}_{file.filename}"
    upload_path = os.path.join(UPLOAD_FOLDER, unique_name)

    try:
        # Ensure safe file writing
        contents = await file.read()
        with open(upload_path, "wb") as buffer:
            buffer.write(contents)
        file.file.close()

        # Extract text
        contract_text = extract_text_from_docx(upload_path)

        # Run OpenAI check
        ai_result = ai_verify_contract(contract_text)

        if ai_result.get("status") == "Verified":
            verified_path = os.path.join(VERIFIED_FOLDER, f"verified_{file.filename}")
            shutil.move(upload_path, verified_path)
            return {
                "success": True,
                "verification_status": "Verified",
                "message": "All required fields appear valid.",
                "verified_file": f"verified_{file.filename}"
            }

        # If not verified
        os.remove(upload_path)
        return JSONResponse(status_code=200, content={
            "success": False,
            "verification_status": "Not Verified",
            "field_level_errors": ai_result.get("issues", []),
            "raw_analysis": ai_result
        })

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"success": False, "errors": [str(e)]})