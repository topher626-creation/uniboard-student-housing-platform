import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ShieldCheck } from 'lucide-react';
import { useLogin } from '../hooks/index.js';
import { useAuthStore } from '../stores/auth.js';

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { mutate: login, isPending } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    login(data, {
      onSuccess: (res) => {
        setAuth(res.data.user, res.data.token);
        navigate('/');
      },
    });
  };

  return (
    <main className="landing-page py-14">
      <div className="container-page grid min-h-[70vh] place-items-center">
        <section className="w-full max-w-md card-surface p-8">
          <ShieldCheck className="mx-auto text-brand-700" size={40} />
          <h1 className="mt-4 text-center text-3xl font-black text-slate-950">Welcome Back</h1>
          <p className="mt-2 text-center text-sm text-slate-600">Sign in to manage accommodation, bookings, or landlord approvals.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Email Address</span>
              <input className="field" type="email" {...register('email', { required: 'Email is required' })} />
              {errors.email && <span className="mt-2 block text-sm font-semibold text-red-600">{errors.email.message}</span>}
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Password</span>
              <input className="field" type="password" {...register('password', { required: 'Password is required' })} />
              {errors.password && <span className="mt-2 block text-sm font-semibold text-red-600">{errors.password.message}</span>}
            </label>
            <button type="submit" className="btn-primary w-full" disabled={isPending}>
              {isPending ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Need landlord access? <Link to="/register" className="font-bold text-brand-700">Create a verified account</Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
