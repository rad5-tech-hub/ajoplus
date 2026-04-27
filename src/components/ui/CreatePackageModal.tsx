import { X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CreatePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PackageItem {
  id: number;
  name: string;
  quantity: string;
}

const CreatePackageModal = ({ isOpen, onClose }: CreatePackageModalProps) => {
  const [packageItems, setPackageItems] = useState<PackageItem[]>([
    { id: 1, name: '', quantity: '' }
  ]);

  // Form state (this was missing!)
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    paymentFrequency: 'Monthly',
    price: '',
    duration: '',
    description: '',
  });

  const addItem = () => {
    setPackageItems([...packageItems, { id: Date.now(), name: '', quantity: '' }]);
  };

  const removeItem = (id: number) => {
    if (packageItems.length === 1) return;
    setPackageItems(packageItems.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: 'name' | 'quantity', value: string) => {
    setPackageItems(packageItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.productName.trim() || !formData.category || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Creating package:', { ...formData, items: packageItems });
    alert('Package created successfully! (Mock)');
    onClose();

    // Reset form after submit (optional)
    setFormData({
      productName: '',
      category: '',
      paymentFrequency: 'Monthly',
      price: '',
      duration: '',
      description: '',
    });
    setPackageItems([{ id: 1, name: '', quantity: '' }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[94vh] overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 md:px-6 md:py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-600 rounded-xl flex items-center justify-center text-base">
                📦
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
              Create New Package
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-auto p-5 md:p-6 space-y-6">

          {/* Row 1: Name + Category + Payment Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Package Name <span className="text-red-500">*</span>
              </label>
              <input
                name="productName"
                type="text"
                placeholder="e.g., Special Food Package"
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 bg-white"
              >
                <option value="">Select category</option>
                <option value="Food & Groceries">Food & Groceries</option>
                <option value="Fashion">Fashion</option>
                <option value="Electronics">Electronics</option>
                <option value="Events">Events</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Payment Frequency <span className="text-red-500">*</span>
              </label>
              <select
                name="paymentFrequency"
                value={formData.paymentFrequency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 bg-white"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Row 2: Price + Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Total Price (₦) <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="text"
                placeholder="e.g., 350000"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                name="duration"
                type="text"
                placeholder="e.g., 12 months"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              name="description"
              placeholder="Brief description of the package..."
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-base border border-slate-200 rounded-3xl focus:outline-none focus:border-emerald-600 resize-y"
            />
          </div>

          {/* Package Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-slate-900">Package Items (Optional)</p>
                <p className="text-xs text-slate-500">Add items included in this package</p>
              </div>
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-2xl transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            <div className="space-y-4">
              {packageItems.map((item, index) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-start">
                  <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-sm font-medium shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    placeholder="Item name (e.g., Bag of Rice)"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    className="flex-1 px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600"
                  />
                  <input
                    type="text"
                    placeholder="Quantity (e.g., 1, 50kg)"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                    className="w-full sm:w-48 lg:w-56 px-4 py-3 text-base border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 p-2 mt-1 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-slate-100 p-5 md:p-6 flex flex-col sm:flex-row gap-3 md:gap-4">
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
            <Plus className="w-5 h-5" /> Create Package
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePackageModal;