import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Package as PackageIcon, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/app/store/authStore';
import Button from '@/components/ui/Button';
import { fetchPublicPackages } from '@/api/public';
import { formatNaira, formatFrequency, getCategoryName } from '@/features/browse/types';

const PackagesSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: packages = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['publicPackages'],
    queryFn: fetchPublicPackages,
    staleTime: 5 * 60 * 1000,
  });

  const handleJoin = (pkgId: string) => {
    if (!isAuthenticated) {
      navigate(`/signup?redirect=/browse&packageId=${pkgId}`);
      return;
    }
    navigate(`/dashboard/customer/packages/${pkgId}`);
  };

  const displayPackages = packages.slice(0, 4);

  if (isLoading) {
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
          <span className="inline-block px-4 py-1.5 text-amber-700 text-sm font-medium tracking-widest">
            INSTALLMENT SAVINGS
          </span>
          <h2 className="mt-4 text-2xl md:text-4xl font-bold tracking-tighter text-blue-950">
            Ongoing Contribution Packages
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Save gradually with flexible installment plans designed for every need
          </p>
        </div>

        {isError ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-red-200">
            <p className="text-red-600 mb-4 text-sm">Could not load packages. Please try again.</p>
            <button onClick={() => refetch()} className="text-sm text-red-600 underline hover:text-red-700 cursor-pointer">
              Retry
            </button>
          </div>
        ) : displayPackages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">No packages available right now.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayPackages.map((pkg) => {
              const key = pkg.id;
              const isExpanded = expanded === key;
              return (
                <div key={key} className="bg-white border border-amber-200 hover:border-amber-400 rounded-3xl p-8 flex flex-col h-full transition-all duration-300 hover:shadow-xl group">
                  <div className="inline-block px-4 py-1 bg-amber-100/40 text-amber-700 text-xs font-medium rounded-2xl mb-6 w-fit">
                    {getCategoryName(pkg.category)}
                  </div>
                  <h3 className="text-xl font-semibold text-blue-950 mb-3 tracking-tight">{pkg.name}</h3>
                  <div className="text-2xl font-bold text-amber-600 mb-8">{formatNaira(pkg.totalPrice)}</div>
                  <div className="space-y-4 mb-6 text-sm">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Clock className="w-5 h-5 text-slate-400" />
                      <span>Duration: {pkg.duration} month{pkg.duration !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <span>Frequency: {formatFrequency(pkg.paymentFrequency)}</span>
                    </div>
                  </div>
                  {pkg.items?.length > 0 && (
                    <div className="mb-6">
                      <button onClick={() => setExpanded(isExpanded ? null : key)}
                        className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors cursor-pointer">
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
                  <div className="text-[15px] text-slate-600 leading-relaxed mb-8 flex-1">{pkg.description}</div>
                  <div className="mt-auto">
                    <button onClick={() => handleJoin(pkg.id)}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.985] cursor-pointer">
                      <PackageIcon className="w-5 h-5" />
                      Join Package
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-16">
          <Button variant="outline" size="lg" showArrow
            onClick={() => navigate('/browse')}
            className="font-medium text-base tracking-wide rounded-3xl cursor-pointer hover:bg-amber-600 hover:text-white hover:border-amber-700">
            View All Packages
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
