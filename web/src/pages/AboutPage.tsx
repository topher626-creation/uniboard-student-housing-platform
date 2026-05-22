import type { FC } from 'react';
import { GraduationCap, Globe2, ShieldCheck } from 'lucide-react';

const AboutPage: FC = () => (
  <main className="landing-page py-14">
    <div className="container-page safe-prose">
      <section className="card-surface p-8 sm:p-10">
        <p className="section-kicker">About UniBoard</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Verified Student Accommodation in Zambia</h1>
        <p className="mt-5 max-w-3xl text-lg">
          UniBoard exists to make student accommodation safer, easier to discover, and more transparent. We connect students with reviewed landlords, real availability, and direct communication.
        </p>
      </section>
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          ['Mission', ShieldCheck, 'Help students find trusted accommodation through verified landlords and transparent listings.'],
          ['Vision', Globe2, 'Build a Zambia-first student housing platform that can scale to campuses and cities internationally.'],
          ['Purpose', GraduationCap, 'Reduce accommodation stress so students can focus on education, safety, and belonging.'],
        ].map(([title, Icon, text]) => (
          <article key={title as string} className="card-surface p-6">
            <Icon className="text-brand-700" size={30} />
            <h2 className="mt-4 text-xl">{title as string}</h2>
            <p className="mt-3">{text as string}</p>
          </article>
        ))}
      </section>
      <section className="mt-8 card-surface p-8">
        <h2>Founded & Developed by Siame Christopher</h2>
        <p className="mt-3">UniBoard is built around a simple belief: students deserve a safer way to find accommodation, and legitimate landlords deserve a better way to be trusted online.</p>
      </section>
    </div>
  </main>
);

export default AboutPage;
