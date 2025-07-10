# backend/routes/blockchain_routes.py
import os
import hashlib
import json
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from blockchain import DocumentBlockchain
from utils.email_utils import send_email_with_receipt
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
blockchain = DocumentBlockchain()

def generate_pdf_receipt(receipt_data, save_path):
    c = canvas.Canvas(save_path, pagesize=letter)
    c.setFont("Helvetica", 12)
    c.drawString(100, 750, "Document Blockchain Receipt")
    c.line(100, 745, 500, 745)
    y = 720
    for key, value in receipt_data.items():
        c.drawString(100, y, f"{key.replace('_', ' ').capitalize()}: {value}")
        y -= 20
    c.drawString(100, y - 20, "Note: This receipt confirms the file was uploaded to the blockchain.")
    c.save()

@router.post("/store-document-hash/")
async def store_document_hash(email: str = Form(...), file: UploadFile = File(...)):
    file_bytes = await file.read()
    document_hash = hashlib.sha256(file_bytes).hexdigest()
    block = blockchain.mine_block(document_hash, email, file.filename)
    timestamp = datetime.utcfromtimestamp(block.timestamp).isoformat()

    receipt = {
        "email": email,
        "filename": file.filename,
        "document_hash": document_hash,
        "block_index": block.index,
        "timestamp": timestamp
    }

    os.makedirs("receipts", exist_ok=True)
    receipt_path = f"receipts/{document_hash}_receipt.pdf"
    generate_pdf_receipt(receipt, receipt_path)

    # Send the receipt via email
    send_email_with_receipt(email, receipt_path)

    return FileResponse(receipt_path, media_type="application/pdf", filename=f"{file.filename}_receipt.pdf")
