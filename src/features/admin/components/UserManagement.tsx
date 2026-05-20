import { useState, useMemo } from 'react';
import {
  Users, X, ChevronRight, Mail, Phone, MapPin, Banknote,
  Building2, CreditCard, UserCircle, Hash, Clock,
  ShieldCheck, AlertTriangle, UserCheck, Gift, ExternalLink,
  Filter, Copy, Check,
} from 'lucide-react';
import { useAdminUsers } from '@/app/store/AdminStore';
import type { AdminUser } from '@/api/adminUsers';

type RoleFilter = 'all' | 'customer' | 'agent';
type StatusFilter = 'all' | 'active' | 'expired';

const statusStyle = (status: string) => {
  const styles: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    inactive: 'bg-slate-100 text-slate-600 ring-slate-500/20',
    pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    suspended: 'bg-red-50 text-red-700 ring-red-600/20',
    approved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    rejected: 'bg-red-50 text-red-700 ring-red-600/20',
  };
  return styles[status] || 'bg-slate-50 text-slate-600 ring-slate-400/20';
};

const statusDot = (status: string) => {
  const dots: Record<string, string> = {
    active: 'bg-emerald-500',
    inactive: 'bg-slate-400',
    pending: 'bg-amber-500',
    suspended: 'bg-red-500',
    approved: 'bg-emerald-500',
    rejected: 'bg-red-500',
  };
  return dots[status] || 'bg-slate-400';
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getEffectiveExpiry(user: { registrationExpiryDate: string | null; createdAt: string }): Date {
  if (user.registrationExpiryDate) return new Date(user.registrationExpiryDate);
  const created = new Date(user.createdAt);
  return new Date(created.getFullYear() + 1, created.getMonth(), created.getDate());
}

function UserDetailModal({
  user,
  onClose,
}: {
  user: AdminUser;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-white/20"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 border-b border-slate-100 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm">
              <UserCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-brand-900 text-lg leading-tight">User Profile</h3>
              <p className="text-xs text-slate-400">Detailed account information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="px-6 sm:px-8 py-6 sm:py-8 space-y-8">

          {/* ── Hero section ── */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-md ring-2 ring-brand-100 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shrink-0">
                <span className="text-2xl sm:text-3xl font-bold text-white">{getInitials(user.fullName)}</span>
              </div>
            )}
            <div className="text-center sm:text-left min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-brand-900">{user.fullName}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${statusStyle(user.role === 'agent' ? 'pending' : 'active')}`}>
                  {user.role === 'agent' ? <UserCheck className="w-3 h-3" /> : <UserCircle className="w-3 h-3" />}
                  {user.role}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${statusStyle(user.accountStatus)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot(user.accountStatus)}`} />
                  {user.accountStatus}
                </span>
              </div>
            </div>
          </div>

          {/* ── Info grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard icon={Mail} label="Email" value={user.email} />
            <InfoCard icon={Phone} label="Phone" value={user.phoneNumber || '—'} />
            <InfoCard icon={MapPin} label="Address" value={user.address || '—'} />
            <InfoCard icon={Hash} label="User ID" value={user.id.slice(0, 8) + '...'} copyable={user.id} />
          </div>

          {/* ── Banking section ── */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Banknote className="w-3.5 h-3.5" /> Banking Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <MiniCard icon={Building2} label="Bank" value={user.bankName || '—'} copyable={user.bankName || undefined} />
              <MiniCard icon={CreditCard} label="Account Number" value={user.accountNumber || '—'} copyable={user.accountNumber || undefined} />
              <MiniCard icon={UserCircle} label="Account Name" value={user.accountName || '—'} copyable={user.accountName || undefined} />
            </div>
          </div>

          {/* ── Referral section ── */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Gift className="w-3.5 h-3.5" /> Referral Info
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MiniCard icon={Hash} label="Referral Code" value={user.referralCode || '—'} copyable={user.referralCode || undefined} />
              <MiniCard icon={ExternalLink} label="Referred By Agent" value={user.referredByAgentCode || '—'} copyable={user.referredByAgentCode || undefined} />
            </div>
          </div>

          {/* ── Status & Dates ── */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Account Status
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MiniCard icon={ShieldCheck} label="Reg. Fee" value={user.registrationFeeStatus.replace(/_/g, ' ')} />
              <MiniCard icon={Clock} label="Created" value={formatDate(user.createdAt)} />
              <MiniCard icon={Clock} label="Updated" value={formatDate(user.updatedAt)} />
              <MiniCard
                icon={AlertTriangle}
                label="Expiry"
                value={formatDate(getEffectiveExpiry(user).toISOString())}
                highlight={getEffectiveExpiry(user) < new Date()}
              />
            </div>
          </div>

          {/* ── Phone & Email copy cards (inline duplicating InfoCard with copy) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniCard icon={Phone} label="Phone" value={user.phoneNumber || '—'} copyable={user.phoneNumber || undefined} />
            <MiniCard icon={Mail} label="Email" value={user.email} copyable={user.email} />
          </div>

        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  copyable,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  copyable?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
        <Icon className="w-4 h-4 text-brand-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        <p
          className={`text-sm font-semibold text-slate-800 mt-0.5 truncate ${copyable ? 'cursor-pointer hover:text-brand-600' : ''}`}
          onClick={() => {
            if (copyable) {
              navigator.clipboard.writeText(copyable);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }
          }}
          title={copyable}
        >
          {copyable && copied ? 'Copied!' : value}
        </p>
      </div>
    </div>
  );
}

function MiniCard({
  icon: Icon,
  label,
  value,
  highlight,
  copyable,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
  copyable?: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!copyable) return;
    navigator.clipboard.writeText(copyable);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div
      className={`p-3 sm:p-4 rounded-2xl border transition-colors ${
        highlight
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-slate-100 hover:border-slate-200'
      } ${copyable ? 'cursor-pointer' : ''}`}
      onClick={handleCopy}
      title={copyable ? 'Click to copy' : undefined}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={`w-3.5 h-3.5 ${highlight ? 'text-red-500' : 'text-slate-400'}`} />
        <p className={`text-[11px] font-medium uppercase tracking-wider ${highlight ? 'text-red-600' : 'text-slate-400'}`}>
          {label}
        </p>
        {copyable && (
          copied
            ? <Check className="w-3 h-3 text-emerald-500 ml-auto shrink-0" />
            : <Copy className="w-3 h-3 text-slate-300 ml-auto shrink-0" />
        )}
      </div>
      <p className={`text-sm font-semibold truncate ${highlight ? 'text-red-700' : 'text-slate-800'}`}>
        {copied && copyable ? 'Copied!' : value}
      </p>
    </div>
  );
}

const UserManagement = () => {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const { data, isLoading, isError, refetch } = useAdminUsers(page, 10);
  const meta = data?.meta;

  const filteredUsers = useMemo(() => {
    const users = data?.users ?? [];
    return users.filter((user) => {
      if (roleFilter !== 'all' && user.role !== roleFilter) return false;

      if (statusFilter === 'active' && user.accountStatus !== 'active') return false;
      if (statusFilter === 'expired') {
        const expiryDate = getEffectiveExpiry(user);
        if (expiryDate >= new Date()) return false;
      }

      return true;
    });
  }, [data?.users, roleFilter, statusFilter]);

  const handleRoleFilterChange = (filter: RoleFilter) => {
    setRoleFilter(filter);
    setPage(1);
  };

  const handleStatusFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setPage(1);
  };

  const skeleton = (key: number) => (
    <div key={key} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-28 bg-gradient-to-r from-slate-100 to-slate-50" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 bg-slate-200 rounded-full" />
            <div className="h-3 w-24 bg-slate-100 rounded-full" />
          </div>
        </div>
        <div className="h-3 w-40 bg-slate-100 rounded-full" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-slate-200 rounded-full" />
          <div className="h-6 w-16 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900">User Management</h2>
            <p className="text-sm text-slate-400 mt-1">Loading users...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6].map(skeleton)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900">User Management</h2>
        </div>
        <div className="bg-white rounded-3xl border border-red-200 p-12 sm:p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 font-semibold text-lg mb-1">Failed to load users</p>
          <p className="text-slate-500 text-sm mb-6">Something went wrong. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2.5 rounded-2xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">User Management</h2>
          <p className="text-sm text-slate-400 mt-1">
            {meta ? `${meta.total} total user${meta.total !== 1 ? 's' : ''}` : ''}
          </p>
        </div>
      </div>

      {/* ── Filters bar ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Filters</span>
        </div>

        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Role</span>
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilterChange(e.target.value as RoleFilter)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All</option>
              <option value="customer">Customers</option>
              <option value="agent">Agents</option>
            </select>
          </div>

          <div className="w-px h-6 bg-slate-200 hidden sm:block" />

          <div className="flex gap-1.5 flex-wrap">
            {([
              { value: 'all' as StatusFilter, label: 'All' },
              { value: 'active' as StatusFilter, label: 'Active' },
              { value: 'expired' as StatusFilter, label: 'Expired' },
            ]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleStatusFilterChange(value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === value
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium shrink-0">
          {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── Cards / Empty ── */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center mb-5 shadow-sm">
            <Users className="w-10 h-10 text-brand-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No users found</h3>
          <p className="text-slate-500 text-sm max-w-xs">
            No users match your current filter criteria. Try adjusting the filters above.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredUsers.map((user) => {
              const initials = getInitials(user.fullName);
              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/5 hover:-translate-y-0.5 hover:border-brand-200"
                >
                  {/* Top accent bar */}
                  <div className="h-2 bg-gradient-to-r from-brand-500 to-brand-600" />

                  <div className="p-5 space-y-4">
                    {/* Avatar + Name row */}
                    <div className="flex items-center gap-3.5">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.fullName}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center ring-1 ring-brand-200 shrink-0 shadow-sm">
                          <span className="text-sm font-bold text-white">{initials}</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-brand-700 transition-colors">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>

                    {/* Badges row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ${
                        user.role === 'agent'
                          ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                          : 'bg-brand-50 text-brand-700 ring-brand-600/20'
                      }`}>
                        {user.role === 'agent' ? (
                          <UserCheck className="w-3 h-3" />
                        ) : (
                          <UserCircle className="w-3 h-3" />
                        )}
                        {user.role}
                      </span>

                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ${statusStyle(user.accountStatus)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot(user.accountStatus)}`} />
                        {user.accountStatus}
                      </span>

                      {user.userStatus && user.userStatus !== user.accountStatus && (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ${statusStyle(user.userStatus)}`}>
                          {user.userStatus}
                        </span>
                      )}
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 border-t border-slate-50">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {user.phoneNumber || '—'}
                      </span>
                      <span className="flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3" />
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Pagination ── */}
          {meta && meta.totalPages > 1 && (
            <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Page <span className="font-semibold text-slate-700">{meta.page}</span> of{' '}
                <span className="font-semibold text-slate-700">{meta.totalPages}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page >= meta.totalPages}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Detail Modal ── */}
      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default UserManagement;
