import { useState } from 'react';
import { useExpiredUsers } from '@/app/store/RegistrationFeeStore';

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    active: 'bg-brand-100 text-brand-700',
    inactive: 'bg-slate-100 text-slate-700',
    pending: 'bg-brand-100 text-brand-700',
    approved: 'bg-brand-100 text-brand-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return styles[status] || 'bg-slate-100 text-slate-700';
};

const ExpiredRegistrations = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useExpiredUsers(page, 10);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white border border-red-200 rounded-3xl p-8 text-center">
        <p className="text-red-600 font-semibold mb-3">Failed to load expired registrations.</p>
        <button onClick={() => refetch()} className="px-5 py-2 rounded-2xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  const users = data?.users ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <div className="bg-white border border-brand-200 rounded-3xl p-10 text-center text-slate-500 text-sm">
          No users with expired registrations.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-4 px-5 text-sm font-semibold text-slate-500">User</th>
                  <th className="py-4 px-5 text-sm font-semibold text-slate-500">Expiry Date</th>
                  <th className="py-4 px-5 text-sm font-semibold text-slate-500">Days Expired</th>
                  <th className="py-4 px-5 text-sm font-semibold text-slate-500">Account</th>
                  <th className="py-4 px-5 text-sm font-semibold text-slate-500">Fee Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const expiry = new Date(user.registrationExpiryDate);
                  const daysExpired = Math.floor((Date.now() - expiry.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-5 px-5">
                        <p className="font-medium text-brand-900">{user.fullName}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </td>
                      <td className="py-5 px-5 text-sm text-slate-500">
                        {expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-5 px-5">
                        <span className="text-red-600 font-medium text-sm">{daysExpired > 0 ? `${daysExpired} days` : 'Today'}</span>
                      </td>
                      <td className="py-5 px-5">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusBadge(user.accountStatus)}`}>
                          {user.accountStatus}
                        </span>
                      </td>
                      <td className="py-5 px-5">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusBadge(user.registrationFeeStatus)}`}>
                          {user.registrationFeeStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-brand-200 rounded-2xl px-5 py-3">
              <p className="text-sm text-slate-500">
                Page {meta.page} of {meta.totalPages} ({meta.total} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 border border-brand-200 rounded-2xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page >= meta.totalPages}
                  className="px-4 py-2 border border-brand-200 rounded-2xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpiredRegistrations;
