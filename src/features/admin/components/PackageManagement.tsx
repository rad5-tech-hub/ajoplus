// src/features/admin/components/PackageManagement.tsx
import { useState, useMemo } from 'react';
import { Trash2, Edit2, AlertTriangle } from 'lucide-react';
import CreatePackageModal from '@/components/ui/CreatePackageModal';
import CategoryManagement from '@/components/ui/CategoryManagement';
import { useAvailablePackages } from '@/app/store/PackageStore';
import type { Package as APIPackage } from '@/api/package';

// ─── Display shape (UI only) ──────────────────────────────────────────────────

interface DisplayPackage {
  id: string;
  name: string;
  desc: string;
  category: string;
  price: string;
  duration: string;
  frequency: string;
}

function toDisplay(pkg: APIPackage): DisplayPackage {
  const price = typeof pkg.totalPrice === 'string' ? parseFloat(pkg.totalPrice) : pkg.totalPrice;
  return {
    id: pkg.id,
    name: pkg.name,
    desc: pkg.description,
    category:
      pkg.category && typeof pkg.category !== 'string'
        ? pkg.category.name
        : (pkg.category as string | undefined) ?? 'Uncategorised',
    price: `₦${price.toLocaleString('en-NG')}`,
    duration: `${pkg.duration} month${pkg.duration !== 1 ? 's' : ''}`,
    frequency: pkg.paymentFrequency.charAt(0).toUpperCase() + pkg.paymentFrequency.slice(1),
  };
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="py-5 px-4">
          <div className="h-4 bg-slate-200 rounded-full animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse space-y-3">
      <div className="h-4 bg-slate-200 rounded-full w-1/2" />
      <div className="h-3 bg-slate-100 rounded-full w-full" />
      <div className="h-3 bg-slate-100 rounded-full w-2/3" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const PackageManagement = () => {
  const { data: apiPackages, isLoading, error, refetch } = useAvailablePackages();
  const packages = useMemo(() => (apiPackages ?? []).map(toDisplay), [apiPackages]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingPackage, setEditingPackage] = useState<APIPackage | null>(null);
  // const deletePackageMutation = useDeletePackage();

  // TODO: wire to DELETE /api/package/packages/:id when endpoint is ready
  // const handleDelete = (id: string | null) => {
  //   if (!id) return;
  //   deletePackageMutation.mutate(id);
  //   setDeleteConfirmId(null);
  // };

  const handleEditClick = (id: string) => {
    setEditingPackage(apiPackages?.find((p) => p.id === id) ?? null);
    setIsCreateModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">All Packages</h2>
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
            + <span>Create</span> Package
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {/* !!error collapses `unknown | Error | null` → boolean, preventing the   */}
      {/* "Type 'unknown' is not assignable to type 'ReactNode'" TS error that    */}
      {/* occurs when `unknown` propagates through the && chain into JSX.         */}
      {!!error && !isLoading && (
        <div className="bg-white border border-red-200 rounded-3xl p-8 text-center mb-6">
          <p className="text-red-600 mb-3">Failed to load packages</p>
          <button
            onClick={() => refetch()}
            className="text-sm text-red-600 underline hover:text-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && !error && packages.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5">
            <span className="text-3xl">📦</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Packages Yet</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
            Get started by creating your first package. It will appear here once added.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all text-white px-6 py-3 rounded-2xl font-semibold text-sm inline-flex items-center gap-2"
          >
            + Create Package
          </button>
        </div>
      )}

      {/* ── Desktop Table (md+) ── */}
      {(isLoading || packages.length > 0) && (
        <div className="hidden md:block bg-white rounded-3xl overflow-hidden border border-slate-100">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-5 px-6 lg:px-8 font-medium text-slate-500 text-sm">Package Name</th>
                <th className="text-left py-5 px-4 font-medium text-slate-500 text-sm">Category</th>
                <th className="text-left py-5 px-4 font-medium text-slate-500 text-sm">Price</th>
                <th className="text-left py-5 px-4 font-medium text-slate-500 text-sm">Duration</th>
                <th className="text-left py-5 px-4 font-medium text-slate-500 text-sm">Frequency</th>
                <th className="text-right py-5 px-6 lg:px-8 font-medium text-slate-500 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)
                : packages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-5 px-6 lg:px-8">
                      <p className="font-semibold text-slate-900 text-sm lg:text-base">{pkg.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 max-w-55">{pkg.desc}</p>
                    </td>
                    <td className="py-5 px-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-xl whitespace-nowrap">
                        {pkg.category}
                      </span>
                    </td>
                    <td className="py-5 px-4 font-semibold text-emerald-600 text-sm whitespace-nowrap">
                      {pkg.price}
                    </td>
                    <td className="py-5 px-4 text-slate-600 text-sm whitespace-nowrap">{pkg.duration}</td>
                    <td className="py-5 px-4 text-slate-600 text-sm">{pkg.frequency}</td>
                    <td className="py-5 px-6 lg:px-8 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(pkg.id)}
                        className="text-emerald-600 cursor-pointer hover:text-emerald-700 mr-4 text-sm font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(pkg.id)}
                        className="text-red-600 hover:text-red-700 hover:underline cursor-pointer text-sm font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Mobile Cards (below md) ── */}
      {(isLoading || packages.length > 0) && (
        <div className="md:hidden space-y-3">
          {isLoading
            ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            : packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm leading-snug">{pkg.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{pkg.desc}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg whitespace-nowrap shrink-0">
                    {pkg.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="font-bold text-emerald-600 text-sm">{pkg.price}</span>
                  <span className="text-slate-300">·</span>
                  <span>{pkg.duration}</span>
                  <span className="text-slate-300">·</span>
                  <span>{pkg.frequency}</span>
                </div>
                <div className="flex gap-3 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => handleEditClick(pkg.id)}
                    className="flex-1 text-center text-emerald-600 cursor-pointer text-sm font-medium py-1.5 rounded-lg hover:bg-emerald-50 transition-colors inline-flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <div className="w-px bg-slate-100" />
                  <button
                    onClick={() => setDeleteConfirmId(pkg.id)}
                    className="flex-1 text-center text-red-500 cursor-pointer text-sm font-medium py-1.5 rounded-lg hover:bg-red-50 transition-colors inline-flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      <CreatePackageModal
        isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); setEditingPackage(null); }}
        initialPackage={editingPackage}
      />

      <CategoryManagement
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      {/* ── Delete Confirmation ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Delete Package?</h3>
            <p className="text-center text-slate-600 mb-6">
              Are you sure you want to delete &quot;{packages.find((p) => p.id === deleteConfirmId)?.name}&quot;?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                // onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
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

export default PackageManagement;