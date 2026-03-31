// src/features/cart/ShoppingCart.tsx
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/app/store/CartStore';
import CustomerNavbar from '../customer/components/CustomerNavbar';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, clearCart } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const processingFee = 0;
  const total = subtotal + processingFee;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    // For now we keep quantity as 1 per item (can be extended later)
    if (newQuantity < 1) removeFromCart(id);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <CustomerNavbar />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Your cart is empty</h2>
          <p className="text-slate-600 mb-8">Looks like you haven't added anything yet.</p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors"
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

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/browse')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Browse</span>
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
        </div>

        <p className="text-slate-600 mb-8">{items.length} items in your cart</p>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-7 space-y-6">
            {items.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-3xl p-6 flex gap-6 border border-slate-100"
              >
                <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                  <img 
                    src={`https://picsum.photos/id/${parseInt(item.id) || 292}/300/300`} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                      Food & Groceries
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg text-slate-900 leading-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                    {item.type === 'product' ? 'One-time purchase' : 'Contribution package'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleQuantityChange(item.id, 0)}
                        className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded-full hover:bg-slate-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium w-6 text-center">1</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, 2)}
                        className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded-full hover:bg-slate-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-emerald-600 text-xl">
                        ₦{item.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">₦{item.price.toLocaleString()} each</div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 p-2 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button 
                onClick={clearCart}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium px-5 py-2.5 rounded-2xl border border-red-200 hover:border-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-8 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Processing Fee</span>
                  <span className="font-medium">NO</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 mb-8">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-emerald-600">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors mb-4"
              >
                Proceed to Checkout →
              </button>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-sm text-emerald-800 mb-6">
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