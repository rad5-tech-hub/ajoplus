import { useState } from 'react';
import { Eye, Download, Check, X } from 'lucide-react';
import ReceiptPreviewModal from '@/components/ui/ReceiptPreviewModal';
import RejectPaymentModal from '@/components/ui/RejectPaymentModal';
import PaymentApprovedModal from '@/components/ui/PaymentApprovalModal';
import PaymentRejectedModal from '@/components/ui/PaymentRejectedModal';

interface ApprovalItem {
  id: string;
  name: string;
  package: string;
  amount: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const approvals: ApprovalItem[] = [
  { id: "1", name: "Chioma Okafor", package: "Smart Phone Package", amount: "₦25,000", date: "18 Mar 2026", status: "pending" },
  { id: "2", name: "Emeka Nwosu", package: "Laptop Pro Package", amount: "₦41,667", date: "18 Mar 2026", status: "pending" },
  { id: "3", name: "Blessing Eze", package: "Home Appliance Bundle", amount: "₦33,333", date: "17 Mar 2026", status: "pending" },
];

const PaymentApprovals = () => {
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [processedItems, setProcessedItems] = useState<Partial<Record<string, 'approved' | 'rejected'>>>({});


  const currentStatus = (item: ApprovalItem) => processedItems[item.id] || item.status;

  const openReceipt = (item: ApprovalItem) => {
    setSelectedItem(item);
    setShowReceiptModal(true);
  };

  const handleApprove = (item: ApprovalItem) => {
    setProcessedItems(prev => ({ ...prev, [item.id]: 'approved' }));
    setShowApprovedModal(true);
  };

  const handleRejectConfirm = (reason: string) => {
    if (!selectedItem || !reason.trim()) return;
    setProcessedItems(prev => ({ ...prev, [selectedItem.id]: 'rejected' }));
    setShowRejectModal(false);
    setShowRejectedModal(true);
  };

  const getCardBg = (status: string) => {
    if (status === 'approved') return 'bg-emerald-50/80 border-emerald-100';
    if (status === 'rejected') return 'bg-red-50/80 border-red-100';
    return 'bg-white border-slate-100';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Payment Approvals</h2>
        <p className="text-slate-600 mt-1 text-sm sm:text-base">
          Review and approve customer payment receipts
        </p>
      </div>

      <div className="space-y-6">
        {approvals.map((item) => {
          const status = currentStatus(item);
          const isPending = status === 'pending';

          return (
            <div
              key={item.id}
              className={`rounded-3xl border shadow-sm p-5 sm:p-6 lg:p-8 
                grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 ${getCardBg(status)}`}
            >
              {/* Left - User Info */}
              <div className="lg:col-span-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                    👤
                  </div>
                  <div>
                    <p className="font-semibold text-lg sm:text-xl text-slate-900">{item.name}</p>
                    <span className={`inline-block mt-1.5 px-4 py-1 text-xs font-medium rounded-full capitalize
                      ${status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                        status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl bg-slate-100/70 p-5 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Package Name</p>
                    <p className="font-medium text-slate-900 mt-0.5">{item.package}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Payment Amount</p>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-0.5">{item.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Submitted Date</p>
                    <p className="font-medium text-slate-900 mt-0.5">{item.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Payment ID</p>
                    <p className="font-medium text-slate-900 mt-0.5">#{item.id}</p>
                  </div>
                </div>
              </div>

              {/* Center - Receipt Preview */}
              <div className="lg:col-span-5">
                <p className="text-slate-500 text-sm mb-3">Receipt Preview</p>
                <div
                  onClick={() => openReceipt(item)}
                  className="bg-slate-100 border-2 border-slate-200 rounded-3xl h-64 sm:h-72 lg:h-80 cursor-pointer 
                    flex flex-col items-center justify-center relative hover:border-emerald-300 
                    transition-all active:scale-[0.985] overflow-hidden"
                >
                  <div className="w-14 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 text-5xl shadow-sm">
                    📄
                  </div>
                  <p className="font-medium text-slate-800">Payment Receipt</p>
                  <p className="text-xs text-slate-500 mt-1">/receipt-{item.id}.jpg</p>
                  
                  <button className="absolute bottom-6 flex items-center gap-2 text-emerald-600 text-sm font-medium hover:underline pointer-events-none">
                    <Eye className="w-4 h-4" /> Click to view full size
                  </button>
                </div>
              </div>

              {/* Right - Actions */}
              <div className="lg:col-span-3 flex flex-col gap-3">
                <button className="border border-emerald-600 text-emerald-600 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors text-sm sm:text-base font-medium">
                  <Eye className="w-4 h-4" /> View Full Receipt
                </button>
                <button className="border border-emerald-600 text-emerald-600 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors text-sm sm:text-base font-medium">
                  <Download className="w-4 h-4" /> Download
                </button>

                {isPending ? (
                  <>
                    <button
                      onClick={() => handleApprove(item)}
                      className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm sm:text-base"
                    >
                      <Check className="w-5 h-5" /> Approve Payment
                    </button>
                    <button
                      onClick={() => { setSelectedItem(item); setShowRejectModal(true); }}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm sm:text-base"
                    >
                      <X className="w-5 h-5" /> Reject Payment
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
        receiptId={selectedItem?.id || ''}
      />

      <RejectPaymentModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectConfirm}
        customerName={selectedItem?.name || ''}
        amount={selectedItem?.amount || ''}
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