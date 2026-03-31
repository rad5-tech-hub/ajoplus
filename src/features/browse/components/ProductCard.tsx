// src/features/browse/components/ProductCard.tsx
import { ShoppingCart, Clock, Calendar } from 'lucide-react';
import { useCartStore } from '@/app/store/CartStore';

interface ProductCardProps {
  item: {
    id: string;
    title: string;
    price: number;
    category: string;
    type: 'package' | 'product';
    duration?: string;
    frequency?: string;
    progress?: number;
    description?: string;
    image: string;
  };
}

const ProductCard = ({ item }: ProductCardProps) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      type: item.type,
    });
  };

  const isPackage = item.type === 'package';

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-emerald-200 hover:shadow-md transition-all group flex flex-col h-full">
      
      {/* Fixed Height Image */}
      <div className="relative h-48 shrink-0 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
            In Stock
          </span>
        </div>
      </div>

      {/* Content - Grows to push button down */}
      <div className="p-6 flex flex-col flex-1">
        
        {/* Category */}
        <div className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-2xl mb-3">
          {item.category}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg leading-tight text-slate-900 mb-2 line-clamp-2">
          {item.title}
        </h3>

        {/* Price */}
        <div className="text-3xl font-bold text-emerald-600 mb-4">
          ₦{item.price.toLocaleString()}
        </div>

        {/* Meta for Packages */}
        {isPackage && item.duration && (
          <div className="flex gap-4 text-sm text-slate-500 mb-5">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {item.duration}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {item.frequency}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isPackage && item.progress !== undefined && (
          <div className="mb-5">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500">Progress</span>
              <span className="font-medium text-emerald-600">{item.progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full" 
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Description - Takes remaining space */}
        <div className="text-sm text-slate-600 flex-1 line-clamp-3 mb-6">
          {item.description || `Essential ${item.category.toLowerCase()} package`}
        </div>

        {/* Fixed Button at Bottom */}
        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;