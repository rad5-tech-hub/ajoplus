import { X, Clock } from 'lucide-react';
import { useAuthStore } from '@/app/store/authStore';

interface AjoSetupBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AjoSetupBlockModal = ({ isOpen, onClose }: AjoSetupBlockModalProps) => {
  const { user } = useAuthStore();

  if (!isOpen) return null;
  if (user?.role !== 'customer') return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md mx-auto shadow-2xl p-8 text-center">
        <button
          onClick={onClose}
          className="float-right p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-brand-600" />
        </div>

        <h2 className="text-xl font-bold text-brand-900 mb-2">Registration Fee Required</h2>

        <p className="text-slate-500 text-sm mb-6">
          Your registration fee payment is pending admin approval. You will be able to set up Ajo once your payment is approved.
        </p>

        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 text-sm text-amber-800 mb-6">
          <p className="font-medium">Already submitted?</p>
          <p className="mt-1">Payments are reviewed within 24 hours. Please check back later.</p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-2xl text-sm transition-all active:scale-[0.985] cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default AjoSetupBlockModal;
