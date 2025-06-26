from fastapi import APIRouter, Form, UploadFile, File
from fastapi.responses import JSONResponse
from docx import Document
import os


router = APIRouter()
TEMP_DOC_DIR = "temp/tempno"
os.makedirs(TEMP_DOC_DIR, exist_ok=True)

@router.post("/html_to_docx/")
async def text_to_docx(user_text: str = Form(...), filename: str = Form("my_notes.docx")):
    # Create a Word document
    doc = Document()
    
    # Add each line as a paragraph
    for para in user_text.split('\n'):
        doc.add_paragraph(para.strip())

    # Ensure it ends with .docx
    if not filename.lower().endswith(".docx"):
        filename += ".docx"

    # Build file path
    file_path = os.path.join(TEMP_DOC_DIR, filename)

    # Save the file (overwrite if exists)
    doc.save(file_path)

    return JSONResponse(
        content={
            "message": f"Document saved as {filename}.",
            "file_path": file_path
        },
        status_code=200
    )

@router.post("/upload_docx/")
async def upload_docx(file: UploadFile = File(...)):
    if not file.filename.endswith(".docx"):
        return JSONResponse(content={"error": "Only .docx files are supported."}, status_code=400)

    save_path = os.path.join(TEMP_DOC_DIR, file.filename)

    with open(save_path, "wb") as f:
        f.write(await file.read())

    return JSONResponse(
        content={
            "message": f"File {file.filename} uploaded successfully.",
            "file_path": save_path
        },
        status_code=200
    )
