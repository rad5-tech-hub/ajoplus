// src/features/landing/sections/DailyAjoSection.tsx
import { Check } from 'lucide-react';
import img from '@/assets/dailyajo.jpg';
import { Rocket, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const DailyAjoSection = () => {
  return (
    <section className="py-12 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Badge */}
            <span className="inline-block px-5 py-1.5 text-emerald-700 text-sm font-semibold rounded-full tracking-widest">
              TRADITIONAL AJO, DIGITAL EXPERIENCE
            </span>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-950 leading-none">
              Daily Ajo Savings
            </h2>

            {/* Description */}
            <p className="text-xl text-slate-600 max-w-lg">
              Save ₦500 daily and withdraw anytime. Only 5% monthly service fee.
            </p>

            {/* Example Calculation Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">💡</span>
                <span className="font-semibold text-slate-900">Example Calculation:</span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Daily Savings:</span>
                  <span className="font-medium text-slate-900">₦500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly Total:</span>
                  <span className="font-medium text-slate-900">₦15,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Service Fee (5%):</span>
                  <span className="font-medium text-red-600">₦750</span>
                </div>

                <div className="border-t border-slate-200 pt-4 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">You Get:</span>
                    <span className="text-2xl font-bold text-emerald-600">₦14,250</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-slate-700">Automated daily collections</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-slate-700">Withdraw after 30 days</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-slate-700">Transparent 5% service fee</span>
              </div>
            </div>

            {/* CTA Button - Now passes state to trigger modal */}
            <Link
              to="/dashboard/customer?openDailyAjo=true"
              className="cursor-pointer mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-2xl flex items-center gap-2 transition-all active:scale-[0.985]"
            >
              <span className="text-white">🤝</span>
              Start Saving
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="rounded-3xl overflow-hidden shadow-2xl max-w-137.5">
              <img
                src={img}
                alt="Person using mobile banking for Ajo savings"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Investment Opportunities section unchanged */}
        <div className="mt-30 bg-emerald-100/60 rounded-3xl p-10 md:p-14 text-center mx-auto max-w-[85%] border border-emerald-200">
          <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
            <Rocket className='h-12 w-12 text-emerald-300' />
          </div>

          <h3 className="text-3xl font-bold tracking-tight text-slate-950 mb-4">
            Investment Opportunities
          </h3>

          <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
            Coming Soon: Grow your wealth with secure investment options. From low-risk savings
            bonds to high-yield opportunities.
          </p>

          <div className="inline-flex items-center gap-2 mt-8 px-6 py-2.5 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-700">
            <Zap className="text-emerald-600"></Zap>
            Launching Q3 2026
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyAjoSection;