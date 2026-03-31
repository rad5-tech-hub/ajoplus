// src/features/agent/dashboard/components/PerformanceTips.tsx
import { Check } from 'lucide-react';

const tips = [
  'Share your link on social media platforms',
  'Explain the benefits of AjoPlus to potential users',
  'Follow up with people who click your link',
  'Share success stories from existing users',
];

const PerformanceTips = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 mb-4 sm:mb-5 lg:mb-6">
        Performance Tips
      </h3>

      <div className="space-y-3.5 sm:space-y-4 lg:space-y-5">
        {tips.map((tip, i) => (
          <div key={i} className="flex gap-3 sm:gap-4">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
            </div>
            <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceTips;