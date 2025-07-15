'use client';
import React from 'react';
import { FaSave, FaFileContract } from 'react-icons/fa';

export default function Step4({ filename }) {
  const pdfFile = filename?.replace('.docx', '.pdf');

  const handleProceed = () => {
    window.location.href = '/up_con';
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-white w-full max-w-4xl p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Final Document Preview</h2>

        {pdfFile ? (
          <object
            data={`http://localhost:8000/temp/temppre/${pdfFile}`}
            type="application/pdf"
            width="100%"
            height="800px"
          >
            <p className="text-red-500">
              PDF preview not supported.{' '}
              <a
                href={`http://localhost:8000/temp/temppre/${pdfFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                Download PDF
              </a>
            </p>
          </object>
        ) : (
          <p className="text-gray-500">No file found for preview.</p>
        )}
      </div>

      <button
        onClick={handleProceed}
        className="flex items-center gap-2 bg-yellow-500 text-black font-semibold px-5 py-2 rounded-full hover:bg-yellow-600 shadow-md"
      >
        <FaFileContract /> Proceed to Verification
      </button>
    </div>
  );
}
