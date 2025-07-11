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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <form
        onSubmit={handleUpload}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md space-y-6 border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">Upload Contract to Blockchain</h1>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Contract File (.docx)</label>
          <input
            type="file"
            required
            accept=".docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Upload & Download Receipt
        </button>

        {status && (
          <p
            className={`text-sm text-center font-medium ${
              status.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status}
          </p>
        )}
      </form>
    </div>
  );
}