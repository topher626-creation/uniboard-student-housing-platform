import { useMemo, useState, type DragEvent, type FC, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, FileText, UploadCloud, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '../hooks/index.js';
import { providerService } from '../services/index.js';
import { useAuthStore } from '../stores/auth.js';

const maxFileSize = 5 * 1024 * 1024;
const acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(7, 'Phone number is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm your password'),
  propertyName: z.string().min(2, 'Property or compound name is required'),
  location: z.string().min(2, 'Location is required'),
  ownerConfirm: z.literal(true, {
    errorMap: () => ({ message: 'Please confirm ownership or authorization' }),
  }),
  termsConfirm: z.literal(true, {
    errorMap: () => ({ message: 'Please agree to the terms' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

type UploadState = {
  file?: File;
  previewUrl?: string;
  error?: string;
  isDragging: boolean;
};

const RegisterPage: FC = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const { mutateAsync: registerUser, isPending } = useRegister();
  const [front, setFront] = useState<UploadState>({ isDragging: false });
  const [back, setBack] = useState<UploadState>({ isDragging: false });
  const [statusMessage, setStatusMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      ownerConfirm: false as unknown as true,
      termsConfirm: false as unknown as true,
    },
  });

  const isSubmitting = isPending;
  const uploadErrors = useMemo(() => [front.error, back.error].filter(Boolean), [front.error, back.error]);

  const onSubmit = async (data: RegisterFormInputs) => {
    setSubmitError('');
    setStatusMessage('');

    if (!front.file || !back.file) {
      setSubmitError('NRC front and back uploads are required.');
      return;
    }

    try {
      const result = await registerUser({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        password: data.password,
        role: 'provider',
      });

      setAuth(result.data.user, result.data.token);
      await providerService.create({
        businessName: data.propertyName,
        businessEmail: data.email,
        businessPhone: data.phone,
        location: data.location,
        verificationDocuments: {
          nrcFront: { name: front.file.name, size: front.file.size, type: front.file.type },
          nrcBack: { name: back.file.name, size: back.file.size, type: back.file.type },
          status: 'pending',
        },
      });

      setStatusMessage('Your landlord account is pending admin approval.');
    } catch (error: any) {
      setSubmitError(error?.response?.data?.message || error?.response?.data?.error || 'Registration failed. Please check your details and try again.');
    }
  };

  return (
    <main className="landing-page py-12">
      <div className="container-page">
        {statusMessage ? (
          <section className="mx-auto max-w-2xl rounded-3xl border border-green-200 bg-green-50 p-8 text-center shadow-soft">
            <CheckCircle2 className="mx-auto text-green-700" size={44} />
            <h1 className="mt-4 text-3xl font-black text-slate-950">Account submitted</h1>
            <p className="mt-3 text-slate-700">{statusMessage}</p>
            <p className="mt-2 text-sm text-slate-600">Your account will be reviewed by admin before activation.</p>
            <Link to="/" className="btn-primary mt-6">Back to UniBoard</Link>
          </section>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl space-y-6">
            <section className="card-surface p-6 sm:p-8">
              <p className="section-kicker">Verified landlord registration</p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">Create Your Account</h1>
              <p className="mt-3 max-w-2xl text-slate-600">Sign up as a verified landlord to manage your properties on UniBoard.</p>
            </section>

            <section className="card-surface p-6 sm:p-8">
              <h2 className="text-xl font-black text-slate-950">Account Details</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field label="Full Name" error={errors.fullName?.message}><input className="field" {...register('fullName')} /></Field>
                <Field label="Phone Number" error={errors.phone?.message}><input className="field" type="tel" placeholder="+260" {...register('phone')} /></Field>
                <Field label="Email Address" error={errors.email?.message}><input className="field" type="email" {...register('email')} /></Field>
                <Field label="Create Password" error={errors.password?.message}><input className="field" type="password" {...register('password')} /></Field>
                <Field label="Confirm Password" error={errors.confirmPassword?.message}><input className="field" type="password" {...register('confirmPassword')} /></Field>
              </div>
            </section>

            <section className="card-surface p-6 sm:p-8">
              <h2 className="text-xl font-black text-slate-950">Property Information</h2>
              <p className="mt-2 text-sm text-slate-600">This represents your business identity on the platform.</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field label="Property / Compound Name" error={errors.propertyName?.message}><input className="field" {...register('propertyName')} /></Field>
                <Field label="Location" error={errors.location?.message}><input className="field" placeholder="Area, town, or city" {...register('location')} /></Field>
              </div>
            </section>

            <section className="card-surface p-6 sm:p-8">
              <h2 className="text-xl font-black text-slate-950">NRC / ID Verification</h2>
              <p className="mt-2 text-sm text-slate-600">Accepted formats: JPG, PNG, PDF. Max size: 5MB.</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <UploadBox label="NRC Front Side" state={front} setState={setFront} />
                <UploadBox label="NRC Back Side" state={back} setState={setBack} />
              </div>
              {uploadErrors.map((error) => <p key={error} className="mt-3 text-sm font-semibold text-red-600">{error}</p>)}
            </section>

            <section className="card-surface p-6 sm:p-8">
              <h2 className="text-xl font-black text-slate-950">Trust & Agreement</h2>
              <div className="mt-5 space-y-4">
                <Checkbox label="I confirm I am a legitimate property owner or authorized representative" error={errors.ownerConfirm?.message} inputProps={register('ownerConfirm')} />
                <Checkbox label="I agree to UniBoard Terms & Conditions" error={errors.termsConfirm?.message} inputProps={register('termsConfirm')} />
              </div>
              <p className="mt-5 rounded-2xl bg-brand-50 p-4 text-sm text-brand-900">
                Your documents are used only for verification and will not be publicly displayed.
              </p>
            </section>

            {submitError && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{submitError}</p>}

            <section className="card-surface p-6 text-center">
              <button type="submit" className="btn-primary w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
              <p className="mt-3 text-sm text-slate-600">Your account will be reviewed by admin before activation.</p>
              <p className="mt-3 text-sm text-slate-600">Registering as a student? <Link className="font-bold text-brand-700" to="/login">Use student login</Link></p>
            </section>
          </form>
        )}
      </div>
    </main>
  );
};

const Field: FC<{ label: string; error?: string; children: ReactNode }> = ({ label, error, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-bold text-slate-800">{label}</span>
    {children}
    {error && <span className="mt-2 block text-sm font-semibold text-red-600">{error}</span>}
  </label>
);

const Checkbox: FC<{ label: string; error?: string; inputProps: any }> = ({ label, error, inputProps }) => (
  <label className="block rounded-2xl border border-slate-200 bg-white p-4">
    <span className="flex items-start gap-3">
      <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600" {...inputProps} />
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </span>
    {error && <span className="mt-2 block text-sm font-semibold text-red-600">{error}</span>}
  </label>
);

const UploadBox: FC<{ label: string; state: UploadState; setState: (state: UploadState) => void }> = ({ label, state, setState }) => {
  const selectFile = (file?: File) => {
    if (!file) return;
    if (!acceptedTypes.includes(file.type)) {
      setState({ isDragging: false, error: 'Only JPG, PNG, or PDF files are accepted.' });
      return;
    }
    if (file.size > maxFileSize) {
      setState({ isDragging: false, error: 'File must be 5MB or smaller.' });
      return;
    }
    setState({
      file,
      previewUrl: file.type === 'application/pdf' ? undefined : URL.createObjectURL(file),
      isDragging: false,
    });
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    selectFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <p className="mb-2 text-sm font-bold text-slate-800">{label} <span className="text-red-600">*</span></p>
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setState({ ...state, isDragging: true });
        }}
        onDragLeave={() => setState({ ...state, isDragging: false })}
        onDrop={handleDrop}
        className={`flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-white p-5 text-center transition ${
          state.isDragging ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-brand-600 hover:bg-brand-50'
        }`}
      >
        {state.file ? (
          <>
            {state.previewUrl ? (
              <img src={state.previewUrl} alt={`${label} preview`} className="mb-4 h-28 w-full rounded-2xl object-cover" />
            ) : (
              <FileText className="mb-4 text-brand-700" size={40} />
            )}
            <span className="font-bold text-slate-900">{state.file.name}</span>
            <span className="mt-1 text-sm text-slate-500">{(state.file.size / 1024 / 1024).toFixed(2)} MB</span>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                setState({ isDragging: false });
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
            >
              <X size={15} />
              Remove / replace
            </button>
          </>
        ) : (
          <>
            <UploadCloud className="text-brand-700" size={42} />
            <span className="mt-4 font-black text-slate-950">{state.isDragging ? 'Drop file to upload' : 'Drag & drop NRC here or click to upload'}</span>
            <span className="mt-2 text-sm text-slate-500">Accepted formats: JPG, PNG, PDF. Max size: 5MB.</span>
          </>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          capture="environment"
          className="sr-only"
          onChange={(event) => selectFile(event.target.files?.[0])}
        />
      </label>
    </div>
  );
};

export default RegisterPage;
