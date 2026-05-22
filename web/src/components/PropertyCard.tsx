import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Heart, MapPin, ShieldCheck } from 'lucide-react';

const fallbackImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80';

const PropertyCard: FC<any> = ({ property, onFavorite, isFavorite }) => {
  const availableRooms = Math.max((property.totalRooms ?? 0) - (property.occupiedRooms ?? 0), 0);

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative">
        <img
          src={property.images?.[0] || fallbackImage}
          alt={property.title || 'Student accommodation listing'}
          className="h-52 w-full object-cover"
        />
        <button
          type="button"
          onClick={() => onFavorite?.(property.id)}
          className="focus-ring absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-slate-700 shadow-sm hover:text-red-600"
          aria-label="Save listing"
        >
          <Heart size={18} fill={isFavorite ? '#dc3545' : 'none'} />
        </button>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-market-600 px-3 py-1 text-xs font-bold text-white">
          <ShieldCheck size={14} />
          Verified
        </span>
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="line-clamp-2 text-lg font-black text-slate-950">{property.title || property.businessName || 'Student accommodation'}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin size={15} />
              {property.location || 'Zambia'}
            </p>
          </div>
          <p className="shrink-0 text-right text-lg font-black text-market-700">
            K {property.pricePerMonth ?? '---'}
            <span className="block text-xs font-semibold text-slate-500">/month</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full bg-market-50 px-3 py-1 text-market-700">{property.nearestUniversity || 'Near campus'}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            <BedDouble size={14} />
            {property.bedType || 'rooms'}
          </span>
          <span className={`rounded-full px-3 py-1 ${availableRooms > 0 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            {availableRooms > 0 ? `${availableRooms} available` : 'Check availability'}
          </span>
        </div>
        <Link to={`/property/${property.id}`} className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-market-600 px-4 py-2 text-sm font-black text-market-700 transition hover:bg-market-600 hover:text-white">
          View Details
        </Link>
      </div>
    </article>
  );
};

export default PropertyCard;
