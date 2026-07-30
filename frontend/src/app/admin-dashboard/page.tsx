'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageError, PageLoader } from '@/components/ui/PageStates';
import { useAuth } from '@/lib/authContext';
import { normalizeRole } from '@/lib/authUtils';
import {
  approveAdminUser,
  banAdminUser,
  fetchAdminStats,
  fetchAdminUsers,
  fetchProperties,
  rejectAdminUser,
} from '@/lib/api';
import type { AdminStats, AdminUser } from '@/lib/types/admin';
import { mapApiPropertiesToListings } from '@/lib/propertyMapper';
import type { ListingProperty } from '@/lib/types/listing';
import { UPLOADS_BASE } from '@/lib/config';
import {
  Users,
  Home,
  Shield,
  Star,
  BarChart2,
  CheckCircle,
  X,
  Lock,
  LogOut,
  Eye,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

type Tab = 'overview' | 'providers' | 'listings' | 'users' | 'reviews';

const roleColors: Record<string, string> = {
  student: 'bg-blue-100 text-blue-700',
  landlord: 'bg-purple-100 text-purple-700',
  admin: 'bg-red-100 text-red-700',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  REJECTED: 'bg-red-100 text-red-700',
  BANNED: 'bg-red-100 text-red-700',
};

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatRole(role: string) {
  return normalizeRole(role);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZM', { year: 'numeric', month: 'short', day: 'numeric' });
}

function resolveDocUrl(item: unknown): string | null {
  if (!item) return null;
  if (typeof item === 'string') {
    return item.startsWith('http') ? item : `${UPLOADS_BASE}/${item.replace(/^\//, '')}`;
  }
  if (typeof item === 'object' && item !== null && 'url' in item) {
    const url = String((item as { url: string }).url);
    return url.startsWith('http') ? url : `${UPLOADS_BASE}/${url.replace(/^\//, '')}`;
  }
  return null;
}

function getVerificationDocs(nrcImages: unknown): string[] {
  if (!nrcImages) return [];
  if (Array.isArray(nrcImages)) {
    return nrcImages.map(resolveDocUrl).filter((u): u is string => Boolean(u));
  }
  const single = resolveDocUrl(nrcImages);
  return single ? [single] : [];
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [listings, setListings] = useState<ListingProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminUser | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, usersData, propertiesData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminUsers(),
        fetchProperties(),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setListings(mapApiPropertiesToListings(propertiesData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const landlords = useMemo(
    () => users.filter((u) => normalizeRole(u.role) === 'landlord'),
    [users],
  );

  const pendingProviders = useMemo(
    () => landlords.filter((u) => u.status === 'PENDING'),
    [landlords],
  );

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: BarChart2 },
    { id: 'providers' as Tab, label: 'Provider Verification', icon: Shield },
    { id: 'listings' as Tab, label: 'All Listings', icon: Home },
    { id: 'users' as Tab, label: 'User Management', icon: Users },
    { id: 'reviews' as Tab, label: 'Review Moderation', icon: Star },
  ];

  const overviewStats = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Listings', value: stats.activeListings.toLocaleString(), icon: Home, color: 'text-green-700', bg: 'bg-green-50' },
        { label: 'Verified Providers', value: stats.verifiedProviders.toLocaleString(), icon: Shield, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Pending Verifications', value: stats.pendingVerifications.toLocaleString(), icon: Eye, color: 'text-amber-600', bg: 'bg-amber-50' },
      ]
    : [];

  const handleApprove = async (userId: string) => {
    setActionId(userId);
    try {
      await approveAdminUser(userId);
      toast.success('Provider approved successfully');
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Approval failed');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setActionId(rejectTarget.id);
    try {
      await rejectAdminUser(rejectTarget.id, rejectReason || undefined);
      toast.success('Provider application rejected');
      setRejectTarget(null);
      setRejectReason('');
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Rejection failed');
    } finally {
      setActionId(null);
    }
  };

  const handleBan = async (userId: string) => {
    if (!confirm('Disable this user account? They will lose access to the platform.')) return;
    setActionId(userId);
    try {
      await banAdminUser(userId);
      toast.success('User account disabled');
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      {!user ? null : (
        <main className="min-h-screen bg-gray-50">
          <Topbar />

          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-24 pb-16">
            {loading ? (
              <PageLoader message="Loading admin dashboard..." />
            ) : error ? (
              <PageError message={error} onRetry={loadData} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
                    <div className="mb-6 pb-6 border-b border-gray-100">
                      <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white font-bold text-lg mb-3">
                        {user.fullName.charAt(0)}
                      </div>
                      <p className="font-bold text-gray-900">{user.fullName}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 mt-1">
                        Admin
                      </span>
                    </div>
                    <nav className="space-y-1">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            activeTab === tab.id
                              ? 'bg-green-700 text-white'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-green-700'
                          }`}
                        >
                          <tab.icon size={16} />
                          {tab.label}
                          {tab.id === 'providers' && pendingProviders.length > 0 && (
                            <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              {pendingProviders.length}
                            </span>
                          )}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          logout();
                          router.push('/home');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </nav>
                  </div>
                </aside>

                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm">
                      Review provider applications, manage users, and monitor platform activity.
                    </p>
                  </div>

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

                  {activeTab === 'providers' && (
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-4">
                        Provider Verification Queue ({pendingProviders.length} pending)
                      </h2>
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {landlords.length === 0 ? (
                          <p className="p-8 text-center text-gray-500 text-sm">No provider accounts yet.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider</th>
                                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Compound</th>
                                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documents</th>
                                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {landlords.map((prov) => {
                                  const docs = getVerificationDocs(prov.nrcImages);
                                  const isPending = prov.status === 'PENDING';
                                  const isActive = prov.status === 'ACTIVE';
                                  const busy = actionId === prov.id;

                                  return (
                                    <tr key={prov.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                      <td className="px-5 py-4">
                                        <p className="font-medium text-gray-900">{prov.fullName}</p>
                                        <p className="text-xs text-gray-400">{prov.email}</p>
                                      </td>
                                      <td className="px-5 py-4 text-gray-600 text-xs">{prov.compoundName || '—'}</td>
                                      <td className="px-5 py-4">
                                        {docs.length ? (
                                          <div className="flex flex-wrap gap-1">
                                            {docs.slice(0, 3).map((doc, idx) => (
                                              <a
                                                key={`${prov.id}-doc-${idx}`}
                                                href={doc}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs hover:bg-green-50 hover:text-green-700"
                                              >
                                                <ExternalLink size={10} />
                                                Doc {idx + 1}
                                              </a>
                                            ))}
                                          </div>
                                        ) : (
                                          <span className="text-xs text-gray-400">No documents</span>
                                        )}
                                      </td>
                                      <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[prov.status] || 'bg-gray-100 text-gray-700'}`}>
                                          {isActive && <Shield size={9} />}
                                          {formatStatus(prov.status)}
                                        </span>
                                      </td>
                                      <td className="px-5 py-4">
                                        {isPending && (
                                          <div className="flex items-center gap-2">
                                            <button
                                              disabled={busy}
                                              onClick={() => handleApprove(prov.id)}
                                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold transition-colors disabled:opacity-50"
                                            >
                                              {busy ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                                              Approve
                                            </button>
                                            <button
                                              disabled={busy}
                                              onClick={() => setRejectTarget(prov)}
                                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-semibold transition-colors disabled:opacity-50"
                                            >
                                              <X size={12} />
                                              Reject
                                            </button>
                                          </div>
                                        )}
                                        {isActive && (
                                          <button
                                            disabled={busy}
                                            onClick={() => handleBan(prov.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 text-xs font-semibold transition-colors disabled:opacity-50"
                                          >
                                            <Lock size={12} />
                                            Disable
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'listings' && (
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-4">All Listings ({listings.length})</h2>
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {listings.length === 0 ? (
                          <p className="p-8 text-center text-gray-500 text-sm">No listings on the platform yet.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Listing</th>
                                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campus</th>
                                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {listings.map((prop) => (
                                  <tr key={prop.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4">
                                      <p className="font-medium text-gray-900 text-xs leading-tight">{prop.title}</p>
                                      <p className="text-xs text-gray-400">{prop.landlord}</p>
                                    </td>
                                    <td className="px-5 py-4 text-gray-500 text-xs">{prop.university}</td>
                                    <td className="px-5 py-4 font-mono font-semibold text-gray-900 text-xs">K{prop.price.toLocaleString()}</td>
                                    <td className="px-5 py-4">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${prop.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {prop.available ? 'Available' : 'Fully Booked'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'users' && (
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-4">User Management ({users.length})</h2>
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
                              {users.map((u) => {
                                const role = formatRole(u.role);
                                const busy = actionId === u.id;
                                return (
                                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4">
                                      <p className="font-medium text-gray-900">{u.fullName}</p>
                                      <p className="text-xs text-gray-400">{u.email}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[role]}`}>
                                        {role}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4 text-gray-500 text-xs">{formatDate(u.createdAt)}</td>
                                    <td className="px-5 py-4">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[u.status] || 'bg-gray-100 text-gray-700'}`}>
                                        {formatStatus(u.status)}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4">
                                      {u.status === 'ACTIVE' && role !== 'admin' && (
                                        <button
                                          disabled={busy}
                                          onClick={() => handleBan(u.id)}
                                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 text-xs font-semibold transition-colors disabled:opacity-50"
                                        >
                                          {busy ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />}
                                          Disable
                                        </button>
                                      )}
                                      {u.status === 'PENDING' && role === 'landlord' && (
                                        <button
                                          onClick={() => setActiveTab('providers')}
                                          className="text-xs text-green-700 font-semibold hover:underline"
                                        >
                                          Review in queue →
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                      <Star size={32} className="mx-auto text-amber-400 mb-3" />
                      <h2 className="text-lg font-bold text-gray-900 mb-2">Review Moderation</h2>
                      <p className="text-gray-500 text-sm max-w-md mx-auto">
                        Review moderation will be available once the reviews system is fully integrated with the platform API.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {rejectTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Provider Application</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Rejecting <strong>{rejectTarget.fullName}</strong>. Optionally provide a reason — they will receive an email notification.
                </p>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason for rejection (optional)"
                  rows={3}
                  className="input-base mb-4 resize-none"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setRejectTarget(null);
                      setRejectReason('');
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionId === rejectTarget.id}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionId === rejectTarget.id ? <Loader2 size={14} className="animate-spin" /> : null}
                    Confirm Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          <Footer />
        </main>
      )}
    </ProtectedRoute>
  );
}
