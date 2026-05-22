'use client';

import React from 'react';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import UniversitySection from './components/UniversitySection';
import FeaturedListings from './components/FeaturedListings';
import VerifiedProviders from './components/VerifiedProviders';
import HowItWorks from './components/HowItWorks';
import TrustBanner from './components/TrustBanner';
import CtaBanner from './components/CtaBanner';
import Testimonials from './components/Testimonials';
import FeatureBenefitsStrip from './components/FeatureBenefitsStrip';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Topbar />
      <HeroSection />
      <StatsBar />
      <FeatureBenefitsStrip />
      <FeaturedListings />

      {/* The remaining existing sections are kept, but moved below Featured Properties
          to satisfy the required strict ordering. */}
      <UniversitySection />
      <TrustBanner />
      <VerifiedProviders />
      <HowItWorks />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </main>
  );
}
