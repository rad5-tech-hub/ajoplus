import { useState } from 'react';
import { Trash2, Edit2, AlertTriangle } from 'lucide-react';
import CreatePackageModal from '@/components/ui/CreatePackageModal';
import CategoryManagement from '@/components/ui/CategoryManagement';

interface Package {
  id: string;
  name: string;
  desc: string;
  category: string;
  price: string;
  duration: string;
  frequency: string;
}

const initialPackages: Package[] = [
  {
    id: '1',
    name: "Special Food Package",
    desc: "Complete food package with essential items - ₦1,000 daily from Jan. - Dec.",
    category: "Food & Groceries",
    price: "₦350,000",
    duration: "12 months",
    frequency: "Daily",
  },
  {
    id: '2',
    name: "Rice Package",
    desc: "Essential rice and groceries package - ₦250 daily",
    category: "Food & Groceries",
    price: "₦97,500",
    duration: "12 months",
    frequency: "Daily",
  },
  {
    id: '3',
    name: "Garri Package",
    desc: "Garri and staples package - ₦250 daily",
    category: "Food & Groceries",
    price: "₦91,200",
    duration: "12 months",
    frequency: "Daily",
  },
  {
    id: '4',
    name: "Provision Package",
    desc: "Household provisions - ₦250 daily",
    category: "Food & Groceries",
    price: "₦91,200",
    duration: "12 months",
    frequency: "Daily",
  },
  {
    id: '5',
    name: "Fashion Package",
    desc: "Update your wardrobe",
    category: "Fashion",
    price: "₦100,000",
    duration: "5 months",
    frequency: "Weekly",
  },
  {
    id: '6',
    name: "Wedding Package",
    desc: "Plan your dream wedding",
    category: "Events",
    price: "₦1,000,000",
    duration: "18 months",
    frequency: "Monthly",
  },
];

const PackageManagement = () => {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
    setDeleteConfirmId(null);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingPackage(null);
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
            + <span className="xs:inline">Create</span> Package
          </button>
        </div>
      </div>

      {/* ── Desktop Table (md+) ── */}
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
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                <td className="py-5 px-6 lg:px-8">
                  <p className="font-semibold text-slate-900 text-sm lg:text-base">{pkg.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-55">{pkg.desc}</p>
                </td>
                <td className="py-5 px-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-xl whitespace-nowrap">
                    {pkg.category}
                  </span>
                </td>
                <td className="py-5 px-4 font-semibold text-emerald-600 text-sm whitespace-nowrap">{pkg.price}</td>
                <td className="py-5 px-4 text-slate-600 text-sm whitespace-nowrap">{pkg.duration}</td>
                <td className="py-5 px-4 text-slate-600 text-sm">{pkg.frequency}</td>
                <td className="py-5 px-6 lg:px-8 text-right whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer mr-4 text-sm font-medium transition-colors inline-flex items-center gap-1"
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

      {/* ── Mobile Cards (below md) ── */}
      <div className="md:hidden space-y-3">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-2xl border border-slate-100 p-4">
            {/* Name + category */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm leading-snug">{pkg.name}</p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{pkg.desc}</p>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg whitespace-nowrap shrink-0">
                {pkg.category}
              </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
              <span className="font-bold text-emerald-600 text-sm">{pkg.price}</span>
              <span className="text-slate-300">·</span>
              <span>{pkg.duration}</span>
              <span className="text-slate-300">·</span>
              <span>{pkg.frequency}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-slate-100 pt-3">
              <button
                onClick={() => handleEdit(pkg)}
                className="flex-1 text-center text-emerald-600 text-sm font-medium py-1.5 rounded-lg hover:bg-emerald-50 transition-colors inline-flex items-center justify-center gap-1"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <div className="w-px bg-slate-100" />
              <button
                onClick={() => setDeleteConfirmId(pkg.id)}
                className="flex-1 text-center text-red-500 text-sm font-medium py-1.5 rounded-lg hover:bg-red-50 transition-colors inline-flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create New Package Modal */}
      <CreatePackageModal 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseModal} 
      />

      {/* Category Management Modal */}
      <CategoryManagement 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">
              Delete Package?
            </h3>
            <p className="text-center text-slate-600 mb-6">
              Are you sure you want to delete "{packages.find(p => p.id === deleteConfirmId)?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
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