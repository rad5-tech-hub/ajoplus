import { Copy, Info, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '@/lib/currency';
import { useGetAjoSettings } from '@/app/store/SettingsStore';

interface PaymentBankDetailsProps {
  onNext: () => void;
  totalAmount?: number;
}

const PaymentBankDetails = ({ onNext, totalAmount = 37500 }: PaymentBankDetailsProps) => {
  const [showToast, setShowToast] = useState(false);
  const { data: settings, isLoading: settingsLoading } = useGetAjoSettings();

  const bankDetails = {
    bankName: settings?.bankName ?? null,
    accountNumber: settings?.accountNumber ?? null,
    accountName: settings?.accountName ?? null,
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const fields = [
    { label: 'Bank Name', value: bankDetails.bankName },
    { label: 'Account Number', value: bankDetails.accountNumber },
    { label: 'Account Name', value: bankDetails.accountName },
  ];

  return (
    <div className="space-y-6 relative">
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-brand-100 border border-brand-200 text-amber-800 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg z-50">
          <span>✅</span> Copied to clipboard!
        </div>
      )}

      <div className="bg-brand-600 text-white rounded-3xl p-8 text-center">
        <p className="text-brand-100 text-sm font-medium tracking-wider">Amount to Pay</p>
        <p className="text-4xl sm:text-5xl font-bold mt-3 mb-2">{formatCurrency(totalAmount, 'NGN')}</p>
      </div>

      {settingsLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
          <span className="ml-2 text-sm text-slate-500">Loading payment details...</span>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-semibold text-lg mb-6">Payment Information</h3>
          </div>
          {fields.map(({ label, value }) => (
            <div key={label} className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className={`font-semibold text-brand-900 mt-1 ${label === 'Account Number' ? 'font-mono tracking-wider' : ''}`}>
                  {value ?? '—'}
                </p>
              </div>
              {value && (
                <button onClick={() => copyToClipboard(value)}
                  className="text-brand-600 hover:text-brand-700 p-2 cursor-pointer transition-colors" title={`Copy ${label}`}>
                  <Copy className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Info className="w-5 h-5 text-sky-600" />
          </div>
          <h4 className="font-semibold text-brand-900">Important Instructions</h4>
        </div>
        <ul className="space-y-3 text-sm text-slate-600">
          {['Transfer the exact amount shown above', 'Use the bank details provided', 'Keep your payment receipt/screenshot', 'After making payment, click "I\'ve Made Payment" below'].map((item) => (
            <li key={item} className="flex gap-2"><span className="text-brand-600 mt-0.5">•</span>{item}</li>
          ))}
        </ul>
      </div>

      <button onClick={onNext}
        className="w-full cursor-pointer bg-brand-600 hover:bg-brand-700 transition-all text-white font-semibold py-4.5 rounded-2xl text-lg shadow-sm">
        I've Made Payment
      </button>
    </div>
  );
};

export default PaymentBankDetails;
