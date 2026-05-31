import { useState } from 'react';
import { Shield, Eye, EyeOff, Loader2, } from 'lucide-react';
import * as adminAPI from '@/api/admin';
import { useModalStore } from '@/app/store/ModalStore';

export function CreateAdmin() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      useModalStore.getState().openModal({
        type: 'error',
        title: 'Validation Error',
        message: 'All fields are required.',
      });
      setTimeout(() => useModalStore.getState().closeModal(), 2500);
      return;
    }

    if (password !== confirmPassword) {
      useModalStore.getState().openModal({
        type: 'error',
        title: 'Password Mismatch',
        message: 'Passwords do not match.',
      });
      setTimeout(() => useModalStore.getState().closeModal(), 2500);
      return;
    }

    if (password.length < 6) {
      useModalStore.getState().openModal({
        type: 'error',
        title: 'Weak Password',
        message: 'Password must be at least 6 characters.',
      });
      setTimeout(() => useModalStore.getState().closeModal(), 2500);
      return;
    }

    setIsLoading(true);
    try {
      await adminAPI.registerAdmin({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: 'admin',
      });

      useModalStore.getState().openModal({
        type: 'success',
        title: 'Admin Created',
        message: `Admin "${fullName.trim()}" has been created successfully.`,
      });
      setTimeout(() => useModalStore.getState().closeModal(), 3000);

      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create admin';
      useModalStore.getState().openModal({
        type: 'error',
        title: 'Creation Failed',
        message,
      });
      setTimeout(() => useModalStore.getState().closeModal(), 2500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">Create Admin</h2>
        <p className="text-sm text-slate-400 mt-1">Add a new administrator to the platform</p>
      </div>

      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@example.com"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-3 pr-12 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-3 pr-12 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Create Admin
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAdmin;
