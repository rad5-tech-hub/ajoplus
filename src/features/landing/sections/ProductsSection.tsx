// src/features/landing/sections/ProductsSection.tsx
import { ShoppingCart, Package } from 'lucide-react';
import { useCartStore } from '@/app/store/CartStore';
import { useModalStore } from '@/app/store/ModalStore';

const ProductsSection = () => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { openModal, closeModal } = useModalStore();

  const products = [
    {
      id: "rice-50kg",
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2070&auto=format&fit=crop',
      category: 'Food & Groceries',
      title: 'Premium Bag of Rice (50kg)',
      description: 'High-quality imported rice, perfect for families',
      price: 85000,
    },
    {
      id: "beans-25kg",
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2070&auto=format&fit=crop',
      category: 'Food & Groceries',
      title: 'Bag of Beans (25kg)',
      description: 'Fresh brown beans, farm direct',
      price: 45000,
    },
    {
      id: "groundnut-oil-5l",
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a9c?q=80&w=2070&auto=format&fit=crop',
      category: 'Food & Groceries',
      title: 'Groundnut Oil (5 Liters)',
      description: 'Pure groundnut oil, perfect for cooking',
      price: 12500,
    },
  ];

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      type: 'product',
    });

    // Success feedback - consistent with ProductCard
    openModal({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.title} has been added successfully.`,
    });

    // Auto close after 2.5 seconds (same as your other pages)
    setTimeout(() => {
      closeModal();
    }, 2500);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:border-emerald-200 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
            >
              {/* Product Image */}
              <div className="relative aspect-4/3 sm:aspect-16/10 md:aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* In Stock Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3.5 py-1 bg-emerald-600 text-white text-xs font-medium rounded-2xl shadow-sm">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                  {product.category}
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight mb-3 line-clamp-2 min-h-13">
                  {product.title}
                </h3>

                <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed mb-6 flex-1 line-clamp-3">
                  {product.description}
                </p>

                {/* Price and Button */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-2xl sm:text-3xl font-bold text-emerald-600">
                    ₦{product.price.toLocaleString()}
                  </span>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex cursor-pointer items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm sm:text-base px-5 py-3 rounded-2xl transition-all active:scale-[0.97] shadow-sm"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="cursor-pointer hidden md:inline">Add to Cart</span>
                    <span className="cursor-pointer md:hidden">Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Difference Section */}
        <div className="mt-16 md:mt-20 mx-auto w-full max-w-3xl px-2 sm:px-4">
          <div className="bg-[#ecfdf5] rounded-3xl p-6 sm:p-8 md:p-12">
            <h2 className="text-center text-xl sm:text-2xl font-bold tracking-tight text-slate-950 mb-8 sm:mb-10">
              Key Difference
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" strokeWidth={2.25} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                  Contribution Packages
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Pay in installments · Get after completion
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                  <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" strokeWidth={2.25} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                  Products
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Pay once · Immediate delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;