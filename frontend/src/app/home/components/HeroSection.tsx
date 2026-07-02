 'use client';

import React, { useState } from 'react';
import { ArrowRight, MapPin, Search, Shield, Users, Star, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';

const propertyFilters = ['All Properties', 'En-Suite', 'Shared Room', 'Private Room', 'Studio'];

export default function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('All Properties');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (propertyFilter && propertyFilter !== 'All Properties') params.set('property', propertyFilter);
    router.push(`/room-listing-page?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a2e1a 0%, #1B4332 45%, #2d6a4f 100%)' }} />
      {/* Decorative elements */}
      <div className="absolute top-20 right-[8%] w-80 h-80 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/5 rounded-full blur-3xl pointer-events-none" />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(11, 253, 55, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Left — Text */}
          <div className="lg:col-span-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5 tracking-tight">
              <span className="block text-white/95">
                Find{' '}
                <span className="text-orange-500">Verified</span>{' '}
                Student
              </span>
              <span className="block text-white/95">Accommodation Near Your Campus</span>
            </h1>

            <p className="text-base sm:text-lg text-white/80 max-w-xl mb-8 leading-relaxed">
              UniBoard connects students with <span className="text-green-600 font-semibold">verified landlords</span>, real-time availability, safer housing, and everything you need in one place.
            </p>

            {/* subtle “card” behind the title for better visual hierarchy */}


            {/* Search system */}
            <div className="bg-white/95 backdrop-blur-md rounded-[24px] p-4 shadow-[0_20px_60px_rgba(2,6,23,0.18)] max-w-2xl border border-white/80">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700 pointer-events-none" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search by location or compound"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                  />
                </div>
                <div className="relative">
                  <select
                    value={propertyFilter}
                    onChange={(e) => setPropertyFilter(e.target.value)}
                    className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 appearance-none cursor-pointer"
                  >
                    {propertyFilters.map((pf) => (
                      <option key={`hero-pf-${pf}`} value={pf}>{pf}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleSearch}
                  className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-150 active:scale-95"
                >
                  <Search size={16} />
                  Search
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleSearch}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-150 active:scale-95"
                >
                  Find Accommodation
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => router.push('/sign-up-login-screen')}
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-green-700 border border-green-200 hover:bg-green-50 font-semibold py-2.5 px-4 rounded-xl transition-all duration-150"
                >
                  <User size={16} />
                  Register as Landlord
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-5 mt-7">
              <div className="flex items-center gap-2 text-white/75">
                <Shield size={15} className="text-green-400" />
                <span className="text-sm font-medium">340+ Verified Providers</span>
              </div>
              <div className="flex items-center gap-2 text-white/75">
                <Users size={15} className="text-green-400" />
                <span className="text-sm font-medium">8,500+ Students Housed</span>
              </div>
              <div className="flex items-center gap-2 text-white/75">
                <Star size={15} className="text-green-400" />
                <span className="text-sm font-medium">4.8/5 Average Rating</span>
              </div>
            </div>

          </div>

          {/* Right — Premium image */}
          <div className="lg:col-span-2 hidden lg:flex">
            <div className="w-full relative h-[460px] rounded-[28px] overflow-hidden shadow-2xl">

              {/* Dotted grid decoration */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)',
                  backgroundSize: '22px 22px',
                }}
              />
              {/* Subtle mesh */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />

              <AppImage
                src="/assets/images/UniBoard home page image .jpeg"
                alt="UniBoard student accommodation"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {/* Top-right verified badge */}
              <div className="absolute top-4 right-4 bg-white/90 border border-gray-100 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm">
                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">✓</span>
                <span className="text-xs font-semibold text-gray-900">Verified listings</span>
              </div>

              {/* Soft vignette */}
              <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 -120px 180px rgba(0,0,0,0.10)' }} />
            </div>
          </div>

          {/* Mobile image (below text) */}
          <div className="lg:hidden relative mt-10">
            <div className="w-full relative h-[360px] rounded-[28px] overflow-hidden shadow-2xl">

              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-35"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)',
                  backgroundSize: '22px 22px',
                }}
              />
              <AppImage
                src="/assets/images/UniBoard home page image .jpeg"
                alt="UniBoard student accommodation"
                fill
                unoptimized
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="#f9fafb" />
        </svg>
      </div>
    </section>
  );
}