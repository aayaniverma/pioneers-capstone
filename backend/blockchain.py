import json
import hashlib
import time
import os

class Block:
    def __init__(self, index, timestamp, data, previous_hash, hash):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.hash = hash

    def to_dict(self):
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "previous_hash": self.previous_hash,
            "hash": self.hash
        }

    @staticmethod
    def from_dict(data):
        return Block(
            index=data["index"],
            timestamp=data["timestamp"],
            data=data["data"],
            previous_hash=data["previous_hash"],
            hash=data["hash"]
        )

class DocumentBlockchain:
    def __init__(self, chain_file='blockchain.json'):
        self.chain_file = chain_file
        self.chain = self.load_chain()

    def create_genesis_block(self):
        genesis_data = json.dumps({"message": "Genesis Block"})
        genesis_hash = self.compute_hash(0, time.time(), genesis_data, "0")
        return Block(0, time.time(), genesis_data, "0", genesis_hash)

    def compute_hash(self, index, timestamp, data, previous_hash):
        value = f"{index}{timestamp}{data}{previous_hash}"
        return hashlib.sha256(value.encode()).hexdigest()

    def mine_block(self, document_hash, email, filename):
        index = len(self.chain)
        timestamp = time.time()
        data = json.dumps({
            "document_hash": document_hash,
            "email": email,
            "filename": filename,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime(timestamp))
        })
        previous_hash = self.chain[-1].hash
        hash_value = self.compute_hash(index, timestamp, data, previous_hash)
        block = Block(index, timestamp, data, previous_hash, hash_value)
        self.chain.append(block)
        self.save_chain()
        return block

    def save_chain(self):
        with open(self.chain_file, 'w') as f:
            json.dump([b.to_dict() for b in self.chain], f, indent=4)

    def load_chain(self):
        if not os.path.exists(self.chain_file):
            return [self.create_genesis_block()]
        with open(self.chain_file, 'r') as f:
            data = json.load(f)
            return [Block.from_dict(b) for b in data]
