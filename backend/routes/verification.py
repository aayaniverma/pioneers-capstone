# backend/routes/verification.py
import json
import hashlib
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from blockchain import DocumentBlockchain

router = APIRouter()
blockchain = DocumentBlockchain()

@router.post("/verify-full/")
async def verify_contract_and_receipt(
    contract: UploadFile = File(...),
    receipt: UploadFile = File(...)
):
    receipt_data = json.loads(await receipt.read())
    expected_hash = receipt_data.get("document_hash")
    email = receipt_data.get("email")

    file_bytes = await contract.read()
    uploaded_hash = hashlib.sha256(file_bytes).hexdigest()

    if uploaded_hash != expected_hash:
        raise HTTPException(status_code=400, detail="Uploaded contract and receipt do not match. The file may be tampered with.")

    for block in blockchain.chain[1:]:
        data = json.loads(block.data)
        if data["document_hash"] == uploaded_hash and data["email"] == email:
            return {
                "verified": True,
                "message": "Document is authentic and exists on the blockchain.",
                "block_index": block.index,
                "timestamp": data["timestamp"],
                "email": email
            }

    return {"verified": False, "reason": "No matching record found in blockchain."}

@router.post("/verify-email/")
async def verify_with_email(
    email: str = Form(...),
    contract: UploadFile = File(...)
):
    file_bytes = await contract.read()
    contract_hash = hashlib.sha256(file_bytes).hexdigest()

    for block in blockchain.chain[1:]:
        data = json.loads(block.data)
        if data["document_hash"] == contract_hash and data["email"] == email:
            return {
                "verified": True,
                "message": "Document is authentic and matches the email.",
                "block_index": block.index,
                "timestamp": data["timestamp"],
                "email": email
            }

    return {"verified": False, "reason": "Document not found for the given email."}
