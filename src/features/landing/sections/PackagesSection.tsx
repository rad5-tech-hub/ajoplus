import { useEffect, useState } from 'react';
import { Clock, Calendar, Package as PackageIcon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { getAvailablePackages, getPackageCategoryName, formatPackagePrice } from '@/api/package';

interface PackageFallback {
  name: string;
  category: string;
  amount: string;
  duration: string;
  frequency: string;
  description: string;
  totalPrice: number;
  durationMonths: number;
  items: { itemName: string; quantity: string }[];
}

const FALLBACK_PACKAGES: PackageFallback[] = [
  {
    name: 'Special Food Package', category: 'Food & Groceries',
    amount: '₦350,000', duration: '12 months', frequency: 'Daily',
    description: 'Complete food package with essential items - ₦1,000 daily from Jan. - Dec.',
    totalPrice: 350000, durationMonths: 12, items: [
      { itemName: 'Bag of Rice', quantity: '1' },
      { itemName: 'Vegetable Oil', quantity: '5 Litres' },
      { itemName: 'Beans', quantity: '10kg' },
    ],
  },
  {
    name: 'Rice Package', category: 'Food & Groceries',
    amount: '₦97,500', duration: '12 months', frequency: 'Daily',
    description: 'Essential rice and groceries package - ₦250 daily',
    totalPrice: 97500, durationMonths: 12, items: [
      { itemName: 'Premium Rice (50kg)', quantity: '1' },
    ],
  },
  {
    name: 'Garri Package', category: 'Food & Groceries',
    amount: '₦91,200', duration: '12 months', frequency: 'Daily',
    description: 'Garri and staples package - ₦250 daily',
    totalPrice: 91200, durationMonths: 12, items: [
      { itemName: 'Garri (50kg)', quantity: '1' },
    ],
  },
  {
    name: 'Provision Package', category: 'Food & Groceries',
    amount: '₦91,200', duration: '12 months', frequency: 'Daily',
    description: 'Household provisions - ₦250 daily',
    totalPrice: 91200, durationMonths: 12, items: [
      { itemName: 'Household Provisions Pack', quantity: '1' },
    ],
  },
];

const PackagesSection = () => {
  const [packages, setPackages] = useState<PackageFallback[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getAvailablePackages()
      .then((data) => {
        if (!mounted) return;
        if (data.length > 0) {
          setPackages(data.slice(0, 4).map((p) => ({
            name: p.name,
            category: getPackageCategoryName(p),
            amount: formatPackagePrice(p.totalPrice),
            duration: `${p.duration} months`,
            frequency: p.paymentFrequency.charAt(0).toUpperCase() + p.paymentFrequency.slice(1),
            description: p.description,
            totalPrice: parseFloat(String(p.totalPrice)),
            durationMonths: p.duration,
            items: (p.items ?? []).map((i) => ({ itemName: i.itemName, quantity: i.quantity })),
          })));
        } else {
          setPackages(FALLBACK_PACKAGES);
        }
      })
      .catch(() => { if (mounted) setPackages(FALLBACK_PACKAGES); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <section id="packages" className="py-24 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-pulse">
            <div className="h-5 bg-slate-200 rounded-full w-32 mx-auto" />
            <div className="h-8 bg-slate-200 rounded-full w-64 mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="packages" className="py-24 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => {
            const isExpanded = expanded === `pkg-${index}`;
            return (
              <div
                key={index}
                className="bg-white border border-slate-100 hover:border-emerald-200 rounded-3xl p-8 flex flex-col h-full transition-all duration-300 hover:shadow-xl group"
              >
                <div className="inline-block px-4 py-1 bg-emerald-100/40 text-emerald-500 text-xs font-medium rounded-2xl mb-6 w-fit">
                  {pkg.category}
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">
                  {pkg.name}
                </h3>

                <div className="text-2xl font-bold text-emerald-600 mb-8">
                  {pkg.amount}
                </div>

                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <span>Duration: {pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <span>Frequency: {pkg.frequency}</span>
                  </div>
                </div>

                {/* Package Items */}
                {pkg.items.length > 0 && (
                  <div className="mb-6">
                    <button
                      onClick={() => setExpanded(isExpanded ? null : `pkg-${index}`)}
                      className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
                    >
                      {pkg.items.length} item{pkg.items.length !== 1 ? 's' : ''} included
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="mt-3 space-y-2 bg-slate-50 rounded-2xl p-3">
                        {pkg.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-slate-700">{item.itemName}</span>
                            <span className="text-slate-400 text-xs">{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="text-[15px] text-slate-600 leading-relaxed mb-8 flex-1">
                  {pkg.description}
                </div>

                <div className="mt-auto">
                  <Link
                    to="/signup"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.985]"
                  >
                    <PackageIcon className="w-5 h-5" />
                    Join Package
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-16">
          <Link to="/browse">
            <Button
              variant="outline"
              size="lg"
              showArrow
              className="font-medium text-base tracking-wide rounded-3xl cursor-pointer hover:bg-emerald-600 hover:text-white hover:border-emerald-700"
            >
              View All Packages
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
