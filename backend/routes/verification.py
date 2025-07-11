import os
import json
import hashlib
import logging
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from PyPDF2 import PdfReader
from utils.blockchain_singleton import get_blockchain

router = APIRouter()
blockchain = get_blockchain()

# Set up logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/verify-full/")
async def verify_contract_and_receipt(
    contract: UploadFile = File(...),
    receipt: UploadFile = File(...)
):
    try:
        logger.info("📩 Received contract: %s, receipt: %s", contract.filename, receipt.filename)

        contract_bytes = await contract.read()
        uploaded_hash = hashlib.sha256(contract_bytes).hexdigest().strip()
        logger.info("🔒 Computed contract hash: %s", uploaded_hash)

        os.makedirs("temp", exist_ok=True)
        receipt_path = os.path.join("temp", receipt.filename)
        with open(receipt_path, "wb") as f:
            f.write(await receipt.read())
        logger.info("🧾 Saved receipt to: %s", receipt_path)

        reader = PdfReader(receipt_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

        logger.info("📄 Extracted receipt text:\n%s", text)

        found_hash = None
        found_email = None
        for line in text.splitlines():
            line_lower = line.lower()
            if "document hash" in line_lower:
                found_hash = line.split(":")[-1].strip()
            elif "email" in line_lower:
                found_email = line.split(":")[-1].strip()

        logger.info("🔍 From receipt: hash=%s, email=%s", found_hash, found_email)

        if uploaded_hash != found_hash:
            raise HTTPException(status_code=400, detail="Contract and receipt hash mismatch")

        for block in blockchain.chain[1:]:
            data = json.loads(block.data)
            if data["document_hash"] == uploaded_hash and data["email"] == found_email:
                return {
                    "verified": True,
                    "message": "Verified from blockchain",
                    "block_index": block.index,
                    "timestamp": data["timestamp"],
                    "email": found_email
                }

        return {"verified": False, "reason": "No record found in blockchain"}

    except Exception as e:
        logger.error("❌ Verification failed: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

@router.post("/verify-email/")
async def verify_with_email(email: str = Form(...), contract: UploadFile = File(...)):
    try:
        contract_bytes = await contract.read()
        contract_hash = hashlib.sha256(contract_bytes).hexdigest().strip()

        for block in blockchain.chain[1:]:
            data = json.loads(block.data)
            if data["document_hash"] == contract_hash and data["email"] == email:
                return {
                    "verified": True,
                    "message": "Document matches email and exists on blockchain",
                    "block_index": block.index,
                    "timestamp": data["timestamp"],
                    "email": email
                }

        return {"verified": False, "reason": "No matching entry in blockchain"}

    except Exception as e:
        logger.error("❌ Email verification error: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Verification error: {str(e)}")
