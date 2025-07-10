# backend/routes/blockchain_routes.py

import os
import hashlib
import json
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from blockchain import DocumentBlockchain
from utils.email_utils import send_email_with_receipt
from dotenv import load_dotenv
import traceback
load_dotenv()

router = APIRouter()
from utils.blockchain_singleton import get_blockchain
blockchain = get_blockchain()


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
    try:
        file_bytes = await file.read()
        document_hash = hashlib.sha256(file_bytes).hexdigest()

        # Store to blockchain
        block = blockchain.mine_block(document_hash, email, file.filename)
        timestamp = datetime.utcfromtimestamp(block.timestamp).isoformat()

        # Generate receipt
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

        # Send email with receipt
        send_email_with_receipt(email, receipt_path)

        return FileResponse(receipt_path, media_type="application/pdf", filename=f"{file.filename}_receipt.pdf")

    except Exception as e:
        print("❌ Exception during /store-document-hash/:", str(e))
        traceback.print_exc()  # This prints the full error with line number
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/blockchain/")
def get_blockchain():
    return [
        {
            "index": block.index,
            "timestamp": block.timestamp,
            "data": block.data,
            "hash": block.hash
        }
        for block in blockchain.chain
    ]


@router.get("/verify-document/{document_hash}")
def verify_document(document_hash: str):
    for block in blockchain.chain[1:]:  # Skip genesis
        if document_hash in block.data:
            return {
                "verified": True,
                "block_index": block.index,
                "timestamp": block.timestamp
            }
    return {"verified": False}
