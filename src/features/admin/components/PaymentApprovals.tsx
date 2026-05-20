import { useState, useMemo } from 'react';
import { Eye, Check, X, SearchX, AlertCircle } from 'lucide-react';
import ReceiptPreviewModal from '@/components/ui/ReceiptPreviewModal';
import RejectPaymentModal from '@/components/ui/RejectPaymentModal';
import PaymentApprovedModal from '@/components/ui/PaymentApprovalModal';
import PaymentRejectedModal from '@/components/ui/PaymentRejectedModal';
import { formatCurrency } from '@/lib/currency';
import DateRangeFilter, { type DateRange } from '@/components/ui/DateRangeFilter';
import { useApprovePayment, useRejectPayment, useGetPendingPayments, useGetApprovedPayments, useGetRejectedPayments } from '@/app/store/PaymentStore';
import { useAdminPendingFees, useApproveAdminFee } from '@/app/store/RegistrationFeeStore';
import type { Payment } from '@/api/payments';
import type { AdminPendingFee } from '@/api/registrationFee';

type FilterValue = 'all' | 'package' | 'product' | 'saving' | 'registration';
type TabValue = 'pending' | 'history';

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  package: 'Package Installment',
  saving: 'Ajo Savings',
  product: 'Product Purchase',
};

const filterOptions: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'package', label: 'Packages' },
  { value: 'product', label: 'Products' },
  { value: 'saving', label: 'Ajo Savings' },
  { value: 'registration', label: 'Reg. Fees' },
];

const PaymentApprovals = () => {
  const { data, isLoading, error } = useGetPendingPayments();
  const { data: approvedData, isLoading: approvedLoading } = useGetApprovedPayments();
  const { data: rejectedData, isLoading: rejectedLoading } = useGetRejectedPayments();
  const { data: regPendingData } = useAdminPendingFees();

  const payments = data?.payments || [];
  const approveMutation = useApprovePayment();
  const rejectMutation = useRejectPayment();
  const approveRegMutation = useApproveAdminFee();
  const [rejectId, setRejectId] = useState<string | null>(null);

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState('');

  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterValue>('all');
  const [activeTab, setActiveTab] = useState<TabValue>('pending');
  const [localStatus, setLocalStatus] = useState<Record<string, 'approved' | 'rejected'>>({});
  const [historySubTab, setHistorySubTab] = useState<'approved' | 'rejected'>('approved');
  const [approvedDateRange, setApprovedDateRange] = useState<DateRange>({ from: null, to: null });
  const [rejectedDateRange, setRejectedDateRange] = useState<DateRange>({ from: null, to: null });
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<'all' | 'package' | 'saving' | 'product'>('all');

  const filteredApproved = useMemo(() => {
    let items = approvedData?.payments ?? [];
    if (paymentTypeFilter !== 'all') items = items.filter((p) => p.paymentType === paymentTypeFilter);
    if (approvedDateRange.from) items = items.filter((p) => p.createdAt && new Date(p.createdAt) >= approvedDateRange.from!);
    if (approvedDateRange.to) items = items.filter((p) => p.createdAt && new Date(p.createdAt) <= approvedDateRange.to!);
    return items;
  }, [approvedData, approvedDateRange, paymentTypeFilter]);

  const filteredRejected = useMemo(() => {
    let items = rejectedData?.payments ?? [];
    if (paymentTypeFilter !== 'all') items = items.filter((p) => p.paymentType === paymentTypeFilter);
    if (rejectedDateRange.from) items = items.filter((p) => p.createdAt && new Date(p.createdAt) >= rejectedDateRange.from!);
    if (rejectedDateRange.to) items = items.filter((p) => p.createdAt && new Date(p.createdAt) <= rejectedDateRange.to!);
    return items;
  }, [rejectedData, rejectedDateRange, paymentTypeFilter]);

  const historyPayments = [
    ...(approvedData?.payments ?? []),
    ...(rejectedData?.payments ?? []),
  ].sort((a, b) => {
    const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bDate - aDate;
  });

  const displayPayments = activeTab === 'pending' ? payments : historyPayments;
  const filteredPayments = selectedFilter === 'all' ? displayPayments : displayPayments.filter((p) => p.paymentType === selectedFilter);
  const showRegFees = selectedFilter === 'all' || selectedFilter === 'registration';
  const regFees = regPendingData?.fees ?? [];
  const showRegBlock = activeTab === 'pending' && showRegFees && regFees.length > 0;

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map(({ value, label }) => (
          <button key={value} onClick={() => setSelectedFilter(value)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap
              ${selectedFilter === value ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-brand-200 hover:bg-slate-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Pending / History toggle */}
      <div className="flex gap-4 border-b border-brand-200">
        <button onClick={() => setActiveTab('pending')}
          className={`pb-2 text-xs font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'pending' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'
          }`}>
          Pending Payments
        </button>
        <button onClick={() => setActiveTab('history')}
          className={`pb-2 text-xs font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'history' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'
          }`}>
          History
        </button>
      </div>

      {activeTab === 'pending' && showRegBlock && (
        <RegFeeBlock fees={regFees} onApprove={(id) => approveRegMutation.mutate(id)} onViewReceipt={(url) => { setReceiptUrl(url); setShowReceiptModal(true); }} isPending={approveRegMutation.isPending} />
      )}

      {activeTab === 'pending' ? (
        isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded-full w-40" />
                    <div className="h-3 bg-slate-100 rounded-full w-56" />
                  </div>
                  <div className="h-8 w-24 bg-slate-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-red-600 font-semibold text-sm mb-1">Failed to load payments</p>
            <p className="text-slate-400 text-xs mb-4">Something went wrong. Please try again.</p>
            <button onClick={() => window.location.reload()} className="px-5 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors cursor-pointer">Retry</button>
          </div>
        ) : (
          filteredPayments.length === 0 && !showRegFees ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                <SearchX className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-slate-600 font-medium text-sm">No pending payments</p>
              <p className="text-slate-400 text-xs mt-1">All payments have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPayments.map((payment) => {
                const effectiveStatus = localStatus[payment.id] || payment.status;
                const initials = (payment.user?.fullName ?? '?').split(' ').map((s) => s[0]).slice(0, 2).join('');
                const userPackage = payment.userPackage as { installmentAmount?: string } | null | undefined;
                const amountMismatch = Number(payment.amountPaid) !== Number(payment.expectedAmount);
                return (
                  <div key={payment.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:border-amber-200/50 transition-all duration-200"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-sm truncate">{payment.user.fullName}</p>
                            <p className="text-xs text-slate-400 truncate">{payment.user.email}</p>
                            {(payment.user as { phoneNumber?: string }).phoneNumber && (
                              <p className="text-xs text-slate-400 truncate">{(payment.user as { phoneNumber?: string }).phoneNumber}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base font-bold text-brand-600">{formatCurrency(parseFloat(payment.amountPaid))}</p>
                          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                            payment.paymentType === 'package' ? 'bg-blue-50 text-blue-700' :
                            payment.paymentType === 'saving' ? 'bg-green-50 text-green-700' :
                            'bg-purple-50 text-purple-700'
                          }`}>{payment.paymentType}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3 mb-3">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Payment for:</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          payment.paymentType === 'package' ? 'bg-blue-100 text-blue-700' :
                          payment.paymentType === 'saving' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {PAYMENT_TYPE_LABELS[payment.paymentType] ?? payment.paymentType}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Amount Paid</p>
                          <p className="text-base font-bold text-slate-800 mt-1">{formatCurrency(Number(payment.amountPaid))}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Expected</p>
                          <p className={`text-base font-bold mt-1 ${amountMismatch ? 'text-amber-600' : 'text-slate-800'}`}>
                            {formatCurrency(Number(payment.expectedAmount))}
                            {amountMismatch && <span className="ml-1 text-[10px] font-medium text-amber-500">(mismatch)</span>}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Date</p>
                          <p className="text-sm font-semibold text-slate-700 mt-1">
                            {payment.createdAt
                              ? new Date(payment.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
                              : '—'}
                          </p>
                        </div>
                        {userPackage?.installmentAmount ? (
                          <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Installment</p>
                            <p className="text-sm font-semibold text-slate-700 mt-1">{formatCurrency(Number(userPackage.installmentAmount))}</p>
                          </div>
                        ) : (
                          <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Time</p>
                            <p className="text-sm font-semibold text-slate-700 mt-1">
                              {payment.createdAt
                                ? new Date(payment.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
                                : '—'}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {payment.receiptUrl && (
                            <button onClick={() => { setReceiptUrl(payment.receiptUrl); setShowReceiptModal(true); }}
                              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-600 hover:bg-brand-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer">
                              <Eye className="w-3.5 h-3.5" /> Receipt
                            </button>
                          )}
                        </div>
                        {effectiveStatus !== 'approved' && effectiveStatus !== 'rejected' && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => approveMutation.mutate(payment.id, {
                              onSuccess: () => setLocalStatus((s) => ({ ...s, [payment.id]: 'approved' })),
                            })}
                              disabled={approveMutation.isPending}
                              className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-sm active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button onClick={() => { setSelectedPayment(payment); setRejectId(payment.id); }}
                              className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-sm active:scale-[0.97] cursor-pointer">
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        )}
                        {(effectiveStatus === 'approved' || effectiveStatus === 'rejected') && (
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                            effectiveStatus === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )
      ) : (
        /* ── History tab: Approved / Rejected sub-tabs with date filtering ── */
        <>
          {/* History sub-tabs */}
          <div className="flex gap-6 border-b border-slate-200">
            {(['approved', 'rejected'] as const).map((tab) => (
              <button key={tab} onClick={() => { setHistorySubTab(tab); setPaymentTypeFilter('all'); }}
                className={`relative pb-3 text-sm font-medium transition-colors cursor-pointer ${
                  historySubTab === tab
                    ? 'text-amber-700'
                    : 'text-slate-500 hover:text-slate-700'
                }`}>
                {tab === 'approved' ? 'Approved' : 'Rejected'}
                {historySubTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Date range filter + type pills row */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 space-y-4">
            <DateRangeFilter
              onChange={historySubTab === 'approved' ? setApprovedDateRange : setRejectedDateRange}
              resultCount={historySubTab === 'approved' ? filteredApproved.length : filteredRejected.length}
            />

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</span>
              <div className="flex gap-1.5 flex-wrap">
                {([
                  { value: 'all' as const, label: 'All' },
                  { value: 'package' as const, label: 'Package' },
                  { value: 'saving' as const, label: 'Savings' },
                  { value: 'product' as const, label: 'Product' },
                ]).map(({ value, label }) => (
                  <button key={value} onClick={() => setPaymentTypeFilter(value)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      paymentTypeFilter === value
                        ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total', count: (historySubTab === 'approved' ? filteredApproved : filteredRejected).length, icon: '⊞' },
              { label: 'Package', count: (historySubTab === 'approved' ? filteredApproved : filteredRejected).filter((p) => p.paymentType === 'package').length, icon: '📦' },
              { label: 'Savings', count: (historySubTab === 'approved' ? filteredApproved : filteredRejected).filter((p) => p.paymentType === 'saving').length, icon: '💰' },
              { label: 'Product', count: (historySubTab === 'approved' ? filteredApproved : filteredRejected).filter((p) => p.paymentType === 'product').length, icon: '🛍️' },
            ].map(({ label, count, icon }) => (
              <div key={label} className="bg-white rounded-xl border border-slate-100 p-3.5 shadow-sm">
                <p className="text-xs text-slate-400 mb-1">{icon} {label}</p>
                <p className="text-xl font-bold text-slate-800">{count}</p>
              </div>
            ))}
          </div>

          {/* Approved / Rejected content */}
          {approvedLoading || rejectedLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded-full w-40" />
                      <div className="h-3 bg-slate-100 rounded-full w-56" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : historySubTab === 'approved' && filteredApproved.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
                <SearchX className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-slate-800 font-semibold text-base">No approved payments found</p>
              <p className="text-slate-400 text-sm mt-1 text-center max-w-xs">Try adjusting the date range or payment type filter above.</p>
            </div>
          ) : historySubTab === 'rejected' && filteredRejected.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
                <SearchX className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-slate-800 font-semibold text-base">No rejected payments found</p>
              <p className="text-slate-400 text-sm mt-1 text-center max-w-xs">No payments were rejected within this range.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(historySubTab === 'approved' ? filteredApproved : filteredRejected).map((payment) => {
                const initials = (payment.user?.fullName ?? '?').split(' ').map((s) => s[0]).slice(0, 2).join('');
                return (
                  <div key={payment.id}
                    className={`group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-amber-200/50 transition-all duration-300 ${
                      historySubTab === 'approved' ? 'hover:shadow-emerald-100/50' : 'hover:shadow-red-100/50'
                    }`}
                  >
                    {/* Top accent stripe */}
                    <div className={`h-1.5 w-full ${
                      historySubTab === 'approved'
                        ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400'
                        : 'bg-gradient-to-r from-red-400 via-red-500 to-red-400'
                    }`} />

                    <div className="p-5 sm:p-6">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-base font-bold shrink-0 shadow-md shadow-brand-500/20">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-[15px] truncate group-hover:text-brand-700 transition-colors">
                              {payment.user?.fullName}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <p className="text-xs text-slate-400 truncate">{payment.user?.email}</p>
                              {(payment.user as { phoneNumber?: string })?.phoneNumber && (
                                <>
                                  <span className="text-slate-200">•</span>
                                  <p className="text-xs text-slate-400 truncate">{(payment.user as { phoneNumber?: string }).phoneNumber}</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                            historySubTab === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                              : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                          }`}>
                            {historySubTab === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-[11px] font-semibold capitalize ${
                            payment.paymentType === 'package' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20' :
                            payment.paymentType === 'saving' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' :
                            'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20'
                          }`}>
                            {payment.paymentType}
                          </span>
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Amount Paid</p>
                          <p className="text-base font-bold text-slate-800 mt-1">{formatCurrency(parseFloat(payment.amountPaid))}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Expected</p>
                          <p className="text-base font-bold text-slate-800 mt-1">{formatCurrency(parseFloat(payment.expectedAmount))}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Date</p>
                          <p className="text-sm font-semibold text-slate-700 mt-1">
                            {payment.createdAt
                              ? new Date(payment.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
                              : '—'}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Time</p>
                          <p className="text-sm font-semibold text-slate-700 mt-1">
                            {payment.createdAt
                              ? new Date(payment.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
                              : '—'}
                          </p>
                        </div>
                      </div>

                      {/* Rejection reason */}
                      {historySubTab === 'rejected' && payment.rejectionReason && (
                        <div className="mt-4 flex items-start gap-2.5 bg-red-50/80 rounded-xl px-4 py-3 border border-red-100">
                          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[11px] font-semibold text-red-600 uppercase tracking-wider">Rejection Reason</p>
                            <p className="text-sm text-red-700 mt-0.5">{payment.rejectionReason}</p>
                          </div>
                        </div>
                      )}

                      {/* Receipt action */}
                      <div className="mt-4 flex items-center gap-3 pt-3 border-t border-slate-100">
                        {payment.receiptUrl && (
                          <button onClick={() => { setReceiptUrl(payment.receiptUrl); setShowReceiptModal(true); }}
                            className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-3.5 py-2 rounded-xl transition-all duration-200 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            View Payment Receipt
                          </button>
                        )}
                        {payment.createdAt && (
                          <span className="text-xs text-slate-300 ml-auto">
                            ID: {payment.id.slice(0, 8)}...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <ReceiptPreviewModal isOpen={showReceiptModal} onClose={() => setShowReceiptModal(false)} imageUrl={receiptUrl} />
      <RejectPaymentModal isOpen={rejectId !== null} onClose={() => setRejectId(null)}
        customerName={selectedPayment?.user?.fullName ?? ''} amount={selectedPayment?.amountPaid ?? '0'}
        onConfirm={(reason) => { if (rejectId) rejectMutation.mutate({ paymentId: rejectId, rejectionReason: reason }); setRejectId(null); }} />
      <PaymentApprovedModal isOpen={showApprovedModal} onClose={() => setShowApprovedModal(false)} />
      <PaymentRejectedModal isOpen={showRejectedModal} onClose={() => setShowRejectedModal(false)} />
    </div>
  );
};

const RegFeeBlock = ({ fees, onApprove, onViewReceipt, isPending }: {
  fees: AdminPendingFee[];
  onApprove: (id: string) => void;
  onViewReceipt: (url: string) => void;
  isPending: boolean;
}) => (
  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
    <p className="text-xs font-semibold text-amber-700 mb-2">Registration Fees ({fees.length} pending)</p>
    <div className="space-y-1.5">
      {fees.slice(0, 5).map((fee) => (
        <div key={fee.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 text-xs">
          <span className="font-medium text-slate-800 truncate max-w-[200px]">{fee.user?.fullName || fee.user?.email || '—'}</span>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button onClick={() => onViewReceipt(fee.proofFile)}
              className="p-1 text-brand-600 hover:bg-brand-100 rounded-lg transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
            <button onClick={() => onApprove(fee.id)} disabled={isPending}
              className="p-1 bg-brand-100 text-brand-600 hover:bg-brand-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"><Check className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PaymentApprovals;
