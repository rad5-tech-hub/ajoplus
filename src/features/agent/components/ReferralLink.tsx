// src/features/agent/dashboard/components/ReferralLink.tsx
import { Link as LinkIcon, Copy, Share2 } from 'lucide-react';

const ReferralLink = () => {
  const referralUrl = "https://ajoplus.com/ref/agent1";

  const copyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    alert("Referral link copied!");
  };

  return (
    <div className="bg-emerald-600 text-white rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <LinkIcon className="w-6 h-6" />
        <h3 className="text-xl font-semibold">Your Referral Link</h3>
      </div>

      <p className="text-emerald-100 text-[15px] leading-relaxed mb-6">
        Share this link with friends and family. You earn ₦4,000 for every person who signs up and buys a package!
      </p>

      <div className="bg-emerald-500/30 rounded-2xl p-4 mb-6">
        <p className="text-xs text-emerald-200 mb-1">Referral URL</p>
        <p className="font-mono text-sm break-all">{referralUrl}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={copyLink}
          className="bg-[#0a2f1f] hover:bg-black text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Copy className="w-5 h-5" />
          Copy Link
        </button>
        <button className="bg-[#0a2f1f] hover:bg-black text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all">
          <Share2 className="w-5 h-5" />
          Share Link
        </button>
      </div>
    </div>
  );
};

export default ReferralLink;