'use client';
import React, { useEffect } from 'react'; // ✅ add useEffect
import mammoth from 'mammoth';  
import RichTextEditor from '../../components/RichTextEditor';

export default function Step3({ filename, docContent, setDocContent, setStep }) {
  useEffect(() => {
    const loadDoc = async () => {
      const res = await fetch(`http://localhost:8000/temp/tempdoc/${filename}`);
      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });

      setDocContent(result.value);
    };
    loadDoc();
  }, [filename]);
  return (
    <div className="flex flex-col items-center gap-4">
      <RichTextEditor docContent={docContent} setDocContent={setDocContent} />
      <button
        onClick={() => setStep(4)}
        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
      >
        Continue to Finalize
      </button>
    </div>
  );
}
