// src/app/router/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import LandingPage from '@/features/landing/LandingPage';
import LoginPage from '@/features/auth/LoginPage';
import SignupPage from '@/features/auth/SignUpPage';
import ProtectedRoute from './ProtectedRoute';
import CustomerDashboard from '@/features/customer/dashboard/CustomerDashboard';
import AgentDashboard from '@/features/agent/dashboard/AgentDashboard';
import AdminDashboard from '@/features/admin/dashboard/AdminDashboard';
import PackageDetail from '@/features/customer/packages/PackagesDetail';
import MakePayment from '@/features/customer/Payments/MakePayment';
import BrowsePage from '@/features/browse/BrowsePage';
import ShoppingCart from '@/features/cart/ShoppingCart';
import PaymentSuccess from '@/components/ui/PaymentSuccess';
const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/browse" element={<BrowsePage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
        <Route path="/dashboard/agent" element={<AgentDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/customer/package/:packageId" element={<PackageDetail />} />
        <Route path="/dashboard/customer/payment/:packageId" element={<MakePayment />} />
        <Route path="/dashboard/customer/payment/" element={<MakePayment />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        
      </Route>

      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRouter;