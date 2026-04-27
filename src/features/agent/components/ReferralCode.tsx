// src/features/agent/dashboard/components/ReferralCode.tsx
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const ReferralCode = () => {
  const referralCode = 'AGENT-ADEBAYO';
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1.5 sm:mb-2">
        Your Referral Code
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-5 lg:mb-6">
        Users can enter this code during signup
      </p>

      <div className="bg-white border border-emerald-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 lg:p-5 text-center mb-4 sm:mb-5 lg:mb-6">
        <p className="text-lg sm:text-2xl font-bold tracking-widest text-emerald-700">
          {referralCode}
        </p>
      </div>

      <button
        onClick={copyCode}
        className="w-full border cursor-pointer border-emerald-600 text-emerald-600 hover:bg-emerald-100 font-semibold
                   py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl
                   flex items-center justify-center gap-2
                   text-sm sm:text-[15px] transition-all"
      >
        {copied
          ? <><Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> Copied!</>
          : <><Copy className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> Copy Code</>
        }
      </button>
    </div>
  );
};

export default ReferralCode;