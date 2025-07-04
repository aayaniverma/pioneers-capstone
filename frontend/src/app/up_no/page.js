'use client';

import { useState, useRef } from 'react';
import { FaFileUpload, FaKeyboard, FaSave, FaFileContract } from 'react-icons/fa';
import mammoth from 'mammoth';
import styles from './styles.module.css';

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
      <div className="flex justify-center items-center mb-10 pb-30 ">

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
        <div className="flex flex-wrap justify-center gap-30 mb-8">
          <button
      onClick={() => {
        setInputType('type');
        setStep(2);
      }}
      className={styles.saveButton}
    >
      <div className={styles.svgWrapper1}>
        <div className={styles.svgWrapper}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            width="30"
            height="30"
            className={styles.icon}
          >
            <path
              d="M592 64H48C21.49 64 0 85.49 0 112v288c0 26.5 21.49 48 48 
                 48h544c26.5 0 48-21.5 48-48V112c0-26.51-21.5-48-48-48zM128 
                 224c0 8.8-7.2 16-16 16s-16-7.2-16-16v-32c0-8.8 7.2-16 
                 16-16s16 7.2 16 16v32zm64 0c0 8.8-7.2 16-16 
                 16s-16-7.2-16-16v-32c0-8.8 7.2-16 
                 16-16s16 7.2 16 16v32zm64 0c0 8.8-7.2 
                 16-16 16s-16-7.2-16-16v-32c0-8.8 
                 7.2-16 16-16s16 7.2 16 16v32zm64 0c0 
                 8.8-7.2 16-16 16s-16-7.2-16-16v-32c0-8.8 
                 7.2-16 16-16s16 7.2 16 16v32zm64 0c0 
                 8.8-7.2 16-16 16s-16-7.2-16-16v-32c0-8.8 
                 7.2-16 16-16s16 7.2 16 16v32zm64 0c0 
                 8.8-7.2 16-16 16s-16-7.2-16-16v-32c0-8.8 
                 7.2-16 16-16s16 7.2 16 16v32zm-320 
                 64h256c8.8 0 16 7.2 16 
                 16s-7.2 16-16 16H192c-8.8 0-16-7.2-16-16s7.2-16 
                 16-16zm384 32H448c-8.8 0-16-7.2-16-16s7.2-16 
                 16-16h128c8.8 0 16 7.2 16 16s-7.2 16-16 16z"
              
            />
          </svg>
        </div>
      </div>
      <span>Type Notes</span>
    </button>

    {/* Upload Button */}
    <button
      onClick={handleUploadClick}
      className={styles.saveButton}
    >
      <div className={styles.svgWrapper1}>
        <div className={styles.svgWrapper}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="30"
            height="30"
            className={styles.icon}
          >
            <path
              d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 
                 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 
                 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 
                 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 
                 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 
                 22,13.13 22,15.04Z"
            ></path>
          </svg>
        </div>
      </div>
      <span>Upload File</span>
    </button>

          <input type="file" accept=".docx" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
      )}

      {/* Step 2: Note Input or File Summary */}
      {step === 2 && (
        <div className="flex flex-col items-center gap-4 -mt-20">
          {inputType === 'type' ? (
            <>
              
              <div className={styles.container}>
                <textarea
                  required
                  name="text"
                 className={`${styles.input} ${styles.notesInput}`}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <label className={styles.label}>Type your notes...</label>
                   </div>
                   <button className="continue-application " onClick={handleGenerate} >
  <div>
    <div className="pencil"></div>
    <div className="folder">
      <div className="top">
        <svg viewBox="0 0 24 27">
          <path d="M1,0 L23,0 C23.5522847,-1.01453063e-16 24,0.44771525 24,1 L24,8.17157288 C24,8.70200585 23.7892863,9.21071368 23.4142136,9.58578644 L20.5857864,12.4142136 C20.2107137,12.7892863 20,13.2979941 20,13.8284271 L20,26 C20,26.5522847 19.5522847,27 19,27 L1,27 C0.44771525,27 6.76353751e-17,26.5522847 0,26 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z"></path>
        </svg>
      </div>
      <div className="paper"></div>
    </div>
  </div>
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
