import { Link } from "react-router-dom";

// src/features/landing/sections/HeroSection.tsx
const HeroSection = () => {
  return (
    <section className="bg-emerald-100/20 pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 leading-none">
              Save Smart.<br />
              Contribute Easily.
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-md">
              Join digital Ajo and structured savings packages. Achieve your financial goals with flexible contributions that fit your budget.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link to="/signup"
              onClick={() => window.location.href = '/signup'}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-200"
            >
              Get Started
            </Link>

            <a href="#packages"
              className="px-8 py-4 border-2 border-emerald-600 text-emerald-700 font-semibold text-base rounded-2xl hover:bg-emerald-50 transition-all active:scale-[0.98]"
            >
              Explore Packages
            </a>
          </div>

          {/* Trust Bar */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-medium border-2 border-white"
                >
                  {i}
                </div>
              ))}
            </div>
            <div>
              <p className="font-semibold text-slate-900">1,200+ Happy Savers</p>
              <p className="text-sm text-slate-500">Join them today!</p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative flex justify-center md:justify-end">
          <div className="relative w-full max-w-105 md:max-w-none">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
              alt="Happy woman saving with AjoPlus"
              className="w-full h-auto rounded-3xl shadow-2xl"
              loading="eager"
            />
            
            {/* Subtle decorative overlay for premium feel */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  📱
                </div>
                <div>
                  <p className="font-medium text-sm">Instant Contributions</p>
                  <p className="text-xs text-emerald-600">Via mobile money</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;