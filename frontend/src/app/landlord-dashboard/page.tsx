'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/authContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { properties } from '@/lib/mockData';
import { Home, BookOpen, BarChart2, Plus, Shield, LogOut, Edit, Trash2, Eye, CheckCircle, Clock, X } from 'lucide-react';

import AppImage from '@/components/ui/AppImage';

type Tab = 'overview' | 'listings' | 'bookings';

const mockBookingRequests = [
  { id: 'br-001', studentName: 'Chipo Mwanza', property: 'Northmead Student Lodge', date: '2025-04-10', status: 'pending' },
  { id: 'br-002', studentName: 'Mulenga Kapata', property: 'Northmead Student Lodge', date: '2025-04-08', status: 'confirmed' },
  { id: 'br-003', studentName: 'Bupe Chanda', property: 'Kamwala Student Flats', date: '2025-04-05', status: 'pending' },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function LandlordDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const myListings = properties.filter((_, i) => i < 3);
  const compoundName = user?.compoundName || 'My Properties';
  const listingCap = 3;
  const listingCount = myListings.length;

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: BarChart2 },
    { id: 'listings' as Tab, label: 'My Listings', icon: Home },
    { id: 'bookings' as Tab, label: 'Booking Requests', icon: BookOpen },
  ];

  const stats = [
    { label: 'Total Listings', value: listingCount, icon: Home, color: 'text-green-700', bg: 'bg-green-50' },
    { label: 'Pending Bookings', value: mockBookingRequests.filter((b) => b.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Views', value: '1,240', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Listing Cap', value: `${listingCount}/${listingCap}`, icon: BarChart2, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <ProtectedRoute allowedRoles={['landlord']}>
    {!user ? null : (
    <main className="min-h-screen bg-gray-50">
      <Topbar />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-green-700 flex items-center justify-center text-white font-bold text-lg mb-3">
                  {user.fullName.charAt(0)}
                </div>
                <p className="font-bold text-gray-900">{user.fullName}</p>
                <p className="text-green-700 text-sm font-semibold">{compoundName}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  {user.role === 'landlord' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      <Clock size={9} />
                      Pending Verification
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <Shield size={9} />
                      Verified Provider
                    </span>
                  )}
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
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{compoundName}</h1>
                  <p className="text-gray-500 text-sm">Welcome back, {user.fullName.split(' ')[0]}. Manage your bedspace listings and bookings.</p>
                </div>
                <button className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-95 flex-shrink-0">
                  <Plus size={16} />
                  Add Listing
                </button>
              </div>

              {/* Verification Banner */}
              <div className="mt-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <Shield size={20} className="text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-amber-800 font-semibold text-sm">Verification Pending</p>
                  <p className="text-amber-700 text-xs">Our team is reviewing your documents. You can add listings but they will only go live after verification. Typically 24-48 hours.</p>
                </div>
              </div>
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                        <stat.icon size={18} className={stat.color} />
                      </div>
                      <p className={`text-2xl font-bold font-mono ${stat.color} mb-0.5`}>{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Listing Cap Progress */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">Listing Cap Progress</h3>
                    <span className="text-sm font-semibold text-gray-500">{listingCount}/{listingCap} listings</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(listingCount / listingCap) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">Free plan allows up to {listingCap} active listings. Contact us to upgrade.</p>
                </div>
              </>
            )}

            {/* My Listings */}
            {activeTab === 'listings' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">My Listings ({listingCount})</h2>
                  <button className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all">
                    <Plus size={15} />
                    Add New
                  </button>
                </div>
                <div className="space-y-4">
                  {myListings.map((prop) => (
                    <div key={prop.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                      <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <AppImage src={prop.images[0].src} alt={prop.images[0].alt} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-0.5 truncate">{prop.title}</h3>
                        <p className="text-xs text-gray-400 mb-1">{prop.location} · {prop.campus}</p>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-green-700 text-sm">K{prop.price.toLocaleString()}/mo</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${prop.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {prop.available ? 'Available' : 'Full'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button className="p-2 rounded-lg text-gray-400 hover:text-green-700 hover:bg-green-50 transition-colors">
                          <Edit size={15} />
                        </button>
                        <button className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Requests */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Booking Requests</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockBookingRequests.map((req) => (
                          <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4 font-medium text-gray-900">{req.studentName}</td>
                            <td className="px-5 py-4 text-gray-500 text-xs">{req.property}</td>
                            <td className="px-5 py-4 text-gray-500">{req.date}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[req.status]}`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {req.status === 'pending' && (
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                                    <CheckCircle size={14} />
                                  </button>
                                  <button className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                    <X size={14} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
