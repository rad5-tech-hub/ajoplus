// src/components/ui/CreatePackageModal.tsx
import { X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useCreatePackage, useCategories } from '@/app/store/PackageStore';

interface CreatePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PackageItem {
  id: number;
  itemName: string;
  quantity: string;
}

const EMPTY_ITEM = (): PackageItem => ({
  id: Date.now() + Math.random(), // avoid collisions on rapid add
  itemName: '',
  quantity: '',
});

const INITIAL_FORM = {
  name: '',
  categoryId: '',
  paymentFrequency: 'daily' as 'daily' | 'weekly' | 'monthly',
  totalPrice: '',
  duration: '',
  description: '',
};

const CreatePackageModal = ({ isOpen, onClose }: CreatePackageModalProps) => {
  const { mutate: createPackage, isPending } = useCreatePackage();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const [packageItems, setPackageItems] = useState<PackageItem[]>([EMPTY_ITEM()]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState('');

  // ─── Item helpers ──────────────────────────────────────────────────────────

  const addItem = () => setPackageItems((prev) => [...prev, EMPTY_ITEM()]);

  const removeItem = (id: number) => {
    if (packageItems.length === 1) return;
    setPackageItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: 'itemName' | 'quantity', value: string) => {
    setPackageItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // ─── Form helpers ──────────────────────────────────────────────────────────

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) { setFormError('Package name is required'); return false; }
    if (!formData.categoryId) { setFormError('Please select a category'); return false; }
    if (!formData.totalPrice || isNaN(Number(formData.totalPrice)) || Number(formData.totalPrice) <= 0) { setFormError('Please enter a valid price'); return false; }
    if (!formData.duration || isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) { setFormError('Please enter a valid duration in months'); return false; }
    if (!formData.description.trim()) { setFormError('Description is required'); return false; }
    return true;
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setPackageItems([EMPTY_ITEM()]);
    setFormError('');
  };

  const handleClose = () => {
    if (isPending) return;
    resetForm();
    onClose();
  };

  // ─── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Filter rows where itemName is blank — quantity alone doesn't count
    const validItems = packageItems.filter((item) => item.itemName.trim());

    createPackage(
      {
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        totalPrice: Number(formData.totalPrice),
        duration: Number(formData.duration),
        paymentFrequency: formData.paymentFrequency,
        description: formData.description.trim(),
        // API requires at least one item — fall back to a generic placeholder
        items: validItems.length > 0
          ? validItems.map(({ itemName, quantity }) => ({ itemName, quantity }))
          : [{ itemName: 'Standard Item', quantity: '1' }],
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
          // Store's onSuccess already shows the success modal
        },
        onError: (err: unknown) => {
          // Show inline error in addition to the store's modal
          setFormError(
            err instanceof Error ? err.message : 'Failed to create package. Please try again.'
          );
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[94vh] overflow-hidden flex flex-col shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 md:px-6 md:py-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-emerald-100 rounded-2xl flex items-center justify-center text-lg">
              📦
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">Create New Package</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-auto p-5 md:p-6 space-y-6">

          {/* Inline error */}
          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          )}

          {/* Row 1: Name · Category · Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Package Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="e.g., Special Food Package"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isPending}
                className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                disabled={isPending || categoriesLoading}
                className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 bg-white disabled:bg-slate-50"
              >
                <option value="">
                  {categoriesLoading ? 'Loading…' : 'Select category'}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Payment Frequency <span className="text-red-500">*</span>
              </label>
              <select
                name="paymentFrequency"
                value={formData.paymentFrequency}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentFrequency: e.target.value as 'daily' | 'weekly' | 'monthly',
                  }))
                }
                disabled={isPending}
                className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 bg-white disabled:bg-slate-50"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Row 2: Price · Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Total Price (₦) <span className="text-red-500">*</span>
              </label>
              <input
                name="totalPrice"
                type="number"
                min="1"
                placeholder="e.g., 350000"
                value={formData.totalPrice}
                onChange={handleInputChange}
                disabled={isPending}
                className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 disabled:bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Duration (months) <span className="text-red-500">*</span>
              </label>
              <input
                name="duration"
                type="number"
                min="1"
                placeholder="e.g., 12"
                value={formData.duration}
                onChange={handleInputChange}
                disabled={isPending}
                className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Brief description of the package..."
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              disabled={isPending}
              className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 resize-y disabled:bg-slate-50"
            />
          </div>

          {/* Package Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-slate-900">Package Items <span className="text-slate-400 font-normal">(Optional)</span></p>
                <p className="text-xs text-slate-500 mt-0.5">Items included in this package</p>
              </div>
              <button
                onClick={addItem}
                disabled={isPending}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {packageItems.map((item, index) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-start">
                  <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 mt-3">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    placeholder="Item name (e.g., Bag of Rice)"
                    value={item.itemName}
                    onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                    disabled={isPending}
                    className="flex-1 px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 disabled:bg-slate-50"
                  />
                  <input
                    type="text"
                    placeholder="Quantity (e.g., 1, 50kg)"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                    disabled={isPending}
                    className="w-full sm:w-44 px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 disabled:bg-slate-50"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={isPending || packageItems.length === 1}
                    className="text-red-400 hover:text-red-600 p-2 mt-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-slate-100 px-5 py-4 md:px-6 md:py-5 flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={handleClose}
            disabled={isPending}
            className="flex-1 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.985] transition-all text-white font-semibold rounded-2xl flex items-center justify-center gap-2 disabled:bg-emerald-400 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating…
              </>
            ) : (
              <><Plus className="w-5 h-5" /> Create Package</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreatePackageModal;