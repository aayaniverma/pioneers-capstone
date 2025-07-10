from fastapi import APIRouter, Form, UploadFile, File
from fastapi.responses import JSONResponse
from docx import Document
from bs4 import BeautifulSoup 
import os


router = APIRouter()
TEMP_DOC_DIR = "temp/tempno"
os.makedirs(TEMP_DOC_DIR, exist_ok=True)

@router.post("/html_to_docx/")
async def text_to_docx(user_text: str = Form(...), filename: str = Form("my_notes.docx")):
    # ✅ Parse and clean HTML from editor
    soup = BeautifulSoup(user_text, "html.parser")
    cleaned_text = soup.get_text()

    # Create Word doc
    doc = Document()
    for para in cleaned_text.split('\n'):
        if para.strip():
            doc.add_paragraph(para.strip())

    if not filename.lower().endswith(".docx"):
        filename += ".docx"

    file_path = os.path.join(TEMP_DOC_DIR, filename)
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
