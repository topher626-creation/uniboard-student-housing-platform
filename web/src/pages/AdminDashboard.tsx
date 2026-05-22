import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { FC, ReactNode } from 'react';
import { Ban, CheckCircle2, Eye, ShieldAlert, ShieldCheck, Trash2, XCircle } from 'lucide-react';
import { adminService, propertyService } from '../services/index.js';
import DashboardFrame from '../components/DashboardFrame.tsx';

const AdminDashboard: FC = () => {
  const queryClient = useQueryClient();
  const { data: pendingProviders, isLoading: providersLoading } = useQuery({
    queryKey: ['admin', 'pending-providers'],
    queryFn: () => adminService.getPendingProviders(),
  });
  const { data: pendingProperties } = useQuery({
    queryKey: ['admin', 'pending-properties'],
    queryFn: () => adminService.getPendingProperties(),
  });
  const { data: reports } = useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: () => adminService.getReports(),
    retry: false,
  });

  const approveProvider = useMutation({
    mutationFn: (id: string) => adminService.approveProvider(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin'] }),
  });
  const rejectProvider = useMutation({
    mutationFn: (id: string) => adminService.disableProvider(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin'] }),
  });
  const deleteListing = useMutation({
    mutationFn: (id: string) => propertyService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin'] }),
  });

  const providers = pendingProviders?.data ?? [];
  const properties = pendingProperties?.data ?? [];
  const reportItems = reports?.data ?? [];

  return (
    <DashboardFrame
      kicker="Admin Trust Operations"
      title="Admin Dashboard"
      subtitle="Pending landlord approvals come first. Listings auto-publish after landlord approval, while admins moderate reports and fake listings."
    >
        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <Metric icon={ShieldCheck} label="Pending landlords" value={providers.length} tone="brand" />
          <Metric icon={Eye} label="Listings to review" value={properties.length} tone="amber" />
          <Metric icon={ShieldAlert} label="Open reports" value={reportItems.length} tone="red" />
          <Metric icon={Ban} label="Moderation tools" value="Ready" tone="green" />
        </section>

        <section id="approvals" className="card-surface overflow-hidden">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-2xl font-black text-slate-950">Pending landlords queue</h2>
            <p className="mt-2 text-sm text-slate-600">Review NRC verification details before approval.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3">Business / Compound</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">NRC documents</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {providersLoading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading pending landlords...</td></tr>
                ) : providers.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No pending landlords</td></tr>
                ) : providers.map((provider: any) => (
                  <tr key={provider.id}>
                    <td className="px-6 py-4 font-bold text-slate-950">{provider.businessName}</td>
                    <td className="px-6 py-4 text-slate-600">{provider.businessEmail}<br />{provider.businessPhone}</td>
                    <td className="px-6 py-4">
                      <DocumentPreview documents={provider.verificationDocuments} />
                    </td>
                    <td className="px-6 py-4"><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">pending</span></td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button className="rounded-full bg-green-600 px-3 py-2 text-xs font-bold text-white" onClick={() => approveProvider.mutate(provider.id)}>
                          <CheckCircle2 size={14} className="inline" /> Approve
                        </button>
                        <button className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-700" onClick={() => rejectProvider.mutate(provider.id)}>
                          <XCircle size={14} className="inline" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="listings" className="mt-8 grid gap-6 lg:grid-cols-2">
          <ModerationPanel
            title="Reported or fake listings"
            empty="No pending listing moderation items"
            items={properties}
            renderItem={(property: any) => (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-950">{property.title}</p>
                  <p className="text-sm text-slate-500">{property.location}</p>
                </div>
                <button className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-700" onClick={() => deleteListing.mutate(property.id)}>
                  <Trash2 size={14} className="inline" /> Delete fake listing
                </button>
              </div>
            )}
          />
          <ModerationPanel
            title="Reports queue"
            empty="No reports submitted"
            items={reportItems}
            renderItem={(report: any) => (
              <div>
                <p className="font-bold text-slate-950">{report.type}</p>
                <p className="mt-1 text-sm text-slate-600">{report.message}</p>
              </div>
            )}
          />
        </section>
    </DashboardFrame>
  );
};

const Metric: FC<{ icon: any; label: string; value: number | string; tone: 'brand' | 'amber' | 'red' | 'green' }> = ({ icon: Icon, label, value, tone }) => {
  const tones = {
    brand: 'bg-brand-50 text-brand-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    green: 'bg-green-50 text-green-700',
  };

  return (
    <article className="card-surface p-5">
      <span className={`grid h-11 w-11 place-items-center rounded-2xl ${tones[tone]}`}><Icon size={22} /></span>
      <p className="mt-5 text-3xl font-black text-slate-950">{value}</p>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
    </article>
  );
};

const DocumentPreview: FC<{ documents: any }> = ({ documents }) => {
  const parsed = typeof documents === 'string' ? safeParse(documents) : documents;
  const files = [parsed?.nrcFront, parsed?.nrcBack].filter(Boolean);
  if (files.length === 0) return <span className="text-sm text-slate-500">No files attached</span>;
  return (
    <div className="space-y-1 text-xs text-slate-600">
      {files.map((file: any) => <p key={file.name}>{file.name} ({Math.round((file.size || 0) / 1024)} KB)</p>)}
    </div>
  );
};

const safeParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const ModerationPanel: FC<{ title: string; empty: string; items: any[]; renderItem: (item: any) => ReactNode }> = ({ title, empty, items, renderItem }) => (
  <section className="card-surface p-6">
    <h2 className="text-xl font-black text-slate-950">{title}</h2>
    <div className="mt-5 space-y-3">
      {items.length === 0 ? <p className="text-sm text-slate-500">{empty}</p> : items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">{renderItem(item)}</div>
      ))}
    </div>
  </section>
);

export default AdminDashboard;
