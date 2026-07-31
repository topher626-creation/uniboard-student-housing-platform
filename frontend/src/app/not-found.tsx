'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router?.push('/');
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history?.back();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <h1 className="text-9xl font-bold text-green-700/10">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-[24px] flex items-center justify-center">
                <span className="text-3xl">🔍</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center justify-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition-all duration-150 active:scale-95 shadow-sm"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center gap-2 border border-green-200 text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-150 active:scale-95"
          >
            <Home size={16} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}