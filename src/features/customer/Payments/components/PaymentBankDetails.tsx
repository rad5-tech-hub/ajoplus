// src/features/customer/payments/components/PaymentBankDetails.tsx
import { Copy, Info } from 'lucide-react';
import { useState } from 'react';

interface PaymentBankDetailsProps {
  onNext: () => void;
}

const PaymentBankDetails = ({ onNext }: PaymentBankDetailsProps) => {
  const [showToast, setShowToast] = useState(false);
//   const [copiedText, setCopiedText] = useState("");

  const bankDetails = {
    bankName: "GTBank",
    accountNumber: "0123456789",
    accountName: "AjoPlus Technologies Ltd",
    amount: "₦37,500",
  };

  const copyToClipboard = (text: string,) => {
    navigator.clipboard.writeText(text);
    // setCopiedText(label);
    setShowToast(true);
    
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-100 border border-emerald-200 text-emerald-800 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg z-50">
          <span>✅</span>
          Copied to clipboard!
        </div>
      )}

      {/* Amount Card - unchanged */}
      <div className="bg-emerald-600 text-white rounded-3xl p-8 text-center">
        <p className="text-emerald-100 text-sm font-medium tracking-wider">Amount to Pay</p>
        <p className="text-5xl font-bold mt-3 mb-1">{bankDetails.amount}</p>
        <p className="text-emerald-100">Weekly Payment</p>
      </div>
 {/* Bank Details Cards */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-semibold text-lg mb-6">Payment Information</h3>
        </div>

        {/* Bank Name */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Bank Name</p>
            <p className="font-semibold text-slate-900 mt-1">{bankDetails.bankName}</p>
          </div>
          <button 
            onClick={() => copyToClipboard(bankDetails.bankName)}
            className="text-emerald-600 cursor-pointer hover:text-emerald-700 p-2 transition-colors"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>

        {/* Account Number */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Account Number</p>
            <p className="font-semibold text-slate-900 mt-1 font-mono tracking-wider">
              {bankDetails.accountNumber}
            </p>
          </div>
          <button 
            onClick={() => copyToClipboard(bankDetails.accountNumber)}
            className="text-emerald-600 hover:text-emerald-700 p-2 cursor-pointer transition-colors"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>

        {/* Account Name */}
        <div className="p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Account Name</p>
            <p className="font-semibold text-slate-900 mt-1">{bankDetails.accountName}</p>
          </div>
          <button 
            onClick={() => copyToClipboard(bankDetails.accountName)}
            className="text-emerald-600 hover:text-emerald-700 p-2 transition-colors cursor-pointer"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Important Instructions - slightly refined */}
      <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Info className="w-5 h-5 text-sky-600" />
          </div>
          <h4 className="font-semibold text-slate-900">Important Instructions</h4>
        </div>
        
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            Transfer the exact amount shown above
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            Use the bank details provided
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            Keep your payment receipt/screenshot
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            After making payment, click "I've Made Payment" below
          </li>
        </ul>
      </div>

      <button 
        onClick={onNext}
        className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all text-white font-semibold py-4.5 rounded-2xl text-lg shadow-sm"
      >
        I've Made Payment
      </button>
    </div>
  );
};

export default PaymentBankDetails;