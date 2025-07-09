'use client';
import React from 'react';

export default function Step3({ docContent, setDocContent, setStep }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <textarea
        className="w-full max-w-3xl h-[400px] p-4 border border-gray-400 rounded-md shadow-sm"
        value={docContent}
        onChange={(e) => setDocContent(e.target.value)}
      />
      <button
        onClick={() => setStep(4)}
        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
      >
        Continue to Finalize
      </button>
    </div>
  );
}
