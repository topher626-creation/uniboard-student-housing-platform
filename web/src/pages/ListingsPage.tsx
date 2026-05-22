import type { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useProperties } from '../hooks/index.js';
import PropertyCard from '../components/PropertyCard.tsx';

const ListingsPage: FC = () => {
  const [searchParams] = useSearchParams();
  const filters = {
    nearestUniversity: searchParams.get('nearestUniversity') || undefined,
    location: searchParams.get('location') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
  };

  const { data: properties, isLoading } = useProperties(filters);
  const listings = properties?.data ?? [];

  return (
    <main className="marketplace-page py-12">
      <div className="container-page">
        <div className="mb-8">
          <p className="section-kicker">Find Accommodation</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Verified listings near your campus</h1>
          <p className="mt-3 text-slate-600">Compare pricing, compound names, availability, and campus proximity.</p>
        </div>
        <div className="grid gap-7 lg:grid-cols-[280px_1fr]">
          <aside className="card-surface h-fit p-6">
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-950"><SlidersHorizontal size={20} /> Filters</h2>
            <div className="mt-5 space-y-4">
              <label className="block"><span className="mb-2 block text-sm font-bold">University</span><select className="field"><option>All Universities</option><option>UNZA</option><option>CBU</option><option>UNILUS</option></select></label>
              <label className="block"><span className="mb-2 block text-sm font-bold">Bedspace Type</span><select className="field"><option>Any</option><option>Private</option><option>Shared</option></select></label>
              <label className="block"><span className="mb-2 block text-sm font-bold">Max Price (K)</span><input className="field" type="number" placeholder="1200" /></label>
              <button className="btn-primary w-full" type="button">Apply Filters</button>
            </div>
          </aside>
          <section>
            {isLoading ? (
              <div className="card-surface p-8 text-center font-semibold text-slate-600">Loading verified listings...</div>
            ) : listings.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {listings.map((property: any) => (
                  <PropertyCard key={property.id} property={property} onFavorite={() => undefined} />
                ))}
              </div>
            ) : (
              <div className="card-surface p-8 text-center text-slate-600">No listings found. Try adjusting your filters.</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ListingsPage;
