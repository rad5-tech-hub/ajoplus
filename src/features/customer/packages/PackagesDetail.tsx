// src/features/customer/packages/PackageDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Package as PackageIcon,
} from 'lucide-react';
import UploadReceiptModal from '@/components/ui/UploadReceiptModal';
import { useUserPackages, usePackageById } from '@/app/store/PackageStore';
import { useState } from 'react';
import type { PackageItem } from '@/api/package';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DisplayData {
  title: string;
  subtitle: string;
  status: 'active' | 'inactive' | 'completed' | 'suspended';
  totalAmount: string;
  category: string;
  totalPaid: string;
  remaining: string;
  perPayment: string;
  duration: string;
  frequency: string;
  nextDue: string;
  progress: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatNaira = (value: string | number, fractionDigits = 0): string => {
  const num = parseFloat(String(value));
  return `₦${isNaN(num) ? '0' : num.toLocaleString('en-NG', { minimumFractionDigits: fractionDigits })}`;
};

// ─── Component ────────────────────────────────────────────────────────────────

const PackageDetail = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);

  // ── Data fetching ─────────────────────────────────────────────────────────
  // Two parallel queries:
  //   1. usePackageById  → real package data including items array
  //   2. useUserPackages → subscription/financial data (totalPaid, progress, etc.)

  const {
    data: packageDetails,
    isLoading: pkgLoading,
    error: pkgError,
  } = usePackageById(packageId);

  const {
    data: userPackages,
    isLoading: userPkgLoading,
  } = useUserPackages();

  const isLoading = pkgLoading || userPkgLoading;

  // Find this user's subscription record for the package
  const userPackageData = userPackages?.find((pkg) => pkg.packageId === packageId);

  // ── Derived display values ────────────────────────────────────────────────

  // Category: packageDetails.category is null per API example; fall back to
  // the nested category object inside user-packages (which always has it as an object).
  const categoryName = (() => {
    if (packageDetails?.category) {
      if (typeof packageDetails.category === 'string') return packageDetails.category;
      return packageDetails.category.name;
    }
    if (userPackageData?.package?.category) {
      return userPackageData.package.category.name;
    }
    return '—';
  })();

  // Items come exclusively from GET /packages/:id — never from user-packages
  const items: PackageItem[] = packageDetails?.items ?? [];

  // Build the unified display object only once we have subscription data
  const displayData: DisplayData | null = userPackageData
    ? {
      title: packageDetails?.name ?? userPackageData.package.name,
      subtitle: packageDetails?.description ?? userPackageData.package.description,
      status: userPackageData.status,
      totalAmount: formatNaira(
        packageDetails?.totalPrice ?? userPackageData.package.totalPrice
      ),
      category: categoryName,
      totalPaid: formatNaira(userPackageData.totalPaid, 2),
      remaining: formatNaira(userPackageData.remainingBalance),
      perPayment: formatNaira(userPackageData.installmentAmount, 2),
      duration: `${userPackageData.duration} months`,
      frequency: userPackageData.paymentFrequency,
      nextDue: new Date(userPackageData.nextPaymentDate).toLocaleDateString('en-GB'),
      progress: userPackageData.progress,
    }
    : null;

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/4 mb-8" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  // ── Error / not found ─────────────────────────────────────────────────────

  if (!displayData || pkgError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-4">
            <PackageIcon className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-700 font-medium mb-1">Package not found</p>
          <p className="text-slate-500 text-sm mb-6">
            This package may no longer be active or could not be loaded.
          </p>
          <button
            onClick={() => navigate('/dashboard/customer')}
            className="text-emerald-600 underline hover:text-emerald-700 text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Metrics strip ─────────────────────────────────────────────────────────

  const metrics = [
    { icon: Calendar, label: 'Duration', value: displayData.duration, green: false },
    { icon: Clock, label: 'Frequency', value: displayData.frequency, green: false },
    { icon: CreditCard, label: 'Per Payment', value: displayData.perPayment, green: true },
    { icon: Calendar, label: 'Next Due', value: displayData.nextDue, green: false },
  ];

  // ── Sidebar (shared between mobile inline & desktop sticky) ───────────────

  const SidebarContent = () => (
    <div className="space-y-4 sm:space-y-6">

      {/* Payment Summary */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6">
        <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 lg:mb-5">
          Payment Summary
        </h3>
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

      {/* Package Items — sourced from GET /packages/:id */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-100 rounded-xl flex items-center justify-center text-base sm:text-xl shrink-0">
            📦
          </div>
          <h3 className="font-semibold text-sm sm:text-base">Package Items</h3>
        </div>

        {items.length === 0 ? (
          <div className="flex items-center gap-2.5 py-1">
            <PackageIcon className="w-4 h-4 text-slate-300 shrink-0" />
            <p className="text-sm text-slate-400">No items listed for this package.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {items.map((item, index) => (
              <div key={item.id ?? index} className="flex gap-2.5 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-emerald-100 text-emerald-700 rounded-lg sm:rounded-2xl flex items-center justify-center text-xs font-medium shrink-0">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{item.itemName}</p>
                  <p className="text-xs text-slate-500">{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
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
          Make payment via bank transfer and upload your receipt for verification.
          Admin approval required.
        </p>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 rounded-xl flex items-center justify-center text-base shrink-0">
            📋
          </div>
          <h3 className="font-semibold text-sm sm:text-base">Terms &amp; Conditions</h3>
        </div>
        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-500">
          {[
            'Contributions must be made on time to maintain package status',
            'Grace period of 7 days for missed payments',
            'Package delivery upon 100% completion',
            'All payments are non-refundable',
          ].map((term) => (
            <li key={term} className="flex gap-2 leading-relaxed">
              <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
              {term}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // ── Main render ───────────────────────────────────────────────────────────

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
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
                    {displayData.totalAmount}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{displayData.category}</p>
                </div>
              </div>

              {/* 2×2 on mobile → 4-col on md+ */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
                {metrics.map(({ icon: Icon, label, value, green }) => (
                  <div key={label} className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5">
                    <div
                      className={`flex items-center gap-1.5 mb-1 text-xs sm:text-sm ${green ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span>{label}</span>
                    </div>
                    <p
                      className={`font-semibold text-sm sm:text-base ${green ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                    >
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
                    <p
                      className={`text-lg sm:text-xl lg:text-2xl font-bold mt-1.5 ${red ? 'text-red-600' : 'text-slate-900'
                        }`}
                    >
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
                  className="bg-emerald-600 hover:bg-emerald-700 w-[50%] cursor-pointer transition-colors
                             text-white font-semibold py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl
                             flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.985]"
                >
                  Make Payment
                </button>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="border-2 border-emerald-600 text-emerald-600 w-[50%] cursor-pointer
                             hover:bg-emerald-50 font-semibold py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl
                             flex items-center justify-center gap-2 text-sm sm:text-base transition-colors active:scale-[0.985]"
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
              {/* TODO: wire up GET /api/package/contributions/:packageId when endpoint is available */}
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-slate-500 text-sm">Contribution history coming soon.</p>
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
        recommendedAmount={displayData.perPayment}
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