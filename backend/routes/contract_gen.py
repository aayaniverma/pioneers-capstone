from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
import os
import shutil
from Model.test import run_model_pipeline

router = APIRouter()

UPLOAD_DIR = "./temp/tempdoc"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/generate-contract/")
async def generate_contract(file: UploadFile = File(...), guideline_path: str = Form(...)):
    temp_dir = "temp/tempdoc"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)
    
    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run ML model pipeline
    generated_path = run_model_pipeline(file_path)  # This handles test.py + contract_generator.py
    
    return {"filename": os.path.basename(generated_path)} 