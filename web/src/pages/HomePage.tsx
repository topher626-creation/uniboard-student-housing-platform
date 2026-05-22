import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Home, MessageCircle, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import HeroSection from '../components/HeroSection.tsx';
import PropertyCard from '../components/PropertyCard.tsx';
import { useProperties } from '../hooks/index.js';

const whyCards = [
  {
    icon: ShieldCheck,
    title: 'Verified & Trusted Listings',
    text: 'We prioritize student safety through a landlord approval system. Every landlord is reviewed before listing accommodation to reduce scams and fake listings.',
  },
  {
    icon: Home,
    title: 'Accommodation Made Simple',
    text: 'No more moving around searching for rooms. UniBoard centralizes student accommodation in one place for easier discovery.',
  },
  {
    icon: Zap,
    title: 'Real-Time Availability',
    text: 'Landlords update room and bed availability in real time, helping students avoid unavailable accommodation.',
  },
  {
    icon: GraduationCap,
    title: 'Focus on Education',
    text: 'Students should focus on studies, not accommodation stress. UniBoard simplifies housing search near campuses.',
  },
];

const faqs = [
  ['Are landlords verified?', 'Yes. Landlord accounts are manually reviewed before listings go live.'],
  ['Can I contact landlords directly?', 'Yes. Listings support quick communication through WhatsApp or phone calls.'],
  ['Does UniBoard approve every listing?', 'No. Once a landlord is approved, listings can go live, while admins can moderate fake or reported listings.'],
];

const HomePage: FC = () => {
  const { data: properties, isLoading } = useProperties({ limit: 6 });
  const listings = properties?.data ?? [];

  return (
    <main className="landing-page">
      <HeroSection />

      <section className="py-16">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="section-kicker">Why Choose UniBoard</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Student housing with trust built in</h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((card) => (
              <article key={card.title} className="card-surface p-6 transition hover:-translate-y-1">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                  <card.icon size={23} />
                </span>
                <h3 className="mt-5 text-lg font-black text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">Featured Listings</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Accommodation near campus</h2>
            </div>
            <Link to="/listings" className="btn-secondary">View all listings</Link>
          </div>
          {isLoading ? (
            <div className="card-surface p-8 text-center font-semibold text-slate-600">Loading trusted accommodation...</div>
          ) : listings.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((property: any) => (
                <PropertyCard key={property.id} property={property} onFavorite={() => undefined} />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <PropertyCard
                  key={item}
                  property={{
                    id: item,
                    title: ['Campus View Rooms', 'Bluegate Student Lodge', 'Manda Hill Boarding House'][item - 1],
                    location: ['Great East Road', 'Riverside Kitwe', 'Lusaka Central'][item - 1],
                    nearestUniversity: ['UNZA', 'CBU', 'UNILUS'][item - 1],
                    pricePerMonth: [950, 780, 1200][item - 1],
                    bedType: item === 2 ? 'shared' : 'private',
                    totalRooms: 12,
                    occupiedRooms: item + 5,
                  }}
                  onFavorite={() => undefined}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-kicker">How It Works</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">A simpler path from search to contact</h2>
            <p className="mt-4 text-slate-600">Students can discover, compare, and contact verified landlords without moving around town first.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Search accommodation', Search],
              ['View verified listings', ShieldCheck],
              ['Contact landlord via WhatsApp or Call', MessageCircle],
            ].map(([title, Icon], index) => (
              <article key={title as string} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="text-sm font-black text-brand-700">Step {index + 1}</span>
                <Icon className="mt-5 text-brand-700" size={28} />
                <h3 className="mt-4 font-black text-slate-950">{title as string}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-900 py-16 text-white">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <Sparkles className="text-brand-100" />
            <h2 className="mt-4 text-2xl font-black">For Students</h2>
            <ul className="mt-5 space-y-3 text-slate-300">
              <li>Easy search near your campus</li>
              <li>Verified listings from reviewed landlords</li>
              <li>Fast communication by WhatsApp or call</li>
            </ul>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <Home className="text-brand-100" />
            <h2 className="mt-4 text-2xl font-black">For Landlords</h2>
            <ul className="mt-5 space-y-3 text-slate-300">
              <li>Manage compounds and business identity</li>
              <li>Manage buildings, rooms, and availability</li>
              <li>Update room status in real time after approval</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <p className="section-kicker">FAQ Preview</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Questions before you start?</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {faqs.map(([question, answer]) => (
              <article key={question} className="card-surface p-6">
                <h3 className="font-black text-slate-950">{question}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
