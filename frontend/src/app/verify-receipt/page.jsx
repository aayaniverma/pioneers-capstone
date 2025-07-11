'use client';
import { useState } from 'react';
import axios from 'axios';

export default function VerifyReceipt() {
  const [contract, setContract] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [status, setStatus] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!contract || !receipt) {
      setStatus('❌ Please upload both files.');
      return;
    }

    const formData = new FormData();
    formData.append('contract', contract);
    formData.append('receipt', receipt);

    try {
      const res = await axios.post('http://localhost:8000/api/verify-full/', formData);
      if (res.data.verified) {
        setStatus(`✅ Verified — Stored in block #${res.data.block_index}`);

      } else {
        setStatus('❌ Not verified — Hash mismatch');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Verification failed. Possibly tampered or receipt invalid.');
    }
  };

  return (
    <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'white' }}>
      <h2>🔐 Verify Contract Using Receipt</h2>

      <div>
        <label htmlFor="receipt">📎 Upload Receipt (.pdf)</label><br />
        <input
          type="file"
          accept=".pdf"
          id="receipt"
          required
          onChange={(e) => setReceipt(e.target.files[0])}
        />
      </div>

      <div>
        <label htmlFor="contract">📄 Upload Original Contract (.docx)</label><br />
        <input
          type="file"
          accept=".docx"
          id="contract"
          required
          onChange={(e) => setContract(e.target.files[0])}
        />
      </div>

      <button type="submit">✅ Verify</button>
      <p>{status}</p>
    </form>
  );
}