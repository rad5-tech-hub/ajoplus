import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, Search, Check } from 'lucide-react';
import { useGetPackageMembers, useFinalizePackage } from '@/app/store/PackageStore';
import type { PackageMember } from '@/api/adminPackages';

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-brand-100 text-brand-700',
  finalized: 'bg-slate-100 text-slate-700',
  suspended: 'bg-red-100 text-red-700',
  inactive: 'bg-slate-100 text-slate-700',
};

const MemberRow = ({ member }: { member: PackageMember }) => {
  const [open, setOpen] = useState(false);
  const { mutate: finalizePkg, isPending: isFinalizing } = useFinalizePackage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (code: string) => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const initials = (member.user.fullName || '?').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="bg-white border border-brand-200 rounded-xl shadow-sm">
      <div onClick={() => setOpen(!open)} className="flex items-center gap-3 px-4 py-3 cursor-pointer">
        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold shrink-0">
          {initials || '?'}
        </div>
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <p className="font-semibold text-slate-800 text-sm truncate">{member.user.fullName}</p>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium w-fit ${statusStyles[member.status] || 'bg-slate-100 text-slate-700'}`}>
            {member.status}
          </span>
        </div>
        <p className="font-medium text-brand-600 text-sm shrink-0 hidden sm:block">₦{member.installmentAmount.toLocaleString()}</p>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </div>

      <div className={`transition-all duration-200 overflow-hidden ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-4 pb-4 pt-1 border-t border-brand-100 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-500">Total Paid</p>
              <p className="font-medium text-slate-800">₦{member.totalPaid.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Remaining</p>
              <p className="font-medium text-slate-800">₦{member.remainingAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Installment</p>
              <p className="font-medium text-slate-800">₦{member.installmentAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Started</p>
              <p className="font-medium text-slate-800">{new Date(member.startedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Next Payment</p>
              <p className="font-medium text-slate-800">{new Date(member.nextPaymentDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Progress</span>
              <span className="font-medium text-brand-600">{member.progressPercent.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-brand-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${Math.min(member.progressPercent, 100)}%` }} />
            </div>
          </div>

          {/* Claim code */}
          {member.status === 'completed' && member.claimCode && (
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">Claim Code</p>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-white border border-brand-200 rounded-lg px-3 py-1 text-brand-800 text-sm select-all flex-1 min-w-0 truncate">{member.claimCode}</span>
                <button onClick={() => handleCopy(member.claimCode!)}
                  className="p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors cursor-pointer shrink-0" title="Copy">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <span className="text-xs">Copy</span>}
                </button>
              </div>
              {member.claimIssuedAt && (
                <p className="text-xs text-slate-400 mt-1">Issued: {new Date(member.claimIssuedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              )}
            </div>
          )}

          {/* Finalize button */}
          {member.status === 'completed' && !member.claimCode && (
            <button onClick={() => finalizePkg(member.id)} disabled={isFinalizing}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl transition-all cursor-pointer">
              {isFinalizing ? 'Finalizing...' : 'Mark as Finalised'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PackageMemberList = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, error, refetch } = useGetPackageMembers(packageId ?? '');

  const members = useMemo(() => {
    if (!data?.members) return [];
    const q = search.toLowerCase();
    return q ? data.members.filter((m) => m.user.fullName.toLowerCase().includes(q)) : data.members;
  }, [data, search]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-6">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-brand-200" />)}
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

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-900 bg-white border border-brand-200 rounded-2xl px-4 py-2 text-sm transition-colors mb-4 cursor-pointer">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl font-bold text-brand-900">{data?.package.name || 'Package Members'}</h1>
            <p className="text-sm text-slate-500">{data?.members.length || 0} member{(data?.members.length || 0) !== 1 ? 's' : ''}</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search members by name..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-brand-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none w-full sm:w-64" />
          </div>
        </div>

        {members.length === 0 ? (
          <div className="bg-white border border-brand-200 rounded-2xl p-10 text-center text-slate-500 text-sm">
            {search ? 'No members matching your search.' : 'No members found for this package.'}
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((member) => <MemberRow key={member.id} member={member} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageMemberList;
