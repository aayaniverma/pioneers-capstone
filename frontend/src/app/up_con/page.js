'use client';

import { useState, useRef } from 'react';
import { FiArrowRight } from 'react-icons/fi';

export default function Cont() {
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
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

    // Simulated async verification
    setTimeout(() => {
      alert(`Contract "${file.name}" verified successfully.`);
      setIsVerified(true);
      setLoading(false);
    }, 2000);
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
