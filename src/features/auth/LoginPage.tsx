// src/features/auth/LoginPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/app/store/authStore';
// import abaGoldLogo from '@/assets/ABAGOLD LOGO.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const ROLE_ROUTES: Record<string, string> = {
    customer: '/dashboard/customer',
    agent: '/dashboard/agent',
    admin: '/dashboard/admin',
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
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
      await login({ email: formData.email.trim(), password: formData.password });

      const { user } = useAuthStore.getState();
      const destination = user ? (ROLE_ROUTES[user.role] ?? '/dashboard/customer') : '/dashboard/customer';
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-brand-600 to-brand-700 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-white">
            {/* <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img src={abaGoldLogo} alt="ABAGOLD Logo" className="h-9 w-auto border border-gray-300 rounded-lg" />
              <span className="font-semibold text-3xl tracking-tight text-white">
                AbaGold
              </span>
            </Link> */}
          </div>
          <p className="text-white/90 font-bold text-3xl tracking-tight text-center mb-2">Save Smart, Grow Together</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <h1 className="text-3xl font-bold text-brand-900 mb-1">Welcome Back</h1>
          <p className="text-slate-500 mb-8">Sign in to continue to your account</p>

          {(error || localError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-brand-200 rounded-2xl focus:border-brand-600 outline-none text-brand-900"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-brand-200 rounded-2xl focus:border-brand-600 outline-none text-brand-900"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  className="w-4 h-4 accent-brand-600"
                />
                <span className="text-slate-600">Remember me</span>
              </label>
              <Link to="#" className="text-brand-600 hover:text-brand-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold py-4 rounded-2xl text-lg transition-all active:scale-[0.985] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <span className="text-xl">→</span>}
            </button>
          </form>

          <p className="text-center text-slate-500 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-600 font-semibold hover:text-brand-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
