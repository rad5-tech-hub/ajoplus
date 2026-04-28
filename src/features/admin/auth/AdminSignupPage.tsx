// src/features/admin/auth/AdminSignupPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useAdminAuthStore } from '@/app/store/adminAuthStore';

const AdminSignupPage = () => {
	const navigate = useNavigate();
	const { register, isLoading, error, clearError } = useAdminAuthStore();

	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [localError, setLocalError] = useState<string>('');

	const validateForm = () => {
		if (!formData.fullName.trim()) {
			setLocalError('Full name is required');
			return false;
		}
		if (formData.fullName.trim().length < 3) {
			setLocalError('Full name must be at least 3 characters');
			return false;
		}
		if (!formData.email.trim()) {
			setLocalError('Email is required');
			return false;
		}
		if (!formData.email.includes('@')) {
			setLocalError('Please enter a valid email address');
			return false;
		}
		if (formData.password.length < 8) {
			setLocalError('Password must be at least 8 characters');
			return false;
		}
		if (formData.password !== formData.confirmPassword) {
			setLocalError('Passwords do not match');
			return false;
		}
		// Basic password strength check
		if (!/[A-Z]/.test(formData.password)) {
			setLocalError('Password must contain at least one uppercase letter');
			return false;
		}
		if (!/[0-9]/.test(formData.password)) {
			setLocalError('Password must contain at least one number');
			return false;
		}
		if (!/[!@#$%^&*]/.test(formData.password)) {
			setLocalError('Password must contain at least one special character (!@#$%^&*)');
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
			await register(formData.fullName.trim(), formData.email.trim(), formData.password);
			navigate('/dashboard/admin', { replace: true });
		} catch (err: unknown) {
			setLocalError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
		}
	};

	const displayError = localError || error;
	const passwordValid =
		formData.password.length >= 8 &&
		/[A-Z]/.test(formData.password) &&
		/[0-9]/.test(formData.password) &&
		/[!@#$%^&*]/.test(formData.password);

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
					<h1 className="text-3xl font-bold text-white">Admin Registration</h1>
					<p className="text-slate-400 mt-2">Create a new admin account</p>
				</div>

				<div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl p-8 md:p-10">
					<h2 className="text-2xl font-bold text-white mb-1">Create Admin Account</h2>
					<p className="text-slate-400 mb-8 text-sm">Register with a strong password</p>

					{displayError && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3">
							<AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
							<p className="text-sm text-red-700">{displayError}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Full Name */}
						<div>
							<label className="block text-sm font-medium text-slate-300 mb-2">
								Full Name
							</label>
							<div className="relative">
								<User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
								<input
									type="text"
									value={formData.fullName}
									onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
									placeholder="John Doe"
									className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
								/>
							</div>
						</div>

						{/* Email */}
						<div>
							<label className="block text-sm font-medium text-slate-300 mb-2">
								Email Address
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

							{/* Password Requirements */}
							<div className="mt-3 space-y-2">
								<div
									className={`flex items-center gap-2 text-xs ${formData.password.length >= 8 ? 'text-green-400' : 'text-slate-400'
										}`}
								>
									<div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
										{formData.password.length >= 8 && <CheckCircle className="w-3 h-3" />}
									</div>
									At least 8 characters
								</div>
								<div
									className={`flex items-center gap-2 text-xs ${/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-slate-400'
										}`}
								>
									<div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
										{/[A-Z]/.test(formData.password) && <CheckCircle className="w-3 h-3" />}
									</div>
									One uppercase letter
								</div>
								<div
									className={`flex items-center gap-2 text-xs ${/[0-9]/.test(formData.password) ? 'text-green-400' : 'text-slate-400'
										}`}
								>
									<div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
										{/[0-9]/.test(formData.password) && <CheckCircle className="w-3 h-3" />}
									</div>
									One number
								</div>
								<div
									className={`flex items-center gap-2 text-xs ${/[!@#$%^&*]/.test(formData.password) ? 'text-green-400' : 'text-slate-400'
										}`}
								>
									<div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
										{/[!@#$%^&*]/.test(formData.password) && <CheckCircle className="w-3 h-3" />}
									</div>
									One special character (!@#$%^&*)
								</div>
							</div>
						</div>

						{/* Confirm Password */}
						<div>
							<label className="block text-sm font-medium text-slate-300 mb-2">
								Confirm Password
							</label>
							<div className="relative">
								<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
								<input
									type={showConfirmPassword ? 'text' : 'password'}
									value={formData.confirmPassword}
									onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
									placeholder="••••••••"
									className="w-full pl-12 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400"
								>
									{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
								</button>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading || !passwordValid}
							className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] mt-8"
						>
							{isLoading ? 'Creating Account...' : 'Create Admin Account'}
						</button>
					</form>

					{/* Already Have Account */}
					<p className="text-center text-slate-400 mt-6 text-sm">
						Already have an account?{' '}
						<Link to="/admin/login" className="text-red-500 hover:text-red-400 font-semibold">
							Sign In
						</Link>
					</p>

					{/* Security Notice */}
					<div className="mt-8 p-4 bg-slate-700/50 border border-slate-600 rounded-xl">
						<p className="text-xs text-slate-400">
							🔒 <span className="font-semibold text-slate-300">Secure Registration</span> — All admin accounts require strong passwords and are logged for security.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminSignupPage;
