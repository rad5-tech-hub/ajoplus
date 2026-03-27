// src/app/router/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import LandingPage from '@/features/landing/LandingPage';
import LoginPage from '@/features/auth/LoginPage';
import SignupPage from '@/features/auth/SignUpPage';
import ProtectedRoute from './ProtectedRoute';
import CustomerDashboard from '@/features/customer/dashboard/CustomerDashboard';
import AgentDashboard from '@/features/agent/dashboard/AgentDashboard';

// Placeholder dashboards for agent and admin until we build them out
const AdminDashboard = () => <div>Admin Dashboard - Coming Soon</div>;

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
        <Route path="/dashboard/agent" element={<AgentDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRouter;