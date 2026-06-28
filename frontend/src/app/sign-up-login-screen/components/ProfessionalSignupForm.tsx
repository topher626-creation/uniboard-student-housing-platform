'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  GraduationCap,
  Loader2,
  Building2,
  Upload,
  ArrowRight,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/authContext';
import { API_BASE } from '@/lib/config';

type SignupFormData = {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  compoundName: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  nrcFront?: FileList;
  nrcBack?: FileList;
};

type Role = 'student' | 'landlord';

type UploadState = {
  uploading: boolean;
  error: string | null;
  lastUploadCount: number;
};

type Props = { onSwitchToLogin: () => void };

const zambianUniversities = [
  'University of Zambia (UNZA)',
  'Copperbelt University (CBU)',
  'Mukuba University (MUKUBA)',
  'Mulungushi University',
  'Kwame Nkrumah University',
  'University of Lusaka (UNILUS)',
  'Other',
];

function formatError(e: unknown): string {
  if (e instanceof Error) return e.message;
  return 'Something went wrong. Please try again.';
}

export default function ProfessionalSignupForm({ onSwitchToLogin }: Props) {
  const router = useRouter();
  const { signup } = useAuth();

  const [role, setRole] = useState<Role>('student');
  const [step, setStep] = useState(1); // landlord multi-step

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formStatus, setFormStatus] = useState<{
    type: 'pending' | 'success' | 'error';
    message: string;
  } | null>(null);

  const [uploadedVerificationUrls, setUploadedVerificationUrls] = useState<string[]>([]);
  const [verificationUploadState, setVerificationUploadState] = useState<UploadState>({
    uploading: false,
    error: null,
    lastUploadCount: 0,
  });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, trigger } = useForm<SignupFormData>();
  const passwordValue = watch('password');
  const selectedNrcFront = watch('nrcFront')?.[0];
  const selectedNrcBack = watch('nrcBack')?.[0];

  useEffect(() => {
    // keep step consistent when switching roles
    if (role === 'student') setStep(1);
    if (role === 'landlord' && step !== 1) setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const API_BASE_URL = API_BASE;

  const verificationHelpText = useMemo(() => {
    if (verificationUploadState.uploading) return 'Uploading...';
    if (verificationUploadState.error) return verificationUploadState.error;
    if (uploadedVerificationUrls.length) return `Uploaded ${uploadedVerificationUrls.length} document${uploadedVerificationUrls.length === 1 ? '' : 's'}`;
    return 'Upload additional documents (optional but recommended) for faster admin verification.';
  }, [uploadedVerificationUrls.length, verificationUploadState.error, verificationUploadState.uploading]);

  const uploadVerificationDocs = async (files: File[]) => {
    if (!files.length) return;

    setVerificationUploadState({ uploading: true, error: null, lastUploadCount: 0 });

    try {
      const formData = new FormData();
      for (const file of files.slice(0, 5)) {
        formData.append('files', file);
      }

      const resp = await fetch(`${API_BASE_URL}/upload/verification-docs`, {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        let msg = `Upload failed (${resp.status})`;
        try {
          const err = await resp.json();
          msg = err?.error || err?.message || msg;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const payload = (await resp.json()) as Array<{ url: string }>;
      const urls = payload.map((p) => p.url).filter(Boolean);

      setUploadedVerificationUrls((prev) => Array.from(new Set([...prev, ...urls])));
      setVerificationUploadState({ uploading: false, error: null, lastUploadCount: urls.length });
    } catch (e) {
      setVerificationUploadState({ uploading: false, error: formatError(e), lastUploadCount: 0 });
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    // landlord uses Next/Prev; submit should only happen on final step
    if (role === 'landlord' && step < 3) {
      if (step === 1) {
        const isValid = await trigger(['fullName', 'email', 'phone', 'password', 'confirmPassword', 'agreeTerms']);
        if (isValid) setStep(2);
      } else if (step === 2) {
        const isValid = await trigger(['compoundName']);
        if (isValid) setStep(3);
      }
      return;
    }

    setFormStatus(null);

    const result = await signup({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: role as UserRole,
      phone: data.phone,
      university: role === 'student' ? data.university : undefined,
      compoundName: role === 'landlord' ? data.compoundName : undefined,
      nrcFront: data.nrcFront?.[0],
      nrcBack: data.nrcBack?.[0],
      verificationImages: role === 'landlord' ? uploadedVerificationUrls : undefined,
    });

    if (!result.success) {
      setFormStatus({ type: 'error', message: result.message || 'Signup failed. Please check your details.' });
      return;
    }

    if (role === 'landlord' && result.pending) {
      setFormStatus({
        type: 'pending',
        message: result.message || 'Your landlord account is pending admin approval. Check your email for updates.',
      });
      return;
    }

    // success navigation
    if (role === 'student') {
      router.push('/student-dashboard');
      return;
    }
    router.push('/landlord-dashboard');
  };

  const handleNext = async () => {
    if (role !== 'landlord') return;
    if (step === 1) {
      const isValid = await trigger(['fullName', 'email', 'phone', 'password', 'confirmPassword', 'agreeTerms']);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = await trigger(['compoundName']);
      if (isValid) setStep(3);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const resetVerificationUploadState = () => {
    setVerificationUploadState({ uploading: false, error: null, lastUploadCount: 0 });
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
        <p className="text-gray-500 text-sm">Join UniBoard Zambia — it&apos;s free. Get verified faster for landlord listings.</p>
      </div>

      {/* Role Selector */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">I am a...</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-150 ${
              role === 'student'
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-green-200'
            }`}
          >
            <GraduationCap size={24} className={role === 'student' ? 'text-green-600' : 'text-gray-400'} />
            <div className="text-center">
              <p className="font-bold text-sm">Student</p>
              <p className="text-xs text-gray-400 mt-0.5">Find accommodation</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('landlord')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-150 ${
              role === 'landlord'
                ? 'border-amber-500 bg-amber-50 text-amber-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-amber-200'
            }`}
          >
            <Building2 size={24} className={role === 'landlord' ? 'text-amber-600' : 'text-gray-400'} />
            <div className="text-center">
              <p className="font-bold text-sm">Provider / Landlord</p>
              <p className="text-xs text-gray-400 mt-0.5">List a bedspace</p>
            </div>
          </button>
        </div>
      </div>

      {role === 'landlord' && (
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    s <= step ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-amber-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 text-xs text-gray-500">
            <span className={step === 1 ? 'text-amber-600 font-semibold' : ''}>Account Details</span>
            <span className="mx-2">•</span>
            <span className={step === 2 ? 'text-amber-600 font-semibold' : ''}>Business Setup</span>
            <span className="mx-2">•</span>
            <span className={step === 3 ? 'text-amber-600 font-semibold' : ''}>Document Upload</span>
          </div>
        </div>
      )}

      {formStatus && (
        <div
          className={`mb-6 rounded-2xl p-4 border ${
            formStatus.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : formStatus.type === 'pending'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <p className="text-sm font-medium">{formStatus.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Step 1 */}
        {(role === 'student' || (role === 'landlord' && step === 1)) && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Chipo Mwanza"
                  className={`input-base pl-9 ${errors.fullName ? 'border-red-400' : ''}`}
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder={role === 'student' ? 'you@university.zm' : 'you@yourbusiness.zm'}
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="+260 97 000 0000"
                  className={`input-base pl-9 ${errors.phone ? 'border-red-400' : ''}`}
                  {...register('phone', { required: 'Phone number is required' })}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone.message}</p>}
            </div>

            {role === 'student' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">University</label>
                <div className="relative">
                  <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select
                    className={`input-base pl-9 appearance-none cursor-pointer ${errors.university ? 'border-red-400' : ''}`}
                    {...register('university', {
                      required: 'Please select your university',
                    })}
                  >
                    <option value="">Select your university</option>
                    {zambianUniversities.map((u) => (
                      <option key={`signup-univ-${u}`} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.university && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.university.message}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className={`input-base pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  className={`input-base pl-9 pr-10 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (v) => v === passwordValue || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-green-600 rounded cursor-pointer mt-0.5"
                {...register('agreeTerms', { required: 'You must agree to the terms' })}
              />
              <span className="text-sm text-gray-600">
                I agree to UniBoard&apos;s{' '}
                <a href="/terms" className="text-green-700 font-semibold hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy-policy" className="text-green-700 font-semibold hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreeTerms && <p className="text-red-500 text-xs font-medium">{errors.agreeTerms.message}</p>}
          </>
        )}

        {/* Step 2 */}
        {role === 'landlord' && step === 2 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Compound / Business Name <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-1.5">This will be shown on your provider dashboard</p>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. Mwale Student Residences"
                className={`input-base pl-9 border-amber-300 focus:border-amber-500 focus:ring-amber-200 ${errors.compoundName ? 'border-red-400' : ''}`}
                {...register('compoundName', {
                  required: 'Compound/Business name is required',
                })}
              />
            </div>
            {errors.compoundName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.compoundName.message}</p>}
          </div>
        )}

        {/* Step 3 */}
        {role === 'landlord' && step === 3 && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                NRC — Front side <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-2">Clear photo/scan of the front of your National Registration Card</p>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id="nrc-front"
                  {...register('nrcFront', { required: 'NRC front image is required' })}
                />
                <label
                  htmlFor="nrc-front"
                  className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-amber-400 transition-colors"
                >
                  <Upload size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Upload NRC front</span>
                </label>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG or PDF — max 5MB</p>
                {selectedNrcFront && <p className="text-xs text-slate-600 mt-1">Selected: {selectedNrcFront.name}</p>}
              </div>
              {errors.nrcFront && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.nrcFront.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                NRC — Back side <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-2">Clear photo/scan of the back of your National Registration Card</p>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id="nrc-back"
                  {...register('nrcBack', { required: 'NRC back image is required' })}
                />
                <label
                  htmlFor="nrc-back"
                  className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-amber-400 transition-colors"
                >
                  <Upload size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Upload NRC back</span>
                </label>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG or PDF — max 5MB</p>
                {selectedNrcBack && <p className="text-xs text-slate-600 mt-1">Selected: {selectedNrcBack.name}</p>}
              </div>
              {errors.nrcBack && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.nrcBack.message}</p>}
            </div>

            <div className="mt-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Additional verification documents <span className="text-amber-600 font-semibold">(optional)</span>
              </label>
              <p className="text-xs text-gray-400 mb-3">Upload any extra documents (business registration, tenancy proof, etc.). Up to 5 files.</p>

              <div className="flex gap-3 items-start">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  className="hidden"
                  id="verification-docs"
                  disabled={verificationUploadState.uploading}
                  onChange={(e) => {
                    const list = e.target.files;
                    if (!list) return;
                    resetVerificationUploadState();
                    uploadVerificationDocs(Array.from(list));
                    e.currentTarget.value = '';
                  }}
                />

                <label
                  htmlFor="verification-docs"
                  className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-amber-400 transition-colors"
                >
                  <Upload size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Upload verification docs</span>
                </label>

                <div className="w-44">
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <div
                    className={
                      verificationUploadState.error
                        ? 'text-red-600 text-xs font-medium'
                        : 'text-amber-800 text-xs font-medium'
                    }
                  >
                    {verificationHelpText}
                  </div>
                  {verificationUploadState.lastUploadCount > 0 && (
                    <div className="text-xs text-gray-500 mt-1">Just uploaded: {verificationUploadState.lastUploadCount}</div>
                  )}
                </div>
              </div>

              {uploadedVerificationUrls.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-slate-600 font-medium mb-2">Uploaded (for admin verification)</p>
                  <div className="text-xs text-slate-500 space-y-1">
                    {uploadedVerificationUrls.slice(0, 3).map((u, idx) => (
                      <div key={`${u}-${idx}`} className="truncate">
                        • {u}
                      </div>
                    ))}
                    {uploadedVerificationUrls.length > 3 && (
                      <div className="truncate">• +{uploadedVerificationUrls.length - 3} more</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm mt-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Shield size={18} className="text-amber-700" />
                </div>
                <div>
                  <p className="text-amber-900 text-sm font-semibold">Verified Landlord required</p>
                  <p className="text-amber-700 text-xs mt-1">Provider accounts are reviewed by UniBoard before listings go live. Expect approval within 24–48 hours.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        {role === 'landlord' ? (
          <div className="flex gap-3 pt-1">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                Previous
              </button>
            ) : (
              <div className="flex-1" />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
              >
                Next
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            )}
          </div>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 pt-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        )}
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-green-700 font-semibold hover:underline">
          Log in
        </button>
      </p>
    </div>
  );
}

