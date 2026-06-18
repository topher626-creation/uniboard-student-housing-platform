'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/authContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { properties, providers } from '@/lib/mockData';
import { Users, Home, Shield, Star, BarChart2, CheckCircle, X, Lock, Flag, LogOut, Eye } from 'lucide-react';

type Tab = 'overview' | 'providers' | 'listings' | 'users' | 'reviews';

const mockUsers = [
  { id: 'u-001', name: 'Chipo Mwanza', email: 'chipo@student.unza.zm', role: 'student', status: 'active', joined: '2025-01-10' },
  { id: 'u-002', name: 'Chanda Mwale', email: 'chanda@mwaleresidences.zm', role: 'landlord', status: 'active', joined: '2024-01-15' },
  { id: 'u-003', name: 'Kelvin Phiri', email: 'kelvin@phiriaccommodation.zm', role: 'landlord', status: 'pending', joined: '2025-01-05' },
  { id: 'u-004', name: 'Bupe Chanda', email: 'bupe@student.cbu.zm', role: 'student', status: 'active', joined: '2025-02-20' },
];

const roleColors: Record<string, string> = {
  student: 'bg-blue-100 text-blue-700',
  landlord: 'bg-purple-100 text-purple-700',
  admin: 'bg-red-100 text-red-700',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  disabled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: BarChart2 },
    { id: 'providers' as Tab, label: 'Provider Verification', icon: Shield },
    { id: 'listings' as Tab, label: 'All Listings', icon: Home },
    { id: 'users' as Tab, label: 'User Management', icon: Users },
    { id: 'reviews' as Tab, label: 'Review Moderation', icon: Star },
  ];

  const overviewStats = [
    { label: 'Total Users', value: '8,500+', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Listings', value: '1,240', icon: Home, color: 'text-green-700', bg: 'bg-green-50' },
    { label: 'Verified Providers', value: '340', icon: Shield, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Verifications', value: providers.filter((p) => p.verificationStatus === 'pending').length, icon: Eye, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const pendingProviders = providers.filter((p) => p.verificationStatus === 'pending');

  return (
    <ProtectedRoute allowedRoles={['admin']}>
    {!user ? null : (
    <main className="min-h-screen bg-gray-50">
      <Topbar />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white font-bold text-lg mb-3">
                  A
                </div>
                <p className="font-bold text-gray-900">{user.fullName}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 mt-1">Admin</span>
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm">Manage providers, listings, users, and reviews for UniBoard Zambia.</p>
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {overviewStats.map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                      <stat.icon size={18} className={stat.color} />
                    </div>
                    <p className={`text-2xl font-bold font-mono ${stat.color} mb-0.5`}>{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Provider Verification */}
            {activeTab === 'providers' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Provider Verification Queue ({pendingProviders.length} pending)</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Compound</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {providers.map((prov) => (
                          <tr key={prov.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4">
                              <div>
                                <p className="font-medium text-gray-900">{prov.name}</p>
                                <p className="text-xs text-gray-400">{prov.email}</p>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-gray-600 text-xs">{prov.compoundName}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${prov.verificationStatus === 'verified' ? 'bg-green-100 text-green-700' : prov.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                {prov.verificationStatus === 'verified' && <Shield size={9} />}
                                {prov.verificationStatus.charAt(0).toUpperCase() + prov.verificationStatus.slice(1)}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {prov.verificationStatus === 'pending' && (
                                <div className="flex items-center gap-2">
                                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold transition-colors">
                                    <CheckCircle size={12} />
                                    Approve
                                  </button>
                                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-semibold transition-colors">
                                    <X size={12} />
                                    Reject
                                  </button>
                                </div>
                              )}
                              {prov.verificationStatus === 'verified' && (
                                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 text-xs font-semibold transition-colors">
                                  <Lock size={12} />
                                  Disable
                                </button>
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

            {/* All Listings */}
            {activeTab === 'listings' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">All Listings ({properties.length})</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Listing</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campus</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.map((prop) => (
                          <tr key={prop.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4">
                              <p className="font-medium text-gray-900 text-xs leading-tight">{prop.title}</p>
                              <p className="text-xs text-gray-400">{prop.provider.name}</p>
                            </td>
                            <td className="px-5 py-4 text-gray-500 text-xs">{prop.campus}</td>
                            <td className="px-5 py-4 font-mono font-semibold text-gray-900 text-xs">K{prop.price.toLocaleString()}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${prop.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {prop.verified ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5">
                                {!prop.verified && (
                                  <button className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                                    <CheckCircle size={13} />
                                  </button>
                                )}
                                <button className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                  <Flag size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* User Management */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">User Management ({mockUsers.length})</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockUsers.map((u) => (
                          <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4">
                              <p className="font-medium text-gray-900">{u.name}</p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[u.role]}`}>{u.role}</span>
                            </td>
                            <td className="px-5 py-4 text-gray-500 text-xs">{u.joined}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[u.status]}`}>{u.status}</span>
                            </td>
                            <td className="px-5 py-4">
                              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 text-xs font-semibold transition-colors">
                                <Lock size={12} />
                                Disable
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Review Moderation */}
            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Review Moderation</h2>
                <div className="space-y-4">
                  {properties.flatMap((p) => p.reviews).map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900 text-sm">{review.authorName}</p>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={`mod-star-${i}`} size={11} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                              ))}
                            </div>
                            {review.verifiedStay && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                                <Shield size={9} />
                                Verified Stay
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                          <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                            <CheckCircle size={14} />
                          </button>
                          <button className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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
