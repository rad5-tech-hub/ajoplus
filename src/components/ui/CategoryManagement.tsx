import { useState } from 'react';
import { X, Plus, Trash2, Tag } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, type Category, createCategory, deleteCategory, } from '@/api/categories';

interface CategoryManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ── Skeleton row ── */
const SkeletonRow = () => (
  <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-start justify-between animate-pulse">
    <div className="flex-1 space-y-2.5">
      <div className="h-4 w-40 bg-slate-200 rounded-full" />
      <div className="h-3 w-64 bg-slate-100 rounded-full" />
      <div className="h-2.5 w-24 bg-slate-100 rounded-full" />
    </div>
    <div className="w-8 h-8 bg-slate-100 rounded-xl ml-4 shrink-0" />
  </div>
);

/* ── Empty state ── */
const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
      <Tag className="w-7 h-7 text-emerald-400" />
    </div>
    <p className="font-semibold text-slate-800 mb-1">No categories yet</p>
    <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-5">
      Categories help organise your Ajo packages. Create the first one to get started.
    </p>
    <button
      onClick={onAdd}
      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-2xl transition-all flex items-center gap-2"
    >
      <Plus className="w-4 h-4" /> Add First Category
    </button>
  </div>
);

const CategoryManagement = ({ isOpen, onClose }: CategoryManagementProps) => {
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  /* ── Optimistic add (replace with real POST endpoint when ready) ── */

  /* ── Add mutation — calls the real POST endpoint ── */
  const addMutation = useMutation({
    mutationFn: (payload: { name: string; description: string }) =>
      createCategory(payload),
    onSuccess: (newCat) => {
      queryClient.setQueryData<Category[]>(['categories'], (prev = []) => [
        ...prev,
        newCat,
      ]);
      setNewCategory({ name: '', description: '' });
      setIsAdding(false);
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to add category';
      // surface to your modal/toast system
      console.error('Create category failed:', message);
    },
  });

  /* ── Delete mutation — calls the real DELETE endpoint ── */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      setDeletingId(id);
      return deleteCategory(id).then(() => id);
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Category[]>(['categories'], (prev = []) =>
        prev.filter((c) => c.id !== id)
      );
      setDeletingId(null);
    },
    onError: () => setDeletingId(null),
  });

  const handleAdd = () => {
    if (!newCategory.name.trim()) return;
    addMutation.mutate(newCategory);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewCategory({ name: '', description: '' });
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 md:px-6 md:py-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">Manage Categories</h2>
            {!isLoading && (
              <p className="text-xs text-slate-400 mt-0.5">{categories.length} categories</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5 md:p-6 space-y-5">

          {/* Add new — only show the trigger button when not in adding mode and there are existing categories */}
          {!isAdding && categories.length > 0 && (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-4 border-2 border-dashed border-emerald-300 text-emerald-600 font-semibold rounded-2xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add New Category
            </button>
          )}

          {/* Add form */}
          {isAdding && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-4">
              <input
                type="text"
                placeholder="Category name (e.g., Home & Garden)"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-4 py-3 text-base border border-emerald-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition-all"
              />
              <textarea
                placeholder="Category description..."
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 text-base border border-emerald-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white resize-none transition-all"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2.5 border border-emerald-300 text-emerald-600 font-medium rounded-2xl hover:bg-emerald-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newCategory.name.trim() || addMutation.isPending}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none text-white font-medium rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  {addMutation.isPending ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Plus className="w-4 h-4" /> Add Category</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* List */}
          <div className="space-y-3">
            {categories.length > 0 && (
              <h3 className="font-semibold text-slate-900 text-base">Existing Categories</h3>
            )}

            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : categories.length === 0 && !isAdding ? (
              <EmptyState onAdd={() => setIsAdding(true)} />
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start justify-between hover:border-slate-300 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900">{category.name}</h4>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">{category.description}</p>
                    <p className="text-xs text-slate-400 mt-2">Created: {formatDate(category.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(category.id)}
                    disabled={deletingId === category.id}
                    className="text-red-400 hover:text-red-600 disabled:opacity-40 p-2 transition-colors shrink-0 ml-4"
                  >
                    {deletingId === category.id ? (
                      <span className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin block" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-5 md:p-6">
          <button
            onClick={onClose}
            className="w-full py-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-2xl hover:bg-emerald-50 transition-colors text-base"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default CategoryManagement;