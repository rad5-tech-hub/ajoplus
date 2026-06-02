// src/features/customer/packages/PackageDetail.tsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Package as PackageIcon,
} from 'lucide-react';
import UploadReceiptModal from '@/components/ui/UploadReceiptModal';
import { useUserPackages, usePackageById, useJoinPackage } from '@/app/store/PackageStore';
import { useState } from 'react';
import type { PackageItem } from '@/api/package';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DisplayData {
  title: string;
  subtitle: string;
  status: 'active' | 'inactive' | 'completed' | 'finalised' | 'suspended';
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

  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Data fetching ─────────────────────────────────────────────────────────

  const {
    data: packageDetails,
    isLoading: pkgLoading,
    error: pkgError,
  } = usePackageById(packageId);

  const {
    data: userPackages,
    isLoading: userPkgLoading,
  } = useUserPackages();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['userPackages'] });
    await queryClient.invalidateQueries({ queryKey: ['package', packageId] });
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const isLoading = pkgLoading || userPkgLoading;
  const { mutate: joinPackage, isPending: isJoining } = useJoinPackage();

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

  // ── Join package (not subscribed yet) ──────────────────────────────────

  if (!userPackageData && packageDetails && !pkgError) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="bg-white border-b border-brand-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
            <button onClick={() => navigate('/browse')}
              className="flex items-center gap-1.5 sm:gap-2 text-slate-500 hover:text-brand-900 transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Back to Browse</span>
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white border border-brand-200 rounded-3xl p-6 sm:p-8">
            <div className="inline-block px-3 py-1 bg-brand-100 text-brand-700 text-xs font-medium rounded-2xl mb-4 w-fit">
              {typeof packageDetails.category === 'string' ? packageDetails.category : packageDetails.category?.name ?? 'Package'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-900 mb-2">{packageDetails.name}</h1>
            <p className="text-xl font-bold text-brand-600 mb-4">{formatNaira(packageDetails.totalPrice)}</p>
            <p className="text-slate-600 text-sm mb-6">{packageDetails.description}</p>
            <div className="flex gap-4 text-sm text-slate-500 mb-6">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {packageDetails.duration} month{packageDetails.duration !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {packageDetails.paymentFrequency.charAt(0).toUpperCase() + packageDetails.paymentFrequency.slice(1)}
              </div>
            </div>
            {packageDetails.items && packageDetails.items.length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <p className="font-semibold text-brand-900 text-sm mb-2">Package Includes:</p>
                <ul className="space-y-1.5">
                  {packageDetails.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full shrink-0" />
                      {item.quantity} {item.itemName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Package Terms */}
            <details className="bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 group">
              <summary className="px-4 py-2.5 font-medium text-slate-700 cursor-pointer select-none">
                Package Terms &amp; Conditions
              </summary>
              <div className="px-4 pb-3 space-y-1.5 max-h-48 overflow-y-auto">
                <p className="flex gap-2 leading-relaxed"><span className="text-brand-500 shrink-0">•</span>For global food contribution, food items you contributed will get to you on or before 30 days of completion.</p>
                <p className="flex gap-2 leading-relaxed"><span className="text-brand-500 shrink-0">•</span>No refund of money is accepted on global food contribution.</p>

                <p className="flex gap-2 leading-relaxed"><span className="text-brand-500 shrink-0">•</span>One is allowed to register multiple packages.</p>
              </div>
            </details>

            <button onClick={() => joinPackage(packageId!, {
              onSuccess: () => navigate(`/dashboard/customer/package/${packageId}`),
            })}
              disabled={isJoining}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.985] cursor-pointer">
              {isJoining ? <><Loader2 className="w-5 h-5 animate-spin" /> Joining...</> : <><PackageIcon className="w-5 h-5" /> Join This Package</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Error / not found ─────────────────────────────────────────────────────

  if ((!packageDetails && !userPackageData) || pkgError) {
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
            onClick={() => navigate('/browse')}
            className="text-brand-600 underline hover:text-brand-700 text-sm font-medium"
          >
            Browse Packages
          </button>
        </div>
      </div>
    );
  }

  if (!displayData) return null;

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
      <div className="bg-brand-50 border border-brand-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6">
        <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 lg:mb-5">
          Payment Summary
        </h3>
        <div className="divide-y divide-brand-100 text-sm sm:text-[15px]">
          {[
            { label: 'Total Price', value: displayData.totalAmount, cls: 'text-brand-900' },
            { label: 'Total Paid', value: displayData.totalPaid, cls: 'text-brand-900' },
            { label: 'Remaining', value: displayData.remaining, cls: 'text-red-600' },
            { label: 'Per Payment', value: displayData.perPayment, cls: 'text-brand-600' },
          ].map(({ label, value, cls }) => (
            <div key={label} className="flex justify-between py-2.5 sm:py-3">
              <span className="text-slate-500">{label}</span>
              <span className={`font-semibold ${cls}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Package Items — sourced from GET /packages/:id */}
      <div className="bg-white border border-brand-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-brand-100 rounded-xl flex items-center justify-center text-base sm:text-xl shrink-0">
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
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-brand-100 text-brand-700 rounded-lg sm:rounded-2xl flex items-center justify-center text-xs font-medium shrink-0">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-brand-900 text-sm">{item.itemName}</p>
                  <p className="text-xs text-slate-500">{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Instructions */}
      <div className="bg-white border border-brand-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-brand-100 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-brand-600 text-base sm:text-xl">ℹ︎</span>
          </div>
          <h3 className="font-semibold text-sm sm:text-base">Payment Instructions</h3>
        </div>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          Make payment via bank transfer and upload your receipt for verification.
          Admin approval required.
        </p>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-white border border-brand-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-brand-100 rounded-xl flex items-center justify-center text-base shrink-0">
            📋
          </div>
          <h3 className="font-semibold text-sm sm:text-base">Terms &amp; Conditions</h3>
        </div>
        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-500">
          {[
            'Food items will be delivered on or before 30 days of completion.',
            'No refund of money is accepted on package contributions.',
            'Multiple packages can be registered at the same time.',
            'A well detailed delivery address must be provided during registration.',
          ].map((term) => (
            <li key={term} className="flex gap-2 leading-relaxed">
              <span className="text-brand-500 mt-0.5 shrink-0">•</span>
              {term}
            </li>
          ))}
        </ul>
        <Link
          to="/terms"
          className="inline-block mt-3 text-brand-600 hover:text-brand-700 text-xs font-medium underline"
        >
          View full terms and conditions
        </Link>
      </div>
    </div>
  );

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Sticky top bar */}
      <div className="bg-white border-b border-brand-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <button
            onClick={() => navigate('/dashboard/customer')}
            className="flex items-center gap-1.5 sm:gap-2 text-slate-500 hover:text-brand-900 transition-colors"
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
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-brand-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-900 leading-tight">
                      {displayData.title}
                    </h1>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full shrink-0 border
                        ${displayData.status === 'active'
                          ? 'bg-blue-100 border-blue-200 text-blue-700'
                          : displayData.status === 'finalised'
                            ? 'bg-brand-100 border-brand-200 text-brand-700'
                            : displayData.status === 'completed'
                              ? 'bg-slate-200 border-slate-300 text-slate-500'
                              : displayData.status === 'inactive'
                                ? 'bg-slate-100 border-slate-200 text-slate-500'
                                : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${displayData.status === 'active' ? 'bg-blue-700' : displayData.status === 'finalised' ? 'bg-brand-500' : displayData.status === 'completed' ? 'bg-slate-400' : displayData.status === 'inactive' ? 'bg-slate-400' : 'bg-amber-500'
                          }`}
                      />
                      {displayData.status === 'finalised' ? 'Finalised' : displayData.status === 'completed' ? 'Completed' : displayData.status.charAt(0).toUpperCase() + displayData.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1.5 text-sm sm:text-base">{displayData.subtitle}</p>
                </div>
                <div className="sm:text-right shrink-0">
                  <p className="text-2xl sm:text-3xl font-bold text-brand-600">
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
                      className={`flex items-center gap-1.5 mb-1 text-xs sm:text-sm ${green ? 'text-brand-600' : 'text-slate-400'
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span>{label}</span>
                    </div>
                    <p
                      className={`font-semibold text-sm sm:text-base ${green ? 'text-brand-600' : 'text-brand-900'
                        }`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-brand-200">
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
                    className="bg-brand-50 p-3 sm:p-4 rounded-xl text-center col-span-1 last:col-span-2 md:last:col-span-1"
                  >
                    <p className="text-slate-500 text-xs sm:text-sm">{label}</p>
                    <p
                      className={`text-lg sm:text-xl lg:text-2xl font-bold mt-1.5 ${red ? 'text-red-600' : 'text-brand-900'
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
                  <span className="font-semibold text-brand-600">{displayData.progress}%</span>
                </div>
                <div className="h-2.5 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full transition-all duration-500"
                    style={{ width: `${displayData.progress}%` }}
                  />
                </div>
              </div>

              {displayData.status === 'finalised' ? (
                <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 sm:p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-brand-600" />
                  </div>
                  <p className="font-bold text-brand-800 text-base sm:text-lg">Package Finalised</p>
                  <p className="text-brand-600 text-sm mt-1">This package has been completed and finalised.</p>
                </div>
              ) : displayData.status === 'completed' ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="font-bold text-emerald-800 text-base sm:text-lg">Package Completed</p>
                  <p className="text-emerald-600 text-sm mt-1">All payments have been fulfilled for this package.</p>
                </div>
              ) : displayData.status !== 'active' ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <PackageIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="font-bold text-slate-600 text-base sm:text-lg">Package {displayData.status.charAt(0).toUpperCase() + displayData.status.slice(1)}</p>
                  <p className="text-slate-400 text-sm mt-1">Payments are disabled for this package.</p>
                </div>
              ) : (
                <div className="flex flex-row gap-3">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/customer/payment/${packageId}`, {
                        state: {
                          expectedAmount: parseFloat(userPackageData?.installmentAmount ?? '0'),
                          packageName: displayData.title,
                          userPackageId: userPackageData?.id,
                        },
                      })
                    }
                    className="bg-brand-600 hover:bg-brand-700 w-[50%] cursor-pointer transition-colors
                                text-white font-semibold py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl
                                flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.985]"
                  >
                    Make Payment
                  </button>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="border-2 border-brand-600 text-brand-600 w-[50%] cursor-pointer
                                hover:bg-brand-50 font-semibold py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl
                                flex items-center justify-center gap-2 text-sm sm:text-base transition-colors active:scale-[0.985]"
                  >
                    Upload Receipt
                  </button>
                </div>
              )}
            </div>

            {/* Contribution History */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-brand-200">
              <div className="flex items-center justify-between mb-4 sm:mb-5 lg:mb-6">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold">
                  Contribution History
                </h2>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
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
        recommendedAmount={displayData.perPayment}
        userPackageId={userPackageData?.id}
        paymentType="package"
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