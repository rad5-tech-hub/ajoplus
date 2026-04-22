import { X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProductModal = ({ isOpen, onClose }: CreateProductModalProps) => {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    description: '',
    price: '',
    quantity: '',
    status: 'In Stock' as 'In Stock' | 'Low Stock' | 'Out of Stock',
    imageUrl: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.productName.trim() || !formData.category || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }
    alert('Product created successfully! (Mock)');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[94vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 md:px-6 md:py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-600 rounded-xl flex items-center justify-center text-base">
                🛍️
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
              Create New Product
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-auto p-5 md:p-6 space-y-6">
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Product Image <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById('image-input')?.click()}>
              {imagePreview ? (
                <div className="relative w-full max-h-48">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setFormData({ ...formData, imageUrl: '' });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
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

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Premium Rice (50kg)"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 bg-white"
              >
                <option value="">Select category</option>
                <option>Food & Groceries</option>
                <option>Fashion</option>
                <option>Electronics</option>
                <option>Home & Garden</option>
                <option>Beauty & Health</option>
                <option>Others</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Price (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 25000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Quantity in Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 50"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Stock Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['In Stock', 'Low Stock', 'Out of Stock'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({ ...formData, status })}
                  className={`py-3 px-4 rounded-2xl font-medium transition-all ${
                    formData.status === status
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Product description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 text-base border border-slate-200 rounded-3xl focus:outline-none focus:border-emerald-600 resize-none"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-slate-100 p-5 md:p-6 flex gap-3 md:gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-2xl hover:bg-emerald-50 transition-colors text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.985] transition-all text-white font-semibold rounded-2xl flex items-center justify-center gap-2 text-base"
          >
            <Plus className="w-5 h-5" /> Create Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
