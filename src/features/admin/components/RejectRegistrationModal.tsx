import { useState } from 'react';
import { X } from 'lucide-react';

interface RejectRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending: boolean;
  error: string | null;
}

const RejectRegistrationModal = ({ isOpen, onClose, onConfirm, isPending, error }: RejectRegistrationModalProps) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const isValid = reason.trim().length >= 10;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md mx-auto shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-brand-900">Reject Registration Fee</h3>
          <button onClick={onClose} disabled={isPending} className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-500 mb-4">Provide a reason for rejecting this registration fee payment. The user will see this reason.</p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter rejection reason (minimum 10 characters)..."
          disabled={isPending}
          className="w-full px-4 py-3 border border-brand-200 focus:border-red-400 rounded-2xl focus:outline-none h-28 resize-none text-sm disabled:opacity-50"
        />

        {reason.trim().length > 0 && reason.trim().length < 10 && (
          <p className="text-xs text-red-500 mt-1">Minimum 10 characters required ({reason.trim().length}/10)</p>
        )}

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 border border-slate-300 text-slate-700 font-semibold py-3 rounded-2xl text-sm hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason.trim())}
            disabled={!isValid || isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 rounded-2xl text-sm transition-all disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? 'Rejecting...' : 'Confirm Reject'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectRegistrationModal;
