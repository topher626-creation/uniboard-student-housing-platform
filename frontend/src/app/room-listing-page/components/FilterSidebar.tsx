'use client';

import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import type { FilterState } from './ListingPageClient';

type Props = {
  filters: FilterState;
  onUpdate: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClear: (key: keyof FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
};

const roomTypeOptions = ['Single Room', 'Shared Room', 'En-Suite', 'Studio', 'Apartment'];
const bedspaceTypeOptions = ['Standard', 'Bankers', 'Luxury', 'Economy'];
const amenityOptions = [
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'parking', label: 'Parking' },
  { value: 'security', label: '24hr Security' },
  { value: 'gym', label: 'Gym' },
  { value: 'garden', label: 'Garden' },
];

const universityOptions = ['University of Zambia (UNZA)', 'Copperbelt University (CBU)', 'Mukuba University (MUKUBA)', 'Mulungushi University', 'Kwame Nkrumah University', 'University of Lusaka (UNILUS)'];

export default function FilterSidebar({ filters, onUpdate, onClear, isOpen, onClose }: Props) {
  const toggleRoomType = (rt: string) => {
    const current = filters.roomTypes;
    if (current.includes(rt)) {
      onUpdate('roomTypes', current.filter((t) => t !== rt));
    } else {
      onUpdate('roomTypes', [...current, rt]);
    }
  };

  const toggleAmenity = (a: string) => {
    const current = filters.amenities;
    if (current.includes(a)) {
      onUpdate('amenities', current.filter((x) => x !== a));
    } else {
      onUpdate('amenities', [...current, a]);
    }
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={17} className="text-green-700" />
          <span className="font-bold text-gray-900">Filters</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      {/* University */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          University / Campus
        </label>
        <select
          value={filters.location}
          onChange={(e) => onUpdate('location', e.target.value)}
          className="input-base text-sm"
        >
          <option value="">All Universities</option>
          {universityOptions.map((u) => (
            <option key={`univ-${u}`} value={u}>{u}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Monthly Price
          </label>
          <span className="price-display text-xs font-semibold text-green-700">
            R{filters.minPrice.toLocaleString()} – R{filters.maxPrice.toLocaleString()}
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Min Price</label>
            <input
              type="range"
              min={0}
              max={7000}
              step={100}
              value={filters.minPrice}
              onChange={(e) => onUpdate('minPrice', Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Max Price</label>
            <input
              type="range"
              min={1000}
              max={8000}
              step={100}
              value={filters.maxPrice}
              onChange={(e) => onUpdate('maxPrice', Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Room Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          Room Type
        </label>
        <div className="space-y-2">
          {roomTypeOptions.map((rt) => (
            <label
              key={`rt-filter-${rt}`}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.roomTypes.includes(rt)}
                onChange={() => toggleRoomType(rt)}
                className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                {rt}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Bedspace Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          Bedspace Type
        </label>
        <div className="space-y-2">
          {bedspaceTypeOptions.map((bt) => (
            <label
              key={`bt-filter-${bt}`}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.bedspaceTypes?.includes(bt) || false}
                onChange={() => {
                  const current = filters.bedspaceTypes || [];
                  if (current.includes(bt)) {
                    onUpdate('bedspaceTypes', current.filter((t) => t !== bt));
                  } else {
                    onUpdate('bedspaceTypes', [...current, bt]);
                  }
                }}
                className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                {bt}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Distance to Campus */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Max Distance to Campus
          </label>
          <span className="text-xs font-semibold text-green-700 price-display">
            {filters.maxDistance} km
          </span>
        </div>
        <input
          type="range"
          min={0.5}
          max={10}
          step={0.5}
          value={filters.maxDistance}
          onChange={(e) => onUpdate('maxDistance', Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0.5 km</span>
          <span>10 km</span>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          Amenities
        </label>
        <div className="grid grid-cols-2 gap-2">
          {amenityOptions.map((a) => (
            <label
              key={`amenity-filter-${a.value}`}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.amenities.includes(a.value)}
                onChange={() => toggleAmenity(a.value)}
                className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                {a.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Furnished */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          Furnishing
        </label>
        <div className="flex gap-2">
          {[
            { value: null, label: 'Any' },
            { value: true, label: 'Furnished' },
            { value: false, label: 'Unfurnished' },
          ].map((opt) => (
            <button
              key={`furnished-${opt.label}`}
              onClick={() => onUpdate('furnished', opt.value)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all duration-150 ${
                filters.furnished === opt.value
                  ? 'bg-green-700 border-green-700 text-white' : 'border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Available Now */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => onUpdate('available', filters.available === true ? null : true)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
              filters.available === true ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                filters.available === true ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">Available Now Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
        <div className="sticky top-32 bg-white rounded-[24px] border border-gray-100 shadow-sm p-5 max-h-[calc(100vh-9rem)] overflow-y-auto scrollbar-hide">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative ml-auto w-80 max-w-full h-full bg-white shadow-2xl p-5 overflow-y-auto animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}