import sys
import os
from docx2pdf import convert
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from datetime import datetime

from utils.io_handler import read_docx, write_docx
from utils.prompt_builder import build_prompt
from utils.openai_client import generate_output
from utils.date_checker import ensure_date_in_prompt



# Add parent directory of the script to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))




router = APIRouter()
@router.post("/generate-document/")
async def generate_document(file: UploadFile = File(...), guideline_path: str = Form(...)):
    input_path = os.path.join("temp", "tempno", os.path.basename(file.filename))

    output_filename = file.filename.replace(".docx", "_structured.docx")
    output_path = f"temp/tempdoc/{output_filename}"
    pdf_output_path = output_path.replace(".docx", ".pdf")

    with open(input_path, "wb") as f:
        f.write(await file.read())

    raw_notes = read_docx(input_path)
    prompt = build_prompt(guideline_path, raw_notes)
    prompt = ensure_date_in_prompt(prompt)

    structured_doc = generate_output(prompt)

# ✨ Replace placeholders with actual values
    current_date = datetime.today().strftime("%B %d, %Y")
    structured_doc = structured_doc.replace("[Effective Date]", current_date)
    structured_doc = structured_doc.replace("[Date]", current_date)

    write_docx(structured_doc, output_path)
    try:
        convert(output_path, pdf_output_path)
    except Exception as e:
        print(f"PDF conversion failed: {e}")

    print("Structured documentation and PDF generated successfully.")

    # Return the DOCX path (frontend can also request PDF separately)
    return {"docx_path": output_path, "pdf_path": pdf_output_path}

    print("Structured documentation generated successfully.")
    '''
    generate_contract_from_structured_doc(
        structured_doc_path="output_docs/structured_output.docx",
        templates_dir="templates",
        output_contract_path="output_contracts/final_contract.docx"
    )
    '''    




