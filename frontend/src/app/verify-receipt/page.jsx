'use client';
import { useState } from 'react';
import axios from 'axios';

export default function VerifyReceipt() {
  const [contract, setContract] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [status, setStatus] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('contract', contract);
    formData.append('receipt', receipt);

    try {
      const res = await axios.post('http://localhost:8000/api/verify-full/', formData);
      setStatus(res.data.verified ? `✅ Verified (Block ${res.data.block_index})` : '❌ Not verified');
    } catch (err) {
      console.error(err);
      setStatus('❌ Verification failed or tampered file');
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <h1>Verify by Receipt</h1>
      <input type="file" required onChange={(e) => setContract(e.target.files[0])} />
      <input type="file" required onChange={(e) => setReceipt(e.target.files[0])} />
      <button type="submit">Verify</button>
      <p>{status}</p>
    </form>
  );
}
