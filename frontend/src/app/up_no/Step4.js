'use client';
import React from 'react';
import { FaSave, FaFileContract } from 'react-icons/fa';

export default function Step4({ filename }) {
  const pdfFile = filename?.replace('.docx', '.pdf');

  const handleProceed = () => {
    window.location.href = '/up_doc';
  };
  const pdfUrl = `http://localhost:8000/temp/temppre/${pdfFile}`;



  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-white w-full max-w-4xl p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Final Documentation Preview</h2>

          <iframe
          src={pdfUrl}
          width="100%"
          height="800px"
          title="PDF Preview"
          style={{ border: '1px solid #ccc', borderRadius: '4px' }}
        />

        <p className="text-sm text-gray-600 mt-2">
          If the preview doesn't appear, you can{' '}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600"
          >
            download the PDF here
          </a>.
        </p>
      </div>

      <button
        onClick={handleProceed}
        className="flex items-center gap-2 bg-yellow-500 text-black font-semibold px-5 py-2 rounded-full hover:bg-yellow-600 shadow-md"
      >
        <FaFileContract /> Proceed to Contract Generation
      </button>
    </div>
  );
}
