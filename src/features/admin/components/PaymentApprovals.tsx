import { useState } from 'react';
import { Eye, Check, X } from 'lucide-react';
import ReceiptPreviewModal from '@/components/ui/ReceiptPreviewModal';
import { formatCurrency } from '@/lib/currency';
import { useApprovePayment, useGetPendingPayments, useGetApprovedPayments, useGetRejectedPayments } from '@/app/store/PaymentStore';
import { useAdminPendingFees, useApproveAdminFee } from '@/app/store/RegistrationFeeStore';

type FilterValue = 'all' | 'package' | 'product' | 'saving' | 'registration';
type TabValue = 'pending' | 'history';

const PaymentApprovals = () => {
  const { data } = useGetPendingPayments();
  const { data: approvedData } = useGetApprovedPayments();
  const { data: rejectedData } = useGetRejectedPayments();
  const { data: regPendingData } = useAdminPendingFees();

  const approveMutation = useApprovePayment();
  const approveRegMutation = useApproveAdminFee();

  const payments = data?.payments || [];
  const regFees = regPendingData?.fees ?? [];

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterValue>('all');
  const [activeTab, setActiveTab] = useState<TabValue>('pending');
  const [rejectRegId, setRejectRegId] = useState<string | null>(null);
  const [rejectRegReason, setRejectRegReason] = useState('');

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

  const handleApprove = (id: string) => approveMutation.mutate(id);
  const handleViewReceipt = (url: string) => { setReceiptUrl(url); setShowReceiptModal(true); };
  const handleApproveReg = (id: string) => approveRegMutation.mutate(id);

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 flex-wrap">
        {[
          { value: 'all' as FilterValue, label: 'All' },
          { value: 'package' as FilterValue, label: 'Packages' },
          { value: 'saving' as FilterValue, label: 'Ajo Savings' },
          { value: 'product' as FilterValue, label: 'Products' },
          { value: 'registration' as FilterValue, label: 'Registration Fees' },
        ].map(({ value, label }) => (
          <button key={value} onClick={() => setSelectedFilter(value)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-medium transition-colors cursor-pointer
              ${selectedFilter === value ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 border-b border-brand-200">
        <button onClick={() => setActiveTab('pending')}
          className={`pb-2 font-medium text-sm transition-colors border-b-2 cursor-pointer ${
            activeTab === 'pending' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'
          }`}>
          Pending {showRegFees && regFees.length > 0 && `(${regFees.length})`}
        </button>
        <button onClick={() => setActiveTab('history')}
          className={`pb-2 font-medium text-sm transition-colors border-b-2 cursor-pointer ${
            activeTab === 'history' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'
          }`}>
          History
        </button>
      </div>

      {activeTab === 'pending' && showRegFees && regFees.length > 0 && (
        <div className="bg-white border border-brand-200 rounded-2xl overflow-hidden">
          <div className="bg-amber-50 px-4 py-2 border-b border-amber-200">
            <p className="text-xs font-semibold text-amber-700">Registration Fees ({regFees.length} pending)</p>
          </div>
          <div className="divide-y divide-slate-100">
            {regFees.slice(0, 10).map((fee) => (
              <div key={fee.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-900 truncate">{fee.fullName || '—'}</p>
                  <p className="text-xs text-slate-400 truncate">{fee.email || ''}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button onClick={() => handleViewReceipt(fee.proofFile)}
                    className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer" title="View receipt">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleApproveReg(fee.id)} disabled={approveRegMutation.isPending}
                    className="p-1.5 bg-brand-100 text-brand-600 hover:bg-brand-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer" title="Approve">
                    <Check className="w-4 h-4" />
                  </button>
                  {rejectRegId === fee.id ? (
                    <div className="flex gap-1">
                      <input type="text" value={rejectRegReason} onChange={(e) => setRejectRegReason(e.target.value)}
                        placeholder="Reason..." className="w-24 px-2 py-1 border border-red-200 rounded-lg text-xs focus:outline-none" />
                      <button onClick={() => {
                        if (!rejectRegReason.trim() || rejectRegReason.trim().length < 10) return;
                        setRejectRegId(null); setRejectRegReason('');
                      }} disabled={rejectRegReason.trim().length < 10}
                        className="p-1.5 bg-red-100 text-red-600 rounded-lg text-xs disabled:opacity-50 cursor-pointer">Reject</button>
                    </div>
                  ) : (
                    <button onClick={() => { setRejectRegId(fee.id); setRejectRegReason(''); }}
                      className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors cursor-pointer" title="Reject">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filteredPayments.length === 0 && !showRegFees ? (
          <div className="bg-white border border-brand-200 rounded-2xl p-6 text-center text-slate-500 text-sm">No payments found.</div>
        ) : (
          filteredPayments.map((payment) => (
            <div key={payment.id} className="bg-white border border-brand-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-brand-900 text-sm truncate">{payment.user?.fullName || '—'}</p>
                <p className="text-xs text-slate-400 truncate">{payment.user?.email || ''}</p>
                <p className="text-xs text-slate-500 mt-0.5">{payment.amountPaid ? formatCurrency(parseFloat(payment.amountPaid)) : ''}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {payment.receiptUrl && (
                  <button onClick={() => handleViewReceipt(payment.receiptUrl)}
                    className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer" title="View receipt">
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                {activeTab === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(payment.id)} disabled={approveMutation.isPending}
                      className="p-1.5 bg-brand-100 text-brand-600 hover:bg-brand-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer" title="Approve">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleApprove(payment.id)} disabled
                      className="p-1.5 bg-red-100 text-red-600 rounded-lg transition-colors cursor-not-allowed" title="Reject">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <ReceiptPreviewModal isOpen={showReceiptModal} onClose={() => setShowReceiptModal(false)} imageUrl={receiptUrl} />
    </div>
  );
};

export default PaymentApprovals;
