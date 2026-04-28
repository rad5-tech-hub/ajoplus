// src/app/router/AppRouter.tsx
import { Routes, Route, } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute';
import AdminProtectedRoute from './AdminProtectedRoute';
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

// Admin auth routes (lazy-loaded)
const AdminLoginPage = lazy(() => import('@/features/admin/auth/AdminLoginPage'));
const AdminSignupPage = lazy(() => import('@/features/admin/auth/AdminSignupPage'));

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
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PUBLIC ROUTES */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Route
        path="/"
        element={
          <Suspense fallback={<RouteSuspenseFallback />}>
            <LandingPage />
          </Suspense>
        }
      />

      {/* Customer/Agent Auth Routes */}
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

      {/* ADMIN AUTH ROUTES (SEPARATE & PRIVATE) */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<RouteSuspenseFallback />}>
            <AdminLoginPage />
          </Suspense>
        }
      />
      <Route
        path="/admin/signup"
        element={
          <Suspense fallback={<RouteSuspenseFallback />}>
            <AdminSignupPage />
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CUSTOMER PROTECTED ROUTES (role: 'customer') */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Route element={<ProtectedRoute requiredRoles={['customer']} />}>
        <Route
          path="/dashboard/customer"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <CustomerDashboard />
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
      </Route>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* AGENT PROTECTED ROUTES (role: 'agent') */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Route element={<ProtectedRoute requiredRoles={['agent']} />}>
        <Route
          path="/dashboard/agent"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <AgentDashboard />
            </Suspense>
          }
        />
      </Route>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ADMIN PROTECTED ROUTES (SEPARATE AUTH SYSTEM - role: 'admin') */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Route element={<AdminProtectedRoute />}>
        <Route
          path="/dashboard/admin"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <AdminDashboard />
            </Suspense>
          }
        />
      </Route>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SHARED ROUTES (customer & agent) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Route element={<ProtectedRoute requiredRoles={['customer', 'agent']} />}>
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