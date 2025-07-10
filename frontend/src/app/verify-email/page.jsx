'use client';
import { useState } from 'react';
import axios from 'axios';

export default function VerifyEmail() {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('contract', file);

    try {
      const res = await axios.post('http://localhost:8000/api/verify-email/', formData);
      setStatus(res.data.verified ? `✅ Verified (Block ${res.data.block_index})` : '❌ Not verified');
    } catch (err) {
      console.error(err);
      setStatus('❌ Verification failed');
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <h1>Verify by Email</h1>
      <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="file" required onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Verify</button>
      <p>{status}</p>
    </form>
  );
}
