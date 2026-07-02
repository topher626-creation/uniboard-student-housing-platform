'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { getDashboardPath } from '@/lib/authUtils';
import { IS_DEV } from '@/lib/config';

type LoginFormData = { email: string; password: string; rememberMe: boolean };

const demoCredentials = IS_DEV
  ? [
      { role: 'Student', email: 'chipo@student.unza.zm', password: 'UniBoard@2026' },
      { role: 'Provider', email: 'chanda@mwaleresidences.zm', password: 'LandlordPass#88' },
      { role: 'Admin', email: 'admin@uniboard.zm', password: 'AdminSecure$99' },
    ]
  : [];

type Props = { onSwitchToSignup: () => void };

export default function LoginForm({ onSwitchToSignup }: Props) {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    defaultValues: { rememberMe: false },
  });

  const autofill = (cred: (typeof demoCredentials)[0]) => {
    setValue('email', cred.email);
    setValue('password', cred.password);
    setLoginError('');
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoginError('');
    const result = await login(data.email, data.password);
    if (!result.success) {
      setLoginError(result.message ?? 'Sign in failed. Please check your credentials.');
      return;
    }

    router.push(result.user ? getDashboardPath(result.user.role) : '/home');
  };

  return (
    <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-6 sm:p-7">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Sign In</h1>
        <p className="text-gray-500 text-sm">Access your UniBoard account and continue your search.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="email"
              placeholder="name@university.edu.zm"
              autoComplete="email"
              className={`input-base pl-9 ${errors.email ? 'border-red-400' : ''}`}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <button type="button" className="text-xs text-green-700 font-medium hover:underline">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`input-base pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-green-600 rounded cursor-pointer" {...register('rememberMe')} />
          <span className="text-sm text-gray-600">Keep me signed in</span>
        </label>

        {loginError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-600 text-sm font-medium">{loginError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
          style={{ minHeight: '48px' }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Don&apos;t have an account?{' '}
        <button onClick={onSwitchToSignup} className="text-green-700 font-semibold hover:underline">
          Create an account
        </button>
      </p>

      {IS_DEV && demoCredentials.length > 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">Dev accounts — click to autofill</p>
          <div className="space-y-2">
            {demoCredentials.map((cred) => (
              <button
                key={cred.role}
                type="button"
                onClick={() => autofill(cred)}
                className="w-full text-left flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-amber-100 hover:border-amber-300 transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-amber-800 mr-2">{cred.role}</span>
                  <span className="text-xs text-gray-500">{cred.email}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
