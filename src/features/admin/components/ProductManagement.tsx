import { useState } from 'react';
import { Trash2, Edit2, AlertTriangle, PackageSearch } from 'lucide-react';
import CreateProductModal from '@/components/ui/CreateProductModal';
import CategoryManagement from '@/components/ui/CategoryManagement';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct, type Product as APIProduct } from '@/api/product';

// ── Skeleton row for desktop table ──────────────────────────────────────────
const TableRowSkeleton = () => (
  <tr className="border-b border-slate-100 last:border-b-0">
    <td className="py-5 px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-slate-200 animate-pulse shrink-0" />
        <div className="space-y-2">
          <div className="h-3.5 w-32 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-2.5 w-48 bg-slate-100 rounded-full animate-pulse" />
        </div>
      </div>
    </td>
    <td className="py-5 px-4"><div className="h-6 w-20 bg-slate-200 rounded-xl animate-pulse" /></td>
    <td className="py-5 px-4"><div className="h-3.5 w-16 bg-slate-200 rounded-full animate-pulse" /></td>
    <td className="py-5 px-4"><div className="h-3.5 w-14 bg-slate-200 rounded-full animate-pulse" /></td>
    <td className="py-5 px-4"><div className="h-6 w-20 bg-slate-200 rounded-xl animate-pulse" /></td>
    <td className="py-5 px-6 lg:px-8 text-right">
      <div className="flex justify-end gap-3">
        <div className="h-3.5 w-10 bg-slate-200 rounded-full animate-pulse" />
        <div className="h-3.5 w-12 bg-slate-200 rounded-full animate-pulse" />
      </div>
    </td>
  </tr>
);

// ── Skeleton card for mobile ─────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
    <div className="w-full h-40 bg-slate-200 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="space-y-2">
        <div className="h-4 w-40 bg-slate-200 rounded-full animate-pulse" />
        <div className="h-3 w-full bg-slate-100 rounded-full animate-pulse" />
        <div className="h-3 w-3/4 bg-slate-100 rounded-full animate-pulse" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-6 w-20 bg-slate-200 rounded-xl animate-pulse" />
        <div className="h-6 w-20 bg-slate-200 rounded-xl animate-pulse" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="space-y-2">
          <div className="h-7 w-24 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-3 w-16 bg-slate-100 rounded-full animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-16 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-9 w-20 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

// ── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ onCreateClick }: { onCreateClick: () => void }) => (
  <div className="bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-5">
      <PackageSearch className="w-10 h-10 text-emerald-500" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">No products yet</h3>
    <p className="text-slate-500 text-sm max-w-xs mb-6">
      You haven't added any products. Create your first product to get started.
    </p>
    <button
      onClick={onCreateClick}
      className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all text-white px-8 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2"
    >
      + Create Product
    </button>
  </div>
);

// ── Main component ───────────────────────────────────────────────────────────
const ProductManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: productsResp, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(1, 100),
    staleTime: 5 * 60 * 1000,
  });

  const products = productsResp?.products ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
    setDeleteConfirmId(null);
  };

  const handleCloseModal = () => setIsCreateModalOpen(false);

  const SKELETON_COUNT = 5;

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
            {/* ── Skeleton rows while loading ── */}
            {isLoading
              ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <TableRowSkeleton key={i} />)
              : products.map((product: APIProduct) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-5 px-6 lg:px-8">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            (product as unknown as { imageUrl: string }).imageUrl ||
                            (product as unknown as { image: string }).image ||
                            ''
                          }
                          alt={(product as unknown as { name: string }).name || ''}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 text-sm lg:text-base">{product.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5 max-w-60 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-xl whitespace-nowrap">
                        {product.category?.name ?? product.categoryId}
                      </span>
                    </td>
                    <td className="py-5 px-4 font-semibold text-emerald-600 text-sm whitespace-nowrap">
                      ₦{Number(product.price).toLocaleString()}
                    </td>
                    <td className="py-5 px-4 text-slate-600 text-sm whitespace-nowrap">
                      {product.quantityInStock} units
                    </td>
                    <td className="py-5 px-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-xl whitespace-nowrap ${
                          product.quantityInStock > 10
                            ? 'bg-emerald-100 text-emerald-700'
                            : product.quantityInStock > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.stockStatus}
                      </span>
                    </td>
                    <td className="py-5 px-6 lg:px-8 text-right whitespace-nowrap">
                      <button className="text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer mr-4 text-sm font-medium transition-colors inline-flex items-center gap-1">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(product.id)}
                        className="text-red-500 hover:text-red-700 hover:underline cursor-pointer text-sm font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {/* Empty state inside table container */}
        {!isLoading && products.length === 0 && (
          <EmptyState onCreateClick={() => setIsCreateModalOpen(true)} />
        )}
      </div>

      {/* ── Mobile Card View (md-) ── */}
      <div className="md:hidden space-y-4">
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <CardSkeleton key={i} />)
          : products.length === 0
          ? <EmptyState onCreateClick={() => setIsCreateModalOpen(true)} />
          : products.map((product: APIProduct) => (
              <div
                key={product.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors"
              >
                <img
                  src={
                    (product as unknown as { imageUrl: string }).imageUrl ||
                    (product as unknown as { image: string }).image ||
                    ''
                  }
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">{product.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-xl font-medium">
                      {product.category?.name || product.categoryId}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-xl ${
                        product.quantityInStock > 10
                          ? 'bg-emerald-100 text-emerald-700'
                          : product.quantityInStock > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.stockStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">
                        ₦{Number(product.price).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{product.quantityInStock} units</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-1">
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(product.id)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Modals */}
      <CreateProductModal isOpen={isCreateModalOpen} onClose={handleCloseModal} />
      <CategoryManagement isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Delete Product?</h3>
            <p className="text-center text-slate-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="cursor-pointer flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId!)}
                className="cursor-pointer flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;