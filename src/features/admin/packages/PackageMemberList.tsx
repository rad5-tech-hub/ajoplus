import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, Search, Check, Copy, Calendar, TrendingUp, Wallet, Building2, UserCircle, ShieldCheck, ExternalLink } from 'lucide-react';
import { useGetPackageMembers, useFinalizePackage } from '@/app/store/PackageStore';
import { formatCurrency } from '@/lib/currency';
import type { PackageMember } from '@/api/adminPackages';

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  completed: 'bg-blue-100 text-blue-700 border-blue-200',
  finalized: 'bg-slate-100 text-slate-600 border-slate-200',
  suspended: 'bg-red-100 text-red-700 border-red-200',
  inactive: 'bg-slate-100 text-slate-500 border-slate-200',
};

const CopyField = ({ value, label }: { value: string; label: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="bg-slate-50 rounded-xl p-3.5 cursor-pointer hover:bg-slate-100 transition-colors" onClick={handleCopy} title={`Copy ${label}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <p className="text-xs text-slate-400">{label}</p>
        {copied
          ? <Check className="w-3 h-3 text-emerald-500 ml-auto shrink-0" />
          : <Copy className="w-3 h-3 text-slate-300 ml-auto shrink-0" />
        }
      </div>
      <p className="font-semibold text-slate-800 text-sm truncate">
        {copied ? 'Copied!' : value}
      </p>
    </div>
  );
};

const Avatar = ({ user }: { user: PackageMember['user'] }) => {
  const initials = (user.fullName || '?').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
  if (user.imageUrl) {
    return (
      <img src={user.imageUrl} alt={user.fullName}
        className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white shadow-sm" />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center text-sm font-semibold shrink-0 ring-2 ring-white shadow-sm">
      {initials || '?'}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  const dotColors: Record<string, string> = {
    active: 'bg-emerald-500',
    completed: 'bg-blue-500',
    finalized: 'bg-slate-400',
    suspended: 'bg-red-500',
    inactive: 'bg-slate-300',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[s] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[s] || 'bg-slate-400'}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const MemberRow = ({ member }: { member: PackageMember }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { mutate: finalizePkg, isPending: isFinalizing } = useFinalizePackage();
  const isCompleted = member.status.toLowerCase() === 'completed';
  const isFinalized = member.status.toLowerCase() === 'finalized';
  const hasClaim = !!member.claimCode;

  const handleCopy = async (code: string) => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); } finally { setCopied(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Main row */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-4">
          <Avatar user={member.user} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <p className="font-semibold text-slate-800 text-sm truncate">{member.user.fullName}</p>
              <StatusBadge status={member.status} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{member.user.email}</p>
          </div>
          <p className="font-bold text-brand-600 text-sm shrink-0 hidden sm:block">{formatCurrency(member.installmentAmount)}</p>
          <button onClick={() => setOpen(!open)} className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
        </div>

        {/* Progress bar — always visible */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isCompleted || isFinalized ? 'bg-brand-500' : 'bg-brand-600'}`}
              style={{ width: `${Math.min(member.progressPercent, 100)}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">{member.progressLabel || `${member.progressPercent.toFixed(0)}%`}</span>
        </div>

        {/* Quick stats row — always visible */}
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-slate-400" />
            Paid: <span className="font-medium text-slate-700">{formatCurrency(member.totalPaid)}</span>
          </span>
          {member.remainingAmount > 0 && (
            <span className="flex items-center gap-1">
              Left: <span className="font-medium text-red-500">{formatCurrency(member.remainingAmount)}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {new Date(member.startedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        </div>

        {/* Finalize button */}
        {isCompleted && !isFinalizing && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <button onClick={() => finalizePkg(member.id)} disabled={isFinalizing}
              className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-all cursor-pointer shadow-sm">
              {isFinalizing ? 'Finalizing...' : 'Mark as Finalised'}
            </button>
          </div>
        )}

        {/* Claim code */}
        {(isFinalized || hasClaim) && member.claimCode && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500">Claim Code</p>
                <p className="font-mono font-bold text-brand-800 text-sm tracking-wider truncate">{member.claimCode}</p>
                {member.claimIssuedAt && (
                  <p className="text-xs text-slate-400 mt-0.5">Issued {new Date(member.claimIssuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                )}
              </div>
              <button onClick={() => handleCopy(member.claimCode!)}
                className="p-2 bg-white border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors cursor-pointer shrink-0" title="Copy">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-brand-600" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expandable details */}
      <div className={`transition-all duration-200 overflow-hidden ${open ? 'max-h-[600px]' : 'max-h-0'}`}>
        <div className="px-5 pb-6 border-t border-slate-100 pt-3 space-y-4">

          {/* Payment progress */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" /> Payment Progress
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <CopyField value={formatCurrency(member.totalPaid)} label="Total Paid" />
              <CopyField value={formatCurrency(member.remainingAmount)} label="Remaining" />
              <CopyField value={formatCurrency(member.installmentAmount)} label="Installment" />
              <CopyField value={new Date(member.startedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} label="Started" />
              <CopyField value={new Date(member.nextPaymentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} label="Next Payment" />
              <CopyField value={member.user.bankName ? `${member.user.bankName} • ${member.user.accountNumber || ''}` : '—'} label={member.user.bankName ? 'Bank' : 'Bank Info'} />
            </div>
          </div>

          {/* User contact & IDs */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <UserCircle className="w-3.5 h-3.5" /> Contact & IDs
            </p>
            <div className="grid grid-cols-2 gap-2">
              <CopyField value={member.user.email} label="Email" />
              <CopyField value={member.user.phoneNumber || '—'} label="Phone" />
              <CopyField value={member.id} label="Membership ID" />
              <CopyField value={member.user.id} label="User ID" />
            </div>
          </div>

          {/* Banking details */}
          {(member.user.bankName || member.user.accountNumber || member.user.accountName) && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Banking Details
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {member.user.bankName && <CopyField value={member.user.bankName} label="Bank" />}
                {member.user.accountNumber && <CopyField value={member.user.accountNumber} label="Account Number" />}
                {member.user.accountName && <CopyField value={member.user.accountName} label="Account Name" />}
              </div>
            </div>
          )}

          {/* Account status */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Account Status
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <CopyField value={member.user.role || '—'} label="Role" />
              <CopyField value={member.user.accountStatus || '—'} label="Account" />
              <CopyField value={member.user.registrationFeeStatus ? member.user.registrationFeeStatus.replace(/_/g, ' ') : '—'} label="Reg. Fee" />
              <CopyField value={new Date(member.user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} label="Created" />
              {member.user.address && <CopyField value={member.user.address} label="Address" />}
            </div>
          </div>

          {/* Claim code */}
          {member.claimCode && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> Claim Info
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <CopyField value={member.claimCode} label="Claim Code" />
                {member.claimIssuedAt && (
                  <CopyField value={new Date(member.claimIssuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} label="Claim Issued" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FILTERS = ['all', 'active', 'completed', 'finalized'] as const;
type FilterValue = (typeof FILTERS)[number];

const PackageMemberList = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterValue>('all');

  const { data, isLoading, isError, error, refetch } = useGetPackageMembers(packageId ?? '');

  const members = useMemo(() => {
    if (!data?.members) return [];
    const q = search.toLowerCase();
    const searched = q ? data.members.filter((m) => m.user.fullName.toLowerCase().includes(q)) : data.members;
    if (filter === 'all') return searched;
    return searched.filter((m) => m.status.toLowerCase() === filter);
  }, [data, search, filter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-6">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-3">Failed to load members.</p>
          <p className="text-slate-500 text-sm mb-4">{error instanceof Error ? error.message : 'Please try again.'}</p>
          <button onClick={() => refetch()} className="px-5 py-2 rounded-2xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors cursor-pointer">Retry</button>
        </div>
      </div>
    );
  }

  const pkg = data?.package;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-6">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-700 bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm transition-all mb-5 cursor-pointer shadow-sm hover:shadow">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {/* Package summary card */}
        {pkg && (
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-6 sm:p-8 mb-6 text-white shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{pkg.name}</h1>
                <p className="text-brand-100 text-sm mt-1">Package Members</p>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(parseFloat(pkg.totalPrice))}</p>
                <p className="text-brand-100 text-xs mt-0.5">Total Price</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-brand-100 text-xs">Members</p>
                <p className="text-xl font-bold mt-1">{data?.members.length || 0}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-brand-100 text-xs">Total Paid</p>
                <p className="text-xl font-bold mt-1">{formatCurrency(pkg.totalAmountPaidByAllMembers)}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm col-span-2 sm:col-span-1">
                <p className="text-brand-100 text-xs">Progress</p>
                <div className="flex items-center gap-2 mt-1">
                  <TrendingUp className="w-4 h-4 text-brand-200" />
                  <p className="text-xl font-bold">{pkg.packageProgressLabel}</p>
                </div>
              </div>
            </div>
            {pkg.packageProgressPercent > 0 && (
              <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${Math.min(pkg.packageProgressPercent, 100)}%` }} />
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const count = f === 'all' ? data?.members.length : data?.members.filter((m) => m.status.toLowerCase() === f).length ?? 0;
              const isActive = filter === f;
              return (
                <button key={f} onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all cursor-pointer border ${isActive
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <span className={`ml-1.5 ${isActive ? 'text-brand-200' : 'text-slate-400'}`}>({count})</span>
                </button>
              );
            })}
          </div>
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none w-full sm:w-56 bg-white" />
          </div>
        </div>

        {/* Members list */}
        {members.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">{search ? 'No members matching your search.' : 'No members found for this package.'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => <MemberRow key={member.id} member={member} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageMemberList;
