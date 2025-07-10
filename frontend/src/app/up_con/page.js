'use client';
import { useState, useRef } from 'react';

export default function ContractVerificationFlow() {
  const [step, setStep] = useState(2);
  const [maxStepReached, setMaxStepReached] = useState(1); 
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const stepTitles = ['Verification', 'Upload To Blockchain'];

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
      setStep(2);
    } catch (err) {
      alert('Verification error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadToBlockchain = async (force = false) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/blockchain/store-document-hash/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_path: `verified_${file.name}`,
          document_name: file.name,
          force_upload: force,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Uploaded to blockchain!');
      } else {
        alert('❌ Upload failed: ' + (data?.detail || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Stepper */}
      <div className="w-1.5/5 bg-[#1e293b] text-white p-8">
  <h2 className="text-2xl font-semibold mb-25">Notes To Documentation</h2>

  <div className="relative ml-6">
    {/* Vertical dashed line */}
   
    {stepTitles.map((title, idx) => {
      const isActive = step === idx + 1;
      const isVisited = maxStepReached >= idx + 1;

      return (
        <div key={idx} className="relative flex items-center gap-4 mb-27 z-10">
          {/* Step circle */}
          <div
            className={`
              w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold
              border-2
              ${isActive
                ? 'border-white text-white bg-[#1e293b] '
                : isVisited
                ? 'border-gray-400 text-gray-500 bg-gray-300'
                : 'border-gray-400 text-gray-500 bg-[#1e293b]'}
            `}
          >
            {idx + 1}
          </div>

          {/* Step title */}
          <button
            onClick={() => {
              if (isVisited) setStep(idx + 1);
            }}
            disabled={!isVisited}
            className={`
              text-left text-sm font-medium transition-colors duration-200
              ${isActive
                ? 'text-white'
                : isVisited
                ? 'text-gray-300 hover:underline'
                : 'text-gray-500 cursor-not-allowed'}
            `}
          >
            {title}
          </button>
        </div>
      );
    })}
  </div>
</div>


      {/* Main Step Content */}
      <div className="relative w-3/4 p-10 z-10">
      <div className="relative z-10">
      {step === 1 && (
            <div className="flex flex-col items-center gap-6 mt-8">
              <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <label htmlFor="file" className="block text-lg font-semibold text-center text-gray-800 mb-4">
                  Upload & Verify Contract
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

              <button
                onClick={verifyContract}
                disabled={!file || loading}
                type="button"
                className="relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group flex justify-center items-center gap-2 mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md font-semibold border-gray-50 text-gray-800 transition-colors duration-300
                  before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-green-500 before:transition-all before:duration-700 before:rounded-full before:z-[-1]
                  hover:before:left-0 hover:text-white"
              >
                Verify Contract
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

              {loading && (
                <div className="processing-overlay">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="lds-ring-overlay"><div></div><div></div><div></div><div></div></div>
                    <p className="text-xl font-semibold text-[#AFBEDC]">Processing...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && result && (
            <div className="flex flex-col items-center gap-6 mt-8">
              <h1 className="text-2xl font-bold mb-6">Upload To Blockchain</h1>
              <div
                className={`p-4 mb-6 w-full max-w-md text-center rounded-lg ${
                  result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {result.success ? (
                  <p>{result.message}</p>
                ) : (
                  <>
                    <p>Contract is not verified. Please fix the following:</p>
                    {result.field_level_issues && (
                      <ul className="mt-2 text-left">
                        {Object.entries(result.field_level_issues).map(([k, v]) => (
                          <li key={k}>• {k}: {v.issue}</li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>

              <button
                onClick={() => uploadToBlockchain(!result.success)}
                className={`px-6 py-2 rounded-full text-white ${
                  result.success ? 'bg-indigo-600' : 'bg-yellow-600'
                }`}
                disabled={loading}
              >
                {loading
                  ? 'Uploading...'
                  : result.success
                  ? 'Upload to Blockchain'
                  : 'Continue Anyway'}
              </button>
            </div>
          )}
        </div>

        <img
          src="/note.png"
          alt="decor"
          className="absolute bottom-5 opacity-70 right-0 w-[700px] h-[700px] z-0 pointer-events-none select-none"
        />
      </div>
    </div>
  );
}