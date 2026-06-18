'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/authContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { properties } from '@/lib/mockData';
import { Heart, BookOpen, User, MapPin, Star, Shield, LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

const savedPropertyIds = ['prop-001', 'prop-006', 'prop-012'];
const savedProperties = properties.filter((p) => savedPropertyIds.includes(p.id));

const bookings = [
  { id: 'book-001', property: 'Northmead Student Lodge', campus: 'UNZA', status: 'confirmed', checkIn: '2025-02-01', price: 2800 },
  { id: 'book-002', property: 'UNILUS Garden Flats', campus: 'UNILUS', status: 'pending', checkIn: '2025-05-01', price: 4200 },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
};

type Tab = 'saved' | 'bookings' | 'profile';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('saved');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'saved' as Tab, label: 'Saved Listings', icon: Heart },
    { id: 'bookings' as Tab, label: 'My Bookings', icon: BookOpen },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
  ];

  return (
    <ProtectedRoute allowedRoles={['student']}>
    {!user ? null : (
    <main className="min-h-screen bg-gray-50">
      <Topbar />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-green-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {user.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user.fullName}</p>
                  <p className="text-xs text-gray-400">{user.university || 'Student'}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-green-700'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
                <Link
                  href="/room-listing-page"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-green-700 transition-all"
                >
                  <Home size={16} />
                  Browse Listings
                </Link>
                <button
                  onClick={() => { logout(); router.push('/home'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {user.fullName.split(' ')[0]}! 👋</h1>
              <p className="text-gray-500 text-sm">Manage your saved listings, bookings, and profile from here.</p>
            </div>

            {/* Saved Listings */}
            {activeTab === 'saved' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Saved Bedspaces ({savedProperties.length})</h2>
                {savedProperties.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                    <Heart size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500">No saved listings yet. Browse and save bedspaces you like.</p>
                    <Link href="/room-listing-page" className="mt-4 inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
                      Browse Listings
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedProperties.map((prop) => (
                      <Link key={prop.id} href={`/property/${prop.id}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden block">
                        <div className="relative h-40 overflow-hidden">
                          <AppImage src={prop.images[0].src} alt={prop.images[0].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 50vw" />
                          {prop.verified && (
                            <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <Shield size={9} />
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-green-700 transition-colors">{prop.title}</h3>
                          <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                            <MapPin size={11} className="text-green-600" />
                            {prop.location}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900 font-mono">K{prop.price.toLocaleString()}<span className="text-gray-400 text-xs font-normal">/mo</span></span>
                            <div className="flex items-center gap-1">
                              <Star size={11} className="text-amber-400 fill-amber-400" />
                              <span className="text-xs font-semibold text-gray-700">{prop.rating}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">My Bookings</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campus</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-In</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4 font-medium text-gray-900">{booking.property}</td>
                            <td className="px-5 py-4 text-gray-500">{booking.campus}</td>
                            <td className="px-5 py-4 text-gray-500">{booking.checkIn}</td>
                            <td className="px-5 py-4 font-mono font-semibold text-gray-900">K{booking.price.toLocaleString()}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[booking.status]}`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Profile */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">My Profile</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { label: 'Full Name', value: user.fullName },
                      { label: 'Email Address', value: user.email },
                      { label: 'Phone Number', value: user.phone || 'Not set' },
                      { label: 'University', value: user.university || 'Not set' },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{field.label}</label>
                        <div className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700">{field.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <p className="text-xs text-gray-400">Profile editing coming soon. Contact support to update your details.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
    )}
    </ProtectedRoute>
  );
}
