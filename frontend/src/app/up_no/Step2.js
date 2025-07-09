'use client';
import mammoth from 'mammoth';
import TiptapEditor from '../../components/TiptapEditor' // adjust path accordingly
import React from 'react';

export default function Step2({
  inputType,
  noteText,
  setNoteText,
  file,
  fileName,
  setFile,
  setStep,
  setDocContent,
  setFileName,
  loading,
  setLoading,
  fileInputRef
}) {
  const handleGenerate = async () => {
    setLoading(true);
    try {
      let finalFilename = '';

      if (inputType === 'type') {
        const formData = new FormData();
        formData.append('user_text', noteText);
        formData.append('filename', 'typed_notes.docx');

        const res = await fetch('http://localhost:8000/api/html_to_docx/', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Failed to generate .docx from text');
        const data = await res.json();
        finalFilename = data.file_path.split('/').pop();
      } else {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('http://localhost:8000/api/upload_docx/', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('File upload failed');
        const data = await res.json();
        finalFilename = data.file_path.split('/').pop();
      }

      const genForm = new FormData();
      genForm.append('filename', finalFilename);
      genForm.append('guideline_path', 'guidelines/nda_ma_guidelines.md');

      const res2 = await fetch('http://localhost:8000/api/generate-document/', {
        method: 'POST',
        body: genForm,
      });

      if (!res2.ok) throw new Error('Document generation failed');
      const blob = await res2.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });

      setDocContent(result.value);
      setStep(3);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col left-5 mt-3 items-center gap-6">
      {inputType === 'type' ? (
        <>
          <TiptapEditor noteText={noteText} setNoteText={setNoteText} />

          <button
  onClick={handleGenerate}
  type="button"
  className="relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group flex justify-center items-center gap-2 mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md font-semibold border-gray-50 text-gray-800 transition-colors duration-300
    before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-emerald-500 before:transition-all before:duration-700 before:rounded-full before:z-[-1]
    hover:before:left-0 hover:text-white"
>
  Generate Document
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


        </>
      ) : (
        <>
          <div className="w-full max-w-md bg-white mt-30 rounded-lg shadow-lg p-6 border border-gray-200">
  <label htmlFor="demo-file" className="block text-lg font-semibold text-center text-gray-800 mb-4">
    Upload DOCX File
  </label>
  <div className="flex items-center justify-between gap-4 flex-wrap">
  <button
    type="button"
    onClick={() => fileInputRef.current.click()}
    className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 font-medium text-sm"
  >
    Choose File
  </button>

  {fileName && (
    <p className="text-sm text-gray-600 whitespace-nowrap">
      <span className="font-medium text-gray-800">Selected:</span> {fileName}
    </p>
  )}
</div>

{/* Hidden input */}
<input
  type="file"
  accept=".docx"
  ref={fileInputRef}
  onChange={(e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setNoteText('');
      setDocContent('');
      setStep(2);
      setFile(selectedFile);
      setFileName(selectedFile.name); 
    }
  }}
  className="hidden"
/>

          </div>


          <button
  onClick={handleGenerate}
  type="button"
  className="relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group flex justify-center items-center gap-2 mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md font-semibold border-gray-50 text-gray-800 transition-colors duration-300
    before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-emerald-500 before:transition-all before:duration-700 before:rounded-full before:z-[-1]
    hover:before:left-0 hover:text-white"
>
  Generate Document
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

        </>
      )}
      {loading && (
  <div className="processing-overlay">
    <div className="flex flex-col items-center space-y-4">
      <div className="lds-ring-overlay">
        <div></div><div></div><div></div><div></div>
      </div>
      <p className="text-xl font-semibold text-[#AFBEDC]">Processing...</p>
    </div>
  </div>
)}


    </div>
  );
}
