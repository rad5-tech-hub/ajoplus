import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '@/app/store/adminAuthStore';

interface AdminProtectedRouteProps {
	children?: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
	const location = useLocation();
	const { isAuthenticated, admin } = useAdminAuthStore();

	if (!isAuthenticated || !admin) {
		return <Navigate to="/admin/login" state={{ from: location }} replace />;
	}

	if (admin.role !== 'admin') {
		return <Navigate to="/admin/login" replace />;
	}

	return children ? <>{children}</> : <Outlet />;
};

export default AdminProtectedRoute;
