// src/features/landing/sections/HowItWorksSection.tsx
import { UserPlus, Package, TrendingUp } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: UserPlus,
      number: "1",
      title: "Sign Up",
      description: "Create your free account in minutes",
      highlight: "No hidden fees, 100% transparent",
    },
    {
      icon: Package,
      number: "2",
      title: "Choose Package or Start Ajo",
      description: "Select a package or set up daily Ajo savings",
      highlight: "Flexible options for every budget",
    },
    {
      icon: TrendingUp,
      number: "3",
      title: "Contribute & Get Value",
      description: "Make contributions and achieve your goals",
      highlight: "Withdraw or get products when complete",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-950">
            How It Works
          </h2>
          <p className="mt-4 text-xl text-slate-600">
            Three simple steps to start your savings journey
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="group bg-white border border-slate-300 hover:border-emerald-200 shadow-lg rounded-3xl p-10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Top Icon Circle - Exact match to your design */}
                <div className="flex justify-center mb-8">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-emerald-600" strokeWidth={2.25} />
                  </div>
                </div>

                {/* Number + Title - Side by side, no background on number */}
                <div className="flex items-center gap-1 mb-6">
                  <span className="text-2xl font-semibold text-slate-900">
                    {step.number}.
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-[17px] leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Highlight Text */}
                <p className="text-emerald-600 font-medium text-[14px]">
                  {step.highlight}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;