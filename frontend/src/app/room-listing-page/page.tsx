import React, { Suspense } from 'react';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import ListingPageClient from './components/ListingPageClient';
import { PageLoader } from '@/components/ui/PageStates';

export default function RoomListingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Topbar />
      <Suspense fallback={<PageLoader message="Loading listings..." />}>
        <ListingPageClient />
      </Suspense>
      <Footer />
    </main>
  );
}
