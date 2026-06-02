import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Search, X, ChevronRight } from 'lucide-react';
import { getAgentDashboard, fetchAgentDownline, type ReferredUser, type AgentDownlineCustomer } from '@/api/agent';
import { formatCurrency } from '@/lib/currency';

function getInitials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  inactive: 'bg-slate-100 text-slate-500',
  suspended: 'bg-red-100 text-red-600',
};

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
const UserRow = ({ user, onClick }: { user: ReferredUser; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 py-3.5 sm:py-4 border-b border-slate-100 last:border-b-0 last:pb-0 hover:bg-slate-50 transition-colors cursor-pointer group"
  >
    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 text-brand-700 text-xs font-bold">
        {getInitials(user.fullName)}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-brand-900 text-sm sm:text-base truncate">{user.fullName}</p>
        <p className="text-xs sm:text-sm text-slate-400 truncate">{user.email}</p>
      </div>
    </div>

    <div className="flex items-center gap-2 w-full sm:w-auto">
      <div className="grid grid-cols-2 sm:flex sm:gap-4 lg:gap-6 bg-slate-50 sm:bg-transparent rounded-xl sm:rounded-none px-3 py-2 sm:p-0 text-xs shrink-0 flex-1">
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
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors shrink-0" />
    </div>
  </button>
);

/* ── Downline Modal ── */
const DownlineModal = ({
  user,
  onClose,
}: {
  user: ReferredUser;
  onClose: () => void;
}) => {
  const referralCode = useQuery({
    queryKey: ['agentDashboard'],
    queryFn: getAgentDashboard,
    staleTime: 5 * 60 * 1000,
    select: (d) => d.referral.code,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['agentDownline', referralCode.data],
    queryFn: () => fetchAgentDownline(referralCode.data!),
    enabled: !!referralCode.data,
    staleTime: 60_000,
  });

  const customers = data?.customers ?? [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-semibold text-brand-900">Downline: {user.fullName}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{customers.length} customer{customers.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-28" />
            ))
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-slate-500 font-medium">No downline customers yet</p>
            </div>
          ) : (
            customers.map((c: AgentDownlineCustomer) => (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm shrink-0">
                      {getInitials(c.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{c.fullName}</p>
                      <p className="text-xs text-slate-400 truncate">{c.email}</p>
                      {c.phoneNumber && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">{c.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize shrink-0 ${statusStyles[c.accountStatus] || 'bg-slate-100 text-slate-500'}`}>
                    {c.accountStatus}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                  <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-600">Bank:</span>{' '}
                    {c.bankName && c.accountNumber
                      ? `${c.bankName} — ${c.accountNumber}`
                      : <span className="italic text-slate-400">&mdash;</span>}
                  </p>
                  <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-600">Joined:</span>{' '}
                    {formatDate(c.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Main component ── */
const ReferredUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['agentDashboard'],
    queryFn: getAgentDashboard,
    staleTime: 5 * 60 * 1000,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<ReferredUser | null>(null);

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
              : filteredUsers.map((user) => <UserRow key={user.id} user={user} onClick={() => setSelectedUser(user)} />)
        }
      </div>

      {/* ── Downline Modal ── */}
      {selectedUser && (
        <DownlineModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default ReferredUsers;