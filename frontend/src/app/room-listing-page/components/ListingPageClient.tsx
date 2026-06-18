'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FilterSidebar from './FilterSidebar';
import PropertyGrid from './PropertyGrid';
import ListingHeader from './ListingHeader';
import ActiveFilterChips from './ActiveFilterChips';
import { fetchProperties } from '@/lib/api';
import { mapApiPropertiesToListings } from '@/lib/propertyMapper';
import type { ListingProperty } from '@/lib/types/listing';
import { PageLoader, PageError } from '@/components/ui/PageStates';

export type Property = ListingProperty;

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
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    location: searchParams.get('q') ?? searchParams.get('location') ?? '',
  }));
  const [sort, setSort] = useState<SortOption>('rating-desc');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [properties, setProperties] = useState<ListingProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 9;

  const loadProperties = () => {
    setLoading(true);
    setError(null);
    fetchProperties()
      .then((data) => {
        setProperties(mapApiPropertiesToListings(data));
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load properties');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...properties];

    if (filters.location) {
      const query = filters.location.toLowerCase();
      result = result.filter(
        (p) =>
          p.location.toLowerCase().includes(query) ||
          p.university.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query),
      );
    }

    if (filters.roomTypes.length > 0) {
      result = result.filter((p) => filters.roomTypes.includes(p.roomType));
    }

    result = result.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    if (filters.amenities.length > 0) {
      result = result.filter((p) => filters.amenities.every((a) => p.amenities.includes(a)));
    }

    if (filters.furnished !== null) {
      result = result.filter((p) => p.furnished === filters.furnished);
    }

    result = result.filter((p) => p.distanceKm <= filters.maxDistance);

    if (filters.available === true) {
      result = result.filter((p) => p.available);
    }

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
        result.sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);
        break;
    }

    return result;
  }, [filters, sort, properties]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginated = filteredAndSorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
        <ActiveFilterChips filters={filters} onClear={clearFilter} onClearAll={clearAllFilters} />

        <div className="flex gap-6 mt-4">
          <FilterSidebar
            filters={filters}
            onUpdate={updateFilter}
            onClear={clearFilter}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="flex-1 min-w-0">
            {loading ? (
              <PageLoader message="Loading available bedspaces..." />
            ) : error ? (
              <PageError message={error} onRetry={loadProperties} />
            ) : (
              <PropertyGrid
                properties={paginated}
                totalCount={filteredAndSorted.length}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
