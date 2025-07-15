'use client';
import { useState, useRef } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function ContractVerificationFlow() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected?.name.endsWith('.docx')) {
      setFile(selected);
      setFileName(selected.name);
      setResult(null);
    } else {
      alert('Please select a .docx file');
    }
  };

  const verifyContract = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/verify-contract', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert('Verification error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute top-0 left-0 w-full h-full object-cover z-0"
  >
    <source src="/abstract_line5.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  {/* 🔳 White translucent overlay over video */}
  <div className="absolute top-0 left-0 w-full h-full bg-white/20 z-10" />
      <div className="bg-white/70 z-10 shadow-lg border border-gray-200 rounded-xl  w-full max-w-6xl p-8 space-y-20">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Verify Contract Structure
        </h1>

        {/* Upload Section */}
        <div className="border border-dashed rounded-lg p-4 bg-purple/20 text-center">
          <p className="text-gray-600 mb-3">Upload your <strong>.docx</strong> contract</p>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="bg-purple-100 text-purple-700 px-4 py-2 rounded-md font-medium hover:bg-blue-200"
          >
            Choose File
          </button>
          <input
            type="file"
            accept=".docx"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {fileName && (
            <p className="mt-2 text-sm text-gray-800">
              <span className="font-medium">Selected:</span> {fileName}
            </p>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={verifyContract}
          disabled={!file || loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-full font-semibold flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
          {loading ? 'Verifying...' : 'Verify Contract'}
        </button>

        {/* Result */}
        {result && (
          <div className="bg-gray-100 p-5 rounded-md border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              {result.success ? (
                <CheckCircle className="text-green-600 w-5 h-5" />
              ) : (
                <XCircle className="text-red-600 w-5 h-5" />
              )}
              <p className={`text-lg font-semibold ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.message || result.summary}
              </p>
            </div>

            {!result.success && result.field_level_issues && (
              <ul className="list-disc ml-6 text-sm text-gray-700">
                {Object.entries(result.field_level_issues).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value.issue}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}