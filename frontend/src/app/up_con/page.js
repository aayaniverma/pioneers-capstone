'use client';
import { useState, useRef } from 'react';

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
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-full max-w-2xl mx-auto p-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Contract Structure</h2>

        {/* Upload Box */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            Upload Contract (.docx)
          </label>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 font-medium text-sm"
            >
              Choose File
            </button>
            {fileName && (
              <p className="text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="font-medium text-gray-800">Selected:</span> {fileName}
              </p>
            )}
          </div>
          <input
            type="file"
            accept=".docx"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Verify Button */}
        <button
          onClick={verifyContract}
          disabled={!file || loading}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full font-semibold"
        >
          {loading ? 'Verifying...' : 'Verify Contract'}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow border">
            <h3 className="text-xl font-semibold mb-4">Verification Result</h3>
            <p className={`mb-2 font-bold ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {result.message || result.summary}
            </p>

            {!result.success && result.field_level_issues && (
              <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
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
