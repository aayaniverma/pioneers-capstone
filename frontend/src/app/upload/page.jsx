'use client';
import { useState } from 'react';
import axios from 'axios';

export default function UploadPage() {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!email || !file) return;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('file', file);

    try {
      const res = await axios.post(
        'http://localhost:8000/api/blockchain/store-document-hash/',
        formData,
        { responseType: 'blob' }
      );

      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${file.name}_receipt.pdf`;
      link.click();

      setStatus('✅ Uploaded & receipt downloaded');
    } catch (err) {
      console.error(err);
      setStatus('❌ Upload failed');
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <h1>Upload Contract</h1>
      <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="file" required onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
      <p>{status}</p>
    </form>
  );
}
