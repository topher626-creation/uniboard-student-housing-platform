import { useState, type FC, type FormEvent } from 'react';
import { ShieldAlert } from 'lucide-react';
import { reportService } from '../services/index.js';

const SafetyCenterPage: FC = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submitReport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      await reportService.create({
        type: form.get('type'),
        listingUrl: form.get('listingUrl'),
        message: form.get('message'),
        contactEmail: form.get('contactEmail'),
        isAnonymous: form.get('isAnonymous') === 'on',
      });
      setMessage('Report submitted. Our admin team will review it.');
      event.currentTarget.reset();
    } catch (submitError: any) {
      setError(submitError?.response?.data?.message || 'Report could not be submitted right now.');
    }
  };

  return (
    <main className="landing-page py-14">
      <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="card-surface p-8">
          <ShieldAlert className="text-brand-700" size={42} />
          <p className="section-kicker mt-5">Safety Center / Report Abuse</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Help keep UniBoard safe</h1>
          <p className="mt-4 leading-7 text-slate-600">Report fake listings, scam attempts, misconduct, or suspicious activity. Anonymous reporting is supported.</p>
        </section>
        <form onSubmit={submitReport} className="card-surface p-8">
          <label className="block">
            <span className="mb-2 block text-sm font-bold">Report type</span>
            <select name="type" className="field" required>
              <option value="fake_listing">Fake listing</option>
              <option value="scam">Scam report</option>
              <option value="misconduct">Misconduct</option>
              <option value="suspicious_activity">Suspicious activity</option>
            </select>
          </label>
          <label className="mt-5 block"><span className="mb-2 block text-sm font-bold">Listing URL or reference</span><input name="listingUrl" className="field" /></label>
          <label className="mt-5 block"><span className="mb-2 block text-sm font-bold">Message</span><textarea name="message" className="field min-h-36" required /></label>
          <label className="mt-5 block"><span className="mb-2 block text-sm font-bold">Contact email optional</span><input name="contactEmail" className="field" type="email" /></label>
          <label className="mt-5 flex items-center gap-3 text-sm font-semibold text-slate-700"><input name="isAnonymous" type="checkbox" className="h-4 w-4" /> Submit anonymously</label>
          {message && <p className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-700">{message}</p>}
          {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
          <button className="btn-primary mt-6" type="submit">Submit Report</button>
        </form>
      </div>
    </main>
  );
};

export default SafetyCenterPage;
