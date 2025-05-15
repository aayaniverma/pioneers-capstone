'use client';

import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function Choice(){
    const router = useRouter();

    const choices = [
        {
          title: "Upload Notes",
          description:
            "Upload your notes to begin the transformation. Our system converts the content into structured documentation, generates a smart contract, performs an integrity check, and securely deploys it to the blockchain.",
          path: "/up_no",  
        },
        {
          title: "Upload Documentation",
          description:
            "Start with your existing documentation. We convert it into a compliant smart contract, validate it for accuracy and structure, and then deploy it to the blockchain with complete transparency and traceability.",
            path: "/up_doc",  
        },
        {
          title: "Upload Contract",
          description:
            "Already have a smart contract ready? Upload it for a thorough validation process. Once verified, the contract is securely published to the blockchain, ensuring trust and immutability.",
            path: "/up_",  
        },
      ];
    return(
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
      {/* Fixed height grid wrapper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl items-start h-[400px] overflow-y-auto">
        {choices.map((choice, index) => (
          <div
            key={index}
            onClick={() => router.push(choice.path)}
            className="group bg-white shadow-md rounded-2xl p-4 border hover:border-green-400 transition-all duration-300 cursor-pointer relative"
          >
            <h2 className="text-lg font-semibold mb-2">{choice.title}</h2>
            <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-40">
              <p className="text-gray-600 text-sm mt-2">{choice.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
}