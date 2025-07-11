from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
import os
import shutil
from Model.test import run_model_pipeline
from docx2pdf import convert

router = APIRouter()

UPLOAD_DIR = "./temp/tempdoc"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/generate-contract/")
async def generate_contract(file: UploadFile = File(...)):
    temp_dir = "temp/tempdoc"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)
    
    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run ML model pipeline
    generated_path = run_model_pipeline(file_path)  # This handles test.py + contract_generator.py
    generated_pdf_path = generated_path.replace(".docx", ".pdf")
    try:
        convert(generated_path, generated_pdf_path)
    except Exception as e:
        print(f"PDF conversion failed: {e}")
        generated_pdf_path = None  # optional fallback
    
    return {
        "filename": os.path.basename(generated_path),
        "docx_path": f"tempcon/{os.path.basename(generated_path)}",
    "pdf_path": f"tempcon/{os.path.basename(generated_pdf_path)}" if generated_pdf_path else None
    }
    
    