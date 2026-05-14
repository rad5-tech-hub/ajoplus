// src/features/customer/payments/components/PaymentBankDetails.tsx
import { Copy, Info } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency, convertToUSD } from '@/lib/currency';
import { useGetAjoSettings } from '@/app/store/SettingsStore';

interface PaymentBankDetailsProps {
  onNext: () => void;
  totalAmount?: number;
}

const PaymentBankDetails = ({ onNext, totalAmount = 37500 }: PaymentBankDetailsProps) => {
  const [showToast, setShowToast] = useState(false);
  const { data: settings, isLoading: settingsLoading } = useGetAjoSettings();

  const bankDetails = {
    bankName: settings?.bankName ?? '—',
    accountNumber: settings?.accountNumber ?? '—',
    accountName: settings?.accountName ?? '—',
  };

  const copyToClipboard = (text: string) => {
    if (text === '—') return; // Don't copy placeholder
    navigator.clipboard.writeText(text);
    setShowToast(true);

    setTimeout(() => setShowToast(false), 2000);
  };

  if (settingsLoading) {
    return (
      <div className="space-y-6">
        {/* Amount Card Skeleton */}
        <div className="bg-amber-600 text-white rounded-3xl p-8 text-center">
          <p className="text-amber-100 text-sm font-medium tracking-wider">Amount to Pay</p>
          <p className="text-4xl sm:text-5xl font-bold mt-3 mb-2">{formatCurrency(totalAmount, 'NGN')}</p>
          <p className="text-amber-100 text-lg">{formatCurrency(convertToUSD(totalAmount), 'USD')}</p>
        </div>

        {/* Bank Details Skeleton */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100 animate-pulse">
          <div className="p-6 border-b border-slate-100">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                <div className="h-5 bg-slate-200 rounded w-1/2"></div>
              </div>
              <div className="w-5 h-5 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-amber-100 border border-amber-200 text-amber-800 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg z-50">
          <span>✅</span>
          Copied to clipboard!
        </div>
      )}

      {/* Amount Card */}
      <div className="bg-amber-600 text-white rounded-3xl p-8 text-center">
        <p className="text-amber-100 text-sm font-medium tracking-wider">Amount to Pay</p>
        <p className="text-4xl sm:text-5xl font-bold mt-3 mb-2">{formatCurrency(totalAmount, 'NGN')}</p>
        <p className="text-amber-100 text-lg">{formatCurrency(convertToUSD(totalAmount), 'USD')}</p>
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
            <p className="font-semibold text-blue-950 mt-1">{bankDetails.bankName}</p>
          </div>
          <button
            onClick={() => copyToClipboard(bankDetails.bankName)}
            disabled={bankDetails.bankName === '—'}
            className="text-amber-600 cursor-pointer hover:text-amber-700 p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>

        {/* Account Number */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Account Number</p>
            <p className="font-semibold text-blue-950 mt-1 font-mono tracking-wider">
              {bankDetails.accountNumber}
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(bankDetails.accountNumber)}
            disabled={bankDetails.accountNumber === '—'}
            className="text-amber-600 hover:text-amber-700 p-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>

        {/* Account Name */}
        <div className="p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Account Name</p>
            <p className="font-semibold text-blue-950 mt-1">{bankDetails.accountName}</p>
          </div>
          <button
            onClick={() => copyToClipboard(bankDetails.accountName)}
            disabled={bankDetails.accountName === '—'}
            className="text-amber-600 hover:text-amber-700 p-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
          <h4 className="font-semibold text-blue-950">Important Instructions</h4>
        </div>

        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            Transfer the exact amount shown above
          </li>
          <li className="flex gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            Use the bank details provided
          </li>
          <li className="flex gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            Keep your payment receipt/screenshot
          </li>
          <li className="flex gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            After making payment, click "I've Made Payment" below
          </li>
        </ul>
      </div>

      <button
        onClick={onNext}
        className="w-full cursor-pointer bg-amber-600 hover:bg-amber-700 active:bg-amber-800 transition-all text-white font-semibold py-4.5 rounded-2xl text-lg shadow-sm"
      >
        I've Made Payment
      </button>
    </div>
  );
};

export default PaymentBankDetails;