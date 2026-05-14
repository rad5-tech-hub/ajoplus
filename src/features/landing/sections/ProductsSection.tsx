import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/app/store/CartStore';
import { useModalStore } from '@/app/store/ModalStore';
import { getProducts } from '@/api/product';

interface ProductDisplay {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  price: number;
}

const FALLBACK_PRODUCTS: ProductDisplay[] = [
  {
    id: 'rice-50kg-fallback', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2070&auto=format&fit=crop',
    category: 'Food & Groceries', title: 'Premium Bag of Rice (50kg)',
    description: 'High-quality imported rice, perfect for families', price: 85000,
  },
  {
    id: 'beans-25kg-fallback', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2070&auto=format&fit=crop',
    category: 'Food & Groceries', title: 'Bag of Beans (25kg)',
    description: 'Fresh brown beans, farm direct', price: 45000,
  },
  {
    id: 'oil-5l-fallback', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a9c?q=80&w=2070&auto=format&fit=crop',
    category: 'Food & Groceries', title: 'Groundnut Oil (5 Liters)',
    description: 'Pure groundnut oil, perfect for cooking', price: 12500,
  },
];

const ProductsSection = () => {
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);
  const { openModal, closeModal } = useModalStore();

  useEffect(() => {
    let mounted = true;
    getProducts(1, 6)
      .then((data) => {
        if (!mounted) return;
        if (data.products.length > 0) {
          setProducts(data.products.map((p) => ({
            id: p.id,
            image: p.imageUrl || FALLBACK_PRODUCTS[0].image,
            category: p.category?.name || 'Products',
            title: p.name,
            description: p.description || '',
            price: parseFloat(p.price),
          })));
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
      })
      .catch(() => { if (mounted) setProducts(FALLBACK_PRODUCTS); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleAddToCart = (product: ProductDisplay) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      type: 'product',
    });
    openModal({ type: 'success', title: 'Added to Cart', message: `${product.title} has been added successfully.` });
    setTimeout(() => closeModal(), 2500);
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16 animate-pulse">
            <div className="h-5 bg-slate-200 rounded-full w-28 mx-auto" />
            <div className="h-8 bg-slate-200 rounded-full w-56 mx-auto mt-6" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-5 py-1.5 text-emerald-700 text-xs sm:text-sm font-bold rounded-full tracking-widest border border-emerald-200">
            ONE-TIME PURCHASE
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-slate-950">
            Available Products
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            Buy products directly from King Donald's Global Ventures. Immediate delivery after payment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:border-emerald-200 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
            >
              <div className="relative aspect-4/3 sm:aspect-16/10 md:aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_PRODUCTS[0].image; }}
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3.5 py-1 bg-emerald-600 text-white text-xs font-medium rounded-2xl shadow-sm">
                    In Stock
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                  {product.category}
                </p>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight mb-3 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed mb-6 flex-1 line-clamp-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-2xl sm:text-3xl font-bold text-emerald-600">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm sm:text-base px-5 py-3 rounded-2xl transition-all active:scale-[0.97] shadow-sm cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden md:inline">Add to Cart</span>
                    <span className="md:hidden">Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
