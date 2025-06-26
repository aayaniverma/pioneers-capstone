'use client';

import { useState, useRef } from 'react';
import { FaFileUpload, FaKeyboard, FaSave, FaFileContract } from 'react-icons/fa';
import mammoth from 'mammoth';

export default function Notes() {
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [inputType, setInputType] = useState('');
  const [noteText, setNoteText] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [docContent, setDocContent] = useState('');

  const stepTitles = ['Select Input', 'Generate Document', 'Edit Document', 'Finalize & Export'];

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected && selected.name.endsWith('.docx')) {
      setFile(selected);
      setFileName(selected.name);
      setInputType('upload');
      setStep(2);
    } else {
      alert('Only .docx files are supported.');
    }
  };

  const handleUploadClick = () => fileInputRef.current.click();

  const handleGenerate = async () => {
    setLoading(true);

    try {
      let finalFilename = '';

      if (inputType === 'type') {
        // Step 1: Send typed notes to create .docx
        const formData = new FormData();
        formData.append("user_text", noteText);
        formData.append("filename", "typed_notes.docx");

        const res = await fetch("http://localhost:8000/api/html_to_docx/", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Failed to generate .docx from text");

        const data = await res.json();
        finalFilename = data.file_path.split('/').pop(); // Extract filename
      } else {
        // Step 1: Upload .docx to backend
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:8000/api/upload_docx/", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("File upload failed");

        const data = await res.json();
        finalFilename = data.file_path.split('/').pop(); // Extract filename
      }

      // Step 2: Generate structured document using filename
      const genForm = new FormData();
      genForm.append("filename", finalFilename);
      genForm.append("guideline_path", "guidelines/nda_ma_guidelines.md");

      const res2 = await fetch("http://localhost:8000/api/generate-document/", {
        method: "POST",
        body: genForm,
      });

      if (!res2.ok) throw new Error("Document generation failed");

      const blob = await res2.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });

      setDocContent(result.value);
      setStep(3);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-orange-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-purple-800">Notes to Documentation</h1>

      {/* Stepper */}
      <div className="flex justify-center items-center mb-10">
      {stepTitles.map((title, idx) => (
          <div key={idx} className="flex items-center">
            <div
        className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold transition-all duration-300 ${
          step === idx + 1
            ? 'bg-blue-500'
            : step > idx
            ? 'bg-green-500'
            : 'bg-gray-400'
        }`}
      >
        {idx + 1}
      </div>
      {idx < stepTitles.length - 1 && (
        <div
        className={`h-1 w-12 transition-all duration-300 ${
          step > idx + 1 ? 'bg-green-400' : 'bg-gray-300'
        }`}
        />
        )}
        </div>
        ))}
        </div>

      {/* Step 1: Input Choice */}
      {step === 1 && (
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => {
              setInputType('type');
              setStep(2);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow"
          >
            <FaKeyboard /> Type Notes
          </button>

          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow"
          >
            <FaFileUpload /> Upload .docx File
          </button>

          <input type="file" accept=".docx" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
      )}

      {/* Step 2: Note Input or File Summary */}
      {step === 2 && (
        <div className="flex flex-col items-center gap-4">
          {inputType === 'type' ? (
            <>
              
              <textarea
                className="w-full max-w-2xl h-60 p-4 border border-gray-400 rounded-md shadow-sm"
                placeholder="Type your notes here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <button
                onClick={handleGenerate}
                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
              >
                Generate Document
              </button>
            </>
          ) : (
            <>
              <div className="bg-white px-4 py-3 rounded-md shadow text-center w-full max-w-md">
                <p className="text-gray-700">{fileName}</p>
              </div>
              <button
                onClick={handleGenerate}
                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
              >
                Generate Document
              </button>
            </>
          )}
          {loading && <p className="text-blue-500">Processing...</p>}
        </div>
      )}

      {/* Step 3: Edit Document */}
      {step === 3 && (
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
      )}

      {/* Step 4: Finalized View */}
      {step === 4 && (
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
      )}
    </div>
  );
}
