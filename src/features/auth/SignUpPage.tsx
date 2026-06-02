// src/features/auth/SignupPage.tsx
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  Camera,
  Upload,
  MapPin,
  CreditCard,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/app/store/authStore';
import RegistrationFeeModal from './components/RegistrationFeeModal';
import CameraCaptureModal from '@/components/ui/CameraCaptureModal';
type Step = 1 | 2 | 3 | 4 | 5;

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

const STEP_LABELS: Record<Step, string> = {
  1: 'Personal Info',
  2: 'Address',
  3: 'Bank Details',
  4: 'Account Setup',
  5: 'Security',
};

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // Step 1 – Personal Info
    fullName: '',
    email: '',
    phone: '',
    profileImage: null as File | null,
    profilePreview: '',

    // Step 2 – Address
    streetAddress: '',
    city: '',
    state: '',

    // Step 3 – Bank Details
    bankName: '',
    accountNumber: '',
    accountName: '',

    // Step 4 – Account Setup
    accountType: 'customer' as 'customer' | 'agent',
    referralCode: '',

    // Step 5 – Security
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleImageFile = (file: File | undefined) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, profileImage: file, profilePreview: preview }));
  };

  const clearProfileImage = () => {
    if (formData.profilePreview) URL.revokeObjectURL(formData.profilePreview);
    setFormData((prev) => ({ ...prev, profileImage: null, profilePreview: '' }));
  };

  const validateStep = (currentStep: Step): boolean => {
    setLocalError('');

    if (currentStep === 1) {
      if (!formData.profileImage)
        return (setLocalError('A profile photo is required'), false);
      if (!formData.fullName.trim())
        return (setLocalError('Full name is required'), false);
      if (!formData.email.trim() || !formData.email.includes('@'))
        return (setLocalError('A valid email address is required'), false);
      if (!formData.phone.trim())
        return (setLocalError('Phone number is required'), false);
    }

    if (currentStep === 2) {
      if (!formData.streetAddress.trim())
        return (setLocalError('Street address is required'), false);
      if (!formData.city.trim())
        return (setLocalError('City is required'), false);
      if (!formData.state)
        return (setLocalError('Please select a state'), false);
    }

    if (currentStep === 3) {
      if (!formData.bankName)
        return (setLocalError('Please select your bank'), false);
      if (!formData.accountNumber.trim())
        return (setLocalError('Account number is required'), false);
      if (!formData.accountName.trim())
        return (setLocalError('Account name is required'), false);
      if (
        formData.accountName.trim().toLowerCase() !==
        formData.fullName.trim().toLowerCase()
      )
        return (
          setLocalError(
            'Account name must exactly match your full name. Please check and try again.',
          ),
          false
        );
    }

    if (currentStep === 5) {
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
    if (validateStep(step)) setStep((s) => (s + 1) as Step);
  };
  const prevStep = () => setStep((s) => (s - 1) as Step);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validateStep(5)) return;

    // These are guaranteed by step-1 validation, but we assert for TypeScript
    if (!formData.profileImage) {
      setLocalError('A profile photo is required');
      return;
    }

    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
        accountName: formData.accountName,
        address: `${formData.streetAddress}, ${formData.city}, ${formData.state}`,
        profileImage: formData.profileImage,
        accountType: formData.accountType,
        referralCode: formData.referralCode || undefined,
      });
      if (formData.accountType === 'agent') {
        setShowFeeModal(true);
      } else {
        navigate('/login');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account';
      setLocalError(message);
    }
  };

  const inputCls =
    'w-full px-4 py-4 bg-slate-50 border border-brand-200 rounded-2xl focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition-all';
  const iconInputCls =
    'w-full pl-11 pr-4 py-4 bg-slate-50 border border-brand-200 rounded-2xl focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition-all';

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center p-6">
      <RegistrationFeeModal
        isOpen={showFeeModal}
        userName={formData.fullName}
        onComplete={() => navigate('/login')}
      />
      <CameraCaptureModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={(file) => handleImageFile(file)}
      />
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white">
            {/* <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img src={abaGoldLogo} alt="ABAGOLD Logo" className="h-9 w-auto border border-gray-300 rounded-lg" />
              <span className="font-semibold text-3xl tracking-tight text-white">
                AbaGold
              </span>
            </Link> */}
            {/* <span className="text-3xl font-semibold tracking-tight text-white">AbaGold</span> */}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="flex gap-1.5 mb-3">
              {([1, 2, 3, 4, 5] as Step[]).map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'bg-brand-600' : 'bg-slate-200'}`}
                />
              ))}
            </div>
            <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">
              Step {step} of 5 — {STEP_LABELS[step]}
            </p>
          </div>

          <h1 className="text-3xl font-bold text-brand-900 mb-1">Create Account</h1>
          <p className="text-slate-500 mb-6">Join thousands of smart savers</p>

          {(error || localError) && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm flex items-start gap-2">
              <span className="flex-1">{error || localError}</span>
              <button
                type="button"
                onClick={() => { setLocalError(''); clearError(); }}
                className="text-red-400 hover:text-red-600 shrink-0 mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ── STEP 1 – Personal Info ── */}
            {step === 1 && (
              <div className="space-y-5">
                {/* Profile photo — REQUIRED */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Profile Photo <span className="text-red-500">*</span>
                  </label>

                  {formData.profilePreview ? (
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 shrink-0">
                        <img
                          src={formData.profilePreview}
                          alt="Profile preview"
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-200 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={clearProfileImage}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-sm text-slate-500">
                        <p className="font-medium text-slate-700">{formData.profileImage?.name}</p>
                        <p>{((formData.profileImage?.size ?? 0) / 1024).toFixed(0)} KB</p>
                        <button
                          type="button"
                          onClick={clearProfileImage}
                          className="text-brand-600 hover:text-brand-700 font-medium mt-1 cursor-pointer"
                        >
                          Change photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowCamera(true)}
                        className="flex-1 flex flex-col items-center gap-2 p-4 border-2 border-dashed border-brand-200 rounded-2xl hover:border-brand-400 hover:bg-brand-50 transition-all group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                          <Camera className="w-5 h-5 text-slate-400 group-hover:text-brand-600 transition-colors" />
                        </div>
                        <span className="text-xs font-medium text-slate-500 group-hover:text-brand-600 transition-colors">
                          Take Photo
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => uploadInputRef.current?.click()}
                        className="flex-1 flex flex-col items-center gap-2 p-4 border-2 border-dashed border-brand-200 rounded-2xl hover:border-brand-400 hover:bg-brand-50 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                          <Upload className="w-5 h-5 text-slate-400 group-hover:text-brand-600 transition-colors" />
                        </div>
                        <span className="text-xs font-medium text-slate-500 group-hover:text-brand-600 transition-colors">
                          Upload Photo
                        </span>
                      </button>

                      <input
                        ref={uploadInputRef}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleImageFile(e.target.files?.[0])}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Adebayo Johnson"
                      className={iconInputCls}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className={iconInputCls}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      placeholder="+234 803 456 7890"
                      className={iconInputCls}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-brand-600 hover:bg-brand-700 active:scale-95 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                >
                  Next <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* ── STEP 2 – Address ── */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-2xl px-4 py-3 mb-2">
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>This address will be used for product deliveries and your profile.</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="12 Adeola Odeku Street, Victoria Island"
                    className="w-full px-4 py-4 bg-slate-50 border border-brand-200 rounded-2xl focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition-all resize-none"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City / LGA <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Lagos Island"
                      className={iconInputCls}
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`${inputCls} appearance-none`}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  >
                    <option value="">Select state</option>
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border border-slate-300 text-slate-700 py-4 rounded-2xl font-semibold hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                  >
                    Next <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3 – Bank Details ── */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-brand-50 border border-brand-100 rounded-2xl px-4 py-3 mb-2">
                  <CreditCard className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>
                    Your <strong>Account Name</strong> must exactly match your{' '}
                    <strong>Full Name</strong> — this is how we verify your identity.
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      className={`${iconInputCls} appearance-none`}
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      required
                    >
                      <option value="">Select your bank</option>
                      <option value="GTBank">Guaranty Trust Bank (GTBank)</option>
                      <option value="Access">Access Bank</option>
                      <option value="Zenith">Zenith Bank</option>
                      <option value="First Bank">First Bank</option>
                      <option value="UBA">United Bank for Africa (UBA)</option>
                      <option value="Stanbic">Stanbic IBTC Bank</option>
                      <option value="Ecobank">Ecobank</option>
                      <option value="FCMB">FCMB</option>
                      <option value="Opay">OPay</option>
                      <option value="Kuda">Kuda Bank</option>
                      <option value="Palmpay">PalmPay</option>
                      <option value="Other">Other Bank</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="10-digit account number"
                    maxLength={10}
                    className={inputCls}
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder={`Must match "${formData.fullName || 'your full name'}"`}
                      className={`${iconInputCls} ${formData.accountName &&
                        formData.accountName.trim().toLowerCase() !==
                        formData.fullName.trim().toLowerCase()
                        ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
                        : formData.accountName &&
                          formData.accountName.trim().toLowerCase() ===
                          formData.fullName.trim().toLowerCase()
                          ? 'border-brand-300 bg-brand-50 focus:border-brand-500'
                          : ''
                        }`}
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                      required
                    />
                    {formData.accountName && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {formData.accountName.trim().toLowerCase() ===
                          formData.fullName.trim().toLowerCase() ? (
                          <Check className="w-5 h-5 text-brand-500" />
                        ) : (
                          <X className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                  {formData.accountName &&
                    formData.accountName.trim().toLowerCase() !==
                    formData.fullName.trim().toLowerCase() && (
                      <p className="text-xs text-red-500 mt-1.5 ml-1">
                        Must match your full name: <strong>{formData.fullName || '—'}</strong>
                      </p>
                    )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border border-slate-300 text-slate-700 py-4 rounded-2xl font-semibold hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                  >
                    Next <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4 – Account Setup ── */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    I want to join as <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['customer', 'agent'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, accountType: type })}
                        className={`py-4 px-3 rounded-2xl border-2 font-medium text-sm transition-all active:scale-95 ${formData.accountType === type
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-brand-200 text-slate-600 hover:border-slate-300'
                          }`}
                      >
                        {type === 'customer' ? (
                          <span className="flex flex-col gap-1">
                            <span className="text-xl">💰</span>
                            <span>Customer</span>
                            <span className="text-xs font-normal text-slate-400">Save & Earn</span>
                          </span>
                        ) : (
                          <span className="flex flex-col gap-1">
                            <span className="text-xl">🤝</span>
                            <span>Agent</span>
                            <span className="text-xs font-normal text-slate-400">Refer & Earn</span>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.accountType === 'customer' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Referral Code{' '}
                      <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter referral code"
                      className={inputCls}
                      value={formData.referralCode}
                      onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border border-slate-300 text-slate-700 py-4 rounded-2xl font-semibold hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                  >
                    Next <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 5 – Security ── */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-brand-200 rounded-2xl focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 h-1.5 rounded-full transition-all ${formData.password.length >= i * 4
                              ? i === 1
                                ? 'bg-red-500'
                                : i === 2
                                  ? 'bg-brand-500'
                                  : 'bg-green-500'
                              : 'bg-slate-200'
                              }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${formData.password.length < 4 ? 'text-red-500' :
                        formData.password.length < 8 ? 'text-brand-500' :
                          'text-green-600'
                        }`}>
                        {formData.password.length < 4 ? 'Weak' :
                          formData.password.length < 8 ? 'Fair' :
                            'Strong'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      className={`w-full pl-11 pr-12 py-4 bg-slate-50 border rounded-2xl focus:ring-2 outline-none transition-all ${formData.confirmPassword && formData.confirmPassword !== formData.password
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-brand-200 focus:border-brand-600 focus:ring-brand-100'
                        }`}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer text-sm select-none">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="mt-0.5 w-4 h-4 accent-brand-600 shrink-0"
                  />
                  <span className="text-slate-600 leading-relaxed">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-brand-600 font-medium hover:underline">Terms of Service</a> and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-600 font-medium hover:underline">Privacy Policy</a>
                  </span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border border-slate-300 text-slate-700 py-4 rounded-2xl font-semibold hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.agreeTerms}
                    className={`flex-1 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${isLoading || !formData.agreeTerms
                      ? 'bg-[var(--color-disabled-bg)] text-[var(--color-disabled-text)] cursor-not-allowed opacity-60'
                      : 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer'
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle
                            className="opacity-25"
                            cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Account <Check className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center text-slate-500 mt-6 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-brand-600 font-semibold hover:text-brand-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;