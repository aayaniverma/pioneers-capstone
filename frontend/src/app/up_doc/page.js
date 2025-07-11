'use client';
import { useState, useRef } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

export default function MultiStepDocToContractForm() {
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [docContent, setDocContent] = useState('');
  const [generatedFilename, setGeneratedFilename] = useState('');
  const [loading, setLoading] = useState(false);

  const stepTitles = ['Upload Documentation', 'Edit Contract', 'Finalize & Export'];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Stepper */}
      <div className="w-1.5/5 bg-[#1e293b] text-white p-8">
  <h2 className="text-2xl font-semibold mb-25">Documentation To Contract</h2>

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
        <Step1
          file={file}
          setFile={setFile}
          fileName={fileName}
          setFileName={setFileName}
          setGeneratedFilename={setGeneratedFilename}
          setStep={setStep}
          fileInputRef={fileInputRef}
          setLoading={setLoading}
          loading={loading}
          setDocContent={setDocContent}
        />
      )}
      {step === 2 && (
        <Step2
          filename={generatedFilename}
          docContent={docContent}
          setDocContent={setDocContent}
          setStep={setStep}
        />
      )}
      {step === 3 && (
        <Step3
          filename={generatedFilename}
        />
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