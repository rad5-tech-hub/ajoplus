import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface RejectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  customerName: string;
  amount: string;
}

const RejectPaymentModal = ({ isOpen, onClose, onConfirm, customerName, amount }: RejectPaymentModalProps) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full">
        <div className="p-6 md:p-8">
          <div className="flex gap-4 mb-6">
            <div className="w-11 h-11 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900">Reject Payment</h3>
              <p className="text-slate-600 text-base">{customerName} • {amount}</p>
            </div>
          </div>
          
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full h-36 p-5 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-red-500 resize-y"
          />
        </div>

        <div className="border-t p-5 md:p-6 flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-4 border border-slate-300 rounded-2xl font-medium hover:bg-slate-50 text-base"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-semibold disabled:bg-red-300 text-base"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectPaymentModal;