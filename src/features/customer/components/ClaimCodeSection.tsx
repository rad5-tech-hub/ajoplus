import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ClaimCodeSectionProps {
  claimCode: string;
  claimIssuedAt: string;
}

const ClaimCodeSection = ({ claimCode, claimIssuedAt }: ClaimCodeSectionProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(claimCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — silently fail
    }
  };

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mt-4">
      <div className="flex items-start gap-2 mb-3">
        <span className="text-lg">🎁</span>
        <div>
          <p className="text-emerald-700 font-semibold text-sm">Your Package is Ready to Claim!</p>
          <p className="text-emerald-600 text-xs mt-0.5">Use this code when your package arrives:</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 bg-white border border-emerald-300 rounded-xl px-4 py-2.5 font-mono text-lg font-bold text-slate-900 tracking-widest select-all">
          {claimCode}
        </div>
        <button
          onClick={handleCopy}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? (
            <><Check className="w-4 h-4" /> Copied ✓</>
          ) : (
            <><Copy className="w-4 h-4" /> Copy</>
          )}
        </button>
      </div>

      <p className="text-slate-500 text-xs mt-2">
        Issued: {new Date(claimIssuedAt).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric'
        })}
      </p>
    </div>
  );
};

export default ClaimCodeSection;
