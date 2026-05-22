import type { FC } from 'react';
import { Building2, Home, ListChecks, Plus, Users } from 'lucide-react';
import DashboardFrame from '../components/DashboardFrame.tsx';

const ProviderDashboard: FC = () => (
  <DashboardFrame
    kicker="Landlord workspace"
    title="Provider Dashboard"
    subtitle="Manage compounds, buildings, rooms, and real-time room availability after admin approval."
  >
      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <Metric icon={Home} value="0" label="Active Listings" />
        <Metric icon={Users} value="0" label="Pending Bookings" />
        <Metric icon={ListChecks} value="0" label="Total Bookings" />
        <Metric icon={Building2} value="Pending" label="Verification Status" />
      </section>
      <section id="listings" className="mt-8 card-surface p-8">
        <h2 className="text-2xl font-black text-slate-950">My Listings</h2>
        <p className="mt-3 text-slate-600">No listings yet. Once your landlord account is approved, your listings can auto-publish.</p>
        <button type="button" className="btn-primary mt-6"><Plus size={18} /> Create Listing</button>
      </section>
  </DashboardFrame>
);

const Metric: FC<{ icon: any; value: string; label: string }> = ({ icon: Icon, value, label }) => (
  <article className="card-surface p-5">
    <Icon className="text-brand-700" />
    <p className="mt-4 text-2xl font-black text-slate-950">{value}</p>
    <p className="text-sm font-semibold text-slate-500">{label}</p>
  </article>
);

export default ProviderDashboard;
