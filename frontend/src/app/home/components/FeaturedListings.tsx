'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import { ArrowRight, Heart, MapPin, Phone, Shield, Star } from 'lucide-react';
import { fetchProperties } from '@/lib/api';
import { mapApiPropertiesToListings } from '@/lib/propertyMapper';
import type { ListingProperty } from '@/lib/types/listing';
import { FeaturedListingsSkeleton } from '@/components/ui/Skeleton';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const typeColors: Record<string, string> = {
  'Single Room': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  'Shared Room': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  'Self-Contained': 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  Bedsitter: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  Bankers: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function FeaturedListings() {
  const { data: featured, isLoading } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: async () => {
      const data = await fetchProperties();
      const mapped = mapApiPropertiesToListings(data);
      return mapped.slice(0, 6);
    },
  });

  return (
    <section className="py-20 bg-white dark:bg-gray-900" id="featured">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-green-700 dark:text-green-400 mb-2">Curated for You</p>
            <h2 className="text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white">Featured Bedspaces</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">Verified properties near top Zambian universities</p>
          </div>
          <Link
            href="/room-listing-page"
            className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold text-sm hover:text-green-800 dark:hover:text-green-300 transition-colors flex-shrink-0"
          >
            View all listings
            <ArrowRight size={16} aria-hidden />
          </Link>
        </motion.div>

        {isLoading ? (
          <FeaturedListingsSkeleton />
        ) : !featured || featured.length === 0 ? (
          <div className="rounded-lg border border-gray-100 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-sm">New listings are being added. Check back soon or browse all bedspaces.</p>
            <Link href="/room-listing-page" className="inline-block mt-4 text-green-700 dark:text-green-400 font-semibold text-sm hover:underline">
              Browse all listings
            </Link>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {featured.map((prop) => (
              <motion.div
                key={prop.id}
                variants={cardVariants}
              >
                <Link
                  href={`/property/${prop.id}`}
                  className="group block overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative h-52 overflow-hidden">
                    <AppImage
                      src={prop.image}
                      alt={prop.imageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[prop.roomType] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {prop.roomType}
                      </span>
                      {prop.verified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                          <Shield size={10} />
                          Verified
                        </span>
                      )}
                    </div>
                    {!prop.available && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">Fully Booked</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1 line-clamp-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                      {prop.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-xs mb-3">
                      <MapPin size={12} className="flex-shrink-0" />
                      <span className="truncate">{prop.location} - {prop.university}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">K{prop.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-400">/month</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{prop.rating}</span>
                        <span className="text-xs text-gray-400">({prop.reviewCount})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Phone size={12} />
                        <span>{prop.landlord}</span>
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-green-600">
                        <WhatsAppIcon />
                        <Heart size={14} className="text-gray-300 dark:text-gray-600" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
