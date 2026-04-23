    import { CheckCircle } from 'lucide-react';

interface PaymentApprovedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentApprovedModal = ({ isOpen, onClose }: PaymentApprovedModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-200 flex items-center justify-center p-4">
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl max-w-sm w-full p-8 md:p-10 text-center">
        <CheckCircle className="w-14 h-14 md:w-16 md:h-16 text-emerald-600 mx-auto" />
        <h3 className="text-2xl md:text-3xl font-bold text-emerald-700 mt-6">
          Payment Approved!
        </h3>
        <p className="text-emerald-600 mt-2 text-base">
          This payment has been successfully approved.
        </p>
        <button
          onClick={onClose}
          className="mt-8 w-full py-4 text-base bg-emerald-600 text-white font-semibold rounded-2xl active:scale-95 transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default PaymentApprovedModal;