from blockchain import DocumentBlockchain

_blockchain_instance = None

def get_blockchain():
    global _blockchain_instance
    if _blockchain_instance is None:
        _blockchain_instance = DocumentBlockchain()
    return _blockchain_instance
