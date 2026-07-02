'use client';

import React from 'react';
import UnifiedAuthForm from './UnifiedAuthForm';
import AppLogo from '@/components/ui/AppLogo';
import Link from 'next/link';

export default function AuthPageClient() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#eefbf4_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
        <div className="w-full max-w-2xl rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/home" className="flex items-center gap-3">
              <AppLogo size={40} />
              <div>
                <p className="text-lg font-semibold text-slate-900">UniBoard</p>
                <p className="text-sm text-slate-500">Student housing, simplified</p>
              </div>
            </Link>

            <Link
              href="/home"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
            >
              Back to home
            </Link>
          </div>

          <div className="flex justify-center">
            <UnifiedAuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}