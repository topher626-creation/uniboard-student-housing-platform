import type { FC } from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';

const ContactPage: FC = () => (
  <main className="landing-page py-14">
    <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="card-surface p-8">
        <p className="section-kicker">Contact Us</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Talk to UniBoard support</h1>
        <p className="mt-4 text-slate-600">Reach us for student help, landlord onboarding, safety concerns, or business inquiries.</p>
        <div className="mt-8 space-y-4 text-sm font-semibold text-slate-700">
          <p className="flex items-center gap-3"><MessageCircle className="text-action-500" /> WhatsApp: +260 976449402 / 0764388122</p>
          <p className="flex items-center gap-3"><Mail className="text-brand-700" /> uniboard.zm@gmail.com</p>
          <p className="flex items-center gap-3"><Phone className="text-brand-700" /> Business hours: Monday to Saturday, 08:00 - 18:00</p>
        </div>
      </section>
      <form className="card-surface p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block"><span className="mb-2 block text-sm font-bold">Name</span><input className="field" /></label>
          <label className="block"><span className="mb-2 block text-sm font-bold">Email</span><input className="field" type="email" /></label>
        </div>
        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-bold">Subject</span>
          <select className="field">
            <option>Student support</option>
            <option>Landlord verification</option>
            <option>Safety or scam concern</option>
            <option>Business inquiry</option>
          </select>
        </label>
        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-bold">Message</span>
          <textarea className="field min-h-36" />
        </label>
        <button type="button" className="btn-primary mt-6">Send Message</button>
      </form>
    </div>
  </main>
);

export default ContactPage;
