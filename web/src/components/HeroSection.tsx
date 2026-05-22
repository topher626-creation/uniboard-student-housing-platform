import { useState, type FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Search, ShieldCheck } from 'lucide-react';

const universities = ['UNZA', 'MUKUBA', 'CBU', 'Mulungushi', 'UNILUS', 'Kwame Nkrumah'];

const HeroSection: FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    university: '',
    location: '',
    maxPrice: '',
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.university) params.append('nearestUniversity', filters.university);
    if (filters.location) params.append('location', filters.location);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <section className="overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-bold text-brand-700 shadow-sm">
            <ShieldCheck size={17} />
            Verified Student Accommodation in Zambia
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Find Verified Student Accommodation Near Your Campus
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            UniBoard helps students find trusted accommodation through verified landlords, real-time availability, and direct communication all in one place.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/listings" className="btn-primary">
              Find Accommodation
              <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn-secondary">
              Register as Landlord
            </Link>
          </div>

          <div className="mt-8 grid max-w-2xl gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-soft md:grid-cols-[1fr_1fr_0.8fr_auto]">
            <label className="sr-only" htmlFor="hero-university">Campus</label>
            <select
              id="hero-university"
              className="field"
              value={filters.university}
              onChange={(event) => setFilters({ ...filters, university: event.target.value })}
            >
              <option value="">Select campus</option>
              {universities.map((university) => (
                <option key={university} value={university}>{university}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="hero-location">Location</label>
            <input
              id="hero-location"
              className="field"
              placeholder="Area or compound"
              value={filters.location}
              onChange={(event) => setFilters({ ...filters, location: event.target.value })}
            />
            <label className="sr-only" htmlFor="hero-price">Max price</label>
            <input
              id="hero-price"
              className="field"
              type="number"
              placeholder="Max K"
              value={filters.maxPrice}
              onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })}
            />
            <button type="button" onClick={handleSearch} className="btn-primary px-5">
              <Search size={18} />
              Search
            </button>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1100&q=80"
            alt="Students walking on a university campus"
            className="h-[28rem] w-full rounded-[2rem] object-cover shadow-soft"
          />
          <div className="absolute -bottom-5 right-4 max-w-xs rounded-2xl bg-brand-900 p-5 text-white shadow-soft">
            <p className="flex items-center gap-2 text-sm font-bold">
              <MapPin size={18} className="text-brand-100" />
              Search by campus proximity
            </p>
            <p className="mt-2 text-sm text-slate-300">Compare compounds, pricing, and availability before you contact a landlord.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
