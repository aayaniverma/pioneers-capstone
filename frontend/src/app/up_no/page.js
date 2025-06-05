'use client';

import { useState, useRef } from 'react';
import { FiArrowRight } from 'react-icons/fi'; // Arrow icon
import { FaFileUpload, FaBook, FaFileContract } from 'react-icons/fa';

export default function Notes() {
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile && selectedFile.name.endsWith('.docx')) {
      setFileName(selectedFile.name);
      setFile(selectedFile);
    } else {
      alert('Please upload a valid .docx file.');
      setFileName('');
      setFile(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const processDocx = async () => {
    if (!file) return;
  
    setLoading(true);  // Show loading state
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('guideline_path', 'guidelines/nda_ma_guidelines.md');
  
    try {
      const response = await fetch('http://localhost:8000/api/generate-document/', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) throw new Error('Failed to process the document');
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace('.docx', '_structured.docx')}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);  // Hide loading state
    }
  };
  

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-gray-50 via-blue-100 to-purple-200 overflow-hidden">

      {/* Background glow effects */}
      <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] bg-purple-300 opacity-30 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-300 opacity-30 rounded-full blur-3xl z-0"></div>

      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800 relative z-10">
        Upload Your Notes <span className="text-purple-600">(.docx)</span>
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
        Select Notes
      </button>

      {fileName && (
        <div className="mt-10 flex flex-col items-center space-y-6 w-full max-w-md relative z-10">

          {/* File Card */}
          <div className="flex items-center bg-white/70 backdrop-blur-md px-5 py-4 rounded-xl shadow-md w-full space-x-4 border border-gray-300">
            <FaBook className="text-purple-600 text-2xl" />
            <p className="text-gray-700 text-sm sm:text-base truncate">{fileName}</p>
          </div>

          {/* Proceed Button */}
          <button
            onClick={processDocx}
            className="bg-white hover:bg-blue-100 text-blue-700 border border-blue-500 px-5 py-2 rounded-full transition transform hover:scale-105 flex items-center space-x-2"
          >
            <span>Proceed</span>
            <FiArrowRight size={20} />
          </button>

          {/* Loading Message */}
          {loading && (
            <p className="text-sm text-blue-600 animate-pulse">Processing document...</p>
          )}
        </div>
      )}
    </div>
  );
}
