'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import { useAuth } from '@/lib/authContext';
import { fetchProperty } from '@/lib/api';
import { mapApiPropertyToDetail } from '@/lib/propertyMapper';
import { PageLoader, PageError } from '@/components/ui/PageStates';
import {
  MapPin,
  Star,
  Shield,
  Heart,
  Phone,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Droplets,
  Lock,
  Zap,
  Car,
  Utensils,
  Users,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const amenityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi,
  Water: Droplets,
  Security: Lock,
  Electricity: Zap,
  Parking: Car,
  Kitchen: Utensils,
};

type DetailProperty = ReturnType<typeof mapApiPropertyToDetail>;

export default function PropertyDetailClient({ id }: { id: string }) {
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState<DetailProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);

  const loadProperty = () => {
    setLoading(true);
    setError(null);
    fetchProperty(id)
      .then((data) => setProperty(mapApiPropertyToDetail(data as Record<string, unknown>)))
      .catch((err) => setError(err instanceof Error ? err.message : 'Property not found'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Topbar />
        <div className="max-w-screen-2xl mx-auto px-4 pt-24">
          <PageLoader message="Loading property details..." />
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !property) {
    if (error?.includes('not found') || error?.includes('404')) return notFound();
    return (
      <main className="min-h-screen bg-gray-50">
        <Topbar />
        <div className="max-w-screen-2xl mx-auto px-4 pt-24">
          <PageError message={error ?? 'Unable to load this property'} onRetry={loadProperty} />
        </div>
        <Footer />
      </main>
    );
  }

  const genderLabel = { male: 'Male Only', female: 'Female Only', mixed: 'Mixed / Any Gender' };
  const typeLabel: Record<string, string> = {
    shared: 'Shared Room',
    private: 'Private Room',
    'en-suite': 'Self-Contained',
    studio: 'Bedsitter',
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Topbar />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-24 pb-16">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/home" className="hover:text-green-700 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/room-listing-page" className="hover:text-green-700 transition-colors">Listings</Link>
          <span>/</span>
          <span className="text-gray-700 truncate">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm">
              <div className="relative h-72 sm:h-96">
                <AppImage
                  src={property.images[activeImage]?.src || property.images[0].src}
                  alt={property.images[activeImage]?.alt || property.images[0].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((prev) => (prev - 1 + property.images.length) % property.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setActiveImage((prev) => (prev + 1) % property.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  {property.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <Shield size={10} />
                      Verified Listing
                    </span>
                  )}
                  {!property.available && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Fully Booked
                    </span>
                  )}
                </div>
              </div>
              {property.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {property.images.map((img, idx) => (
                    <button
                      key={`thumb-${idx}`}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-green-600' : 'border-transparent'}`}
                    >
                      <AppImage src={img.src} alt={img.alt} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-green-600" />
                      {property.location}
                    </span>
                    <span>·</span>
                    <span>{property.campus}</span>
                    <span>·</span>
                    <span>{property.distanceFromCampus} from campus</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-900">{property.rating}</span>
                  <span className="text-sm text-gray-400">({property.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="mb-6 flex flex-wrap gap-2">
                <span className="badge-green">{typeLabel[property.type] ?? property.type}</span>
                <span className="badge-blue">{genderLabel[property.genderPreference]}</span>
                <span className="badge-violet">{property.availableSpots} of {property.totalSpots} spots available</span>
              </div>

              <div className="rounded-2xl border border-green-100 bg-green-50/70 p-4 text-sm text-gray-700">
                <p className="font-semibold text-green-800">Why students like this place</p>
                <p className="mt-1 leading-relaxed">A well-located, verified option with flexible availability and a straightforward booking experience.</p>
              </div>
              <p className="mt-5 leading-relaxed text-gray-600">{property.description}</p>
            </div>

            {property.amenities.length > 0 && (
              <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] ?? CheckCircle;
                    return (
                      <div key={amenity} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                        <Icon size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-gray-700">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {property.reviews.length > 0 && (
              <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Student Reviews</h2>
                <div className="space-y-4">
                  {property.reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                          {review.authorName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{review.authorName}</p>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="sticky top-24 rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">Monthly rent</p>
                <p className="text-3xl font-bold text-gray-900">
                  K{property.price.toLocaleString()}
                  <span className="text-base font-normal text-gray-400">/mo</span>
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <a
                  href={`https://wa.me/${property.whatsapp?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in ${property.title} on UniBoard.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  <WhatsAppIcon />
                  WhatsApp Provider
                </a>
                <a
                  href={`tel:${property.phone}`}
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Phone size={16} />
                  Call Provider
                </a>
                <button
                  onClick={() => setSaved(!saved)}
                  className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-colors ${
                    saved ? 'bg-red-50 text-red-600 border border-red-200' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart size={16} className={saved ? 'fill-red-500' : ''} />
                  {saved ? 'Saved' : 'Save Listing'}
                </button>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                    {property.provider.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{property.provider.name}</p>
                    <p className="text-xs text-gray-400">{property.provider.compoundName}</p>
                  </div>
                  {property.provider.verified && (
                    <span className="ml-auto inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                      <Shield size={12} />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users size={12} />
                  <span>Responds quickly · {property.provider.rating}★ provider rating</span>
                </div>
              </div>

              {!isAuthenticated && (
                <p className="text-xs text-gray-400 mt-4 text-center">
                  <Link href="/sign-up-login-screen" className="text-green-700 font-semibold hover:underline">
                    Sign in
                  </Link>
                  {' '}to save listings and track inquiries
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
