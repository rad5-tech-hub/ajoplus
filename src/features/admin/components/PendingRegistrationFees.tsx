import { useState, useMemo } from 'react';
import { Check, X, Eye, AlertCircle, SearchX, Inbox } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { useAdminPendingFees, useApprovedRejectedFees, useApproveAdminFee, useRejectAdminFee } from '@/app/store/RegistrationFeeStore';
import RejectRegistrationModal from './RejectRegistrationModal';
import ReceiptPreviewModal from '@/components/ui/ReceiptPreviewModal';
import DateRangeFilter, { type DateRange } from '@/components/ui/DateRangeFilter';
import type { AdminPendingFee, RegistrationFeeRecord } from '@/api/registrationFee';

function getInitials(name: string) {
  return name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

const roleStyles: Record<string, string> = {
  customer: 'bg-blue-100 text-blue-700',
  agent: 'bg-purple-100 text-purple-700',
};

const statusStyles: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
  pending: 'bg-amber-100 text-amber-700',
};

type HistoryFilter = 'all' | 'approved' | 'rejected';

const PendingRegistrationFees = () => {
  const { data: pendingData, isLoading: pendingLoading, isError: pendingError, refetch: refetchPending } = useAdminPendingFees();
  const [historyPage, setHistoryPage] = useState(1);
  const { data: historyData, isLoading: historyLoading, isError: historyError, refetch: refetchHistory } = useApprovedRejectedFees(historyPage);
  const approveMutation = useApproveAdminFee();
  const rejectMutation = useRejectAdminFee();

  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState('');

  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all');
  const [historyDateRange, setHistoryDateRange] = useState<DateRange>({ from: null, to: null });

  const pendingFees = pendingData?.fees ?? [];
  const pagination = historyData?.pagination;
  const filteredHistoryFees = useMemo(() => {
    let items = historyData?.fees ?? [];
    if (historyFilter !== 'all') items = items.filter((f) => f.status === historyFilter);
    if (historyDateRange.from) items = items.filter((f) => new Date(f.createdAt) >= historyDateRange.from!);
    if (historyDateRange.to) items = items.filter((f) => new Date(f.createdAt) <= historyDateRange.to!);
    return items;
  }, [historyData?.fees, historyFilter, historyDateRange]);

  const handleApprove = (feeId: string) => {
    approveMutation.mutate(feeId, {
      onSuccess: () => { setSuccessMsg('Registration fee approved'); setTimeout(() => setSuccessMsg(null), 2500); },
      onError: (err: Error) => { setSuccessMsg(null); setRejectError(err.message); setTimeout(() => setRejectError(null), 3000); },
    });
  };

  const handleReject = (reason: string) => {
    if (!rejectTarget) return;
    setRejectError(null);
    rejectMutation.mutate(
      { feeId: rejectTarget, reason },
      {
        onSuccess: () => { setRejectTarget(null); setSuccessMsg('Registration fee rejected'); setTimeout(() => setSuccessMsg(null), 2500); },
        onError: (err: Error) => { setRejectError(err.message); },
      }
    );
  };

  const renderPendingCard = (fee: AdminPendingFee) => {
    const name = fee.user?.fullName ?? 'Unknown User';
    const email = fee.user?.email ?? '';
    const phone = fee.user?.phoneNumber ?? '';
    const role = fee.user?.role ?? 'customer';
    return (
      <div key={fee.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md hover:border-amber-200 transition-all duration-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
              {getInitials(name)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-blue-950 text-sm truncate">{name}</p>
              <p className="text-xs text-slate-500 truncate">{email}</p>
              {phone && <p className="text-xs text-slate-500 truncate">{phone}</p>}
              <p className="text-xs text-slate-400 mt-0.5">
                {formatCurrency(Number(fee.amount))} • {formatDate(fee.createdAt)}
              </p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize shrink-0 ${roleStyles[role] || 'bg-slate-100 text-slate-500'}`}>
            {role}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button onClick={() => { setReceiptUrl(fee.proofFile); setShowReceipt(true); }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer">
            <Eye className="w-3.5 h-3.5" /> View Proof
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => handleApprove(fee.id)} disabled={approveMutation.isPending}
              className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-sm active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              <Check className="w-3.5 h-3.5" /> Approve
            </button>
            <button onClick={() => { setRejectTarget(fee.id); setRejectError(null); }}
              className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-sm active:scale-[0.97] cursor-pointer">
              <X className="w-3.5 h-3.5" /> Reject
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderHistoryCard = (fee: RegistrationFeeRecord) => {
    const name = fee.user?.fullName ?? 'Unknown User';
    const email = fee.user?.email ?? '';
    const phone = fee.user?.phoneNumber ?? '';
    const role = fee.user?.role ?? 'customer';
    return (
      <div key={fee.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-amber-200/50 transition-all duration-300">
        <div className={`h-1 w-full ${fee.status === 'approved' ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-red-400 via-red-500 to-red-400'}`} />
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md shadow-brand-500/20">
                {getInitials(name)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-blue-950 text-[15px] truncate">{name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-xs text-slate-500 truncate">{email}</p>
                  {phone && <><span className="text-slate-200">•</span><p className="text-xs text-slate-500 truncate">{phone}</p></>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${statusStyles[fee.status] || 'bg-slate-100 text-slate-500'}`}>
                {fee.status}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${roleStyles[role] || 'bg-slate-100 text-slate-500'}`}>
                {role}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Amount</p>
              <p className="text-base font-bold text-slate-800 mt-1">{formatCurrency(Number(fee.amount))}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Date</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">{formatDate(fee.createdAt)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Payment</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">{formatDate(fee.paymentDate)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Receipt</p>
              <a href={fee.proofFile} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 mt-1 bg-white border border-amber-200 hover:bg-amber-50 px-3 py-1.5 rounded-xl transition-all duration-200">
                <Eye className="w-3.5 h-3.5" /> View
              </a>
            </div>
          </div>

          {fee.status === 'rejected' && fee.rejectionReason && (
            <div className="mt-4 flex items-start gap-2.5 bg-red-50/80 rounded-xl px-4 py-3 border border-red-100">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-red-600 uppercase tracking-wider">Rejection Reason</p>
                <p className="text-sm text-red-700 mt-0.5">{fee.rejectionReason}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {successMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-2xl px-5 py-3 font-medium">{successMsg}</div>}
      {rejectError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-3">{rejectError}</div>}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button onClick={() => setActiveTab('pending')}
          className={`pb-2 text-sm font-medium transition-colors border-b-2 cursor-pointer ${activeTab === 'pending' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Pending {pendingFees.length > 0 && <span className="ml-1.5 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">{pendingFees.length}</span>}
        </button>
        <button onClick={() => setActiveTab('history')}
          className={`pb-2 text-sm font-medium transition-colors border-b-2 cursor-pointer ${activeTab === 'history' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          History {pagination ? <span className="ml-1.5 text-xs text-slate-400">({pagination.totalRecords})</span> : ''}
        </button>
      </div>

      {activeTab === 'pending' ? (
        pendingLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
        ) : pendingError ? (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-amber-700 font-medium mb-3">Failed to load pending fees.</p>
            <button onClick={() => refetchPending()} className="px-5 py-2 rounded-2xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors cursor-pointer">Retry</button>
          </div>
        ) : pendingFees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Inbox className="w-12 h-12 text-amber-300 mb-3" />
            <p className="text-slate-500 font-medium text-sm">No pending registration fee submissions.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-500">{pendingFees.length} pending fee{pendingFees.length !== 1 ? 's' : ''}</p>
            {pendingFees.map((fee) => renderPendingCard(fee))}
          </div>
        )
      ) : (
        <>
          {/* History filters */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
            <DateRangeFilter onChange={setHistoryDateRange} resultCount={filteredHistoryFees.length} />
            <div className="flex gap-1.5">
              {(['all', 'approved', 'rejected'] as HistoryFilter[]).map((f) => (
                <button key={f} onClick={() => setHistoryFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                    historyFilter === f
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-amber-50'
                  }`}>
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {historyLoading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl w-full" />)}</div>
          ) : historyError ? (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-amber-700 font-medium mb-3">Failed to load history.</p>
              <button onClick={() => refetchHistory()} className="px-5 py-2 rounded-2xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors cursor-pointer">Retry</button>
            </div>
          ) : filteredHistoryFees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <SearchX className="w-12 h-12 text-amber-300 mb-3" />
              <p className="text-slate-500 font-medium text-sm">No {historyFilter === 'all' ? '' : historyFilter} registration fees found.</p>
              <p className="text-slate-400 text-xs mt-1">Try a different filter or date range.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">{filteredHistoryFees.length} record{filteredHistoryFees.length !== 1 ? 's' : ''}</p>
              {filteredHistoryFees.map((fee) => renderHistoryCard(fee))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-3">
              <p className="text-sm text-slate-500">Page {pagination.currentPage} of {pagination.totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setHistoryPage((p) => Math.max(1, p - 1))} disabled={!pagination.hasPreviousPage}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${pagination.hasPreviousPage ? 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50' : 'bg-slate-50 border border-slate-200 text-slate-300 cursor-not-allowed'}`}>
                  ← Previous
                </button>
                <button onClick={() => setHistoryPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={!pagination.hasNextPage}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${pagination.hasNextPage ? 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50' : 'bg-slate-50 border border-slate-200 text-slate-300 cursor-not-allowed'}`}>
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <RejectRegistrationModal isOpen={rejectTarget !== null} onClose={() => { setRejectTarget(null); setRejectError(null); }}
        onConfirm={handleReject} isPending={rejectMutation.isPending} error={rejectError} />

      <ReceiptPreviewModal isOpen={showReceipt} onClose={() => setShowReceipt(false)} imageUrl={receiptUrl} />
    </div>
  );
};

export default PendingRegistrationFees;
