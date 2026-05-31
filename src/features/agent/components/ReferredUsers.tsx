// src/features/agent/dashboard/components/ReferredUsers.tsx
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Search } from 'lucide-react';
import { getAgentDashboard, type ReferredUser } from '@/api/agent';
import { formatCurrency } from '@/lib/currency';

function getInitials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/* ── Skeleton row ── */
const SkeletonRow = () => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3.5 sm:py-4 border-b border-slate-100 last:border-b-0 animate-pulse">
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-200 rounded-xl sm:rounded-2xl shrink-0" />
      <div className="space-y-2">
        <div className="h-3.5 w-32 bg-slate-200 rounded-full" />
        <div className="h-3 w-24 bg-slate-100 rounded-full" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-6 sm:flex sm:gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-1.5">
          <div className="h-2.5 w-12 bg-slate-100 rounded-full" />
          <div className="h-3.5 w-10 bg-slate-200 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

/* ── Empty state ── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
      <Users className="w-8 h-8 text-brand-400" />
    </div>
    <p className="font-semibold text-slate-800 text-base mb-1">No referrals yet</p>
    <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
      Share your referral code and you'll see everyone you've brought on board here.
    </p>
  </div>
);

/* ── User row ── */
const UserRow = ({ user }: { user: ReferredUser }) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 py-3.5 sm:py-4 border-b border-slate-100 last:border-b-0 last:pb-0">
    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 text-brand-700 text-xs font-bold">
        {getInitials(user.fullName)}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-brand-900 text-sm sm:text-base truncate">{user.fullName}</p>
        <p className="text-xs sm:text-sm text-slate-400 truncate">{user.email}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 sm:flex sm:gap-4 lg:gap-6 bg-slate-50 sm:bg-transparent rounded-xl sm:rounded-none px-3 py-2 sm:p-0 text-xs shrink-0">
      <div className="sm:text-right">
        <p className="text-slate-400 text-[10px]">Packages</p>
        <p className="font-medium text-brand-900 mt-0.5">{user.packages}</p>
      </div>
      <div className="sm:text-right">
        <p className="text-slate-400 text-[10px]">Earnings</p>
        <p className="font-semibold text-brand-600 mt-0.5">{formatCurrency(user.earnings)}</p>
      </div>
      <div className="sm:text-right">
        <p className="text-slate-400 text-[10px]">Pkg Comm.</p>
        <p className="font-medium text-brand-900 mt-0.5">{formatCurrency(user.packageCommissions)}</p>
      </div>
      <div className="sm:text-right">
        <p className="text-slate-400 text-[10px]">Sav. Comm.</p>
        <p className="font-medium text-brand-900 mt-0.5">{formatCurrency(user.savingCommissions)}</p>
      </div>
      <div className="sm:text-right">
        <p className="text-slate-400 text-[10px]">Comm.</p>
        <p className="font-medium text-brand-900 mt-0.5">{user.commissions}</p>
      </div>
      <div className="sm:text-right">
        <p className="text-slate-400 text-[10px]">Pending</p>
        <p className="font-medium text-amber-600 mt-0.5">{formatCurrency(user.pendingEarnings)}</p>
      </div>
      <div className="sm:text-right">
        <p className="text-slate-400 text-[10px]">Joined</p>
        <p className="font-medium text-brand-900 mt-0.5 whitespace-nowrap">{formatDate(user.joinedAt)}</p>
      </div>
    </div>
  </div>
);

/* ── Main component ── */
const ReferredUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['agentDashboard'],
    queryFn: getAgentDashboard,
    staleTime: 5 * 60 * 1000,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const users = useMemo(() => data?.referredUsers ?? [], [data]);
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter((u: ReferredUser) =>
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-5 sm:mb-6 lg:mb-8">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-brand-900">Referred Users</h3>
        {!isLoading && (
          <span className="text-xs sm:text-sm text-slate-400">{users.length} total</span>
        )}
        {isLoading && (
          <div className="h-4 w-12 bg-slate-200 rounded-full animate-pulse" />
        )}
      </div>

      {/* ── Search Bar ── */}
      {!isLoading && users.length > 0 && (
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
          />
        </div>
      )}

      <div className="space-y-0">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
          : users.length === 0
            ? <EmptyState />
            : filteredUsers.length === 0
              ? <div className="py-8 text-center text-slate-400 text-sm font-medium">No referred users match your search.</div>
              : filteredUsers.map((user) => <UserRow key={user.id} user={user} />)
        }
      </div>
    </div>
  );
};

export default ReferredUsers;