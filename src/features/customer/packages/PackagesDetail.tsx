// src/features/customer/packages/PackageDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle, Clock, CreditCard } from 'lucide-react';
import UploadReceiptModal from '@/components/ui/UploadReceiptModal';
import { useUserPackages } from '@/app/store/PackageStore';
import { useState } from 'react';

const PackageDetail = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { data: userPackages, isLoading } = useUserPackages();

  // Find the specific package from user packages
  const userPackageData = userPackages?.find((pkg) => pkg.packageId === packageId);

  // Format package data from API
  const packageData = userPackageData
    ? {
      id: userPackageData.id,
      title: userPackageData.package.name,
      subtitle: userPackageData.package.description,
      status: userPackageData.status,
      totalAmount: `₦${parseFloat(userPackageData.package.totalPrice as string).toLocaleString()}`,
      category: userPackageData.package.category.name,
      totalPaid: `₦${parseFloat(userPackageData.totalPaid).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
      remaining: `₦${userPackageData.remainingBalance.toLocaleString()}`,
      perPayment: `₦${parseFloat(userPackageData.installmentAmount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
      duration: `${userPackageData.duration} months`,
      frequency: userPackageData.paymentFrequency,
      nextDue: new Date(userPackageData.nextPaymentDate).toLocaleDateString('en-GB'),
      progress: userPackageData.progress,
    }
    : null;

  // Fallback to default data if package not found
  const displayData = packageData || {
    id: packageId,
    title: 'Smart Phone Package',
    subtitle: 'Save weekly and get the latest smartphone',
    status: 'active',
    totalAmount: '₦150,000',
    category: 'Electronics',
    totalPaid: '₦97,500',
    remaining: '₦52,500',
    perPayment: '₦5,769.23',
    duration: '6 months',
    frequency: 'Weekly',
    nextDue: '26 Mar 2026',
    progress: 65,
  };

  const contributions = [
    { amount: '₦25,000', date: '15 Mar 2026', status: 'approved' },
    { amount: '₦25,000', date: '8 Mar 2026', status: 'approved' },
    { amount: '₦25,000', date: '1 Mar 2026', status: 'approved' },
    { amount: '₦25,000', date: '22 Feb 2026', status: 'approved' },
    { amount: '₦25,000', date: '15 Feb 2026', status: 'pending' },
  ];

  const metrics = [
    { icon: Calendar, label: 'Duration', value: displayData.duration, green: false },
    { icon: Clock, label: 'Frequency', value: displayData.frequency, green: false },
    { icon: CreditCard, label: 'Per Payment', value: displayData.perPayment, green: true },
    { icon: Calendar, label: 'Next Due', value: displayData.nextDue, green: false },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/4 mb-8" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Payment Summary */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6">
        <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 lg:mb-5">Payment Summary</h3>
        <div className="divide-y divide-emerald-100 text-sm sm:text-[15px]">
          {[
            { label: 'Total Price', value: displayData.totalAmount, cls: 'text-slate-900' },
            { label: 'Total Paid', value: displayData.totalPaid, cls: 'text-slate-900' },
            { label: 'Remaining', value: displayData.remaining, cls: 'text-red-600' },
            { label: 'Per Payment', value: displayData.perPayment, cls: 'text-emerald-600' },
          ].map(({ label, value, cls }) => (
            <div key={label} className="flex justify-between py-2.5 sm:py-3">
              <span className="text-slate-500">{label}</span>
              <span className={`font-semibold ${cls}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Package Items */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-100 rounded-xl flex items-center justify-center text-base sm:text-xl shrink-0">
            📦
          </div>
          <h3 className="font-semibold text-sm sm:text-base">Package Items</h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {[
            { n: 1, name: 'Bag of Rice', detail: '50kg' },
            { n: 2, name: 'Cooking Oil', detail: '5 liters' },
          ].map((item, index) => (
            <div key={item.n} className="flex gap-2.5 sm:gap-3">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-emerald-100 text-emerald-700 rounded-lg sm:rounded-2xl flex items-center justify-center text-xs font-medium shrink-0">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                <p className="text-xs text-slate-500">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-amber-600 text-base sm:text-xl">ℹ︎</span>
          </div>
          <h3 className="font-semibold text-sm sm:text-base">Payment Instructions</h3>
        </div>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          Make payment via bank transfer and upload your receipt for verification. Admin approval required.
        </p>
      </div>

      {/* Terms */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 rounded-xl flex items-center justify-center text-base shrink-0">
            📋
          </div>
          <h3 className="font-semibold text-sm sm:text-base">Terms & Conditions</h3>
        </div>
        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-500">
          {[
            'Contributions must be made on time to maintain package status',
            'Grace period of 7 days for missed payments',
            'Package delivery upon 100% completion',
            'All payments are non-refundable',
          ].map((t) => (
            <li key={t} className="flex gap-2 leading-relaxed">
              <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Sticky top bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <button
            onClick={() => navigate('/dashboard/customer')}
            className="flex items-center gap-1.5 sm:gap-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">

          {/* ── Main column ── */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6 lg:space-y-8">

            {/* Header card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
                      {displayData.title}
                    </h1>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full shrink-0 border
                        ${displayData.status === 'active'
                          ? 'bg-blue-100 border-blue-200 text-blue-700'
                          : 'bg-amber-100 border-amber-200 text-amber-700'
                        }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${displayData.status === 'active' ? 'bg-blue-700' : 'bg-amber-500'
                          }`}
                      />
                      {displayData.status.charAt(0).toUpperCase() + displayData.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1.5 text-sm sm:text-base">{displayData.subtitle}</p>
                </div>
                <div className="sm:text-right shrink-0">
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{displayData.totalAmount}</p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{displayData.category}</p>
                </div>
              </div>

              {/* 2×2 on mobile → 4-col on md+ */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
                {metrics.map(({ icon: Icon, label, value, green }) => (
                  <div key={label} className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5">
                    <div className={`flex items-center gap-1.5 mb-1 text-xs sm:text-sm ${green ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span>{label}</span>
                    </div>
                    <p className={`font-semibold text-sm sm:text-base ${green ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-4 sm:mb-5 lg:mb-6">
                Financial Summary
              </h2>

              {/* 2-col on mobile, 3-col on md+ */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6 mb-5 sm:mb-6 lg:mb-8">
                {[
                  { label: 'Total Package Price', value: displayData.totalAmount, red: false },
                  { label: 'Total Paid', value: displayData.totalPaid, red: false },
                  { label: 'Remaining Balance', value: displayData.remaining, red: true },
                ].map(({ label, value, red }) => (
                  <div
                    key={label}
                    className="bg-emerald-50 p-3 sm:p-4 rounded-xl text-center col-span-1 last:col-span-2 md:last:col-span-1"
                  >
                    <p className="text-slate-500 text-xs sm:text-sm">{label}</p>
                    <p className={`text-lg sm:text-xl lg:text-2xl font-bold mt-1.5 ${red ? 'text-red-600' : 'text-slate-900'}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mb-5 sm:mb-6 lg:mb-8">
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span className="text-slate-500">Overall Progress</span>
                  <span className="font-semibold text-emerald-600">{displayData.progress}%</span>
                </div>
                <div className="h-2.5 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${displayData.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-3">
                <button
                  onClick={() => navigate(`/dashboard/customer/payment/${packageId}`)}
                  className="bg-emerald-600 hover:bg-emerald-700 w-[50%] cursor-pointer transition-colors text-white font-semibold
                             py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl
                             flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Make Payment
                </button>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="border-2 border-emerald-600 text-emerald-600 w-[50%] cursor-pointer hover:bg-emerald-50
                             font-semibold py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl
                             flex items-center justify-center gap-2 text-sm sm:text-base transition-colors"
                >
                  Upload Receipt
                </button>
              </div>
            </div>

            {/* Contribution History */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-4 sm:mb-5 lg:mb-6">
                Contribution History
              </h2>
              <div className="space-y-0 divide-y divide-slate-100">
                {contributions.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-3 sm:py-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm sm:text-base">{c.amount}</p>
                        <p className="text-xs sm:text-sm text-slate-400">{c.date}</p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-center
                        ${c.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                        }`}
                    >
                      {c.status}
                      {c.status === 'pending' && (
                        <span className="text-[10px] sm:text-xs block leading-tight mt-0.5 opacity-80">
                          Receipt attached
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar renders inline on mobile/tablet, hidden on lg */}
            <div className="lg:hidden">
              <SidebarContent />
            </div>
          </div>

          {/* ── Sidebar column (lg+ only) ── */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24">
              <SidebarContent />
            </div>
          </div>
        </div>
      </div>

      <UploadReceiptModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        packageName={displayData.title}
        recommendedAmount="₦5,769.23"
        onSuccess={(amount) =>
          navigate('/payment/success', {
            state: { packageName: displayData.title, amount: `₦${amount}` },
          })
        }
      />
    </div>
  );
};

export default PackageDetail;