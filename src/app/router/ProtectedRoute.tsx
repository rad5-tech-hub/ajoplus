import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/app/store/authStore';

interface ProtectedRouteProps {
  requiredRoles?: ('customer' | 'agent' | 'admin')[];
  children?: React.ReactNode;
}

const ProtectedRoute = ({ requiredRoles, children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    if (!requiredRoles.includes(user.role)) {
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
