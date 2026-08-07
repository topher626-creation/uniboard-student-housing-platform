'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { FilterState } from './ListingPageClient';

type Props = {
  filters: FilterState;
  onClear: (key: keyof FilterState) => void;
  onClearAll: () => void;
};

export default function ActiveFilterChips({ filters, onClear, onClearAll }: Props) {
  const chips: { key: keyof FilterState; label: string }[] = [];

  if (filters.location) chips.push({ key: 'location', label: `Campus: ${filters.location}` });
  if (filters.roomTypes.length > 0) chips.push({ key: 'roomTypes', label: `Type: ${filters.roomTypes.join(', ')}` });
  if (filters.minPrice > 0) chips.push({ key: 'minPrice', label: `Min: K${filters.minPrice.toLocaleString()}` });
  if (filters.maxPrice < 8000) chips.push({ key: 'maxPrice', label: `Max: K${filters.maxPrice.toLocaleString()}` });
  if (filters.genderPreference !== null) {
    const label = filters.genderPreference === 'male' ? 'Boys only' : filters.genderPreference === 'female' ? 'Girls only' : 'Both genders';
    chips.push({ key: 'genderPreference', label: label });
  }
  if (filters.amenities.length > 0) chips.push({ key: 'amenities', label: `${filters.amenities.length} Amenities` });
  if (filters.furnished !== null) chips.push({ key: 'furnished', label: filters.furnished ? 'Furnished' : 'Unfurnished' });
  if (filters.maxDistance < 10) chips.push({ key: 'maxDistance', label: `≤ ${filters.maxDistance}km` });
  if (filters.available === true) chips.push({ key: 'available', label: 'Available Now' });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={`chip-${chip.key}`}
          className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full"
        >
          {chip.label}
          <button
            onClick={() => onClear(chip.key)}
            className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
          >
            <X size={11} />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-gray-500 hover:text-red-500 font-medium underline transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}