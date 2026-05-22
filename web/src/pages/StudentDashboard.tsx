import type { FC } from 'react';
import { CalendarCheck, Heart, Home } from 'lucide-react';
import { useMyBookings } from '../hooks/index.js';
import DashboardFrame from '../components/DashboardFrame.tsx';

const StudentDashboard: FC = () => {
  const { data: bookings, isLoading } = useMyBookings();
  const rows = bookings?.data ?? [];

  return (
    <DashboardFrame
      kicker="Student workspace"
      title="My Dashboard"
      subtitle="Track bookings, saved listings, and verified accommodation activity from one secure dashboard."
    >
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Metric icon={CalendarCheck} value={rows.length} label="Bookings" />
          <Metric icon={Heart} value="0" label="Saved Listings" />
          <Metric icon={Home} value="Verified" label="Accommodation Search" />
        </section>
        <section className="mt-8 card-surface overflow-hidden">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-2xl font-black text-slate-950">My Bookings</h2>
          </div>
          {isLoading ? (
            <p className="p-8 text-center text-slate-500">Loading bookings...</p>
          ) : rows.length === 0 ? (
            <p className="p-8 text-center text-slate-500">No bookings yet. Start by finding verified accommodation near your campus.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr><th className="px-6 py-3">Property</th><th className="px-6 py-3">Check-in</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Price</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {rows.map((booking: any) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 font-bold">Property Name</td>
                      <td className="px-6 py-4">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{booking.status}</span></td>
                      <td className="px-6 py-4">K {booking.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
    </DashboardFrame>
  );
};

const Metric: FC<{ icon: any; value: string | number; label: string }> = ({ icon: Icon, value, label }) => (
  <article className="card-surface p-5">
    <Icon className="text-brand-700" />
    <p className="mt-4 text-2xl font-black text-slate-950">{value}</p>
    <p className="text-sm font-semibold text-slate-500">{label}</p>
  </article>
);

export default StudentDashboard;
