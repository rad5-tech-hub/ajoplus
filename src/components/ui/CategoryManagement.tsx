import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface CategoryManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryManagement = ({ isOpen, onClose }: CategoryManagementProps) => {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Food & Groceries', description: 'Food items and grocery products', createdAt: '2024-01-15' },
    { id: '2', name: 'Fashion', description: 'Clothing and fashion items', createdAt: '2024-01-15' },
    { id: '3', name: 'Electronics', description: 'Electronics and gadgets', createdAt: '2024-01-15' },
    { id: '4', name: 'Events', description: 'Event planning and supplies', createdAt: '2024-01-15' },
  ]);

  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCategories([...categories, category]);
    setNewCategory({ name: '', description: '' });
    setIsAdding(false);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 md:px-6 md:py-5 border-b border-slate-100">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
            Manage Categories
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5 md:p-6 space-y-6">
          
          {/* Add New Category Section */}
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-4 border-2 border-dashed border-emerald-300 text-emerald-600 font-semibold rounded-2xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add New Category
            </button>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-4">
              <input
                type="text"
                placeholder="Category name (e.g., Home & Garden)"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-4 py-3 text-base border border-emerald-300 rounded-2xl focus:outline-none focus:border-emerald-600 bg-white"
              />
              <textarea
                placeholder="Category description..."
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 text-base border border-emerald-300 rounded-2xl focus:outline-none focus:border-emerald-600 bg-white resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewCategory({ name: '', description: '' });
                  }}
                  className="flex-1 py-2 border border-emerald-300 text-emerald-600 font-medium rounded-2xl hover:bg-emerald-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 text-lg">Existing Categories</h3>
            {categories.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No categories yet. Create one to get started!</p>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start justify-between hover:border-slate-300 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{category.name}</h4>
                    <p className="text-slate-500 text-sm mt-1">{category.description}</p>
                    <p className="text-xs text-slate-400 mt-2">Created: {category.createdAt}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-400 hover:text-red-600 p-2 transition-colors shrink-0 ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-slate-100 p-5 md:p-6 flex gap-3 md:gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-2xl hover:bg-emerald-50 transition-colors text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
