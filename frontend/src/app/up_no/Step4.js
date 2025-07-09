'use client';
import React from 'react';
import { FaSave, FaFileContract } from 'react-icons/fa';

export default function Step4({ docContent }) {
  const handleSavePreview = () => {
    const printWin = window.open('', '_blank');
    printWin.document.write(`<pre>${docContent}</pre>`);
    printWin.document.close();
    printWin.print();
  };

  const handleProceed = () => {
    window.location.href = '/contract';
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-white w-full max-w-3xl p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Final Document Preview</h2>
        <div className="whitespace-pre-wrap text-gray-700">{docContent}</div>
      </div>

      <div className="flex gap-6">
        <button
          onClick={handleSavePreview}
          className="flex items-center gap-2 bg-gray-700 text-white px-5 py-2 rounded-full hover:bg-gray-800"
        >
          <FaSave /> Save / Print Preview
        </button>

        <button
          onClick={handleProceed}
          className="flex items-center gap-2 bg-yellow-500 text-black font-semibold px-5 py-2 rounded-full hover:bg-yellow-600 shadow-md"
        >
          <FaFileContract /> Proceed to Contract
        </button>
      </div>
    </div>
  );
}
