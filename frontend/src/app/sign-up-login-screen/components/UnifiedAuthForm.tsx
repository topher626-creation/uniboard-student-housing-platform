'use client';

import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone, GraduationCap, Building2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/authContext';

interface AuthFormValues {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  businessName: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

type AuthMode = 'login' | 'signup';
type Role = 'student' | 'landlord';

const universities = [
  'University of Zambia (UNZA)',
  'Copperbelt University (CBU)',
  'Mukuba University (MUKUBA)',
  'Mulungushi University',
  'Kwame Nkrumah University',
  'University of Lusaka (UNILUS)',
  'Other',
];

export default function UnifiedAuthForm() {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<Role>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    defaultValues: {
      agreeTerms: true,
      university: 'University of Zambia (UNZA)',
    },
  });

  const passwordValue = watch('password');
  const isLandlord = role === 'landlord';

  const submitLabel = useMemo(() => (mode === 'login' ? 'Sign in' : role === 'landlord' ? 'Create landlord account' : 'Create student account'), [mode, role]);

  const onLoginSubmit = async (data: AuthFormValues) => {
    setStatusMessage(null);
    const result = await login(data.email, data.password);

    if (!result.success) {
      setStatusMessage(result.message ?? 'Unable to sign in right now.');
      return;
    }

    router.push(result.user ? (result.user.role === 'admin' ? '/admin-dashboard' : result.user.role === 'landlord' ? '/landlord-dashboard' : '/student-dashboard') : '/home');
  };

  const onSignupSubmit = async (data: AuthFormValues) => {
    setStatusMessage(null);

    const result = await signup({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: isLandlord ? 'landlord' : 'student',
      university: isLandlord ? undefined : data.university,
      businessName: isLandlord ? data.businessName : undefined,
    });

    if (!result.success) {
      setStatusMessage(result.message ?? 'We could not create your account.');
      return;
    }

    if (result.pending) {
      setStatusMessage('Your landlord account is submitted for review. We will notify you once it is approved.');
      return;
    }

    router.push(isLandlord ? '/landlord-dashboard' : '/student-dashboard');
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-[32px] border border-white/80 bg-white/85 p-6 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex rounded-full bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setStatusMessage(null);
            }}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-green-700 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setStatusMessage(null);
            }}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${mode === 'signup' ? 'bg-green-700 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Create account
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            {mode === 'login'
              ? 'Access your UniBoard account in seconds.'
              : 'Join students and verified landlords on one clean platform.'}
          </p>
        </div>

        {statusMessage ? (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {statusMessage}
          </div>
        ) : null}

        {mode === 'signup' ? (
          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-2.5 text-left text-sm transition ${role === 'student' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-green-200 hover:bg-gray-50'}`}
            >
              <GraduationCap size={18} />
              <span>
                <span className="block font-semibold">Student</span>
                <span className="text-xs opacity-80">Find accommodation</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole('landlord')}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-2.5 text-left text-sm transition ${role === 'landlord' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-amber-200 hover:bg-gray-50'}`}
            >
              <Building2 size={18} />
              <span>
                <span className="block font-semibold">Landlord</span>
                <span className="text-xs opacity-80">List your brand</span>
              </span>
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSubmit(mode === 'login' ? onLoginSubmit : onSignupSubmit)} className="space-y-3.5">
          {mode === 'signup' ? (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Full name</label>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Chipo Mwanza"
                    className={`input-base pl-9 ${errors.fullName ? 'border-red-400' : ''}`}
                    {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
                  />
                </div>
                {errors.fullName ? <p className="mt-1.5 text-xs font-medium text-red-500">{errors.fullName.message}</p> : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email address</label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@university.zm"
                    className={`input-base pl-9 ${errors.email ? 'border-red-400' : ''}`}
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } })}
                  />
                </div>
                {errors.email ? <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email.message}</p> : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Phone number</label>
                <div className="relative">
                  <Phone size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="e.g. 0977 123 456"
                    className={`input-base pl-9 ${errors.phone ? 'border-red-400' : ''}`}
                    {...register('phone', { required: 'Phone number is required', minLength: { value: 7, message: 'Phone number is too short' } })}
                  />
                </div>
                {errors.phone ? <p className="mt-1.5 text-xs font-medium text-red-500">{errors.phone.message}</p> : null}
              </div>

              {isLandlord ? (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">Business name</label>
                  <div className="relative">
                    <ShieldCheck size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Mwale Residence"
                      className={`input-base pl-9 ${errors.businessName ? 'border-red-400' : ''}`}
                      {...register('businessName', { required: isLandlord ? 'Business name is required for landlords' : false })}
                    />
                  </div>
                  {errors.businessName ? <p className="mt-1.5 text-xs font-medium text-red-500">{errors.businessName.message}</p> : null}
                </div>
              ) : (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">University</label>
                  <select className="input-base" {...register('university')}>
                    {universities.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className={`input-base pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                    {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                  />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Toggle password visibility">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password ? <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password.message}</p> : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Confirm password</label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    className={`input-base pl-9 pr-10 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                    {...register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === passwordValue || 'Passwords do not match' })}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Toggle password confirmation visibility">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword ? <p className="mt-1.5 text-xs font-medium text-red-500">{errors.confirmPassword.message}</p> : null}
              </div>

              <label className="flex items-start gap-2 text-sm text-gray-600">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600" {...register('agreeTerms', { required: 'You must accept the terms to continue' })} />
                <span>I agree to the terms and privacy policy.</span>
              </label>
              {errors.agreeTerms ? <p className="mt-1.5 text-xs font-medium text-red-500">{errors.agreeTerms.message}</p> : null}
            </>
          ) : (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email address</label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" placeholder="name@university.zm" className={`input-base pl-9 ${errors.email ? 'border-red-400' : ''}`} {...register('email', { required: 'Email is required' })} />
                </div>
                {errors.email ? <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email.message}</p> : null}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className={`input-base pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`} {...register('password', { required: 'Password is required' })} />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Toggle password visibility">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password ? <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password.message}</p> : null}
              </div>
            </>
          )}

          <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
            {isSubmitting ? 'Please wait...' : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
