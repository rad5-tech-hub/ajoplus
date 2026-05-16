
import { useNavigate, } from 'react-router-dom';
// src/features/customer/dashboard/components/QuickActions.tsx
const QuickActions = () => {
const navigate = useNavigate();
  return (
    <div className="bg-white border border-slate-300 shadow-lg rounded-3xl p-6">
      <h3 className="font-semibold text-brand-900 mb-5">Quick Actions</h3>

      <div className="space-y-3">
        <button
          onClick={() => navigate(`/dashboard/customer/payment`)}
          className="w-full cursor-pointer bg-brand-600 hover:bg-brand-700 text-white font-semibold py-4 rounded-2xl transition-all active:scale-[0.985]"
        >
          Make Payment
        </button>

        <button 
          onClick={() => navigate(`/browse`)} className="w-full cursor-pointer border border-brand-600 text-brand-600 font-semibold py-4 rounded-2xl hover:bg-brand-50 transition-all">
          Browse Packages
        </button>

        <button className="w-full border cursor-pointer border-slate-300 text-slate-700 font-semibold py-4 rounded-2xl hover:bg-slate-50 transition-all">
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
