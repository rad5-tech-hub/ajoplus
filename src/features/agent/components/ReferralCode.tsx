// src/features/agent/dashboard/components/ReferralCode.tsx
import { Copy } from 'lucide-react';

const ReferralCode = () => {
  const referralCode = "AGENT-ADEBAYO";

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Referral code copied to clipboard!");
  };

  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Your Referral Code</h3>
      <p className="text-sm text-slate-500 mb-6">Users can enter this code during signup</p>

      <div className="bg-white border border-emerald-200 rounded-2xl p-5 text-center mb-6">
        <p className="text-2xl font-bold tracking-widest text-emerald-700">{referralCode}</p>
      </div>

      <button
        onClick={copyCode}
        className="w-full border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
      >
        <Copy className="w-5 h-5" />
        Copy Code
      </button>
    </div>
  );
};

export default ReferralCode;