// src/features/customer/payments/MakePayment.tsx
import { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { formatCurrency, convertToUSD } from '@/lib/currency';
import { usePackageById } from '@/app/store/PackageStore';
import PaymentBankDetails from './components/PaymentBankDetails';
import PaymentUploadReceipt from './components/PaymentUploadReceipt';

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
  const [step, setStep] = useState<1 | 2>(1);
  const [amountPaid, setAmountPaid] = useState<string>("");

  // Determine if this is a cart payment or package payment
  const isCartPayment = location.state?.isCartPayment || packageId === 'cart';
  const cartItems: CartItem[] = location.state?.items || [];
  const cartTotal = location.state?.total || 0;

  // Fetch package details dynamically if not a cart payment
  // Only fetch if it's not a cart payment and we have a valid packageId
  const shouldFetchPackage = !isCartPayment && packageId && packageId !== 'cart';
  const { data: packageData, isLoading: packageLoading, error: packageError } = usePackageById(
    shouldFetchPackage ? packageId : ''
  );

  // Memoize package name and amount to prevent unnecessary re-renders
  const { packageName, expectedAmount } = useMemo(() => {
    if (isCartPayment || !shouldFetchPackage) {
      return { packageName: '', expectedAmount: 0 };
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
  }, [isCartPayment, shouldFetchPackage, packageData]);

  // Determine the page title and total amount
  const pageTitle = isCartPayment ? 'Checkout' : 'Make Payment';
  const totalAmount = isCartPayment ? cartTotal : expectedAmount;

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  const handleNext = () => setStep(2);

  // Show loading state while fetching package details
  if (!isCartPayment && packageLoading) {
    return (
      <div className="min-h-screen bg-[#f0f9f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mx-auto mb-4"></div>
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Unable to Load Package</h2>
          <p className="text-slate-600 mb-6">
            {packageError instanceof Error ? packageError.message : 'Failed to load package details'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors"
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
      <div className="bg-[#f0f9f4] border-b border-slate-200 z-50">
        <div className="max-w-2xl mx-auto px-6 py-5 items-center ">
          <button
            onClick={handleBack}
            className="flex cursor-pointer mb-2 items-center gap-2 text-slate-600 hover:text-emerald-900 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="font-medium text-sm">Back</span>
          </button>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
            <p className="text-slate-600 text-sm mt-0.5">
              {isCartPayment
                ? `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} - ${formatCurrency(totalAmount, 'NGN')} (${formatCurrency(convertToUSD(totalAmount), 'USD')})`
                : `${packageName} - ${formatCurrency(totalAmount, 'NGN')} (${formatCurrency(convertToUSD(totalAmount), 'USD')})`
              }
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="max-w-2xl mx-auto px-6 pb-6">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step === 1 ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'
              }`}>
              1
            </div>
            <div className="h-px flex-1 bg-slate-200"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
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
          <PaymentBankDetails
            onNext={handleNext}
            totalAmount={totalAmount}
          />
        ) : (
          <PaymentUploadReceipt
            onBack={handleBack}
            amountPaid={amountPaid}
            setAmountPaid={setAmountPaid}
            packageId={packageId!}
            packageName={isCartPayment ? 'Cart Checkout' : packageName}
            expectedAmount={totalAmount}
            isCartPayment={isCartPayment}
            cartItems={cartItems}
          />
        )}
      </div>
    </div>
  );
};

export default MakePayment;