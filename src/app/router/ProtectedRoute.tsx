// src/app/router/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/app/store/authStore';

interface ProtectedRouteProps {
  requiredRoles?: ('customer' | 'agent' | 'admin')[];
  children?: React.ReactNode;
}

/**
 * Protected route that enforces authentication and role-based access control
 * - Redirects unauthenticated users to /login
 * - Redirects users with wrong role to /unauthorized
 * - Prevents URL manipulation to access other roles' dashboards
 */
const ProtectedRoute = ({ requiredRoles, children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user has the right role
  if (requiredRoles && requiredRoles.length > 0) {
    if (!requiredRoles.includes(user.role)) {
      // User tried to access a route for a different role
      // Redirect to their own dashboard based on role
      const roleRoutes: Record<string, string> = {
        customer: '/dashboard/customer',
        agent: '/dashboard/agent',
        admin: '/dashboard/admin',
      };
      return <Navigate to={roleRoutes[user.role] || '/dashboard/customer'} replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
