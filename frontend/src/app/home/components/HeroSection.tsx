'use client';

import React, { useState } from 'react';
import { ArrowRight, BadgeCheck, MapPin, Search, Shield, Star, User, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';

const roomTypeOptions = ['All Types', 'Single Room', 'Shared Room', 'Bunkered Room', 'Self-Contained'];
const genderOptions = [
  { value: 'all', label: 'Any' },
  { value: 'male', label: 'Boys only' },
  { value: 'female', label: 'Girls only' },
  { value: 'mixed', label: 'Both' },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('All Types');
  const [genderFilter, setGenderFilter] = useState('all');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (roomTypeFilter && roomTypeFilter !== 'All Types') params.set('roomType', roomTypeFilter);
    if (genderFilter && genderFilter !== 'all') params.set('genderPreference', genderFilter);
    router.push(`/room-listing-page?${params.toString()}`);
  };

  return (
    <section className="relative flex min-h-[86vh] items-center overflow-hidden bg-gray-950">
      <AppImage
        src="/assets/images/UniBoard home page image .jpeg"
        alt="UniBoard student accommodation near campus"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.88)_0%,rgba(3,7,18,0.66)_46%,rgba(3,7,18,0.24)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-50 via-gray-50/70 to-transparent dark:from-gray-900 dark:via-gray-900/60" />

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 xl:px-10">
        <motion.div
          className="max-w-3xl"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md"
          >
            <BadgeCheck size={15} className="text-amber-300" />
            Verified student housing across Zambia
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mb-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            UniBoard
            <span className="block text-white/90">student accommodation near your campus</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mb-8 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg"
          >
            UniBoard connects students with <span className="font-semibold text-green-300">verified landlords</span>, real-time availability, safer housing, and everything you need in one place.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="max-w-2xl rounded-lg border border-white/80 bg-white/95 p-3 shadow-[0_18px_50px_rgba(2,6,23,0.22)] backdrop-blur-md"
          >
            <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
              <div className="relative">
                <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-green-700" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Search by location or residence"
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-9 pr-3 text-sm font-medium text-gray-700 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                />
              </div>
              <div className="relative">
                <select
                  value={roomTypeFilter}
                  onChange={(e) => setRoomTypeFilter(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-3 pl-3 pr-3 text-sm font-medium text-gray-700 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                >
                  {roomTypeOptions.map((option) => (
                    <option key={`hero-room-${option}`} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-3 pl-3 pr-3 text-sm font-medium text-gray-700 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                >
                  {genderOptions.map((option) => (
                    <option key={`hero-gender-${option.value}`} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSearch}
                className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition-colors duration-150 hover:bg-green-800"
              >
                <Search size={16} />
                Search
              </button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleSearch}
                className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition-colors duration-150 hover:bg-green-800"
              >
                Find Accommodation
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => router.push('/sign-up-login-screen')}
                className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-3 font-semibold text-green-700 transition-colors duration-150 hover:bg-green-50"
              >
                <User size={16} />
                Register as Landlord
              </button>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-7 flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2 text-white/75">
              <Shield size={15} className="text-green-300" />
              <span className="text-sm font-medium">340+ Verified Providers</span>
            </div>
            <div className="flex items-center gap-2 text-white/75">
              <Users size={15} className="text-green-300" />
              <span className="text-sm font-medium">8,500+ Students Housed</span>
            </div>
            <div className="flex items-center gap-2 text-white/75">
              <Star size={15} className="text-green-300" />
              <span className="text-sm font-medium">4.8/5 Average Rating</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
