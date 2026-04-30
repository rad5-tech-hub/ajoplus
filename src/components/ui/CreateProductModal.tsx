import { X, Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, type Category } from '@/api/categories';
import { createProduct } from '@/api/product';
import { useModalStore } from '@/app/store/ModalStore';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProductModal = ({ isOpen, onClose }: CreateProductModalProps) => {
  const queryClient = useQueryClient();
  const { openModal } = useModalStore();

  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    description: '',
    price: '',
    quantity: '',
    status: 'In Stock' as 'In Stock' | 'Low Stock' | 'Out of Stock',
    imageFile: null as File | null,
    imageUrl: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: (payload: FormData) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      openModal({ type: 'success', title: 'Success', message: 'Product created successfully!' });
      onClose();
    },
    onError: (err) => {
      console.error('Create product failed', err);
      openModal({ type: 'error', title: 'Failed', message: err instanceof Error ? err.message : 'Failed to create product' });
    },
  });

  const isSubmitting =
    createMutation.isPending ??
    (createMutation as unknown as { isLoading: boolean }).isLoading ??
    false;

  useEffect(() => {
    return () => {
      setImagePreview(null);
      setFormData({
        productName: '',
        category: '',
        description: '',
        price: '',
        quantity: '',
        status: 'In Stock',
        imageFile: null,
        imageUrl: '',
      });
    };
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string, imageFile: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.productName.trim()) {
      openModal({ type: 'error', title: 'Validation Error', message: 'Product name is required.' });
      return;
    }
    if (!formData.category) {
      openModal({ type: 'error', title: 'Validation Error', message: 'Please select a category.' });
      return;
    }
    if (!formData.price) {
      openModal({ type: 'error', title: 'Validation Error', message: 'Price is required.' });
      return;
    }
    if (!formData.imageFile) {
      // ✅ Caught client-side before even hitting the API
      openModal({ type: 'error', title: 'Validation Error', message: 'Please upload a product image.' });
      return;
    }

    const fd = new FormData();
    fd.append('name', formData.productName.trim());
    fd.append('categoryId', formData.category);
    fd.append('description', formData.description.trim());
    fd.append('price', String(formData.price));
    fd.append('quantityInStock', String(formData.quantity || '0'));
    fd.append('stockStatus', formData.status);
    // ✅ Fixed: was "image" — API expects "productImage"
    fd.append('productImage', formData.imageFile);

    createMutation.mutate(fd);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[94vh] overflow-hidden flex flex-col shadow-2xl relative">

        {/* ── Full-modal loading overlay while submitting ── */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3 rounded-3xl">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            <p className="text-slate-700 font-semibold text-base">Creating product…</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 md:px-6 md:py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-600 rounded-xl flex items-center justify-center text-base">🛍️</div>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">Create New Product</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-auto p-5 md:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Product Image <span className="text-red-500">*</span>
              </label>
              <div
                className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer h-[calc(100%-2rem)]"
                onClick={() => !isSubmitting && document.getElementById('image-input')?.click()}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full min-h-36">
                    <img src={imagePreview} alt="Preview" className="w-full h-full max-h-48 object-cover rounded-xl" />
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setFormData((p) => ({ ...p, imageUrl: '', imageFile: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="text-4xl mb-3">📸</div>
                    <p className="text-slate-600 font-medium">Click to upload product image</p>
                    <p className="text-slate-400 text-sm mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Premium Rice (50kg)"
                  value={formData.productName}
                  disabled={isSubmitting}
                  onChange={(e) => setFormData((p) => ({ ...p, productName: e.target.value }))}
                  className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  disabled={isSubmitting || categoriesLoading}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 bg-white disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">{categoriesLoading ? 'Loading…' : 'Select category'}</option>
                  {categories.map((c: Category) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Price (₦) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 25000"
                    value={formData.price}
                    disabled={isSubmitting}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                    className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Qty in Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.quantity}
                    disabled={isSubmitting}
                    onChange={(e) => setFormData((p) => ({ ...p, quantity: e.target.value }))}
                    className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Stock Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['In Stock', 'Low Stock', 'Out of Stock'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setFormData((p) => ({ ...p, status }))}
                  className={`py-3 px-4 rounded-2xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${formData.status === status
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Product description..."
              value={formData.description}
              disabled={isSubmitting}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 text-base border border-slate-200 rounded-3xl focus:outline-none focus:border-emerald-600 resize-none disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-5 md:p-6 sm:block md:flex gap-3 md:gap-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="md:flex-1 w-full mb-2 md:mb-0 py-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-2xl hover:bg-emerald-50 transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="md:flex-1 py-4 w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 active:scale-[0.985] transition-all text-white font-semibold rounded-2xl flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Product
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;