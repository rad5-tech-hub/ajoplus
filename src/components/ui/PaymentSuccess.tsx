// src/features/customer/payments/PaymentSuccess.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { packageName = 'Smart Phone Package', amount = '₦400' } = location.state || {};

  return (
    <div >
      {/* <CustomerNavbar /> */}
      <div className="flex items-center justify-center w-[90%] mx-auto">
        <div className="bg-emerald-600 rounded-3xl max-w-md w-full p-10 text-center mt-4">
          <div className="mx-auto w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mb-8">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
          </div>

          <h1 className="text-3xl font-bold text-emerald-900 mb-3">Payment Submitted!</h1>
          <p className="text-white mb-10 leading-relaxed">
            Your payment receipt has been submitted successfully.
            <br />
            Our team will verify and approve it within 24 hours.
          </p>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-10">
            <p className="text-emerald-800 text-sm">
              <strong>Package:</strong> {packageName}
              <br />
              <strong>Amount:</strong> {amount}
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard/customer')}
            className="w-full cursor-pointer bg-white transition-colors text-emerald-600 font-semibold py-4 rounded-2xl text-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
