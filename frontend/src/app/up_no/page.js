'use client';

import { useState, useRef } from 'react';
import { FiArrowRight } from 'react-icons/fi'; // Arrow icon

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gray-50">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
        Upload Your Notes (.docx)
      </h1>

      {/* Hidden File Input */}
      <input
        type="file"
        accept=".docx"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Button */}
      <button
        onClick={handleUploadClick}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors text-base sm:text-lg"
      >
        Upload .docx
      </button>

      {/* Uploaded File Preview */}
      {fileName && (
        <div className="mt-6 flex flex-col items-center space-y-4 w-full max-w-md">
          <div className="flex items-center space-x-3 bg-white px-4 py-3 rounded shadow w-full">
            <span className="text-2xl sm:text-3xl">📄</span>
            <p className="text-gray-700 text-sm sm:text-base truncate">{fileName}</p>
          </div>

          {/* Arrow to Proceed */}
          <button
            onClick={processDocx}
            className="text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-110"
            title="Proceed to next step"
          >
            <FiArrowRight size={32} />
          </button>
          {loading && (
          <p className="mt-4 text-blue-600 text-sm sm:text-base">Processing document...</p>
          )}
        </div>
      )}
    </div>
  );
}
