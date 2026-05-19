import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, ArrowLeft, Receipt } from 'lucide-react';
import { formatCurrency, convertToUSD } from '@/lib/currency';

interface PaymentSuccessProps {
  amount?: string;
  paymentType?: 'package' | 'product' | 'saving';
  packageName?: string;
  onBackToDashboard?: () => void;
}

const PAYMENT_TYPE_LABELS: Record<string, { label: string; emoji: string; description: string }> = {
  package: {
    label: 'Package Payment',
    emoji: '📦',
    description: 'Your package subscription receipt has been submitted.',
  },
  product: {
    label: 'Product Purchase',
    emoji: '🛍️',
    description: 'Your cart receipt has been submitted for review.',
  },
  saving: {
    label: 'Daily Savings',
    emoji: '🐷',
    description: 'Your savings contribution receipt has been submitted.',
  },
};

const PaymentSuccess = ({
  amount,
  paymentType = 'package',
  packageName,
  onBackToDashboard,
}: PaymentSuccessProps) => {
  const navigate = useNavigate();
  const meta = PAYMENT_TYPE_LABELS[paymentType];
  const parsedAmount = amount ? parseFloat(amount) : null;

  const handleBack = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    } else {
      navigate('/dashboard/customer');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center pt-8 px-4">
      <div className="w-full max-w-md space-y-4">

        {/* Main success card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-sm">

          {/* Animated check icon */}
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-brand-900 mb-2">Receipt Submitted!</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            {meta.description}
          </p>
        </div>

        {/* Detail card */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          {/* Payment type pill */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{meta.emoji}</span>
              <div className="text-left">
                <p className="font-semibold text-brand-900">{meta.label}</p>
                {packageName && (
                  <p className="text-sm text-slate-500 mt-0.5">{packageName}</p>
                )}
              </div>
              <span className="ml-auto inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 border border-yellow-100 text-xs font-medium px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                Pending Review
              </span>
            </div>
          </div>

          {/* Amount row */}
          {parsedAmount && parsedAmount > 0 && (
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-xs text-slate-400 mb-1">Amount Submitted</p>
              <p className="text-2xl font-bold text-brand-600">
                {formatCurrency(parsedAmount, 'NGN')}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                ≈ {formatCurrency(convertToUSD(parsedAmount), 'USD')}
              </p>
            </div>
          )}

          {/* Timeline */}
          <div className="px-6 py-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-green-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Receipt className="w-3.5 h-3.5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-900">Receipt received</p>
                <p className="text-xs text-slate-400 mt-0.5">Just now</p>
              </div>
            </div>

            <div className="ml-3.5 my-1 h-5 w-px bg-slate-200" />

            <div className="flex items-start gap-3 opacity-40">
              <div className="w-7 h-7 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-900">Admin review</p>
                <p className="text-xs text-slate-400 mt-0.5">Within 24 hours</p>
              </div>
            </div>

            <div className="ml-3.5 my-1 h-5 w-px bg-slate-200" />

            <div className="flex items-start gap-3 opacity-40">
              <div className="w-7 h-7 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-900">Payment approved</p>
                <p className="text-xs text-slate-400 mt-0.5">You'll get a notification</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleBack}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 active:scale-[0.985] transition-all text-white font-semibold py-4 rounded-2xl text-base cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;