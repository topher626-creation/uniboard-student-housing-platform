'use client';

import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import type { SortOption } from './ListingPageClient';

type Props = {
  totalCount: number;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  activeFilterCount: number;
  onToggleSidebar: () => void;
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'distance-asc', label: 'Nearest to Campus' },
  { value: 'newest', label: 'Recently Listed' },
];

export default function ListingHeader({ totalCount, sort, setSort, activeFilterCount, onToggleSidebar }: Props) {
  return (
    <div className="bg-white/90 border-b border-gray-100 backdrop-blur-sm sticky top-16 z-30">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-4">
        <div className="flex items-center justify-between gap-4 rounded-[20px] border border-gray-100 bg-gray-50/70 px-4 py-3 sm:px-5">
          {/* Left: Title + Count */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Student Rooms</h1>
              <p className="text-sm text-gray-500">
                <span className="price-display font-semibold text-green-700">{totalCount}</span>
                {' '}properties found
              </p>
            </div>
          </div>

          {/* Right: Sort + Filter Toggle */}
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-green-50 hover:border-green-200 text-sm font-medium text-gray-700 transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-green-700 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none input-base pr-8 text-sm cursor-pointer w-48 bg-white"
              >
                {sortOptions.map((opt) => (
                  <option key={`sort-${opt.value}`} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}