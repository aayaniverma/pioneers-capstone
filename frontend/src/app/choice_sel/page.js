'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaFileUpload, FaBook, FaFileContract, FaCloudUploadAlt, FaShieldAlt } from 'react-icons/fa';

export default function Choice() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    if (videoRef.current) {
      videoRef.current.playbackRate = 4;
    }
  }, []);

  const choices = [
    {
      title: 'Upload Notes',
      icon: <FaBook className="text-green-600 text-xl" />,
      path: '/up_no',
      description: 'Upload your notes to begin the transformation. Our system converts the content into structured documentation, generates a smart contract, performs an integrity check, and securely deploys it to the blockchain.',
    },
    {
      title: 'Upload Documentation',
      icon: <FaFileUpload className="text-blue-600 text-xl" />,
      path: '/up_doc',
      description: 'Start with your existing documentation. We convert it into a compliant smart contract, validate it for accuracy and structure, and then deploy it to the blockchain with complete transparency and traceability.',
    },
    {
      title: 'Verify Contract',
      icon: <FaFileContract className="text-purple-600 text-xl" />,
      path: '/up_con',
      description: 'Already have a smart contract ready? Upload it for a thorough validation process.',
    },
    {
      title: 'Upload To Blockchain',
      icon: <FaCloudUploadAlt className="text-purple-600 text-xl" />,
      path: '/upload',
      description: 'Push your finalized document directly to the blockchain. Ensure tamper-proof integrity and gain an immutable public record of your contract execution.',
    },
    {
      title: 'Verify Blockchain Integrity',
      icon: <FaShieldAlt className="text-purple-600 text-xl" />,
      path: '/verify-choice',
      description: '"Upload your contract along with either a receipt or your email to verify whether the document has been tampered with or is authentically stored on the blockchain.',
    },
  ];

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      {/* Main Box with 5% margin on all sides */}
      <div className="w-[95%] h-[90%] flex rounded-xl overflow-hidden shadow-lg bg-white">
        {/* Left Side - 45% */}
        <div className="w-[40%] relative">
          {isClient && (
            <video
              ref={videoRef}
              src="/ch2.mov"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-10 left-10 z-20 bg-transparent rounded-xl border-2 border-white p-2 ">
    <img src="/logow.png" alt="Logo" className="w-15 h-15 object-contain" />
  </div>
          {/* Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-start px-10 bg-white/10">
  <div className="text-white drop-shadow-xl max-w-xl">
    <h2 className="text-3xl font-bold mb-4">Choose an Option</h2>
    <p className="text-2xl leading-snug">
      Upload once. Let our AI draft, verify, and launch your smart contract to the blockchain — in just seconds.
    </p>
  </div>
</div>

        </div>

        {/* Right Section */}
        <div className="w-[60%] bg-[#F1F8FE] flex flex-col items-center justify-center px-6 py-8">
          <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
            {choices.map((choice, index) => (
              <div
                key={index}
                onClick={() => router.push(choice.path)}
                className="group cursor-pointer border border-gray-200 bg-transparent rounded-xl p-4 hover:border-[#340247] border-2 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-2">
                  {choice.icon}
                  <span className="text-lg font-semibold text-gray-800">{choice.title}</span>
                </div>
                <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-all">
                  {choice.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
