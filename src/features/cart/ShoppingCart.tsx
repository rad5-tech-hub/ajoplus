// src/features/cart/ShoppingCart.tsx
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/app/store/CartStore';
import { formatCurrency, convertToUSD } from '@/lib/currency';
import CustomerNavbar from '../customer/components/CustomerNavbar';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, clearCart, updateQuantity } = useCartStore();

  const itemCount = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const processingFee = 0;
  const total = subtotal + processingFee;

  const handleQuantityChange = (id: string, type: 'inc' | 'dec') => {
    const item = items.find((item) => item.id === id);
    if (!item) return;

    const currentQty = Number(item.quantity || 0);

    if (type === 'inc') {
      updateQuantity(id, currentQty + 1);
    } else {
      updateQuantity(id, currentQty - 1);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <CustomerNavbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Your cart is empty
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added anything yet.
          </p>

          <button
            onClick={() => navigate('/browse')}
            className="w-full sm:w-auto bg-emerald-600 text-white px-6 sm:px-8 py-3.5 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <CustomerNavbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Back</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Shopping Cart
          </h1>
        </div>

        <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8">
          {itemCount} items in your cart
        </p>

        {/* ── Grid ── */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">

          {/* ── Left column: items ── */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {items.map((item) => {
              const safeQty = Number(item.quantity || 0);
              const safePrice = Number(item.price || 0);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 border border-slate-100 shadow-sm"
                >
                  <div className="w-full sm:w-24 sm:h-24 h-40 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                    <img
                      src={item.image || `https://picsum.photos/id/${parseInt(item.id) || 292}/300/300`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                        {item.type === 'product' ? 'Product' : 'Package'}
                      </span>
                    </div>

                    <h3 className="font-semibold text-base sm:text-lg text-slate-900 leading-tight mb-1">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 mb-4">
                      {item.type === 'product'
                        ? 'One-time purchase'
                        : 'Contribution package'}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center justify-between sm:justify-start gap-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, 'dec')}
                          className="w-9 h-9 flex items-center justify-center border border-slate-300 rounded-full hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="font-medium w-8 text-center">
                          {safeQty}
                        </span>

                        <button
                          onClick={() => handleQuantityChange(item.id, 'inc')}
                          className="w-9 h-9 flex items-center justify-center border border-slate-300 rounded-full hover:bg-slate-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <div className="font-bold text-emerald-600 text-lg sm:text-xl">
                            {formatCurrency(safePrice * safeQty, 'NGN')}
                          </div>
                          <div className="text-xs text-slate-600 font-medium">
                            {formatCurrency(convertToUSD(safePrice * safeQty), 'USD')}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {formatCurrency(safePrice, 'NGN')} each
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 p-2 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                // FIX 1: removed the extra </div> that was here
              );
            })}
            {/* FIX 2: map now correctly closed with })} above */}

            <div className="flex justify-center sm:justify-end">
              <button
                onClick={clearCart}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-red-600 hover:text-red-700 font-medium px-5 py-3 rounded-2xl border border-red-200 hover:border-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>
            </div>
          </div>

          {/* ── Right column: order summary ── */}
          {/* FIX 3: this column is now correctly inside the grid div */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:sticky lg:top-24 shadow-sm">
              <h2 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 sm:mb-8">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal, 'NGN')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span></span>
                  <span>{formatCurrency(convertToUSD(subtotal), 'USD')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Processing Fee</span>
                  <span className="font-medium">Free</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-5 sm:pt-6 mb-6 sm:mb-8">
                <div className="flex justify-between text-base sm:text-lg mb-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(total, 'NGN')}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span></span>
                  <span>{formatCurrency(convertToUSD(total), 'USD')}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors mb-4"
              >
                Proceed to Checkout →
              </button>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 sm:p-5 text-sm text-emerald-800 mb-4 sm:mb-6">
                <strong>Note:</strong> You'll need to sign up or log in to complete your purchase.
              </div>

              <button
                onClick={() => navigate('/browse')}
                className="w-full border-2 border-emerald-600 text-emerald-600 font-semibold py-4 rounded-2xl hover:bg-emerald-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;