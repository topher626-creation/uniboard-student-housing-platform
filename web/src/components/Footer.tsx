import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

const Footer: FC = () => {
  return (
    <footer className="mt-20 bg-brand-900 text-white">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xl font-black">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-600">
                <ShieldCheck size={21} />
              </span>
              UniBoard
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-300">
              Built for Students, Built for Trust. UniBoard helps students find trusted accommodation through verified landlords, transparent listings, and real-time availability.
            </p>
            <p className="mt-4 text-sm font-semibold text-slate-200">Founded & Developed by Siame Christopher</p>
            <div className="mt-5 space-y-2 text-sm text-slate-300">
              <p className="flex items-center gap-2"><Mail size={16} /> uniboard.zm@gmail.com</p>
              <p className="flex items-center gap-2"><Phone size={16} /> +260 976449402 / 0764388122</p>
              <p className="flex items-center gap-2"><MapPin size={16} /> Zambia</p>
            </div>
          </div>

          <FooterColumn title="Support" links={[['Help Center', '/help'], ['Safety Center', '/safety'], ['Report Issue', '/safety?report=issue']]} />
          <FooterColumn title="Company" links={[['About Us', '/about'], ['Contact', '/contact'], ['Find Accommodation', '/listings']]} />
          <FooterColumn title="Legal" links={[['Terms & Conditions', '/terms'], ['Privacy Policy', '/privacy']]} />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>All landlord accounts are manually verified before listings go live.</p>
          <p>© 2026 UniBoard. Helping students find verified accommodation.</p>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn: FC<{ title: string; links: Array<[string, string]> }> = ({ title, links }) => (
  <div>
    <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-white">{title}</h3>
    <ul className="space-y-3 text-sm text-slate-300">
      {links.map(([label, href]) => (
        <li key={`${label}-${href}`}>
          <Link to={href} className="hover:text-white">{label}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
