from fastapi import APIRouter, Form
from fastapi.responses import FileResponse
from utils.io_handler import read_docx, write_docx
from utils.prompt_builder import build_prompt
from utils.openai_client import generate_output
from utils.date_checker import ensure_date_in_prompt
from datetime import datetime
import os

router = APIRouter()

@router.post("/generate-document/")
async def generate_document(filename: str = Form(...), guideline_path: str = Form(...)):
    filename = os.path.basename(filename)  # ✅ sanitize input
    input_path = os.path.join("temp/tempno", filename)
    output_filename = filename.replace(".docx", "_structured.docx")
    output_path = os.path.join("temp/tempdoc", output_filename)

    # ✅ Don't try to write — the file should already exist
    if not os.path.exists(input_path):
        return {"error": f"File {input_path} does not exist."}

    # Read and process the doc
    raw_notes = read_docx(input_path)
    prompt = build_prompt(guideline_path, raw_notes)
    prompt = ensure_date_in_prompt(prompt)
    structured_doc = generate_output(prompt)

    # Replace placeholders
    current_date = datetime.today().strftime("%B %d, %Y")
    structured_doc = structured_doc.replace("[Effective Date]", current_date)
    structured_doc = structured_doc.replace("[Date]", current_date)

    # Save structured output
    write_docx(structured_doc, output_path)

    print("Structured documentation generated successfully.")

    return FileResponse(
        path=output_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=output_filename
    )
