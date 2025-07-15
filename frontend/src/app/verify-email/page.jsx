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
        className="bg-white/70 rounded-xl shadow-xl p-8 w-full max-w-md space-y-6 border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">
            Upload Contract to Blockchain
          </h1>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-black-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          Verify Contract
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