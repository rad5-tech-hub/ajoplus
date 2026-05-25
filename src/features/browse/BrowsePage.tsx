import { useState, useEffect, useRef } from 'react';
import { Search, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/app/store/authStore';
import { useCartStore, useAddToCart } from '@/app/store/CartStore';
import { useModalStore } from '@/app/store/ModalStore';
import { fetchPublicPackages, fetchPublicProducts } from '@/api/public';
import type { PublicProduct } from '@/api/public';
import { formatNaira, formatFrequency, getCategoryName } from './types';
import BrowseTabs from './components/BrowseTabs';
import ProductCard from './components/ProductCard';
import Modal from '@/components/ui/GeneralModal';

type Tab = 'all' | 'packages' | 'products';

function BrowsePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const addToCartMutation = useAddToCart();
  const { openModal, closeModal } = useModalStore();
  const productsTopRef = useRef<HTMLDivElement>(null);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [page, setPage] = useState(1);

  const { data: packages = [], isLoading: pkgLoading, isError: pkgErr, refetch: refetchPkgs } = useQuery({
    queryKey: ['publicPackages'],
    queryFn: fetchPublicPackages,
    staleTime: 5 * 60 * 1000,
  });

  const { data: productsResp, isLoading: prodLoading, isError: prodErr, refetch: refetchProds } = useQuery({
    queryKey: ['publicProducts', page],
    queryFn: () => fetchPublicProducts(page),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => { productsTopRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [page]);

  const products = productsResp?.products ?? [];
  const pagination = productsResp?.pagination;
  const isLoading = pkgLoading || prodLoading;
  const isError = pkgErr || prodErr;

  const refetchAll = () => { refetchPkgs(); refetchProds(); };

  function handleJoinPackage(pkgId: string) {
    if (!isAuthenticated) { navigate(`/signup?redirect=/browse&packageId=${pkgId}`); return; }
    navigate(`/dashboard/customer/package/${pkgId}`);
  }

  function handleAddToCart(product: PublicProduct) {
    if (isAuthenticated) {
      addToCartMutation.mutate({
        itemId: product.id, type: 'product', quantity: 1, price: parseFloat(product.price),
        title: product.name, image: product.imageUrl,
      });
    } else {
      useCartStore.getState().addToCart({
        id: product.id, title: product.name, price: parseFloat(product.price),
        image: product.imageUrl, type: 'product',
      });
    }
    openModal({ type: 'success', title: 'Added to Cart', message: `${product.name} has been added successfully.` });
    setTimeout(() => closeModal(), 2500);
  }

  // Derived categories
  const allCategories = [
    'All Categories',
    ...Array.from(new Set([
      ...packages.map((p) => getCategoryName(p.category)),
      ...products.map((p) => p.category?.name ?? 'Product'),
    ])),
  ];

  // Filtered data per tab
  const filteredPackages = packages.filter((p) => {
    const name = p.name.toLowerCase();
    const cat = getCategoryName(p.category).toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || cat.includes(q);
  });

  const filteredProducts = products.filter((p) => {
    const name = p.name.toLowerCase();
    const cat = (p.category?.name ?? '').toLowerCase();
    const q = searchTerm.toLowerCase();
    const catMatch = selectedCategory === 'All Categories' || (p.category?.name ?? '') === selectedCategory;
    return catMatch && (name.includes(q) || cat.includes(q));
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <button onClick={() => navigate(-1)}
          className="flex cursor-pointer mb-2 items-center gap-2 text-slate-600 hover:text-amber-800 transition-colors">
          <ArrowLeft className="w-3 h-3" />
          <span className="font-medium text-sm">Back</span>
        </button>

        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-brand-900 leading-tight">
              Discover Premium Packages & Products
            </h1>
            <p className="text-slate-600 mt-3 text-base sm:text-lg max-w-2xl">
              Choose from flexible contribution packages or premium one-time purchase products
            </p>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 rounded-xl bg-white border border-amber-200 hover:bg-amber-50 transition-all shrink-0"
            aria-label="View cart"
          >
            <ShoppingCart className="w-5 h-5 text-amber-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>

        <BrowseTabs activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); setPage(1); }} />

        {/* Search & Filter */}
        <div ref={productsTopRef} className="mt-10 bg-white rounded-3xl shadow-sm border border-brand-200 p-2">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-brand-500" />
              <input type="text" placeholder="Search packages and products..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-transparent border border-transparent focus:border-brand-200 rounded-2xl focus:outline-none text-base placeholder:text-slate-400" />
            </div>
            {activeTab !== 'packages' && (
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-brand-200 px-6 py-4 rounded-2xl focus:outline-none focus:border-brand-500 text-base w-full md:w-80 cursor-pointer">
                {allCategories.map((cat) => <option key={cat}>{cat}</option>)}
              </select>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-brand-200 rounded-3xl p-6 animate-pulse flex flex-col gap-4">
                <div className="h-4 bg-slate-200 rounded-full w-1/3" />
                <div className="h-5 bg-slate-200 rounded-full w-2/3" />
                <div className="h-8 bg-slate-100 rounded-full w-1/2" />
                <div className="h-3 bg-slate-100 rounded-full w-full" />
                <div className="h-3 bg-slate-100 rounded-full w-4/5" />
                <div className="mt-auto h-12 bg-slate-200 rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="mt-12 text-center py-16 bg-white rounded-3xl border border-red-200">
            <p className="text-red-600 mb-4">Failed to load items. Please try again.</p>
            <button onClick={refetchAll} className="text-sm text-red-600 underline hover:text-red-700 cursor-pointer">Retry</button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !isError && (
          <>
            {/* Packages Tab */}
            {(activeTab === 'all' || activeTab === 'packages') && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-brand-900 mb-4">
                  {activeTab === 'all' ? 'Contribution Packages' : 'All Packages'}
                </h2>
                {filteredPackages.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-3xl border border-brand-200 mb-6">
                    <p className="text-slate-500">No packages found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredPackages.map((pkg) => (
                      <div key={pkg.id} className="bg-white border border-brand-200 rounded-3xl p-6 flex flex-col h-full hover:shadow-lg transition-shadow">
                        <div className="inline-block px-3 py-1 bg-brand-100 text-brand-700 text-xs font-medium rounded-2xl mb-3 w-fit">
                          {getCategoryName(pkg.category)}
                        </div>
                        <h3 className="font-semibold text-lg text-brand-900 mb-2">{pkg.name}</h3>
                        <p className="text-2xl font-bold text-brand-600 mb-4">{formatNaira(pkg.totalPrice)}</p>
                        <div className="text-sm text-slate-500 mb-3 space-y-1">
                          <p>Duration: {pkg.duration} month{pkg.duration !== 1 ? 's' : ''}</p>
                          <p>Frequency: {formatFrequency(pkg.paymentFrequency)}</p>
                        </div>
                        {pkg.items?.length > 0 && (
                          <div className="mb-3 text-sm">
                            <p className="font-medium text-slate-700 mb-1">Includes:</p>
                            <ul className="space-y-1">
                              {pkg.items.slice(0, 3).map((item, i) => (
                                <li key={i} className="text-slate-500 text-xs">• {item.quantity} {item.itemName}</li>
                              ))}
                              {pkg.items.length > 3 && <li className="text-xs text-slate-400">+{pkg.items.length - 3} more</li>}
                            </ul>
                          </div>
                        )}
                        <p className="text-xs text-slate-400 flex-1 line-clamp-2 mb-4">{pkg.description}</p>
                        <button onClick={() => handleJoinPackage(pkg.id)}
                          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-2xl text-sm transition-all active:scale-[0.985] cursor-pointer">
                          Join Package
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Products Tab */}
            {(activeTab === 'all' || activeTab === 'products') && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-brand-900 mb-4">
                  {activeTab === 'all' ? 'One-Time Products' : 'All Products'}
                </h2>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-3xl border border-brand-200">
                    <p className="text-slate-500">No products found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 bg-white border border-brand-200 rounded-2xl px-5 py-3">
                    <p className="text-sm text-slate-500">Page {pagination.page} of {pagination.totalPages}</p>
                    <div className="flex gap-2">
                      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                        className="px-4 py-2 border border-brand-200 rounded-2xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                        Previous
                      </button>
                      <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages}
                        className="px-4 py-2 border border-brand-200 rounded-2xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Modal />
    </div>
  );
}

export default BrowsePage;
