import { useState } from 'react';
import CreateProductModal from '@/components/ui/CreateProductModal';
import CategoryManagement from '@/components/ui/CategoryManagement';

const products = [
  {
    id: '1',
    name: 'Premium Bag of Rice (50kg)',
    desc: 'High-quality imported rice, perfect for families',
    category: 'Food & Groceries',
    price: '₦85,000',
    quantity: 45,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800',
  },
  {
    id: '2',
    name: 'Bag of Beans (25kg)',
    desc: 'Fresh brown beans, farm direct',
    category: 'Food & Groceries',
    price: '₦45,000',
    quantity: 12,
    status: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800',
  },
  {
    id: '3',
    name: 'Groundnut Oil (5 Liters)',
    desc: 'Pure groundnut oil, perfect for cooking',
    category: 'Food & Groceries',
    price: '₦12,500',
    quantity: 0,
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1626645739622-0c5c3b2b9c5e?q=80&w=800',
  },
  {
    id: '4',
    name: 'Frozen Chicken (Carton)',
    desc: 'Fresh frozen chicken, 10kg carton',
    category: 'Food & Groceries',
    price: '₦35,000',
    quantity: 28,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1607623812832-9d5d6c6d8f0f?q=80&w=800',
  },
];

const ProductManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-100 text-emerald-700';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-700';
      case 'Out of Stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">All Products</h2>
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="cursor-pointer bg-slate-200 hover:bg-slate-300 active:scale-95 transition-all text-slate-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base whitespace-nowrap"
          >
            📁 Manage Categories
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base whitespace-nowrap flex items-center gap-1.5"
          >
            + <span className="xs:inline">Create</span> Product
          </button>
        </div>
      </div>

      {/* ── Desktop Table (md+) ── */}
      <div className="hidden md:block bg-white rounded-3xl overflow-hidden border border-slate-100">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-5 px-6 lg:px-8 font-medium text-slate-500 text-sm">Product Name</th>
              <th className="text-left py-5 px-4 font-medium text-slate-500 text-sm">Category</th>
              <th className="text-left py-5 px-4 font-medium text-slate-500 text-sm">Price</th>
              <th className="text-left py-5 px-4 font-medium text-slate-500 text-sm">Quantity</th>
              <th className="text-left py-5 px-4 font-medium text-slate-500 text-sm">Status</th>
              <th className="text-right py-5 px-6 lg:px-8 font-medium text-slate-500 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                <td className="py-5 px-6 lg:px-8">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm lg:text-base">{product.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 max-w-60 line-clamp-1">{product.desc}</p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-xl whitespace-nowrap">
                    {product.category}
                  </span>
                </td>
                <td className="py-5 px-4 font-semibold text-emerald-600 text-sm whitespace-nowrap">{product.price}</td>
                <td className="py-5 px-4 text-slate-600 text-sm whitespace-nowrap">{product.quantity} units</td>
                <td className="py-5 px-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-xl whitespace-nowrap ${getStatusBadgeColor(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="py-5 px-6 lg:px-8 text-right whitespace-nowrap">
                  <span className="text-emerald-600 hover:underline cursor-pointer mr-4 text-sm">Edit</span>
                  <span className="text-red-500 hover:underline cursor-pointer text-sm">Delete</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Card View (md-) ── */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors"
          >
            {/* Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">{product.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.desc}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-xl font-medium">
                  {product.category}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded-xl ${getStatusBadgeColor(product.status)}`}>
                  {product.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{product.price}</p>
                  <p className="text-xs text-slate-500 mt-1">{product.quantity} units</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-xl text-sm font-medium transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <CreateProductModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <CategoryManagement isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
    </div>
  );
};

export default ProductManagement;
