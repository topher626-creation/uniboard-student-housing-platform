'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, Loader2, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

type LoginFormData = { email: string; password: string; rememberMe: boolean };

const demoCredentials = [
  { role: 'Student', email: 'chipo@student.unza.zm', password: 'UniBoard@2026', dashboard: '/student-dashboard' },
  { role: 'Provider', email: 'chanda@mwaleresidences.zm', password: 'LandlordPass#88', dashboard: '/landlord-dashboard' },
  { role: 'Admin', email: 'admin@uniboard.zm', password: 'AdminSecure$99', dashboard: '/admin-dashboard' },
];

type Props = { onSwitchToSignup: () => void };

export default function LoginForm({ onSwitchToSignup }: Props) {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loginError, setLoginError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormData>({ defaultValues: { rememberMe: false } });

  const copyToClipboard = async (text: string, fieldId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const autofill = (cred: (typeof demoCredentials)[0]) => {
    setValue('email', cred.email);
    setValue('password', cred.password);
    setLoginError('');
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoginError('');
    const success = await login(data.email, data.password);
    if (!success) {
      setLoginError('Invalid credentials — use the demo accounts below to sign in');
      return;
    }
    const matched = demoCredentials.find((c) => c.email === data.email);
    router.push(matched?.dashboard || '/home');
  };

  return (
    <div>
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
              className={`input-base pl-9 ${errors.email ? 'border-red-400' : ''}`}
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <button type="button" className="text-xs text-green-700 font-medium hover:underline">Forgot password?</button>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={`input-base pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-green-600 rounded cursor-pointer" {...register('rememberMe')} />
          <span className="text-sm text-gray-600">Remember me for 30 days</span>
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
          {isSubmitting ? <><Loader2 size={18} className="animate-spin" />Signing in...</> : 'Sign In'}
        </button>
      </form>

      <div className="mt-5">
        <div className="relative py-3">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200" />
          <p className="relative bg-gray-50 text-center text-xs uppercase tracking-[0.24em] text-gray-500 px-3">Or continue with</p>
        </div>
        <button
          type="button"
          onClick={() => alert('Google sign in is not yet connected.')}
          className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-150"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-green-600 font-bold">G</span>
          Sign in with Google
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-5">
        Don&apos;t have an account?{' '}
        <button onClick={onSwitchToSignup} className="text-green-700 font-semibold hover:underline">Create an account</button>
      </p>

      {/* Demo Credentials */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4">
        <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-3">Demo Accounts — Click to Autofill</p>
        <div className="space-y-2">
          {demoCredentials.map((cred) => (
            <div
              key={`demo-${cred.role}`}
              className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-green-100 hover:border-green-300 transition-colors cursor-pointer group"
              onClick={() => autofill(cred)}
            >
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-green-700 mr-2">{cred.role}</span>
                <span className="text-xs text-gray-500 truncate">{cred.email}</span>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); copyToClipboard(cred.email, `email-${cred.role}`); }}
                className="p-1 rounded hover:bg-green-100 transition-colors ml-2"
                title="Copy email"
              >
                {copiedField === `email-${cred.role}` ? <Check size={12} className="text-green-600" /> : <Copy size={12} className="text-green-400" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}