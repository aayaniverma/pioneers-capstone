import os
import hashlib
import json
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from utils.email_utils import send_email_with_receipt
from dotenv import load_dotenv
import traceback
from utils.blockchain_singleton import get_blockchain

load_dotenv()

router = APIRouter()
blockchain = get_blockchain()  # Singleton blockchain instance

def generate_pdf_receipt(receipt_data, save_path, duplicate=False):
    """Generates a PDF receipt. If duplicate=True, marks it as a duplicate notice."""
    c = canvas.Canvas(save_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 16)
    if duplicate:
        c.drawString(100, 750, "Duplicate Contract Notice")
    else:
        c.drawString(100, 750, "Document Blockchain Receipt")
    c.line(100, 740, 500, 740)

    c.setFont("Helvetica", 12)
    y = 710
    for key, value in receipt_data.items():
        c.drawString(100, y, f"{key.replace('_', ' ').capitalize()}: {value}")
        y -= 20

    if duplicate:
        c.drawString(100, y - 20, "Note: This contract was already registered. No new block added.")
    else:
        c.drawString(100, y - 20, "Note: This confirms your contract is securely on the blockchain.")
    c.save()

@router.post("/store-document-hash/")
async def store_document_hash(email: str = Form(...), file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        document_hash = hashlib.sha256(file_bytes).hexdigest()

        # Mine block (detects duplicates internally)
        result = blockchain.mine_block(document_hash, email, file.filename)
        block = result["block"]
        is_duplicate = result["duplicate"]

        timestamp = datetime.utcfromtimestamp(block.timestamp).isoformat()

        # Prepare receipt data
        receipt = {
            "email": email,
            "filename": file.filename,
            "document_hash": document_hash,
            "block_index": block.index,
            "timestamp": timestamp
        }

        os.makedirs("receipts", exist_ok=True)
        receipt_path = f"receipts/{document_hash}_receipt.pdf"

        # Generate receipt (duplicate or normal)
        generate_pdf_receipt(receipt, receipt_path, duplicate=is_duplicate)

        # Send email with receipt
        send_email_with_receipt(email, receipt_path, duplicate=is_duplicate)

        # Return PDF to frontend (HTTP 208 for duplicate)
        return FileResponse(
            receipt_path,
            media_type="application/pdf",
            filename=f"{file.filename}_{'duplicate' if is_duplicate else 'receipt'}.pdf",
            status_code=208 if is_duplicate else 200
        )

    except Exception as e:
        print("❌ Exception during /store-document-hash/:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/blockchain/")
def get_blockchain_view():
    """Returns the full blockchain."""
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
    """Checks if a document hash is registered in the blockchain."""
    for block in blockchain.chain[1:]:  # Skip genesis block
        try:
            data = json.loads(block.data)
            if data.get("document_hash") == document_hash:
                return {
                    "verified": True,
                    "block_index": block.index,
                    "timestamp": block.timestamp
                }
        except json.JSONDecodeError:
            continue
    return {"verified": False}