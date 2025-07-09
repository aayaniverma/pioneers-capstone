'use client';
import React from 'react';
import mammoth from 'mammoth';

export default function Step2({
  inputType,
  noteText,
  setNoteText,
  file,
  fileName,
  setStep,
  setDocContent,
  loading,
  setLoading,
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
    <div className="flex flex-col items-center gap-6">
      {inputType === 'type' ? (
        <>
          <textarea
            className="w-full max-w-xl h-60 border rounded p-4"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Type your notes here..."
          />
          <button onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Generate Document
          </button>
        </>
      ) : (
        <>
          <div className="text-gray-700">Selected File: <strong>{fileName}</strong></div>
          <button onClick={handleGenerate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Generate Document
          </button>
        </>
      )}
      {loading && <p className="text-blue-500">Processing...</p>}
    </div>
  );
}
