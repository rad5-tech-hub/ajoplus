// src/features/customer/dashboard/components/DailyAjoSetupModal.tsx
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useDailyAjoStore } from '@/app/store/DailyAjoStore';
import { useModalStore } from '@/app/store/ModalStore';

interface DailyAjoSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DailyAjoSetupModal = ({ isOpen, onClose }: DailyAjoSetupModalProps) => {
  const [dailyAmount, setDailyAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const startDailyAjo = useDailyAjoStore((state) => state.startDailyAjo);
  const { openModal, closeModal } = useModalStore();

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setDailyAmount('');
      setDescription('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(dailyAmount);

    if (!amount || amount < 100) {
      openModal({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount of at least ₦100.',
      });
      return;
    }

    try {
      startDailyAjo(amount);

      openModal({
        type: 'success',
        title: 'Daily Ajo Activated!',
        message: `You are now saving ₦${amount.toLocaleString()} daily. 5% monthly commission applies.`,
      });

      setTimeout(() => {
        closeModal();
        onClose();
      }, 1200);

    } catch {
      openModal({
        type: 'error',
        title: 'Something went wrong',
        message: 'Could not start your Daily Ajo. Please try again.',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-3xl w-full max-w-2xl mx-auto shadow-2xl transition-all duration-300 my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <button
            onClick={onClose}
            className="p-1.5 -ml-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-slate-900">Start Daily Ajo</h2>
          <div className="w-8" />
        </div>

        {/* Content */}
        <div className="px-5 py-4 sm:px-7">
          <p className="text-slate-500 text-sm text-center mb-4">
            How much would you like to save daily?{' '}
            <span className="font-medium text-emerald-700">5% monthly service fee</span> applies.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Daily Savings Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₦</span>
                <input
                  type="number"
                  value={dailyAmount}
                  onChange={(e) => setDailyAmount(e.target.value)}
                  placeholder="500"
                  className="w-full pl-9 pr-5 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 text-base font-medium placeholder:text-slate-400"
                  min="100"
                  required
                />
              </div>
              <p className="text-xs text-slate-400 mt-1 pl-1">Minimum ₦100 per day</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Purpose <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. School fees, business capital, emergency fund..."
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 h-20 resize-none text-sm leading-relaxed"
              />
            </div>

            {/* Example Note */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 text-sm">
              <span className="text-emerald-700 font-medium">Example: </span>
              <span className="text-slate-600">₦500/day = ₦15,000/month → ₦750 fee → You keep ₦14,250</span>
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.985] text-white font-semibold py-3 rounded-2xl text-sm transition-all duration-200"
            >
              Start Saving Daily
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DailyAjoSetupModal;