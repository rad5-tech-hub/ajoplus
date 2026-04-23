import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useCartStore } from '@/app/store/CartStore';
import { formatCurrency, convertToUSD } from '@/lib/currency';
import CustomerNavbar from '../customer/components/CustomerNavbar';

const Checkout = () => {
  const navigate = useNavigate();
  const { items } = useCartStore();

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const processingFee = 0;
  const total = subtotal + processingFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <CustomerNavbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Your cart is empty
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-md mx-auto">
            Add items to your cart to proceed with checkout.
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

  const handleProceedToPayment = () => {
    // Encode cart items as JSON in URL state
    navigate('/dashboard/customer/payment/cart', {
      state: {
        items: items,
        total: total,
        isCartPayment: true,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <CustomerNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors w-fit mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm sm:text-base">Back to Cart</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Order Review
          </h1>
          <p className="text-slate-600">Review your order before proceeding to payment</p>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 mb-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            Order Items
          </h2>

          <div className="space-y-4 mb-8">
            {items.map((item) => {
              const safeQty = Number(item.quantity || 0);
              const safePrice = Number(item.price || 0);
              const itemTotal = safePrice * safeQty;

              return (
                <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-b-0">
                  <div className="shrink-0 w-20 h-20 bg-slate-100 rounded-xl overflow-hidden">
                    <img
                      src={item.image || `https://picsum.photos/id/${parseInt(item.id) || 292}/100/100`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                        {item.type === 'product' ? 'Product' : 'Package'}
                      </span>
                      <span className="text-xs text-slate-500">ID: {item.id}</span>
                    </div>
                    <h3 className="font-semibold text-base text-slate-900 leading-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">
                      {item.type === 'product'
                        ? 'One-time purchase'
                        : 'Contribution package'}
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      Quantity: {safeQty}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="font-bold text-emerald-600 text-lg">
                      {formatCurrency(itemTotal, 'NGN')}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      {formatCurrency(convertToUSD(itemTotal), 'USD')}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {formatCurrency(safePrice, 'NGN')} each
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6 sm:mb-8">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal ({items.length} items)</span>
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

          <div className="border-t border-slate-200 pt-5 sm:pt-6 mb-8">
            <div className="flex justify-between text-lg sm:text-xl mb-2">
              <span className="font-semibold">Total Amount</span>
              <span className="font-bold text-emerald-600 text-2xl">
                {formatCurrency(total, 'NGN')}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span></span>
              <span>{formatCurrency(convertToUSD(total), 'USD')}</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 sm:p-5 mb-6 text-sm text-emerald-800">
            <strong>Note:</strong> You will complete payment in the next step. Please ensure you have the required amount ready.
          </div>

          <div className="flex gap-3 flex-col sm:flex-row">
            <button
              onClick={() => navigate('/cart')}
              className="flex-1 border-2 border-emerald-600 text-emerald-600 font-semibold py-4 rounded-2xl hover:bg-emerald-50 transition-colors"
            >
              Back to Cart
            </button>
            <button
              onClick={handleProceedToPayment}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              Proceed to Payment →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
