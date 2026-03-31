// src/features/customer/payments/MakePayment.tsx
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PaymentBankDetails from './components/PaymentBankDetails';
import PaymentUploadReceipt from './components/PaymentUploadReceipt';

const MakePayment = () => {
  const navigate = useNavigate();
  const { packageId } = useParams<{ packageId: string }>();
  const [step, setStep] = useState<1 | 2>(1);
  const [amountPaid, setAmountPaid] = useState<string>("");

  const packageName = "Smart Phone Package";

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(`/dashboard/customer/package/${packageId}`);
    }
  };

  const handleNext = () => setStep(2);	

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
            <h1 className="text-2xl font-bold text-slate-900">Make Payment</h1>
            <p className="text-slate-600 text-sm mt-0.5">{packageName}</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="max-w-2xl mx-auto px-6 pb-6">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              step === 1 ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'
            }`}>
              1
            </div>
            <div className="h-px flex-1 bg-slate-200"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              step === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
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
          <PaymentBankDetails onNext={handleNext} />
        ) : (
          <PaymentUploadReceipt 
            onBack={handleBack} 
            amountPaid={amountPaid} 
            setAmountPaid={setAmountPaid}
            packageId={packageId!}
			packageName={packageName}
          />
        )}
      </div>
    </div>
  );
};

export default MakePayment;