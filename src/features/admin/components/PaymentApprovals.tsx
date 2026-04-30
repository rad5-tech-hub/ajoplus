import { useState } from 'react';
import { Eye, Download, Check, X, Filter } from 'lucide-react';

import ReceiptPreviewModal from '@/components/ui/ReceiptPreviewModal';
import RejectPaymentModal from '@/components/ui/RejectPaymentModal';
import PaymentApprovedModal from '@/components/ui/PaymentApprovalModal';
import PaymentRejectedModal from '@/components/ui/PaymentRejectedModal';

import { formatDualCurrency } from '@/lib/currency';
import { useApprovePayment, useRejectPayment, useGetPendingPayments } from '@/app/store/PaymentStore';

import type { Payment } from '@/api/payments';

type FilterValue = 'all' | 'package' | 'product' | 'saving';

const filterOptions: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All Payments' },
  { value: 'package', label: 'Packages' },
  { value: 'product', label: 'Products' },
  { value: 'saving', label: 'Ajo Savings' },
];

const PaymentApprovals = () => {
  const { data: payments = [], isLoading, error } = useGetPendingPayments();
  const approveMutation = useApprovePayment();
  const rejectMutation = useRejectPayment();

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterValue>('all');

  // Optimistic local status updates
  const [localStatus, setLocalStatus] = useState<Record<string, 'approved' | 'rejected'>>({});

  const filteredPayments = payments.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.paymentType === selectedFilter;
  });

  const getStatus = (payment: Payment): string =>
    localStatus[payment.id] ?? payment.status;

  const openReceipt = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const handleApprove = (payment: Payment) => {
    approveMutation.mutate(payment.id, {
      onSuccess: () => {
        setLocalStatus((prev) => ({ ...prev, [payment.id]: 'approved' }));
        setShowApprovedModal(true);
      },
      onError: (err: Error) => {
        console.error('[Approve Error]', err.message);
      },
    });
  };

  const handleRejectConfirm = (reason: string) => {
    if (!selectedPayment || !reason.trim()) return;

    rejectMutation.mutate(
      { paymentId: selectedPayment.id, rejectionReason: reason },
      {
        onSuccess: () => {
          setLocalStatus((prev) => ({ ...prev, [selectedPayment.id]: 'rejected' }));
          setShowRejectModal(false);
          setShowRejectedModal(true);
        },
        onError: (err: Error) => {
          console.error('[Reject Error]', err.message);
        },
      }
    );
  };

  const getCardBg = (status: string) => {
    if (status === 'approved') return 'bg-emerald-50/80 border-emerald-100';
    if (status === 'rejected') return 'bg-red-50/80 border-red-100';
    return 'bg-white border-slate-100';
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="h-9 bg-slate-200 rounded-full w-1/3 animate-pulse" />
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-100 p-8 animate-pulse">
            <div className="h-6 bg-slate-200 rounded-full w-1/4 mb-4" />
            <div className="h-48 bg-slate-100 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-red-200 rounded-3xl p-8 text-center">
          <p className="text-red-600 mb-4">Failed to load pending payments</p>
          <button
            onClick={() => window.location.reload()}
            className="text-red-600 underline text-sm hover:text-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Payment Approvals</h2>
        <p className="text-slate-600 mt-1 text-sm sm:text-base">
          Review and approve customer payment receipts
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
          <Filter className="w-4 h-4" />
          <span>Filter:</span>
        </div>
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedFilter(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilter === option.value
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
          <p className="text-slate-500 text-lg font-medium">No pending payments</p>
          <p className="text-slate-400 text-sm mt-1">All receipts have been reviewed.</p>
        </div>
      )}

      <div className="space-y-6">
        {filteredPayments.map((payment) => {
          const status = getStatus(payment);
          const isPending = status === 'pending' || status === 'pending_approval';

          // Per-item loading states
          const isApprovingThis = approveMutation.isPending && approveMutation.variables === payment.id;
          const isRejectingThis =
            rejectMutation.isPending && selectedPayment?.id === payment.id;

          return (
            <div
              key={payment.id}
              className={`rounded-3xl border shadow-sm p-5 sm:p-6 lg:p-8
                grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 ${getCardBg(status)}`}
            >
              {/* Left — Payment Info */}
              <div className="lg:col-span-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                    👤
                  </div>
                  <div>
                    <p className="font-semibold text-lg sm:text-xl text-slate-900">
                      {payment.userId}
                    </p>
                    <span
                      className={`inline-block mt-1.5 px-4 py-1 text-xs font-medium rounded-full capitalize
                        ${status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'}`}
                    >
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl bg-slate-100/70 p-5 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Payment Type</p>
                    <p className="font-medium text-slate-900 mt-0.5 capitalize">
                      {payment.paymentType.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Amount Paid</p>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-0.5">
                      {formatDualCurrency(parseFloat(payment.amountPaid))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Expected Amount</p>
                    <p className="font-medium text-slate-900 mt-0.5">
                      {formatDualCurrency(parseFloat(payment.expectedAmount))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Payment ID</p>
                    <p className="font-medium text-slate-900 mt-0.5 text-xs break-all">
                      #{payment.id}
                    </p>
                  </div>
                  {payment.rejectionReason && (
                    <div>
                      <p className="text-xs text-slate-500">Rejection Reason</p>
                      <p className="font-medium text-red-700 mt-0.5">{payment.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Center — Receipt Preview */}
              <div className="lg:col-span-5">
                <p className="text-slate-500 text-sm mb-3">Receipt Preview</p>
                <div
                  onClick={() => openReceipt(payment)}
                  className="bg-slate-100 border-2 border-slate-200 rounded-3xl h-64 sm:h-72 lg:h-80 cursor-pointer
                    flex flex-col items-center justify-center relative hover:border-emerald-300
                    transition-all active:scale-[0.985] overflow-hidden"
                >
                  {payment.receiptUrl ? (
                    <img
                      src={payment.receiptUrl}
                      alt="Payment receipt"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="w-14 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 text-5xl shadow-sm">
                        📄
                      </div>
                      <p className="font-medium text-slate-800">Payment Receipt</p>
                    </>
                  )}
                  <button className="absolute bottom-6 flex items-center gap-2 text-emerald-600 text-sm font-medium bg-white/90 px-3 py-1.5 rounded-xl pointer-events-none">
                    <Eye className="w-4 h-4" /> Click to view full size
                  </button>
                </div>
              </div>

              {/* Right — Actions */}
              <div className="lg:col-span-3 flex flex-col gap-3">
                {/* View & Download Links */}
                {payment.receiptUrl && (
                  <>
                    <a
                      href={payment.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-emerald-600 text-emerald-600 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors text-sm sm:text-base font-medium"
                    >
                      <Eye className="w-4 h-4" /> View Full Receipt
                    </a>

                    <a
                      href={payment.receiptUrl}
                      download
                      className="border border-emerald-600 text-emerald-600 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors text-sm sm:text-base font-medium"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </>
                )}

                {isPending ? (
                  <>
                    <button
                      onClick={() => handleApprove(payment)}
                      disabled={isApprovingThis}
                      className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm sm:text-base disabled:bg-emerald-400 disabled:cursor-not-allowed"
                    >
                      {isApprovingThis ? (
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                      Approve Payment
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowRejectModal(true);
                      }}
                      disabled={isRejectingThis}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm sm:text-base disabled:bg-red-400 disabled:cursor-not-allowed"
                    >
                      {isRejectingThis ? (
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      ) : (
                        <X className="w-5 h-5" />
                      )}
                      Reject Payment
                    </button>
                  </>
                ) : status === 'approved' ? (
                  <div className="mt-8 flex flex-col items-center text-emerald-600">
                    <Check className="w-12 h-12" />
                    <p className="font-semibold mt-3 text-lg">Approved</p>
                  </div>
                ) : (
                  <div className="mt-8 flex flex-col items-center text-red-600">
                    <X className="w-12 h-12" />
                    <p className="font-semibold mt-3 text-lg">Rejected</p>
                    {payment.rejectionReason && (
                      <p className="text-xs text-center text-red-400 mt-1">{payment.rejectionReason}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <ReceiptPreviewModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        receiptId={selectedPayment?.id ?? ''}
      />

      <RejectPaymentModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectConfirm}
        customerName={selectedPayment?.userId ?? ''}
        amount={selectedPayment?.amountPaid ?? ''}
      />

      <PaymentApprovedModal
        isOpen={showApprovedModal}
        onClose={() => setShowApprovedModal(false)}
      />

      <PaymentRejectedModal
        isOpen={showRejectedModal}
        onClose={() => setShowRejectedModal(false)}
      />
    </div>
  );
};

export default PaymentApprovals;