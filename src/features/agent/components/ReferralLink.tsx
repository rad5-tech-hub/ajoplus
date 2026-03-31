// src/features/agent/dashboard/components/ReferralLink.tsx
import { useState } from 'react';
import { Link as LinkIcon, Copy, Share2, Check } from 'lucide-react';

const ReferralLink = () => {
  const referralUrl = 'https://ajoplus.com/ref/agent1';
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-emerald-600 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5 lg:mb-6">
        <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold">Your Referral Link</h3>
      </div>

      {/* Description */}
      <p className="text-emerald-100 text-sm sm:text-[15px] leading-relaxed mb-4 sm:mb-5 lg:mb-6">
        Share this link with friends and family. You earn{' '}
        <span className="font-semibold text-white">₦4,000</span> for every person
        who signs up and buys a package!
      </p>

      {/* URL box */}
      <div className="bg-white/15 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-5 lg:mb-6">
        <p className="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-wide mb-1">
          Referral URL
        </p>
        <p className="font-mono text-xs sm:text-sm break-all leading-relaxed">
          {referralUrl}
        </p>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={copyLink}
          className="bg-emerald-950 hover:bg-black text-white py-3 sm:py-3.5 lg:py-4 px-3 rounded-xl sm:rounded-2xl text-sm sm:text-[15px] font-semibold flex items-center justify-center gap-2 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="">Copied!</span>
              {/* <span className="xs:hidden">✓</span> */}
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <button className="bg-emerald-950 hover:bg-black text-white py-3 sm:py-3.5 lg:py-4 px-3 rounded-xl sm:rounded-2xl text-sm sm:text-[15px] font-semibold flex items-center justify-center gap-2 transition-all">
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>Share Link</span>
        </button>
      </div>
    </div>
  );
};

export default ReferralLink;