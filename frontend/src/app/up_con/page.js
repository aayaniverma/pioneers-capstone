'use client';

import { useState, useRef } from 'react';
import { FiArrowRight } from 'react-icons/fi';

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
      setIsVerified(false); // Reset if new file uploaded
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

      if (res.ok) {
        const data = await res.json();
        setVerificationResult({ success: true, message: data.message });
        setIsVerified(true);
        alert("✅ Verified successfully!");
      } else {
        const errData = await res.json();
        setVerificationResult({ success: false, errors: errData.errors });
        setIsVerified(false);
      }
    } catch (error) {
      setVerificationResult({ success: false, errors: [error.message] });
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const uploadToBlockchain = () => {
    alert(`Contract "${file.name}" uploaded to blockchain!`);
    // TODO: Add real blockchain interaction here
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gray-50">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
        Upload Your Contract (.docx)
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
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors text-base sm:text-lg"
      >
        Upload .docx
      </button>

      {fileName && (
        <div className="mt-6 flex flex-col items-center space-y-4 w-full max-w-md">
          <div className="flex items-center space-x-3 bg-white px-4 py-3 rounded shadow w-full">
            <span className="text-2xl sm:text-3xl">📄</span>
            <p className="text-gray-700 text-sm sm:text-base truncate">{fileName}</p>
          </div>

          {/* Verify Button */}
          {!isVerified && (
            <button
              onClick={verifyContract}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition-all"
            >
              {loading ? 'Verifying...' : 'Verify Contract'}
            </button>
          )}

          {/* Upload to Blockchain Button */}
          {isVerified && (
            <button
              onClick={uploadToBlockchain}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition-all"
            >
              Upload to Blockchain
            </button>
          )}

          
        </div>
      )}
    </div>
  );
}
