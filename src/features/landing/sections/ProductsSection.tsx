// src/features/landing/sections/ProductsSection.tsx
import { ShoppingCart, Package } from 'lucide-react';

const ProductsSection = () => {
  const products = [
    {
      image:
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2070&auto=format&fit=crop',
      category: 'Food & Groceries',
      title: 'Premium Bag of Rice (50kg)',
      description: 'High-quality imported rice, perfect for families',
      price: '₦85,000',
      inStock: true,
    },
    {
      image:
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2070&auto=format&fit=crop',
      category: 'Food & Groceries',
      title: 'Bag of Beans (25kg)',
      description: 'Fresh brown beans, farm direct',
      price: '₦45,000',
      inStock: true,
    },
    {
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a9c?q=80&w=2070&auto=format&fit=crop',
      category: 'Food & Groceries',
      title: 'Groundnut Oil (5 Liters)',
      description: 'Pure groundnut oil, perfect for cooking',
      price: '₦12,500',
      inStock: true,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-5 text-emerald-700 text-sm font-bold rounded-full tracking-widest">
            ONE-TIME PURCHASE
          </span>
          <h2 className="mt-4 text-2xl md:text-4xl font-bold tracking-tighter text-slate-950">
            Available Products
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Buy products directly from King Donald's Global Ventures. Immediate delivery after
            payment.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:border-emerald-200 transition-all duration-300 group"
            >
              {/* Product Image */}
              <div className="relative h-56 bg-slate-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* In Stock Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-4 py-1 bg-emerald-600 text-white text-xs font-medium rounded-2xl">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                  {product.category}
                </p>

                <h3 className="text-xl font-semibold text-slate-900 leading-tight mb-3">
                  {product.title}
                </h3>

                <p className="text-slate-600 text-[15px] leading-relaxed mb-8 min-h-10.5">
                  {product.description}
                </p>

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-emerald-600">{product.price}</span>

                  <button className="flex items-center gap-2 text-sm cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-3 rounded-2xl transition-all active:scale-[0.97]">
                    <ShoppingCart className="w-5 h-5" />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 mx-auto w-full max-w-3xl px-4 sm:px-6">
          <div className="bg-[#ecfdf5] rounded-3xl p-6 sm:p-8 md:p-12">
            <h2 className="text-center text-xl sm:text-2xl font-bold tracking-tight text-slate-950 mb-8 sm:mb-10">
              Key Difference
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Contribution Packages */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all duration-200">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                  <Package className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" strokeWidth={2.25} />
                </div>
                <h3 className="text-[15px] sm:text-base font-semibold text-slate-900 mb-2 leading-snug">
                  Contribution Packages
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Pay in installments · Get after completion
                </p>
              </div>

              {/* Products */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all duration-200">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                  <ShoppingCart
                    className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600"
                    strokeWidth={2.25}
                  />
                </div>
                <h3 className="text-[15px] sm:text-base font-semibold text-slate-900 mb-2 leading-snug">
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
