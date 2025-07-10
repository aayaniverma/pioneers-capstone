from fastapi import APIRouter, Form, UploadFile, File
from fastapi.responses import JSONResponse
from docx import Document
import os


router = APIRouter()
TEMP_DOC_DIR = "temp/tempdoc"
os.makedirs(TEMP_DOC_DIR, exist_ok=True)

@router.post("/up_doc_to_con/")
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
