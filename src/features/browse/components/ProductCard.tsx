import { ShoppingCart } from 'lucide-react';
import type { PublicProduct } from '@/api/public';
import { formatNaira } from '../types';

interface ProductCardProps {
  product: PublicProduct;
  onAddToCart: (product: PublicProduct) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const isOutOfStock = product.stockStatus === 'out_of_stock';

  return (
    <div className="bg-white border border-amber-200 rounded-3xl overflow-hidden hover:border-amber-400 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-100">
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
        <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-2xl mb-3 w-fit">
          {product.category?.name ?? 'Product'}
        </div>
        <h3 className="font-semibold text-base sm:text-lg leading-tight text-blue-950 mb-2 line-clamp-2">{product.name}</h3>
        <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-3">{formatNaira(product.price)}</div>
        <p className="text-sm text-slate-600 flex-1 line-clamp-3 mb-4">{product.description}</p>
        <button onClick={() => onAddToCart(product)} disabled={isOutOfStock}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base active:scale-[0.985] cursor-pointer">
          <ShoppingCart className="w-4 h-4" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
