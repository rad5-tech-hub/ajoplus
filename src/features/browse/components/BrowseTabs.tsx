// src/features/browse/components/BrowseTabs.tsx
import { Package, ShoppingBag } from 'lucide-react';

interface BrowseTabsProps {
  activeTab: 'all' | 'packages' | 'products';
  onTabChange: (tab: 'all' | 'packages' | 'products') => void;
}

const BrowseTabs = ({ activeTab, onTabChange }: BrowseTabsProps) => {
  return (
    <div className="flex gap-2 border-b border-slate-200 pb-px">
      <button
        onClick={() => onTabChange('all')}
        className={`px-6 py-3 rounded-t-2xl font-medium text-sm transition-all flex items-center gap-2 ${
          activeTab === 'all'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        All Items
      </button>

      <button
        onClick={() => onTabChange('packages')}
        className={`px-6 py-3 rounded-t-2xl font-medium text-sm transition-all flex items-center gap-2 ${
          activeTab === 'packages'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <Package className="w-4 h-4" />
        Contribution Packages
      </button>

      <button
        onClick={() => onTabChange('products')}
        className={`px-6 py-3 rounded-t-2xl font-medium text-sm transition-all flex items-center gap-2 ${
          activeTab === 'products'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <ShoppingBag className="w-4 h-4" />
        One-Time Products
      </button>
    </div>
  );
};

export default BrowseTabs;