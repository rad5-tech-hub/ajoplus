// src/features/customer/payments/MakePayment.tsx
import { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { formatCurrency } from '@/lib/currency';
import { usePackageById } from '@/app/store/PackageStore';
import PaymentBankDetails from './components/PaymentBankDetails';
import PaymentUploadReceipt from './components/PaymentUploadReceipt';
import { useCartId } from '@/app/store/CartStore';
interface CartItem {
  id: string;
  title: string;
  price: number;
  type: 'package' | 'product';
  quantity: number;
}

const MakePayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { packageId } = useParams<{ packageId: string }>();
  const cartId = useCartId();
  // ── Detect payment mode ────────────────────────────────────────────────
  const isSavingPayment = location.state?.isSavingPayment === true || packageId === 'saving';
  const isCartPayment = location.state?.isCartPayment === true || packageId === 'cart';
  const userPackageId = location.state?.userPackageId as string | undefined;
  const savingsId = location.state?.savingsId as string | undefined;
  const savingPlanId = location.state?.savingPlanId as string | undefined;
  const cartItems: CartItem[] = location.state?.items || [];
  const cartTotal = location.state?.total || 0;
  const savingTotal = location.state?.total || 0;
  const expectedFromState = location.state?.expectedAmount as number | undefined;
  // Pre-fill amount for savings so the user sees their daily amount immediately
  const [amountPaid, setAmountPaid] = useState<string>(
    isSavingPayment ? String(savingTotal) : ''
  );
  const [step, setStep] = useState<1 | 2>(1);

  // Only fetch package data for real package payments
  const shouldFetchPackage =
    !isCartPayment && !isSavingPayment && !!packageId && packageId !== 'cart' && packageId !== 'saving';

  const {
    data: packageData,
    isLoading: packageLoading,
    error: packageError,
  } = usePackageById(shouldFetchPackage ? packageId! : '');

  const { packageName, expectedAmount } = useMemo(() => {
    if (isCartPayment || isSavingPayment || !shouldFetchPackage) {
      return { packageName: '', expectedAmount: 0 };
    }
    // Prefer state-passed installment amount over package total price
    if (expectedFromState) {
      return {
        packageName: packageData?.name ?? '',
        expectedAmount: expectedFromState,
      };
    }
    if (packageData) {
      return {
        packageName: packageData.name,
        expectedAmount: typeof packageData.totalPrice === 'string'
          ? parseFloat(packageData.totalPrice)
          : packageData.totalPrice,
      };
    }
    return { packageName: '', expectedAmount: 0 };
  }, [isCartPayment, isSavingPayment, shouldFetchPackage, packageData, expectedFromState]);

  const pageTitle = isCartPayment ? 'Checkout' : isSavingPayment ? 'Add to Savings' : 'Make Payment';
  const totalAmount = isCartPayment ? cartTotal : isSavingPayment ? savingTotal : expectedAmount;

  const handleBack = () => (step === 2 ? setStep(1) : navigate(-1));
  const handleNext = () => setStep(2);

  // Show loading state while fetching package details
  if (!isCartPayment && packageLoading) {
    return (
      <div className="min-h-screen bg-[#f0f9f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading package details...</p>
        </div>
      </div>
    );
  }

  // Show error state if package fetch failed
  if (!isCartPayment && packageError) {
    return (
      <div className="min-h-screen bg-[#f0f9f4] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-brand-900 mb-2">Unable to Load Package</h2>
          <p className="text-slate-600 mb-6">
            {packageError instanceof Error ? packageError.message : 'Failed to load package details'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-brand-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-brand-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f9f4]">
      {/* Header */}
      <div className="bg-[#f0f9f4] border-b border-brand-200 z-50">
        <div className="max-w-2xl mx-auto px-6 py-5 items-center ">
          <button
            onClick={handleBack}
            className="flex cursor-pointer mb-2 items-center gap-2 text-slate-600 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="font-medium text-sm">Back</span>
          </button>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-brand-900">{pageTitle}</h1>
            <p className="text-slate-600 text-sm mt-0.5">
              {isCartPayment
                ? `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} - ${formatCurrency(totalAmount, 'NGN')}`
                : `${packageName} - ${formatCurrency(totalAmount, 'NGN')}`
              }
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="max-w-2xl mx-auto px-6 pb-6">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step === 1 ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-600'
              }`}>
              1
            </div>
            <div className="h-px flex-1 bg-slate-200"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step === 2 ? 'bg-brand-600 text-white' : 'bg-[var(--color-disabled-bg)] text-[var(--color-disabled-text)]'
              }`}>
              2
            </div>
          </div>
          <div className="flex justify-between text-xs mt-2 text-slate-500 font-medium">
            <span>Bank Details</span>
            <span>Upload Receipt</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-8">
        {step === 1 ? (
          <PaymentBankDetails onNext={handleNext} totalAmount={totalAmount} />
        ) : (
          <PaymentUploadReceipt
            onBack={handleBack}
            amountPaid={amountPaid}
            setAmountPaid={setAmountPaid}
            packageId={packageId ?? ''}
            userPackageId={userPackageId}
            savingPlanId={savingPlanId ?? savingsId}
            packageName={
              isCartPayment ? 'Cart Checkout' : isSavingPayment ? 'Daily Savings' : packageName
            }
            expectedAmount={totalAmount}
            isCartPayment={isCartPayment}
            isSavingPayment={isSavingPayment}
            cartId={isCartPayment ? cartId : undefined}
            cartItems={cartItems}
          />
        )}
      </div>
    </div>
  );
};

export default MakePayment;