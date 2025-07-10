'use client';
import React from 'react';

export default function Step1({
  file,
  setFile,
  fileName,
  setFileName,
  setGeneratedFilename, // optional if needed later
  setStep,
  setLoading,
  loading,
  fileInputRef
}) {
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.docx')) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      alert('Please upload a valid .docx file.');
      setFile(null);
      setFileName('');
    }
  };

  const processDocx = async () => {
    if (!file) return;
    setLoading(true);
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("guideline_path", "guidelines/nda_ma_guidelines.md");
  
    try {
      const res = await fetch("http://localhost:8000/api/generate-contract/", {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) throw new Error("Failed to process document");
  
      const data = await res.json();  // ✅ this is valid again
      setGeneratedFilename?.(data.filename); 
      setStep(1);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <label htmlFor="file" className="block text-lg font-semibold text-center text-gray-800 mb-4">
          Upload Contract DOCX
        </label>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleUploadClick}
            className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 font-medium text-sm"
          >
            Choose File
          </button>

          {fileName && (
            <p className="text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="font-medium text-gray-800">Selected:</span> {fileName}
            </p>
          )}
        </div>

        <input
          type="file"
          accept=".docx"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <button
        onClick={processDocx}
        disabled={!file || loading}
        type="button"
        className="relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group flex justify-center items-center gap-2 mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md font-semibold border-gray-50 text-gray-800 transition-colors duration-300
        before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-emerald-500 before:transition-all before:duration-700 before:rounded-full before:z-[-1]
        hover:before:left-0 hover:text-white"
      >
        Generate Contract
        <svg
          className="w-8 h-8 ml-2 transition-transform duration-300 ease-linear transform rotate-45 group-hover:rotate-90 text-gray-800 bg-white group-hover:bg-gray-50 rounded-full border border-gray-700 group-hover:border-none p-2"
          viewBox="0 0 16 19"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 18C7 18.5523 7 19 8 19C8.5523 19 9 18.5523 9 18H7ZM8.7071 0.2929C8.3166 -0.0976 7.6834 -0.0976 7.2929 0.2929L0.9289 6.6569C0.5384 7.0474 0.5384 7.6805 0.9289 8.0711C1.3195 8.4616 1.9526 8.4616 2.3431 8.0711L8 2.4142L13.6569 8.0711C14.0474 8.4616 14.6805 8.4616 15.0711 8.0711C15.4616 7.6805 15.4616 7.0474 15.0711 6.6569L8.7071 0.2929ZM9 18L9 1H7V18H9Z"
            className="fill-gray-800"
          />
        </svg>
      </button>

      {loading && (
        <div className="processing-overlay">
          <div className="flex flex-col items-center space-y-4">
            <div className="lds-ring-overlay"><div></div><div></div><div></div><div></div></div>
            <p className="text-xl font-semibold text-[#AFBEDC]">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}
