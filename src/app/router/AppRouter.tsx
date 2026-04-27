// src/app/router/AppRouter.tsx
import { Routes, Route, } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute';
import RouteSuspenseFallback from '@/components/RouteSuspenseFallback';

/**
 * Route-level code splitting for optimal performance on 3G/low-end devices
 * Each dashboard is lazy-loaded only when navigated to
 */

// Public routes (lazy-loaded)
const LandingPage = lazy(() => import('@/features/landing/LandingPage'));
const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
const SignupPage = lazy(() => import('@/features/auth/SignUpPage'));
const BrowsePage = lazy(() => import('@/features/browse/BrowsePage'));

// Protected routes (lazy-loaded)
const CustomerDashboard = lazy(() => import('@/features/customer/dashboard/CustomerDashboard'));
const AgentDashboard = lazy(() => import('@/features/agent/dashboard/AgentDashboard'));
const AdminDashboard = lazy(() => import('@/features/admin/dashboard/AdminDashboard'));
const PackageDetail = lazy(() => import('@/features/customer/packages/PackagesDetail'));
const MakePayment = lazy(() => import('@/features/customer/Payments/MakePayment'));
const ShoppingCart = lazy(() => import('@/features/cart/ShoppingCart'));
const Checkout = lazy(() => import('@/features/cart/Checkout'));
const PaymentSuccess = lazy(() => import('@/components/ui/PaymentSuccess'));
const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes - Lazy loaded */}
      <Route
        path="/"
        element={
          <Suspense fallback={<RouteSuspenseFallback />}>
            <LandingPage />
          </Suspense>
        }
      />
      <Route
        path="/login"
        element={
          <Suspense fallback={<RouteSuspenseFallback />}>
            <LoginPage />
          </Suspense>
        }
      />
      <Route
        path="/signup"
        element={
          <Suspense fallback={<RouteSuspenseFallback />}>
            <SignupPage />
          </Suspense>
        }
      />
      <Route
        path="/browse"
        element={
          <Suspense fallback={<RouteSuspenseFallback />}>
            <BrowsePage />
          </Suspense>
        }
      />

      {/* Protected Routes - Lazy loaded */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard/customer"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <CustomerDashboard />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/agent"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <AgentDashboard />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/customer/package/:packageId"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <PackageDetail />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/customer/payment/:packageId"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <MakePayment />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/customer/payment/"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <MakePayment />
            </Suspense>
          }
        />
        <Route
          path="/cart"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <ShoppingCart />
            </Suspense>
          }
        />
        <Route
          path="/checkout"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <Checkout />
            </Suspense>
          }
        />
        <Route
          path="/payment/success"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <PaymentSuccess />
            </Suspense>
          }
        />
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center">Unauthorized Access</div>} />
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRouter;