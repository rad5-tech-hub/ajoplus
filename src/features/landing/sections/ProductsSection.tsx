import { useQuery } from '@tanstack/react-query';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/app/store/CartStore';
import { useModalStore } from '@/app/store/ModalStore';
import { fetchPublicProducts } from '@/api/public';
import { formatNaira } from '@/features/browse/types';

const ProductsSection = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['publicProducts', 1],
    queryFn: () => fetchPublicProducts(1),
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.products ?? [];
  const addToCart = useCartStore((state) => state.addToCart);
  const { openModal, closeModal } = useModalStore();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      title: product.name,
      price: parseFloat(product.price),
      image: product.imageUrl,
      type: 'product',
    });
    openModal({ type: 'success', title: 'Added to Cart', message: `${product.name} has been added successfully.` });
    setTimeout(() => closeModal(), 2500);
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16 animate-pulse">
            <div className="h-5 bg-slate-200 rounded-full w-28 mx-auto" />
            <div className="h-8 bg-slate-200 rounded-full w-56 mx-auto mt-6" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => <div key={i} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-5 py-1.5 text-brand-700 text-xs sm:text-sm font-bold rounded-full tracking-widest border border-brand-200">
            ONE-TIME PURCHASE
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-brand-900">
            Available Products
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            Buy products directly from King Donald's Global Ventures. Immediate delivery after payment.
          </p>
        </div>

        {isError ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-red-200">
            <p className="text-red-600 mb-4 text-sm">Could not load products. Please try again.</p>
            <button onClick={() => refetch()} className="text-sm text-red-600 underline hover:text-red-700 cursor-pointer">Retry</button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">No products available right now.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-brand-200 rounded-3xl overflow-hidden hover:border-brand-400 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                <div className="relative aspect-4/3 sm:aspect-16/10 md:aspect-video bg-slate-100 overflow-hidden">
                  <img src={product.imageUrl} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-3.5 py-1 text-xs font-medium rounded-2xl shadow-sm
                      ${product.stockStatus === 'in_stock' ? 'bg-green-100 text-green-700' : ''}
                      ${product.stockStatus === 'low_stock' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${product.stockStatus === 'out_of_stock' ? 'bg-red-100 text-red-600' : ''}
                    `}>
                      {product.stockStatus === 'in_stock' ? 'In Stock' : product.stockStatus === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">{product.category?.name ?? 'Product'}</p>
                  <h3 className="text-lg sm:text-xl font-semibold text-brand-900 leading-tight mb-3 line-clamp-2">{product.name}</h3>
                  <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed mb-6 flex-1 line-clamp-3">{product.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div>
                      <span className="text-2xl sm:text-3xl font-bold text-brand-600">{formatNaira(product.price)}</span>
                      {product.dollarPrice && (
                        <p className="text-xs text-slate-500 mt-0.5">≈ ${parseFloat(product.dollarPrice).toFixed(2)} USD</p>
                      )}
                    </div>
                    <button onClick={() => handleAddToCart(product)}
                      disabled={product.stockStatus === 'out_of_stock'}
                      className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-sm sm:text-base px-5 py-3 rounded-2xl transition-all active:scale-[0.97] shadow-sm cursor-pointer">
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden md:inline">Add to Cart</span>
                      <span className="md:hidden">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
