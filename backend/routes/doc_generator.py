import sys
import os
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



TEMP_NO_DIR = "temp/tempno"
TEMP_DOC_DIR = "temp/tempdoc"
os.makedirs(TEMP_NO_DIR, exist_ok=True)
os.makedirs(TEMP_DOC_DIR, exist_ok=True)

router = APIRouter()
@router.post("/generate-document/")
async def generate_document(file: UploadFile = File(...), guideline_path: str = Form(...)):
    input_path = os.path.join(TEMP_NO_DIR, os.path.basename(file.filename))

    output_filename = file.filename.replace(".docx", "_structured.docx")
    output_path = os.path.join(TEMP_DOC_DIR, output_filename)
    
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
    # Explicitly check file is ready
    if not os.path.exists(output_path) or os.path.getsize(output_path) < 200:
        raise RuntimeError("Docx file not fully written.")
    
    print("Structured documentation and PDF generated successfully.")

    # ✅ Return filename for frontend fetch use
    return {
        "filename": os.path.basename(output_path),
        "docx_path": output_path,
       }

    print("Structured documentation generated successfully.")
    '''
    generate_contract_from_structured_doc(
        structured_doc_path="output_docs/structured_output.docx",
        templates_dir="templates",
        output_contract_path="output_contracts/final_contract.docx"
    )
    '''    

# ✅ GET route to serve the generated DOCX file
@router.get("/temp/tempdoc/{filename}")
async def get_generated_docx(filename: str):
    file_path = os.path.join(TEMP_DOC_DIR, filename)
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    return FileResponse(
        path=file_path,
        media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        filename=filename
    )
