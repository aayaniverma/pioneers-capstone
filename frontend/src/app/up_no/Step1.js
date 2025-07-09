'use client';
import React from 'react';
import './AnimatedButton.css'; // Ensure the CSS is in this file

export default function Step1({ setInputType, setStep, handleFileChange, fileInputRef }) {
  return (
    <div className="flex flex-col  gap-8 mt-20">
      {/* Type Notes Button */}
      <button
        className="animated-button"
        onClick={() => {
          setInputType('type');
          setStep(2);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
        <span className="text">Type Notes</span>
        <span className="circle"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
      </button>

      {/* Upload .docx File Button */}
      <button
        className="animated-button"
        onClick={() => fileInputRef.current.click()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
        <span className="text">Upload .docx File</span>
        <span className="circle"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
      </button>

      {/* Hidden input */}
      <input
        type="file"
        accept=".docx"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
