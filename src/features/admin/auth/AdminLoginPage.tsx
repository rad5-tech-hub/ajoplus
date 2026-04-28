// src/features/admin/auth/AdminLoginPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAdminAuthStore } from '@/app/store/adminAuthStore';

const AdminLoginPage = () => {
	const navigate = useNavigate();
	const { login, isLoading, error, clearError } = useAdminAuthStore();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [localError, setLocalError] = useState<string>('');

	const validateForm = () => {
		if (!formData.email.trim()) {
			setLocalError('Email is required');
			return false;
		}
		if (!formData.email.includes('@')) {
			setLocalError('Please enter a valid email address');
			return false;
		}
		if (formData.password.length < 6) {
			setLocalError('Password must be at least 6 characters');
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearError();
		setLocalError('');

		if (!validateForm()) return;

		try {
			await login(formData.email.trim(), formData.password);
			navigate('/dashboard/admin', { replace: true });
		} catch (err: unknown) {
			setLocalError(err instanceof Error ? err.message : 'Login failed. Please try again.');
		}
	};

	const displayError = localError || error;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
			<div className="w-full max-w-md">
				<Link
					to="/"
					className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
				>
					<ArrowLeft className="w-5 h-5" />
					<span className="font-medium">Back to Home</span>
				</Link>

				<div className="text-center mb-10">
					<div className="inline-flex items-center justify-center w-14 h-14 bg-red-600 rounded-2xl mb-4">
						<span className="text-2xl font-bold text-white">⚙️</span>
					</div>
					<h1 className="text-3xl font-bold text-white">Admin Portal</h1>
					<p className="text-slate-400 mt-2">Secure administration access</p>
				</div>

				<div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl p-8 md:p-10">
					<h2 className="text-2xl font-bold text-white mb-1">Welcome Admin</h2>
					<p className="text-slate-400 mb-8">Sign in to manage the platform</p>

					{displayError && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3">
							<AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
							<p className="text-sm text-red-700">{displayError}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Email */}
						<div>
							<label className="block text-sm font-medium text-slate-300 mb-2">
								Admin Email
							</label>
							<div className="relative">
								<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
								<input
									type="email"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									placeholder="admin@ajoplus.com"
									className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
								/>
							</div>
						</div>

						{/* Password */}
						<div>
							<label className="block text-sm font-medium text-slate-300 mb-2">
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
								<input
									type={showPassword ? 'text' : 'password'}
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									placeholder="••••••••"
									className="w-full pl-12 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400"
								>
									{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
								</button>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] mt-8"
						>
							{isLoading ? 'Signing in...' : 'Sign In'}
						</button>
					</form>

					{/* Security Notice */}
					<div className="mt-8 p-4 bg-slate-700/50 border border-slate-600 rounded-xl">
						<p className="text-xs text-slate-400">
							🔒 <span className="font-semibold text-slate-300">Admin Portal</span> — This is a restricted area. Unauthorized access attempts are logged and monitored.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminLoginPage;
