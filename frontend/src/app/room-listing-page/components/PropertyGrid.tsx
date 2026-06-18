'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { MapPin, Star, Shield, Wifi, Car, Coffee, Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ListingProperty } from '@/lib/types/listing';
import { toast } from 'sonner';


type Props = {
  properties: ListingProperty[];
  totalCount: number;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  itemsPerPage: number;
};

const roomTypeBadge: Record<string, string> = {
  'En-Suite': 'badge-blue',
  'Single Room': 'badge-violet',
  'Shared Room': 'badge-amber',
  Studio: 'badge-green',
  Apartment: 'bg-pink-100 text-pink-700',
};

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  kitchen: Coffee,
};

export default function PropertyGrid({ properties, totalCount, page, totalPages, onPageChange, itemsPerPage }: Props) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const toggleSave = (id: string, title: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info(`Removed "${title}" from saved listings`);
      } else {
        next.add(id);
        toast.success(`Saved "${title}" to your wishlist`);
      }
      return next;
    });
  };

  const handleContact = (landlord: string) => {
    // Backend integration: POST /api/inquiries { propertyId, studentId, message }
    toast.success(`Inquiry sent to ${landlord}! They typically respond within 2 hours.`);
  };

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
          <MapPin size={28} className="text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No rooms match your filters</h3>
        <p className="text-gray-500 text-sm text-center max-w-xs">
          Try adjusting your price range, room type, or distance to campus to see more results.
        </p>
      </div>
    );
  }

  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalCount);

  return (
    <div>
      {/* Result count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing{' '}
        <span className="price-display font-semibold text-gray-700">{startItem}–{endItem}</span>
        {' '}of{' '}
        <span className="price-display font-semibold text-gray-700">{totalCount}</span>
        {' '}properties
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
        {properties.map((prop) => (
          <div
            key={prop.id}
            className="card-base group overflow-hidden flex flex-col"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <AppImage
                src={prop.image}
                alt={prop.imageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
              {/* Overlay Badges */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className={`badge ${roomTypeBadge[prop.roomType] || 'badge-blue'} shadow-sm text-xs`}>
                  {prop.roomType}
                </span>
                {prop.verified && (
                  <span className="badge badge-green shadow-sm text-xs">
                    <Shield size={9} />
                    Verified
                  </span>
                )}
              </div>
              {/* Save Button */}
              <button
                onClick={() => toggleSave(prop.id, prop.title)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                aria-label="Save listing"
              >
                <Heart
                  size={15}
                  className={savedIds.has(prop.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}
                />
              </button>
              {/* Unavailable overlay */}
              {!prop.available && (
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    Fully Booked — from {prop.availableFrom}
                  </span>
                </div>
              )}
              {/* New Badge */}
              {prop.listedDaysAgo <= 2 && (
                <div className="absolute bottom-3 left-3">
                  <span className="badge bg-blue-600 text-white shadow-sm text-xs">New</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              {/* Title + Rating */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">
                  {prop.title}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-gray-700">{prop.rating}</span>
                  <span className="text-xs text-gray-400">({prop.reviewCount})</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                <MapPin size={11} className="text-blue-500 flex-shrink-0" />
                <span className="truncate">{prop.location}</span>
                <span className="text-gray-300">·</span>
                <span className="text-blue-600 font-semibold flex-shrink-0">{prop.distanceKm} km to {prop.university}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed flex-1">
                {prop.description}
              </p>

              {/* Amenities */}
              <div className="flex items-center gap-1.5 mb-3">
                {prop.amenities.slice(0, 3).map((amenity) => {
                  const IconComp = amenityIcons[amenity];
                  return IconComp ? (
                    <div
                      key={`${prop.id}-a-${amenity}`}
                      className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center"
                      title={amenity}
                    >
                      <IconComp size={11} className="text-gray-500" />
                    </div>
                  ) : (
                    <span key={`${prop.id}-a-${amenity}`} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {amenity}
                    </span>
                  );
                })}
                {prop.amenities.length > 3 && (
                  <span className="text-xs text-gray-400">+{prop.amenities.length - 3} more</span>
                )}
                <span className={`ml-auto text-xs font-medium ${prop.furnished ? 'text-green-600' : 'text-gray-400'}`}>
                  {prop.furnished ? 'Furnished' : 'Unfurnished'}
                </span>
              </div>

              {/* Landlord + Response Rate */}
              <div className="flex items-center gap-2 mb-3 py-2.5 border-t border-b border-gray-100">
                <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                  <AppImage
                    src={prop.landlordAvatar}
                    alt={prop.landlordAvatarAlt}
                    fill
                    className="object-cover"
                    sizes="28px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">{prop.landlord}</p>
                  <p className="text-xs text-gray-400">Responds {prop.responseRate}% of the time</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  prop.responseRate >= 90
                    ? 'bg-green-100 text-green-700'
                    : prop.responseRate >= 75
                    ? 'bg-amber-100 text-amber-700' :'bg-red-100 text-red-700'
                }`}>
                  {prop.responseRate}%
                </span>
              </div>

              {/* Price + Actions */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="price-display text-lg font-bold text-gray-900">
                    K{prop.price.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-xs">/mo</span>
                  {prop.available && (
                    <p className="text-xs text-green-600 font-medium mt-0.5">
                      From {prop.availableFrom}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleContact(prop.landlord)}
                  disabled={!prop.available}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-150 ${
                    prop.available
                      ? 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <MessageCircle size={13} />
                  {prop.available ? 'Contact' : 'Waitlist'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={`page-${pageNum}`}
                onClick={() => onPageChange(pageNum)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-150 ${
                  page === pageNum
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}