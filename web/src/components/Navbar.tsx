import { useState, type FC } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Building2, Menu, Moon, ShieldCheck, Sun, X } from 'lucide-react';
import { useAuthStore } from '../stores/auth.js';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
  }`;

const Navbar: FC<{ isDark: boolean; onToggleTheme: () => void }> = ({ isDark, onToggleTheme }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  const dashboardPath = user?.role === 'provider' ? '/provider-dashboard' : `/${user?.role}-dashboard`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-black text-slate-950">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft">
            <Building2 size={21} />
          </span>
          <span className="text-lg">UniBoard</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink to="/listings" className={navLinkClass}>Find Accommodation</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/help" className={navLinkClass}>Help Center</NavLink>
          <NavLink to="/safety" className={navLinkClass}>Safety</NavLink>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={onToggleTheme}
            className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 hover:border-brand-600 hover:text-brand-700"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isAuthenticated && user ? (
            <>
              <Link to={dashboardPath} className="btn-secondary px-4 py-2">
                <ShieldCheck size={17} />
                Dashboard
              </Link>
              <button
                type="button"
                className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100">
                Log In
              </Link>
              <Link to="/register" className="btn-primary px-4 py-2">
                Register as Landlord
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 lg:hidden"
          aria-label="Open navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page flex flex-col gap-2 py-4">
            <NavLink to="/listings" className={navLinkClass} onClick={() => setIsOpen(false)}>Find Accommodation</NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={() => setIsOpen(false)}>About</NavLink>
            <NavLink to="/help" className={navLinkClass} onClick={() => setIsOpen(false)}>Help Center</NavLink>
            <NavLink to="/safety" className={navLinkClass} onClick={() => setIsOpen(false)}>Safety</NavLink>
            <div className="mt-2 grid gap-2 border-t border-slate-100 pt-3">
              {isAuthenticated && user ? (
                <Link to={dashboardPath} className="btn-primary" onClick={() => setIsOpen(false)}>Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary" onClick={() => setIsOpen(false)}>Log In</Link>
                  <Link to="/register" className="btn-primary" onClick={() => setIsOpen(false)}>Register as Landlord</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
