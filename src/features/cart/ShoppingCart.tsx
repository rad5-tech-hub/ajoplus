import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/app/store/CartStore';
import { formatCurrency } from '@/lib/currency';
import CustomerNavbar from '../customer/components/CustomerNavbar';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, clearCart, updateQuantity } = useCartStore();

  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const total = subtotal;

  const handleQuantityChange = (id: string, type: 'inc' | 'dec') => {
    const item = items.find((item) => item.id === id);
    if (!item) return;
    const currentQty = Number(item.quantity || 0);
    const newQty = type === 'inc' ? currentQty + 1 : currentQty - 1;
    if (newQty < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQty);
    }
  };

  const handleRemoveItem = (id: string) => removeFromCart(id);

  const handleClearCart = () => clearCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <CustomerNavbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand-50 flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-brand-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mb-3">Your cart is empty</h2>
          <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-md mx-auto">Looks like you haven't added anything yet.</p>
          <button onClick={() => navigate('/browse')}
            className="w-full sm:w-auto bg-brand-600 text-white px-6 sm:px-8 py-3.5 rounded-2xl font-semibold hover:bg-brand-700 transition-colors cursor-pointer">
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
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-900 transition-colors w-fit cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-900">Shopping Cart</h1>
        </div>

        <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8">{itemCount} items in your cart</p>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {items.map((item) => {
              const safeQty = Number(item.quantity || 0);
              const safePrice = Number(item.price || 0);
              return (
                <div key={item.id} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 border border-slate-100 shadow-sm">
                  <div className="w-full sm:w-24 sm:h-24 h-40 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                    <img src={item.image || ''} alt={item.title}
                      className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-brand-100 text-brand-700 px-3 py-1 rounded-full">
                        {item.type === 'product' ? 'Product' : 'Package'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg text-brand-900 leading-tight mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      {item.type === 'product' ? 'One-time purchase' : 'Contribution package'}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center justify-between sm:justify-start gap-3">
                        <button onClick={() => handleQuantityChange(item.id, 'dec')}
                          className="w-9 h-9 flex items-center justify-center border border-slate-300 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium w-8 text-center">{safeQty}</span>
                        <button onClick={() => handleQuantityChange(item.id, 'inc')}
                          className="w-9 h-9 flex items-center justify-center border border-slate-300 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <div className="font-bold text-brand-600 text-lg sm:text-xl">{formatCurrency(safePrice * safeQty)}</div>
                          <div className="text-xs text-slate-500 mt-1">{formatCurrency(safePrice)} each</div>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-600 p-2 transition-colors cursor-pointer" aria-label="Remove item">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-brand-200 p-6 sm:p-8 shadow-sm sticky top-28">
              <h2 className="text-xl font-bold text-brand-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal ({itemCount} items)</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Processing Fee</span>
                  <span className="font-medium">Free</span>
                </div>
              </div>
              <div className="border-t border-brand-200 pt-5 mb-6">
                <div className="flex justify-between text-lg mb-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-brand-600 text-2xl">{formatCurrency(total)}</span>
                </div>
              </div>
              {items.length > 0 && (
                <div className="flex gap-3">
                  <button onClick={handleClearCart}
                    className="flex-1 border border-slate-300 text-slate-700 font-semibold py-3.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                    Clear All
                  </button>
                  <button onClick={() => navigate('/checkout')}
                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-[0.985] cursor-pointer">
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
