// src/features/auth/SignupPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '@/app/store/authStore';

type Step = 1 | 2 | 3;

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    accountType: 'customer' as 'customer' | 'agent',
    password: '',
    confirmPassword: '',
    referralCode: '',
    agreeTerms: false,
  });

  const validateStep = (currentStep: Step): boolean => {
    setLocalError('');

    if (currentStep === 1) {
      if (!formData.fullName.trim()) return (setLocalError('Full name is required'), false);
      if (!formData.email.trim() || !formData.email.includes('@'))
        return (setLocalError('Valid email is required'), false);
      if (!formData.phone.trim()) return (setLocalError('Phone number is required'), false);
    }

    if (currentStep === 3) {
      if (formData.password.length < 6)
        return (setLocalError('Password must be at least 6 characters'), false);
      if (formData.password !== formData.confirmPassword)
        return (setLocalError('Passwords do not match'), false);
      if (!formData.agreeTerms)
        return (setLocalError('You must agree to the Terms and Privacy Policy'), false);
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((s) => (s + 1) as Step);
    }
  };

  const prevStep = () => setStep((s) => (s - 1) as Step);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateStep(3)) return;

    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        accountType: formData.accountType,
        password: formData.password,
        referralCode: formData.referralCode || undefined,
      });

      navigate('/dashboard/customer');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account';
      setLocalError(message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-600 to-emerald-700 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white">
            <div className="w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-2xl">
              A+
            </div>
            <span className="text-3xl font-semibold tracking-tight">AjoPlus</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  s <= step ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-1">Create Account</h1>
          <p className="text-slate-500 mb-8">Join thousands of smart savers</p>

          {(error || localError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Adebayo Johnson"
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 outline-none"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+234 803 456 7890"
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
                >
                  Next <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    I want to join as *
                  </label>
                  <select
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 outline-none"
                    value={formData.accountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountType: e.target.value as 'customer' | 'agent',
                      })
                    }
                  >
                    <option value="customer">Customer (Save & Earn)</option>
                    <option value="agent">Agent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Referral Code (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter referral code"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 outline-none"
                    value={formData.referralCode}
                    onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border border-slate-300 text-slate-700 py-4 rounded-2xl font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
                  >
                    Next <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 outline-none"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 outline-none"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="mt-1 accent-emerald-600"
                  />
                  <span className="text-slate-600">
                    I agree to the <span className="text-emerald-600">Terms of Service</span> and{' '}
                    <span className="text-emerald-600">Privacy Policy</span>
                  </span>
                </label>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border border-slate-300 text-slate-700 py-4 rounded-2xl font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.agreeTerms}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                    {!isLoading && <Check className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center text-slate-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
