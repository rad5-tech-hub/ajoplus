// src/features/customer/payments/components/UploadReceiptModal.tsx
import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { useSubmitPayment } from '@/app/store/PaymentStore';
import type { PaymentType } from '@/api/payments';

interface UploadReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedAmount: string;
  userPackageId?: string;
  paymentType?: PaymentType;
  cartId?: string;
  onSuccess: (amount: string) => void;
}

const UploadReceiptModal = ({
  isOpen,
  onClose,
  recommendedAmount,
  userPackageId,
  paymentType = 'package',
  cartId,
  onSuccess,
}: UploadReceiptModalProps) => {
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: submitPayment, isPending } = useSubmitPayment();

  if (!isOpen) return null;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && ['image/png', 'image/jpeg', 'application/pdf'].includes(dropped.type)) {
      setFile(dropped);
      setSubmitError(null);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setSubmitError(null);
    }
  };

  const removeFile = () => setFile(null);

  const handleSubmit = () => {
    if (!amount || !file) return;
    setSubmitError(null);

    submitPayment(
      {
        receipt: file,
        amountPaid: amount,
        paymentType,
        ...(paymentType === 'package' && userPackageId && { userPackageId }),
        ...(paymentType === 'product' && cartId && { cartId }),
      },
      {
        onSuccess: () => {
          onSuccess(amount);
          onClose();
        },
        onError: (err: Error) => {
          setSubmitError(err.message || 'Failed to submit receipt. Please try again.');
        },
      }
    );
  };

  const canSubmit = !!amount && !!file && !isPending;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b">
          <h2 className="text-2xl font-semibold text-brand-900">Upload Receipt</h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {submitError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{submitError}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Receipt Image</p>
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isPending && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-brand-400 rounded-2xl p-10 text-center
                  transition-all cursor-pointer min-h-44 flex flex-col items-center justify-center
                  ${isDragging ? 'bg-brand-50 border-brand-600' : 'hover:border-brand-500'}
                  ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <Upload className="w-12 h-12 text-brand-500 mb-4" />
                <p className="font-medium text-slate-700">Click to upload receipt</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG or PDF up to 5MB</p>
              </div>
            ) : (
              <div className="border-2 border-brand-200 bg-brand-50 rounded-2xl p-6 text-center">
                <div className="text-brand-600 mb-2 font-medium">✓ File selected</div>
                <p className="text-sm text-brand-900 truncate max-w-full" title={file.name}>{file.name}</p>
                <button
                  onClick={removeFile}
                  disabled={isPending}
                  className="text-red-600 text-sm mt-3 hover:underline disabled:opacity-50 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Amount Paid</p>
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value.replace(/[^0-9.]/g, ''));
                setSubmitError(null);
              }}
              placeholder="Enter amount"
              disabled={isPending}
              className="w-full border border-brand-200 focus:border-brand-500 rounded-2xl px-5 py-4
                text-lg focus:outline-none transition-colors disabled:opacity-50"
            />
            <p className="text-xs text-slate-500 mt-2">Recommended: {recommendedAmount}</p>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t bg-slate-50">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 border-2 border-slate-300 hover:bg-slate-100 font-medium py-3.5
              rounded-2xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`flex-1 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2
              transition-all ${
                canSubmit
                  ? 'bg-brand-600 hover:bg-brand-700 text-white'
                  : 'bg-[var(--color-disabled-bg)] text-[var(--color-disabled-text)] cursor-not-allowed'
              }`}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" /> Submit Receipt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadReceiptModal;