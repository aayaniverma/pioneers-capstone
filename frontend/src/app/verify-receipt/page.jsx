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
    <div className="relative min-h-screen overflow-hidden">
      {/* 🔁 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/abstract_line5.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔳 White translucent overlay over video */}
      <div className="absolute top-0 left-0 w-full h-full bg-white/20 z-10" />

      {/* 💬 Content Overlay */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleVerify}
        className="bg-white/70 shadow-xl border border-gray-200 rounded-xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          🔐 Verify Contract Using Receipt
        </h2>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">📎 Upload Receipt (.pdf)</label>
          <input
            type="file"
            accept=".pdf"
            required
            onChange={(e) => setReceipt(e.target.files[0])}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">📄 Upload Original Contract (.docx)</label>
          <input
            type="file"
            accept=".docx"
            required
            onChange={(e) => setContract(e.target.files[0])}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
        >
          ✅ Verify
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
    </div>
  );
}