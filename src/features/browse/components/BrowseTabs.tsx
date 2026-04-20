// src/features/browse/components/BrowseTabs.tsx
import { Package, ShoppingBag, Grid3X3 } from 'lucide-react';

interface BrowseTabsProps {
  activeTab: 'all' | 'packages' | 'products';
  onTabChange: (tab: 'all' | 'packages' | 'products') => void;
}

const BrowseTabs = ({ activeTab, onTabChange }: BrowseTabsProps) => {
  return (
    <div className="relative">
      {/* Subtle background accent */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-slate-200" />

      <div className="flex items-center gap-2 overflow-x-auto pb-4 -mb-4 scrollbar-hide">
        <button
          onClick={() => onTabChange('all')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all active:scale-95
            ${activeTab === 'all'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <Grid3X3 className="w-4 h-4" />
          All Items
        </button>

        <button
          onClick={() => onTabChange('packages')}
          className={`flex cursor-pointer items-center gap-2 px-5 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all active:scale-95
            ${activeTab === 'packages'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <Package className="w-4 h-4" />
          <span className="hidden sm:inline">Contribution Packages</span>
          <span className="sm:hidden">Packages</span>
        </button>

        <button
          onClick={() => onTabChange('products')}
          className={`flex items-center cursor-pointer gap-2 px-5 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all active:scale-95
            ${activeTab === 'products'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">One-Time Products</span>
          <span className="sm:hidden">Products</span>
        </button>
      </div>
    </div>
  );
};

export default BrowseTabs;