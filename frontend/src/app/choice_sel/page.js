'use client';

import { useRouter } from 'next/navigation';
import { FaFileUpload, FaBook, FaFileContract } from 'react-icons/fa';

export default function Choice() {
  const router = useRouter();

  const choices = [
    {
      title: "Upload Notes",
      icon: <FaBook className="text-green-500 text-3xl" />,
      description:
        "Upload your notes to begin the transformation. Our system converts the content into structured documentation, generates a smart contract, performs an integrity check, and securely deploys it to the blockchain.",
      path: "/up_no",
    },
    {
      title: "Upload Documentation",
      icon: <FaFileUpload className="text-blue-500 text-3xl" />,
      description:
        "Start with your existing documentation. We convert it into a compliant smart contract, validate it for accuracy and structure, and then deploy it to the blockchain with complete transparency and traceability.",
      path: "/up_doc",
    },
    {
      title: "Upload Contract",
      icon: <FaFileContract className="text-purple-500 text-3xl" />,
      description:
        "Already have a smart contract ready? Upload it for a thorough validation process. Once verified, the contract is securely published to the blockchain, ensuring trust and immutability.",
      path: "/up_con",
    },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-10 overflow-hidden bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Blurry background blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] bg-purple-300 opacity-30 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-300 opacity-30 rounded-full blur-3xl z-0"></div>


      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl items-start h-[400px]">
        {choices.map((choice, index) => (
          <div
            key={index}
            onClick={() => router.push(choice.path)}
            className="group bg-white hover:bg-gradient-to-r from-green-50 to-green-100 shadow-xl hover:shadow-2xl rounded-3xl p-6 border border-gray-200 hover:border-green-400 transition-all duration-300 cursor-pointer relative transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div>{choice.icon}</div>
              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-green-600">
                {choice.title}
              </h2>
            </div>
            <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-48">
              <p className="text-gray-600 text-sm mt-4 leading-relaxed">{choice.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
