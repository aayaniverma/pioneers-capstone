'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaFileUpload, FaBook, FaFileContract } from 'react-icons/fa';

export default function Choice() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    if (videoRef.current) {
      videoRef.current.playbackRate = 3;
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
      title: 'Upload Contract',
      icon: <FaFileContract className="text-purple-600 text-xl" />,
      path: '/up_con',
      description: 'Already have a smart contract ready? Upload it for a thorough validation process. Once verified, the contract is securely published to the blockchain, ensuring trust and immutability.',
    },
  ];

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      {/* Main Box with 5% margin on all sides */}
      <div className="w-[95%] h-[90%] flex rounded-xl overflow-hidden shadow-lg bg-white">
        {/* Left Side - 45% */}
        <div className="w-[45%] relative">
          {isClient && (
            <video
              ref={videoRef}
              src="/ch.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-10 left-10 z-20 bg-transparent rounded-xl border-2 border-black p-2 ">
    <img src="/logob.png" alt="Logo" className="w-15 h-15 object-contain" />
  </div>
          {/* Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-start px-10 bg-white/55">
  <div className="text-black drop-shadow-xl max-w-xl">
    <h2 className="text-3xl font-bold mb-4">Choose an Option</h2>
    <p className="text-2xl leading-snug">
      Upload once. Let our AI draft, verify, and launch your smart contract to the blockchain — in just seconds.
    </p>
  </div>
</div>

        </div>

        {/* Right Side - 55% */}
        <div className="w-[55%] bg-[#F1F8FE] flex flex-col justify-center items-center ">
        <div className="grid grid-rows-3 gap-25 w-full max-w-xl h-[450px]">

          {choices.map((choice, index) => (
    <div
      key={index}
      onClick={() => router.push(choice.path)}
      className="group cursor-pointer border border-gray-300 rounded-lg bg-white hover:border-indigo-400 transition-all duration-300 overflow-hidden h-[70px] hover:h-[150px]"
    >
      {/* Fixed Top Row */}
      <div className="flex items-center space-x-4 p-5">
        {choice.icon}
        <span className="text-gray-800 font-medium text-lg">{choice.title}</span>
      </div>

      {/* Expanding Description */}
      <div className="px-3 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-m text-black-600">{choice.description}</p>
      </div>
    </div>
  ))}
</div>
        </div>
      </div>
    </div>
  );
}
