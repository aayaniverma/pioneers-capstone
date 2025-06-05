# backend/blockchain.py
import hashlib
import time
import json

class Block:
    def __init__(self, index, timestamp, data, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.data = data  # Document hash
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        block_string = f"{self.index}{self.timestamp}{self.data}{self.previous_hash}"
        return hashlib.sha256(block_string.encode()).hexdigest()

class DocumentBlockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]
    
    def create_genesis_block(self):
        return Block(0, time.time(), "Genesis", "0")
    
    def mine_block(self, document_hash, document_name=""):
        previous_block = self.chain[-1]
        block_data = {
            "document_hash": document_hash,
            "document_name": document_name,
            "timestamp": time.time()
        }
        new_block = Block(
            index=len(self.chain),
            timestamp=time.time(),
            data=json.dumps(block_data),
            previous_hash=previous_block.hash
        )
        self.chain.append(new_block)
        return new_block
