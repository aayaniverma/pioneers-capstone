'use client';

import { useRouter } from 'next/navigation';
import { FaEnvelopeOpen, FaFileInvoice } from 'react-icons/fa';

export default function VerifyChoice() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-10 bg-gradient-to-br from-gray-50 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800">Choose Verification Method</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl w-full">
        <div
          onClick={() => router.push('/verify-email')}
          className="cursor-pointer p-6 bg-white border hover:border-blue-400 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            <FaEnvelopeOpen className="text-blue-500 text-3xl" />
            <h2 className="text-xl font-semibold text-gray-700">Verify with Email</h2>
          </div>
          <p className="text-gray-600 mt-4">
            Upload the contract and provide the email used during upload. We'll match it with the blockchain.
          </p>
        </div>

        <div
          onClick={() => router.push('/verify-receipt')}
          className="cursor-pointer p-6 bg-white border hover:border-indigo-400 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            <FaFileInvoice className="text-indigo-500 text-3xl" />
            <h2 className="text-xl font-semibold text-gray-700">Verify with Receipt</h2>
          </div>
          <p className="text-gray-600 mt-4">
            Upload both the contract and the receipt PDF you received. We’ll verify hash integrity and match.
          </p>
        </div>
      </div>
    </div>
  );
}
