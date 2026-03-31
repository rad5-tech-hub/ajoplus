// src/features/customer/packages/PackageDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle, Clock,  CreditCard } from 'lucide-react';
import UploadReceiptModal from '@/components/ui/UploadReceiptModal';
import { useState } from 'react';
const PackageDetail = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock data - in production this would come from TanStack Query
  const packageData = {
    id: packageId,
    title: 'Smart Phone Package',
    subtitle: 'Save weekly and get the latest smartphone',
    status: 'Active',
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

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/dashboard/customer')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 cursor-pointer" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-slate-900">{packageData.title}</h1>
                    <span className="inline-flex items-center px-4 py-1.5 bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium rounded-2xl">
                      <span className="w-2.5 h-2.5 bg-blue-700 rounded-full mr-2"></span>
                      Active
                    </span>
                  </div>
                  <p className="text-slate-600 mt-2 text-md">{packageData.subtitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-600">{packageData.totalAmount}</p>
                  <p className="text-sm text-slate-500 mt-1">{packageData.category}</p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="font-semibold text-slate-900">{packageData.duration}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm">Frequency</span>
                  </div>
                  <p className="font-semibold text-slate-900">{packageData.frequency}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-sm">Per Payment</span>
                  </div>
                  <p className="font-semibold text-emerald-600">{packageData.perPayment}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">Next Due</span>
                  </div>
                  <p className="font-semibold text-slate-900">{packageData.nextDue}</p>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200">
              <h2 className="text-xl font-semibold mb-6">Financial Summary</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-emerald-100/40 p-4 rounded-xl text-center">
                  <p className="text-slate-500 text-sm">Total Package Price</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {packageData.totalAmount}
                  </p>
                </div>
                <div className="bg-emerald-100/40 p-4 rounded-xl text-center">
                  <p className="text-slate-500 text-sm">Total Paid</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{packageData.totalPaid}</p>
                </div>
                <div className="bg-emerald-100/40 p-4 rounded-xl text-center">
                  <p className="text-slate-500 text-sm">Remaining Balance</p>
                  <p className="text-2xl font-bold text-red-600 mt-2">{packageData.remaining}</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-600">Overall Progress</span>
                  <span className="font-semibold text-emerald-600">{packageData.progress}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${packageData.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/dashboard/customer/payment/${packageId}`)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3"
                >
                  Make Payment
                </button>

                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex-1 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors"
                >
                  Upload Receipt
                </button>
              </div>
            </div>

            {/* Contribution History */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200">
              <h2 className="text-xl font-semibold mb-6">Contribution History</h2>

              <div className="space-y-4">
                {contributions.map((contrib, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-4 border-b border-slate-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{contrib.amount}</p>
                        <p className="text-sm text-slate-500">{contrib.date}</p>
                      </div>
                    </div>

                    <div
                      className={`px-4 py-1.5 rounded-2xl text-sm font-medium ${
                        contrib.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {contrib.status === 'approved' ? 'approved' : 'pending'}
                      {contrib.status === 'pending' && (
                        <span className="text-xs block">Receipt attached</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Payment Summary */}
            <div className="bg-emerald-50 border border-slate-300 rounded-3xl p-6">
              <h3 className="font-semibold text-lg mb-6">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Price</span>
                  <span className="font-semibold">₦150,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Paid</span>
                  <span className="font-semibold">₦97,500</span>
                </div>
                <div className="flex justify-between border-t border-emerald-100 pt-4">
                  <span className="text-slate-600">Remaining</span>
                  <span className="font-semibold text-red-600">₦52,500</span>
                </div>
                <div className="flex justify-between border-t border-emerald-100 pt-4">
                  <span className="text-slate-600">Per Weekly</span>
                  <span className="font-semibold text-emerald-600">₦5,769.23</span>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
                  <span className="text-amber-600 text-xl">ℹ︎</span>
                </div>
                <h3 className="font-semibold">Payment Instructions</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Make payment via bank transfer and upload your receipt for verification. Admin
                approval required.
              </p>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                  📋
                </div>
                <h3 className="font-semibold">Terms & Conditions</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  Contributions must be made on time to maintain package status
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  Grace period of 7 days for missed payments
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  Package delivery upon 100% completion
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  All payments are non-refundable
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  <UploadReceiptModal 
  isOpen={showUploadModal}
  onClose={() => setShowUploadModal(false)}
  packageName={packageData.title}
  recommendedAmount="₦5,769.23"
  onSuccess={(amount) => {
    navigate('/payment-success', { 
      state: { packageName: packageData.title, amount: `₦${amount}` } 
    });
  }}
/>
    </div>
  );
};

export default PackageDetail;
