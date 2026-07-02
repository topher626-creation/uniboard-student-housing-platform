'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/authContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { API_BASE } from '@/lib/config';
import { 
  LayoutDashboard, 
  Home, 
  BarChart2, 
  User, 
  Settings, 
  LogOut, 
  Plus, 
  Shield, 
  Clock, 
  MapPin, 
  Bed, 
  Users, 
  CheckCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';

type Tab = 'overview' | 'properties' | 'analytics' | 'profile' | 'settings';

export default function LandlordDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('uniboard_token');
        const [overviewRes, propertiesRes] = await Promise.all([
          fetch(`${API_BASE}/landlord/overview`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE}/landlord/properties`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (overviewRes.ok) setDashboardData(await overviewRes.json());
        if (propertiesRes.ok) setProperties(await propertiesRes.json());
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const businessName = dashboardData?.businessName || user?.compoundName || 'My Residence';
  const isVerified = dashboardData?.status === 'ACTIVE';

  const sidebarItems = [
    { id: 'overview' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties' as Tab, label: 'Properties', icon: Home },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart2 },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  const stats = [
    { 
      label: 'Total Properties', 
      value: dashboardData?.stats?.totalProperties || 0, 
      icon: Home, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Total Bedspaces', 
      value: dashboardData?.stats?.totalBedspaces || 0, 
      icon: Bed, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Occupied', 
      value: dashboardData?.stats?.occupiedBedspaces || 0, 
      icon: Users, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
    { 
      label: 'Available', 
      value: dashboardData?.stats?.availableBedspaces || 0, 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
  ];

  return (
    <ProtectedRoute allowedRoles={['landlord']}>
      <main className="min-h-screen bg-gray-50">
        <Topbar />

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="w-14 h-14 rounded-2xl bg-green-700 flex items-center justify-center text-white font-bold text-xl mb-3 shadow-lg shadow-green-100">
                    {businessName.charAt(0)}
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg truncate">{businessName}</h2>
                  <div className="mt-2">
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <CheckCircle size={12} />
                        Verified Landlord
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                        <Clock size={12} />
                        Pending Approval
                      </span>
                    )}
                  </div>
                </div>

                <nav className="space-y-1.5">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === item.id 
                          ? 'bg-green-700 text-white shadow-md shadow-green-100' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-green-700'
                      }`}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </button>
                  ))}
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <button
                      onClick={() => { logout(); router.push('/home'); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Header Card */}
              <div className="relative overflow-hidden rounded-[28px] border border-gray-100 bg-white p-8 shadow-sm">
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🏢</span>
                        <h1 className="text-3xl font-black text-gray-900">{businessName}</h1>
                      </div>
                      <p className="text-gray-500 font-medium text-lg">Verified Landlord Dashboard</p>
                      <p className="text-gray-400 text-sm mt-1 max-w-md">
                        Manage your accommodation listings and bedspaces from one place.
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => router.push('/landlord-dashboard/add-property')}
                      disabled={!isVerified}
                      className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-white transition-all active:scale-95 shadow-lg ${
                        isVerified 
                          ? 'bg-green-700 hover:bg-green-800 shadow-green-100' 
                          : 'bg-gray-300 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <Plus size={20} />
                      Add Property
                    </button>
                  </div>

                  {!isVerified && (
                    <div className="mt-8 flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <AlertCircle size={20} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-amber-900 font-bold">Account Verification Pending</p>
                        <p className="text-amber-700 text-sm mt-0.5">
                          Your account is currently being reviewed. You will be able to add properties and manage listings once our team approves your documents.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-hover hover:shadow-md">
                    <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
                      <stat.icon size={22} className={stat.color} />
                    </div>
                    <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 min-h-[400px]">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                    {properties.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-12">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                          <Home size={40} className="text-green-700" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No properties yet</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">
                          Start by adding your first property listing to reach thousands of students.
                        </p>
                        {isVerified && (
                          <button 
                            onClick={() => router.push('/landlord-dashboard/add-property')}
                            className="mt-6 flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
                          >
                            <Plus size={18} />
                            Create Listing
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {properties.slice(0, 3).map((prop) => (
                          <div key={prop.id} className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4 transition-colors hover:bg-gray-50">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                              {prop.images?.[0] ? (
                                <img src={`${API_BASE.replace('/api', '')}${prop.images[0].url}`} alt={prop.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 truncate">{prop.name}</h4>
                              <p className="text-xs text-gray-500">{prop.location} · {prop.roomType}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-green-700">K{prop.price}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{prop.totalBeds - prop.occupiedBeds} beds left</p>
                            </div>
                          </div>
                        ))}
                        <button 
                          onClick={() => setActiveTab('properties')}
                          className="w-full py-3 text-sm font-bold text-gray-500 hover:text-green-700 transition-colors"
                        >
                          View All Properties
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'properties' && (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black text-gray-900">Your Properties</h3>
                      <button 
                        onClick={() => router.push('/landlord-dashboard/add-property')}
                        disabled={!isVerified}
                        className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-50"
                      >
                        <Plus size={16} />
                        Add New
                      </button>
                    </div>

                    {properties.length === 0 ? (
                      <div className="text-center py-20">
                        <p className="text-gray-400 font-medium">You haven't added any properties yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {properties.map((prop) => (
                          <div key={prop.id} className="group overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                            <div className="relative aspect-[16/10] overflow-hidden">
                              {prop.images?.[0] ? (
                                <img src={`${API_BASE.replace('/api', '')}${prop.images[0].url}`} alt={prop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400"><ImageIcon size={40} /></div>
                              )}
                              <div className="absolute top-3 left-3">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${
                                  prop.totalBeds - prop.occupiedBeds > 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                }`}>
                                  {prop.totalBeds - prop.occupiedBeds > 0 ? 'Available' : 'Full'}
                                </span>
                              </div>
                            </div>
                            <div className="p-5">
                              <h4 className="font-bold text-gray-900 mb-1 truncate">{prop.name}</h4>
                              <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium mb-4">
                                <MapPin size={12} />
                                {prop.location}
                              </div>
                              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</p>
                                  <p className="font-black text-green-700">K{prop.price}<span className="text-[10px] text-gray-400 font-bold">/mo</span></p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}
