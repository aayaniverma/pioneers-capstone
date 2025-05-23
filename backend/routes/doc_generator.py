from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from utils.io_handler import read_docx, write_docx
from utils.prompt_builder import build_prompt
from utils.openai_client import generate_output
from utils.date_checker import ensure_date_in_prompt
from datetime import datetime
import os

router = APIRouter()
@router.post("/generate-document/")
async def generate_document(file: UploadFile = File(...), guideline_path: str = Form(...)):
    input_path = f"input_docs/{file.filename}"
    output_filename = file.filename.replace(".docx", "_structured.docx")
    output_path = f"output_docs/{output_filename}"

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

    print("Structured documentation generated successfully.")
    '''
    generate_contract_from_structured_doc(
        structured_doc_path="output_docs/structured_output.docx",
        templates_dir="templates",
        output_contract_path="output_contracts/final_contract.docx"
    )
    '''    



