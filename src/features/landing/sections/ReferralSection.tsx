// src/features/landing/sections/ReferralSection.tsx
import { Gift, UserPlus } from 'lucide-react';

const ReferralSection = () => {
  return (
    <section className="py-24 bg-emerald-600">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Gift Icon */}
        <div className="mx-auto mb-8 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <Gift className="w-10 h-10 text-white" strokeWidth={2} />
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">
          Earn by Referring Others
        </h2>

        {/* Description */}
        <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-12">
          Become an agent and earn ₦4,000 for every person who joins and buys a 
          package through your referral link.
        </p>

        {/* CTA Button */}
        <button className="group inline-flex items-center gap-3 cursor-pointer bg-white hover:bg-white/95 text-emerald-700 font-semibold text-lg px-10 py-4 rounded-2xl transition-all active:scale-[0.985]">
          <UserPlus className="w-6 h-6 " strokeWidth={2.5} />
          Become an Agent
        </button>
      </div>
    </section>
  );
};

export default ReferralSection;