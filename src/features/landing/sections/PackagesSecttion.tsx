// src/features/landing/sections/PackagesSection.tsx
import Button from '@/components/ui/Button';
import { Clock, Calendar, Package as PackageIcon } from 'lucide-react';

const PackagesSection = () => {
  const packages = [
    {
      category: "Food & Groceries",
      title: "Special Food Package",
      amount: "₦350,000",
      duration: "12 months",
      frequency: "Daily",
      progress: 45,
      description: "Complete food package with essential items - ₦1,000 daily from Jan. - Dec.",
      hasProgress: true,
    },
    {
      category: "Food & Groceries",
      title: "Rice Package",
      amount: "₦97,500",
      duration: "12 months",
      frequency: "Daily",
      description: "Essential rice and groceries package - ₦250 daily",
      hasProgress: false,
    },
    {
      category: "Food & Groceries",
      title: "Garri Package",
      amount: "₦91,200",
      duration: "12 months",
      frequency: "Daily",
      description: "Garri and staples package - ₦250 daily",
      hasProgress: false,
    },
    {
      category: "Food & Groceries",
      title: "Provision Package",
      amount: "₦91,200",
      duration: "12 months",
      frequency: "Daily",
      description: "Household provisions - ₦250 daily",
      hasProgress: false,
    },
  ];

  return (
    <section id="packages" className="py-24 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-emerald-700 text-sm font-medium tracking-widest">
            INSTALLMENT SAVINGS
          </span>
          <h2 className="mt-4 text-2xl md:text-4xl font-bold tracking-tighter text-slate-950">
            Ongoing Contribution Packages
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Save gradually with flexible installment plans designed for every need
          </p>
        </div>

        {/* Packages Grid - Equal Height Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="bg-white border border-slate-100 hover:border-emerald-200 rounded-3xl p-8 flex flex-col h-full transition-all duration-300 hover:shadow-xl group"
            >
              {/* Category Tag */}
              <div className="inline-block px-4 py-1 bg-emerald-100/40 text-emerald-500 text-xs font-medium rounded-2xl mb-6 w-fit">
                {pkg.category}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">
                {pkg.title}
              </h3>

              {/* Amount */}
              <div className="text-2xl font-bold text-emerald-600 mb-8">
                {pkg.amount}
              </div>

              {/* Meta Info */}
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <span>Duration: {pkg.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span>Frequency: {pkg.frequency}</span>
                </div>
              </div>

              {/* Progress Bar (Only for first card) */}
              {pkg.hasProgress && (
                <div className="mb-8">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-medium text-emerald-600">{pkg.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${pkg.progress}%` }}
                    />
                  </div>
                  <div className="text-[13px] text-slate-500 mt-3">
                    {pkg.description}
                  </div>
                </div>
              )}

              {/* Description for cards without progress */}
              {!pkg.hasProgress && (
                <div className="text-[15px] text-slate-600 leading-relaxed mb-8 flex-1">
                  {pkg.description}
                </div>
              )}

              {/* Join Button - Pushed to bottom */}
              <div className="mt-auto">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-4xl flex items-center justify-center gap-2 transition-all active:scale-[0.985]">
                  <PackageIcon className="w-5 h-5" />
                  Join Package
                </button>
              </div>
            </div>
          ))}
        </div>

		<div className="flex justify-center mt-16">
          <Button 
            variant="outline" 
            size="lg" 
            showArrow
            className="font-medium text-base tracking-wide rounded-3xl cursor-pointer hover:bg-emerald-600 hover:text-white hover:border-emerald-700"
          >
            View All Packages
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;