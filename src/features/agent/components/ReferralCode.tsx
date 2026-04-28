// src/features/agent/dashboard/components/ReferralCode.tsx
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAgentDashboard } from '@/api/agent';
import { useModalStore } from '@/app/store/ModalStore';

const ReferralCode = () => {
  const [copied, setCopied] = useState(false);
  const openModal = useModalStore((state) => state.openModal);

  const { data, isLoading, error } = useQuery({
    queryKey: ['agentDashboard'],
    queryFn: getAgentDashboard,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const referralCode = data?.referral?.code ?? '';

  const copyCode = async () => {
    if (!referralCode) return;

    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      openModal({
        type: 'success',
        title: 'Success',
        message: 'Referral code copied successfully!',
      });
    } catch {
      openModal({
        type: 'error',
        title: 'Copy Failed',
        message: 'Failed to copy code. Please try again.',
      });
    }
  };

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 text-sm">Failed to load referral code</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-xs text-red-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1.5 sm:mb-2">
        Your Referral Code
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-5 lg:mb-6">
        Users can enter this code during signup
      </p>

      <div className="bg-white border border-emerald-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 lg:p-5 text-center mb-4 sm:mb-5 lg:mb-6 min-h-[60px] flex items-center justify-center">
        {isLoading ? (
          <div className="h-7 w-40 bg-emerald-100 rounded-full animate-pulse" />
        ) : (
          <p className="text-lg sm:text-2xl font-bold tracking-widest text-emerald-700">
            {referralCode || 'AGENT-XXXX-XXXX'}
          </p>
        )}
      </div>

      <button
        onClick={copyCode}
        disabled={isLoading || !referralCode}
        className="w-full border cursor-pointer border-emerald-600 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 disabled:pointer-events-none font-semibold py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-[15px] transition-all active:scale-95"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> Copy Code
          </>
        )}
      </button>
    </div>
  );
};

export default ReferralCode;