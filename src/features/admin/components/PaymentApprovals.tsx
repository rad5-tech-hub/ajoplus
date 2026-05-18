import { useState } from 'react';
import { Eye, Check, X } from 'lucide-react';
import ReceiptPreviewModal from '@/components/ui/ReceiptPreviewModal';
import RejectPaymentModal from '@/components/ui/RejectPaymentModal';
import PaymentApprovedModal from '@/components/ui/PaymentApprovalModal';
import PaymentRejectedModal from '@/components/ui/PaymentRejectedModal';
import { formatCurrency } from '@/lib/currency';
import { useApprovePayment, useRejectPayment, useGetPendingPayments, useGetApprovedPayments, useGetRejectedPayments } from '@/app/store/PaymentStore';
import { useAdminPendingFees, useApproveAdminFee } from '@/app/store/RegistrationFeeStore';
import type { Payment } from '@/api/payments';

type FilterValue = 'all' | 'package' | 'product' | 'saving' | 'registration';
type TabValue = 'pending' | 'history';

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

      {showRegBlock ? <RegFeeBlock fees={regFees} onApprove={(id) => approveRegMutation.mutate(id)} onViewReceipt={(url) => { setReceiptUrl(url); setShowReceiptModal(true); }} isPending={approveRegMutation.isPending} /> : null}

      {isLoading || approvedLoading || rejectedLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : error ? (
        <div className="bg-white border border-red-200 rounded-2xl p-4 text-center">
          <p className="text-red-600 text-xs mb-2">Failed to load payments.</p>
          <button onClick={() => window.location.reload()} className="text-xs text-red-600 underline cursor-pointer">Retry</button>
        </div>
      ) : (
        filteredPayments.length === 0 && !showRegFees ? (
          <div className="bg-white border border-brand-200 rounded-2xl p-6 text-center text-slate-500 text-xs">No payments found.</div>
        ) : (
          <div className="space-y-1.5">
            {filteredPayments.map((payment) => {
              const effectiveStatus = localStatus[payment.id] || payment.status;
              return (
                <div key={payment.id} className="bg-white border border-brand-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 grid place-items-center font-semibold text-xs shrink-0">
                      {(payment.user?.fullName ?? '?').split(' ').map((s) => s[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{payment.user.fullName}</p>
                      <p className="text-xs text-slate-400">{payment.user.email}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-brand-600">{formatCurrency(parseFloat(payment.amountPaid))}</p>
                    <p className="text-xs text-slate-400 capitalize">{payment.paymentType}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {payment.receiptUrl && (
                      <button onClick={() => { setReceiptUrl(payment.receiptUrl); setShowReceiptModal(true); }}
                        className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all cursor-pointer" title="View receipt">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {activeTab === 'pending' && effectiveStatus !== 'approved' && effectiveStatus !== 'rejected' && (
                      <>
                        <button onClick={() => approveMutation.mutate(payment.id, {
                          onSuccess: () => setLocalStatus((s) => ({ ...s, [payment.id]: 'approved' })),
                        })}
                          disabled={approveMutation.isPending}
                          className="p-1.5 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-lg transition-all disabled:opacity-50 cursor-pointer">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setSelectedPayment(payment); setRejectId(payment.id); }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {activeTab === 'history' && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'approved' ? 'bg-green-100 text-green-700' :
                        payment.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'
                      }`}>{payment.status}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
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
  fees: { id: string; fullName?: string; email?: string; proofFile: string }[];
  onApprove: (id: string) => void;
  onViewReceipt: (url: string) => void;
  isPending: boolean;
}) => (
  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
    <p className="text-xs font-semibold text-amber-700 mb-2">Registration Fees ({fees.length} pending)</p>
    <div className="space-y-1.5">
      {fees.slice(0, 5).map((fee) => (
        <div key={fee.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 text-xs">
          <span className="font-medium text-slate-800 truncate max-w-[200px]">{fee.fullName || fee.email || '—'}</span>
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
