'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import FilterSidebar from './FilterSidebar';
import PropertyGrid from './PropertyGrid';
import ListingHeader from './ListingHeader';
import ActiveFilterChips from './ActiveFilterChips';


export type Property = {
  id: string;
  title: string;
  location: string;
  university: string;
  distanceKm: number;
  price: number;
  roomType: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  available: boolean;
  furnished: boolean;
  amenities: string[];
  image: string;
  imageAlt: string;
  landlord: string;
  landlordAvatar: string;
  landlordAvatarAlt: string;
  responseRate: number;
  availableFrom: string;
  listedDaysAgo: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
};

export type FilterState = {
  location: string;
  roomTypes: string[];
  bedspaceTypes?: string[];
  minPrice: number;
  maxPrice: number;
  amenities: string[];
  furnished: boolean | null;
  maxDistance: number;
  available: boolean | null;
};


const defaultFilters: FilterState = {
  location: '',
  roomTypes: [],
  bedspaceTypes: [],
  minPrice: 0,
  maxPrice: 8000,
  amenities: [],
  furnished: null,
  maxDistance: 10,
  available: null,
};

export type SortOption = 'price-asc' | 'price-desc' | 'rating-desc' | 'distance-asc' | 'newest';

export default function ListingPageClient() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState<SortOption>('rating-desc');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ITEMS_PER_PAGE = 9;

  const API_BASE = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

  useEffect(() => {
    fetch(`${API_BASE}/properties`)
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load properties');
        setLoading(false);
      });
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...properties];


    if (filters.location) {
      result = result.filter((p) =>
        p.location.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.university.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.roomTypes.length > 0) {
      result = result.filter((p) => filters.roomTypes.includes(p.roomType));
    }

    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    if (filters.amenities.length > 0) {
      result = result.filter((p) =>
        filters.amenities.every((a) => p.amenities.includes(a))
      );
    }

    if (filters.furnished !== null) {
      result = result.filter((p) => p.furnished === filters.furnished);
    }

    result = result.filter((p) => p.distanceKm <= filters.maxDistance);

    if (filters.available === true) {
      result = result.filter((p) => p.available);
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance-asc':
        result.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
      case 'newest':
        result.sort((a, b) => b.listedDaysAgo - a.listedDaysAgo);
        break;
    }

    return result;
  }, [filters, sort]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginated = filteredAndSorted.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: defaultFilters[key] }));
    setPage(1);
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const activeFilterCount = [
    filters.location !== '',
    filters.roomTypes.length > 0,
    filters.minPrice > 0,
    filters.maxPrice < 8000,
    filters.amenities.length > 0,
    filters.furnished !== null,
    filters.maxDistance < 10,
    filters.available === true,
  ].filter(Boolean).length;

  return (
    <div className="pt-16 min-h-screen">
      <ListingHeader
        totalCount={filteredAndSorted.length}
        sort={sort}
        setSort={setSort}
        activeFilterCount={activeFilterCount}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
        <ActiveFilterChips
          filters={filters}
          onClear={clearFilter}
          onClearAll={clearAllFilters}
        />

        <div className="flex gap-6 mt-4">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onUpdate={updateFilter}
            onClear={clearFilter}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <PropertyGrid
              properties={paginated}
              totalCount={filteredAndSorted.length}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </div>
      </div>
    </div>
  );
}