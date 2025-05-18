from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from utils.io_handler import read_docx, write_docx
from utils.prompt_builder import build_prompt
from utils.openai_client import generate_output
from utils.date_checker import ensure_date_in_prompt
from datetime import datetime
import os

app = FastAPI()

# Optional: Allow CORS for frontend testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-document/")
async def generate_document(
    file: UploadFile = File(...),
    guideline_path: str = Form("guidelines/nda_ma_guidelines.md")
):
    # Save uploaded file temporarily
    os.makedirs("temp", exist_ok=True)
    os.makedirs("output_docs", exist_ok=True)

    input_path = f"temp/{file.filename}"
    output_path = f"output_docs/{file.filename.replace('.docx', '_structured.docx')}"

    with open(input_path, "wb") as f:
        f.write(await file.read())

    # Run your processing logic
    raw_notes = read_docx(input_path)
    prompt = build_prompt(guideline_path, raw_notes)
    prompt = ensure_date_in_prompt(prompt)

    structured_doc = generate_output(prompt)

    current_date = datetime.today().strftime("%B %d, %Y")
    structured_doc = structured_doc.replace("[Effective Date]", current_date)
    structured_doc = structured_doc.replace("[Date]", current_date)

    write_docx(structured_doc, output_path)

    # Return the output file to download
    return FileResponse(path=output_path, filename=os.path.basename(output_path))
