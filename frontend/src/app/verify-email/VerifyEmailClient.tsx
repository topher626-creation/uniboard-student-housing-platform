'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Mail, ArrowRight } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { verifyOtp } from '@/lib/api';
import { normalizeUser } from '@/lib/authUtils';
import { useAuth } from '@/lib/authContext';
import { toast } from 'sonner';

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const userId = searchParams.get('userId') ?? user?.id ?? '';

  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError('Missing account reference. Please sign up again.');
      return;
    }
    if (otp.length !== 6) {
      setError('Enter the 6-digit code from your email.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const result = await verifyOtp(userId, otp);
      const normalized = normalizeUser(result.user as Record<string, unknown>);
      localStorage.setItem('uniboard_token', result.token);
      localStorage.setItem('uniboard_user', JSON.stringify(normalized));
      toast.success('Email verified successfully!');
      router.push('/student-dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Check the code and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/home" className="inline-flex items-center gap-2 mb-6">
            <AppLogo size={40} />
            <span className="font-bold text-xl text-gray-900">UniBoard</span>
          </Link>
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail size={28} className="text-green-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
          <p className="text-gray-500 text-sm">
            We sent a 6-digit code to your email. Enter it below to complete your registration.
          </p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Verification code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="input-base text-center text-2xl tracking-[0.5em] font-mono"
              autoComplete="one-time-code"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || otp.length !== 6}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <>Verify & Continue <ArrowRight size={16} /></>}
          </button>

          <p className="text-center text-xs text-gray-400">
            Didn&apos;t receive a code? Check spam or{' '}
            <Link href="/sign-up-login-screen" className="text-green-700 font-semibold hover:underline">
              try signing up again
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
