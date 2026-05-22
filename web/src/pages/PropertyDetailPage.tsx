import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { BedDouble, Heart, MapPin, MessageCircle, Phone, ShieldCheck, Users } from 'lucide-react';
import { usePropertyById } from '../hooks/index.js';

const fallbackImage = 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1200&q=80';

const PropertyDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading } = usePropertyById(id!);

  if (isLoading) {
    return <main className="marketplace-page py-14"><div className="container-page card-surface p-8 text-center text-slate-600">Loading listing...</div></main>;
  }

  if (!property?.data) {
    return <main className="marketplace-page py-14"><div className="container-page rounded-2xl bg-red-50 p-6 font-semibold text-red-700">Property not found</div></main>;
  }

  const p = property.data;
  const available = Math.max((p.totalRooms ?? 0) - (p.occupiedRooms ?? 0), 0);

  return (
    <main className="marketplace-page py-12">
      <div className="container-page grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <img src={p.images?.[0] || fallbackImage} alt={p.title} className="h-[24rem] w-full rounded-3xl object-cover shadow-soft" />
          <div className="mt-8">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-market-50 px-3 py-1 text-sm font-bold text-market-700"><ShieldCheck size={16} /> Verified landlord</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-market-50 px-3 py-1 text-sm font-bold text-market-700"><BedDouble size={16} /> {p.bedType}</span>
            </div>
            <h1 className="mt-4 text-4xl font-black text-slate-950">{p.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-lg text-slate-600"><MapPin size={20} /> {p.location} near {p.nearestUniversity}</p>
            <p className="mt-5 text-3xl font-black text-market-700">K {p.pricePerMonth}<span className="text-base font-semibold text-slate-500"> / month</span></p>

            <article className="mt-8 card-surface p-6">
              <h2 className="text-xl font-black text-slate-950">About this accommodation</h2>
              <p className="mt-3 leading-7 text-slate-600">{p.description}</p>
            </article>

            <article className="mt-6 card-surface p-6">
              <h2 className="text-xl font-black text-slate-950">Room details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <p className="flex items-center gap-2 text-slate-700"><Users className="text-market-700" /> Total rooms: <strong>{p.totalRooms}</strong></p>
                <p className="flex items-center gap-2 text-slate-700"><Users className="text-market-700" /> Available: <strong>{available}</strong></p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.amenities?.map((amenity: string) => (
                  <span key={amenity} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{amenity}</span>
                ))}
              </div>
            </article>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-soft lg:sticky lg:top-24">
          <h2 className="text-xl font-black text-slate-950">Ready to contact?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Contact the landlord directly after reviewing the listing details and availability.</p>
          <div className="mt-6 grid gap-3">
            <a href="https://wa.me/260976449402" target="_blank" rel="noreferrer" className="btn-primary"><MessageCircle size={18} /> WhatsApp Landlord</a>
            <a href="tel:+260976449402" className="btn-secondary"><Phone size={18} /> Call Landlord</a>
            <button type="button" className="btn-secondary"><Heart size={18} /> Save to Favorites</button>
          </div>
          <p className="mt-5 rounded-2xl bg-market-50 p-4 text-sm text-market-700">All landlord accounts are manually verified before listings go live.</p>
        </aside>
      </div>
    </main>
  );
};

export default PropertyDetailPage;
