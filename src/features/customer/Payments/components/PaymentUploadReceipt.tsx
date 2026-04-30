// src/features/customer/payments/components/PaymentUploadReceipt.tsx
import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { formatCurrency, convertToUSD } from '@/lib/currency';
import { type SubmitPaymentRequest, type PaymentType } from '@/api/payments';
import { useSubmitPayment } from '@/app/store/PaymentStore';
import { useCartStore, useClearCart } from '@/app/store/CartStore';
import { useQueryClient } from '@tanstack/react-query';
import PaymentSuccess from '@/components/ui/PaymentSuccess';

interface CartItem {
  id: string;
  title: string;
  price: number;
  type: 'package' | 'product';
  quantity: number;
}

interface PaymentUploadReceiptProps {
  onBack: () => void;
  amountPaid: string;
  setAmountPaid: (amount: string) => void;
  packageId: string;
  packageName?: string;
  expectedAmount?: number;
  isCartPayment?: boolean;
  cartItems?: CartItem[];
}

const PaymentUploadReceipt = ({
  onBack,
  amountPaid,
  setAmountPaid,
  packageId,
  expectedAmount = 0,
  isCartPayment = false,
  cartItems = [],
}: PaymentUploadReceiptProps) => {

  const { mutate: submitPaymentMutation, isPending: isSubmitting } = useSubmitPayment();

  const { clearCart: clearCartLocal } = useCartStore();
  const { mutate: clearCartAPI } = useClearCart();
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File handlers ─────────────────────────────────────────────────────────
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
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submit Handler ───────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!amountPaid || !file || !packageId) return;

    const paymentType: PaymentType = isCartPayment ? 'cart' : 'package';

    const payload: SubmitPaymentRequest = {
      receipt: file,
      amountPaid,
      userPackageId: packageId,           // Critical field
      paymentType,
      expectedAmount: String(expectedAmount),
      packageId: isCartPayment ? undefined : packageId,
      cartItems: isCartPayment && cartItems.length > 0
        ? JSON.stringify(
          cartItems.map((item) => ({
            itemId: item.id,
            itemName: item.title,
            itemPrice: item.price,
            itemType: item.type,
            quantity: item.quantity,
          }))
        )
        : undefined,
    };

    submitPaymentMutation(payload, {
      onSuccess: () => {
        if (isCartPayment) {
          clearCartLocal();
          clearCartAPI(undefined, {
            onError: (err) => console.error('[Clear cart error]', err),
          });
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
        setTimeout(() => setIsSubmitted(true), 1800);
      },
      onError: (err: Error) => {
        console.error('[Submit payment error]', err);
        // Error modal is handled automatically by useSubmitPayment hook
      },
    });
  };

  // ── Computed values ───────────────────────────────────────────────────────
  const canSubmit = !!amountPaid && !!file && !isSubmitting;
  const isButtonDisabled = !canSubmit || isSubmitting;

  // Success screen
  if (isSubmitted) return <PaymentSuccess />;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-slate-100">
        <h2 className="text-2xl font-semibold text-slate-900 mb-8">Upload Payment Receipt</h2>

        {/* Amount Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Amount Paid <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="Enter amount"
            disabled={isSubmitting}
            className="w-full bg-white border-2 border-emerald-500 focus:border-emerald-600 rounded-2xl px-5 py-4 text-lg focus:outline-none transition-all disabled:opacity-50"
          />
          <p className="text-xs text-slate-500 mt-2">
            Expected: {formatCurrency(expectedAmount, 'NGN')} (
            {formatCurrency(convertToUSD(expectedAmount), 'USD')})
          </p>
        </div>

        {/* File Upload Area */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Payment Receipt <span className="text-red-500">*</span>
          </label>

          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isSubmitting && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer min-h-48 flex flex-col items-center justify-center 
                ${isDragging ? 'border-emerald-600 bg-emerald-50' : 'border-slate-300 hover:border-slate-400'}
                ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                <Upload className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG or PDF (max. 5MB)</p>
              <button
                type="button"
                className="mt-8 bg-slate-900 hover:bg-slate-800 transition-colors text-white px-8 py-3 rounded-2xl font-medium text-sm"
              >
                Choose File
              </button>
            </div>
          ) : (
            <div className="border-2 border-emerald-200 bg-emerald-50 rounded-3xl p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <button
                onClick={removeFile}
                disabled={isSubmitting}
                className="text-red-600 hover:text-red-700 text-sm mt-3 font-medium disabled:opacity-50"
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

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-sm">
          <p className="text-amber-800">
            <strong>Note:</strong> Your payment will be reviewed and approved within 24 hours.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-colors"
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          className={`flex-1 font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 
            ${isButtonDisabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-[0.985]'
            }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Submit Receipt
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentUploadReceipt;