import { useMemo, useState, type FC } from 'react';
import { Search } from 'lucide-react';

const helpItems = [
  ['Getting started', 'Create an account, search by campus or location, and compare verified accommodation.'],
  ['Student help', 'Use filters, review availability, and contact landlords directly before visiting.'],
  ['Landlord help', 'Register, submit NRC verification, wait for approval, then manage compounds and rooms.'],
  ['Account help', 'Keep your phone and email up to date for booking and safety communication.'],
  ['Troubleshooting', 'If something looks suspicious or unavailable, report it through the Safety Center.'],
];

const HelpCenterPage: FC = () => {
  const [query, setQuery] = useState('');
  const results = useMemo(() => helpItems.filter(([title, text]) => `${title} ${text}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <main className="landing-page py-14">
      <div className="container-page">
        <section className="card-surface p-8">
          <p className="section-kicker">Help Center</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">How can we help?</h1>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
            <Search className="text-slate-400" />
            <input className="w-full py-4 outline-none" placeholder="Search help topics" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </section>
        <section className="mt-8 grid gap-4">
          {results.map(([title, text]) => (
            <details key={title} className="card-surface p-6">
              <summary className="cursor-pointer text-lg font-black text-slate-950">{title}</summary>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </details>
          ))}
        </section>
      </div>
    </main>
  );
};

export default HelpCenterPage;
