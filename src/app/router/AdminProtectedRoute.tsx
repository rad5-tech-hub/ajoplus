// src/app/router/AdminProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '@/app/store/adminAuthStore';

interface AdminProtectedRouteProps {
	children?: React.ReactNode;
}

/**
 * Protected route for admin dashboard
 * - Only allows authenticated admin users
 * - Redirects non-admins to admin login page
 */
const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
	const { isAuthenticated, admin } = useAdminAuthStore();
	const location = useLocation();

	// Not authenticated as admin - redirect to admin login
	if (!isAuthenticated || !admin) {
		return <Navigate to="/admin/login" state={{ from: location }} replace />;
	}

	// Additional check: ensure role is admin
	if (admin.role !== 'admin') {
		return <Navigate to="/admin/login" replace />;
	}

	return children ? <>{children}</> : <Outlet />;
};

export default AdminProtectedRoute;
