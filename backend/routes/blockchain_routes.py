# backend/routes/blockchain_routes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import hashlib
import os
from blockchain import DocumentBlockchain

router = APIRouter()
blockchain = DocumentBlockchain()

class DocumentRequest(BaseModel):
    file_path: str
    document_name: str

@router.post("/store-document-hash/")
async def store_document_hash(request: DocumentRequest):
    try:
        # Generate hash from your existing documents
        file_path = os.path.join("output_docs", request.file_path)
        
        with open(file_path, "rb") as f:
            document_hash = hashlib.sha256(f.read()).hexdigest()
        
        new_block = blockchain.mine_block(document_hash, request.document_name)
        
        return {
            "message": "Document hash stored in blockchain",
            "block_index": new_block.index,
            "document_hash": document_hash,
            "block_hash": new_block.hash
        }
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Document not found")

@router.get("/blockchain/")
def get_blockchain():
    return [{
        "index": block.index,
        "timestamp": block.timestamp,
        "data": block.data,
        "hash": block.hash
    } for block in blockchain.chain]

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
