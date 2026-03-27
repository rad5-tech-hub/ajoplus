// src/features/agent/dashboard/components/PerformanceTips.tsx
import { Check } from 'lucide-react';

const PerformanceTips = () => {
  const tips = [
    "Share your link on social media platforms",
    "Explain the benefits of AjoPlus to potential users",
    "Follow up with people who click your link",
    "Share success stories from existing users",
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8">
      <h3 className="text-2xl font-semibold text-slate-900 mb-6">Performance Tips</h3>
      
      <div className="space-y-5">
        {tips.map((tip, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-6 h-6 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-slate-700 text-[15px] leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceTips;