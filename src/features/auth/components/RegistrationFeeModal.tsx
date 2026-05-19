import { useState, useRef } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useSubmitRegistrationFee } from '@/app/store/RegistrationFeeStore';
import { useGetAjoSettings } from '@/app/store/SettingsStore';

interface RegistrationFeeModalProps {
  isOpen: boolean;
  userName: string;
  onComplete: () => void;
}

const REGISTRATION_FEE = 1000;

const RegistrationFeeModal = ({ isOpen, userName, onComplete }: RegistrationFeeModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState(String(REGISTRATION_FEE));
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: submitFee, isPending } = useSubmitRegistrationFee();
  const { data: bankSettings, isLoading: bankLoading } = useGetAjoSettings();

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!['image/png', 'image/jpeg', 'application/pdf'].includes(selected.type)) {
        setError('Only PNG, JPG, or PDF files are accepted');
        return;
      }
      if (selected.size > 5 * 1024 * 1024) {
        setError('File must be under 5MB');
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleSubmit = () => {
    setError(null);
    if (!file) { setError('Please upload your proof of payment'); return; }
    if (!amount || parseInt(amount) < REGISTRATION_FEE) { setError(`Minimum amount is ₦${REGISTRATION_FEE.toLocaleString()}`); return; }
    if (!paymentDate) { setError('Please select the date of payment'); return; }

    submitFee(
      { paymentDate, proofFile: file },
      {
        onSuccess: () => {
          setSubmitted(true);
          setTimeout(() => onComplete(), 2000);
        },
        onError: (err: Error) => {
          setError(err.message || 'Failed to submit. Please try again.');
        },
      }
    );
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl w-full max-w-md mx-auto shadow-2xl p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-brand-900 mb-2">Payment Proof Submitted!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Your registration fee proof has been submitted. Your account is pending approval.
            You will be notified once an admin reviews your payment.
          </p>
          <div className="bg-green-100 border border-green-200 rounded-2xl p-4 text-sm text-green-800 mb-6">
            <p className="font-medium">What happens next?</p>
            <p className="mt-1">An admin will review your payment within 24 hours. Once approved, you'll get full access to your account.</p>
          </div>
          <div className="animate-pulse text-sm text-slate-400">Redirecting...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg mx-auto shadow-2xl my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <h2 className="text-lg font-semibold text-brand-900">Registration Fee</h2>
          <div className="w-8" />
        </div>

        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setStep(1)}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors
              ${step === 1 ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Payment Details
          </button>
          <button
            onClick={() => setStep(2)}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors
              ${step === 2 ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Submit Proof
          </button>
        </div>

        <div className="px-5 py-4 sm:px-7">
          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-brand-50 border border-brand-100 rounded-3xl p-6 text-center">
                <p className="text-sm text-slate-500 mb-1">Registration Fee</p>
                <p className="text-3xl font-bold text-brand-900">₦{REGISTRATION_FEE.toLocaleString()}</p>
              </div>

              <div className="bg-white border border-brand-200 rounded-3xl p-5 space-y-4">
                <h3 className="font-semibold text-brand-900">Bank Details</h3>
                {bankLoading ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map((i) => <div key={i} className="h-5 bg-slate-200 rounded w-3/4" />)}
                  </div>
                ) : (
                  [
                    { label: 'Bank Name', value: bankSettings?.bankName || '—' },
                    { label: 'Account Number', value: bankSettings?.accountNumber || '—' },
                    { label: 'Account Name', value: bankSettings?.accountName || '—' },
                    { label: 'Amount', value: `₦${REGISTRATION_FEE.toLocaleString()}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <p className="text-sm text-slate-500">{label}</p>
                      <p className="text-sm font-semibold text-brand-900">{value}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 text-sm text-amber-800">
                <strong>Note:</strong> Transfer the exact amount above to the provided bank account.
                Keep your payment receipt/screenshot for the next step.
              </div>

              <button
            onClick={() => setStep(2)}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-2xl text-sm transition-all active:scale-[0.985]"
              >
                I've Made Payment — Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text" value={userName} disabled
                  className="w-full px-4 py-3 border border-brand-200 rounded-2xl text-sm bg-slate-50 text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount Paid</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₦</span>
                    <input
                      type="number" value={amount} min={REGISTRATION_FEE}
                      onKeyDown={(e) => { if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') e.preventDefault(); }}
                      onChange={(e) => { setAmount(e.target.value.replace(/\D/g, '')); setError(null); }}
                    className="w-full pl-9 pr-4 py-3 border border-brand-200 focus:border-brand-600 rounded-2xl focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Payment</label>
                <input
                  type="date" value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-brand-200 focus:border-brand-600 rounded-2xl focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Proof of Payment</label>
                {!file ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-brand-400 rounded-3xl p-8 text-center cursor-pointer transition-colors"
                  >
                    <Upload className="mx-auto w-8 h-8 text-slate-400 mb-3" />
                    <p className="text-sm text-slate-600 font-medium">Click to upload receipt</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG or PDF (max 5MB)</p>
                  </div>
                ) : (
                  <div className="border-2 border-brand-200 bg-brand-50 rounded-3xl p-5 text-center">
                    <CheckCircle className="mx-auto w-8 h-8 text-brand-600 mb-2" />
                    <p className="text-sm font-medium text-brand-900 truncate max-w-full" title={file.name}>{file.name}</p>
                    <button onClick={() => setFile(null)} className="text-xs text-red-500 hover:text-red-600 mt-2">
                      Remove
                    </button>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,application/pdf" onChange={handleFileSelect} className="hidden" />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold py-3 rounded-2xl text-sm transition-all active:scale-[0.985] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Proof of Payment'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationFeeModal;
