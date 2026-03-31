// src/features/customer/payments/PaymentSuccess.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { packageName = "Smart Phone Package", amount = "₦400" } = location.state || {};

  return (
    <div className="min-h-screen bg-[#f0f9f4] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl max-w-md w-full p-10 text-center">
        <div className="mx-auto w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mb-8">
          <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">Payment Submitted!</h1>
        <p className="text-slate-600 mb-10 leading-relaxed">
          Your payment receipt has been submitted successfully.<br />
          Our team will verify and approve it within 24 hours.
        </p>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-10">
          <p className="text-emerald-800 text-sm">
            <strong>Package:</strong> {packageName}<br />
            <strong>Amount:</strong> {amount}
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/customer')}
          className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors text-white font-semibold py-4 rounded-2xl text-lg"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;