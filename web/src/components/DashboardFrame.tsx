import type { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home, Settings, ShieldCheck, Users } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '#overview', icon: Home },
  { label: 'Approvals', href: '#approvals', icon: ShieldCheck },
  { label: 'Listings', href: '#listings', icon: Building2 },
  { label: 'Users', href: '#users', icon: Users },
  { label: 'Settings', href: '#settings', icon: Settings },
];

const DashboardFrame: FC<{ title: string; subtitle: string; kicker: string; children: ReactNode }> = ({ title, subtitle, kicker, children }) => (
  <main className="dashboard-page py-8 sm:py-12">
    <div className="container-page grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
        <Link to="/" className="mb-5 flex items-center gap-2 px-2 font-black text-slate-950">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
            <ShieldCheck size={20} />
          </span>
          UniBoard
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-brand-50 hover:text-brand-700">
              <item.icon size={17} />
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <div>
        <header id="overview" className="mb-8">
          <p className="section-kicker">{kicker}</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">{title}</h1>
          <p className="mt-3 max-w-3xl text-slate-600">{subtitle}</p>
        </header>
        {children}
      </div>
    </div>
  </main>
);

export default DashboardFrame;
