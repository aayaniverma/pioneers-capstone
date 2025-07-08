'use client';

import { useState, useRef } from 'react';
import { FaFileUpload, FaFileContract } from 'react-icons/fa';

export default function Cont() {
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile && selectedFile.name.endsWith('.docx')) {
      setFileName(selectedFile.name);
      setFile(selectedFile);
      setIsVerified(false);
      setVerificationResult(null);
    } else {
      alert('Please upload a valid .docx file.');
      setFileName('');
      setFile(null);
      setIsVerified(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const verifyContract = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/verify-contract', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setVerificationResult({ success: true, message: data.message });
        setIsVerified(true);
        alert("✅ Verified successfully!");
      } else {
        const fieldErrors = data.field_level_issues
          ? Object.entries(data.field_level_issues).map(
            ([key, val]) => `${key}: ${val.issue}`
            )
          : data.errors || ['Verification failed.'];

        setVerificationResult({ success: false, errors: fieldErrors });
        setIsVerified(false);
        alert("❌ Not Verified. Check field-level issues.");
      }
    } catch (error) {
      setVerificationResult({ success: false, errors: [error.message] });
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const uploadToBlockchain = async () => {
    if (!file) return;

    try {
      const res = await fetch('http://localhost:8000/api/blockchain/store-document-hash/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_path: `verified_${file.name}`,
          document_name: file.name,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Uploaded to blockchain successfully!");
        console.log("Blockchain response:", data);
      } else {
        alert("❌ Failed to upload to blockchain: " + (data?.detail || "Unknown error"));
      }
    } catch (error) {
      alert("❌ Upload error: " + error.message);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-gray-50 via-blue-100 to-purple-200 overflow-hidden">

      {/* Background glow effects */}
      <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] bg-purple-300 opacity-30 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-300 opacity-30 rounded-full blur-3xl z-0"></div>

      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800 relative z-10">
        Upload Your Contract <span className="text-purple-600">(.docx)</span>
      </h1>

      <input
        type="file"
        accept=".docx"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleUploadClick}
        className="bg-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-purple-700 transition transform hover:scale-105 relative z-10"
      >
        Select Contract File
      </button>

      {fileName && (
        <div className="mt-10 flex flex-col items-center space-y-6 w-full max-w-md relative z-10">

          {/* File Card */}
          <div className="flex items-center bg-white/70 backdrop-blur-md px-5 py-4 rounded-xl shadow-md w-full space-x-4 border border-gray-300">
            <FaFileContract className="text-purple-600 text-2xl" />
            <p className="text-gray-700 text-sm sm:text-base truncate">{fileName}</p>
          </div>

          {/* Verification Button */}
          {!isVerified && (
            <button
              onClick={verifyContract}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Contract'}
            </button>
          )}

          {/* Upload Button */}
          {isVerified && (
            <button
              onClick={uploadToBlockchain}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition-all"
            >
              Upload to Blockchain
            </button>
          )}

          {/* Result message */}
          {verificationResult && (
            <div className={`mt-2 text-center text-sm font-medium px-4 py-2 rounded ${
              verificationResult.success ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
            }`}>
              {verificationResult.success
                ? verificationResult.message
                : verificationResult.errors?.join(', ') || 'Verification failed.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
