// src/features/browse/BrowsePage.tsx
import { useState } from 'react';
import { Search, ArrowLeft, Package as PackageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import BrowseTabs from './components/BrowseTabs';
import ProductCard from './components/ProductCard';
import { useAvailablePackages } from '@/app/store/PackageStore';
import { getProducts, type Product } from '@/api/product';
import type { Package } from '@/api/package';

// ─── Transform API Package → card item ────────────────────────────────────────

function toPackageCardItem(pkg: Package) {
  return {
    id: pkg.id,
    title: pkg.name,
    price: typeof pkg.totalPrice === 'string' ? parseFloat(pkg.totalPrice) : pkg.totalPrice,
    category: pkg.category?.name ?? 'Package',
    type: 'package' as const,
    duration: `${pkg.duration} month${pkg.duration !== 1 ? 's' : ''}`,
    frequency: pkg.paymentFrequency.charAt(0).toUpperCase() + pkg.paymentFrequency.slice(1),
    description: pkg.description,
    image: '',
    packageItems: pkg.items?.map((i) => `${i.quantity} ${i.itemName}`) ?? [],
  };
}

// ─── Transform API Product → card item ────────────────────────────────────────

function toProductCardItem(product: Product) {
  return {
    id: product.id,
    title: product.name,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    category: product.category?.name ?? 'Product',
    type: 'product' as const,
    duration: undefined,
    frequency: undefined,
    description: product.description,
    image: product.imageUrl ?? '',
    packageItems: [],
    stockStatus: product.stockStatus,
    quantityInStock: product.quantityInStock,
  };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 animate-pulse flex flex-col gap-4">
      <div className="h-4 bg-slate-200 rounded-full w-1/3" />
      <div className="h-5 bg-slate-200 rounded-full w-2/3" />
      <div className="h-8 bg-slate-100 rounded-full w-1/2" />
      <div className="h-3 bg-slate-100 rounded-full w-full" />
      <div className="h-3 bg-slate-100 rounded-full w-4/5" />
      <div className="mt-auto h-12 bg-slate-200 rounded-2xl" />
    </div>
  );
}

// ─── BrowsePage ───────────────────────────────────────────────────────────────

const BrowsePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'packages' | 'products'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Packages
  const {
    data: packages,
    isLoading: packagesLoading,
    error: packagesError,
    refetch: refetchPackages,
  } = useAvailablePackages();

  // Products
  const {
    data: productsResp,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ['products', 'browse'],
    queryFn: () => getProducts(1, 100),
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = packagesLoading || productsLoading;
  const error = packagesError || productsError;

  const refetchAll = () => {
    refetchPackages();
    refetchProducts();
  };

  // Merge both data sources into a unified list
  const packageItems = (packages ?? []).map(toPackageCardItem);
  const productItems = (productsResp?.products ?? []).map(toProductCardItem);
  const allItems = [...packageItems, ...productItems];

  // Derive category list from live data
  const categories = [
    'All Categories',
    ...Array.from(new Set(allItems.map((i) => i.category))),
  ];

  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'packages' && item.type === 'package') ||
      (activeTab === 'products' && item.type === 'product');
    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        <button
          onClick={() => navigate(-1)}
          className="flex cursor-pointer mb-2 items-center gap-2 text-slate-600 hover:text-emerald-900 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span className="font-medium text-sm">Back</span>
        </button>

        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Discover Premium Packages & Products
          </h1>
          <p className="text-slate-600 mt-3 text-base sm:text-lg max-w-2xl">
            Choose from flexible contribution packages or premium one-time purchase products
          </p>
        </div>

        <BrowseTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Search & Filter */}
        <div className="mt-10 bg-white rounded-3xl shadow-sm border border-slate-100 p-2">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-emerald-500" />
              <input
                type="text"
                placeholder="Search packages and products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-transparent border border-transparent focus:border-emerald-200 rounded-2xl focus:outline-none text-base placeholder:text-slate-400"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-200 px-6 py-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-base w-full md:w-80 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="mt-12 text-center py-16 bg-white rounded-3xl border border-red-200">
            <p className="text-red-600 mb-4">Failed to load items. Please try again.</p>
            <button
              onClick={refetchAll}
              className="text-sm text-red-600 underline hover:text-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && (
          <>
            <p className="mt-8 text-sm text-slate-500 font-medium">
              Showing {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredItems.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 mt-4">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <PackageIcon className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg">No items found matching your search.</p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default BrowsePage;