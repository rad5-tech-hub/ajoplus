// src/features/browse/components/ProductCard.tsx
import { ShoppingCart, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/app/store/CartStore';
import { useJoinPackage } from '@/app/store/PackageStore';
import { useModalStore } from '@/app/store/ModalStore';
import Modal from '@/components/ui/GeneralModal';

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
    packageItems?: string[];
  };
}

const ProductCard = ({ item }: ProductCardProps) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { mutate: joinPackageAPI, isPending } = useJoinPackage();
  const openModal = useModalStore((state) => state.openModal);

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      type: item.type,
    });

    openModal({
      type: 'success',
      title: 'Added to Cart',
      message: `${item.title} has been added successfully.`,
    });

    setTimeout(() => {
      useModalStore.getState().closeModal();
    }, 2500);
  };

  const isPackage = item.type === 'package';

  const handleAction = () => {
    if (isPackage) {
      joinPackageAPI(item.id, {
        onSuccess: () => {
          // Store's onSuccess already shows the modal — just handle navigation
          setTimeout(() => {
            navigate(`/dashboard/customer/package/${item.id}`);
          }, 2500);
        },
        onError: () => {
          // Store's onError already shows the error modal — nothing extra needed
        },
      });
    } else {
      handleAddToCart();
    }
  };


  return (
    <>
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-emerald-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
        {/* Image Section - Only for Products */}
        {!isPackage && (
          <div className="relative h-52 sm:h-56 md:h-60 lg:h-64 shrink-0 overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 right-4">
              <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-xs px-3.5 py-1 rounded-full font-medium shadow-sm">
                In Stock
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          {/* Category Tag */}
          <div className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-b-lg rounded-t-sm mb-3">
            {item.category}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base sm:text-lg leading-tight text-slate-900 mb-2 line-clamp-2 min-h-10">
            {item.title}
          </h3>

          {/* Price */}
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-4">
            ₦{item.price.toLocaleString()}
          </div>

          {/* Package Meta */}
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

          {/* Progress Bar for Packages */}
          {isPackage && item.progress !== undefined && (
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500">Progress</span>
                <span className="font-medium text-emerald-600">{item.progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-emerald-500 to-emerald-600 rounded-full transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="text-sm text-slate-600 flex-1 line-clamp-3 mb-2 leading-relaxed">
            {item.description || `Premium ${item.category.toLowerCase()} offering`}
          </div>

          {/* Package Details Section - Only for Packages */}
          {isPackage && item.packageItems && (
            <div className="bg-slate-50 rounded-md border-b border-slate-200 sm:p-6">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Package Includes:</h4>
              <div className="max-h-48 overflow-y-auto">
                <ul className="space-y-2">
                  {item.packageItems.slice(0, 4).map((packageItem, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="font-medium text-emerald-600 hrink-0">{index + 1}.</span>
                      <span>{packageItem}</span>
                    </li>
                  ))}
                  {item.packageItems.length > 4 && (
                    <li className="flex items-start gap-2 text-sm text-slate-600 italic">
                      <span className="font-medium text-emerald-600 shrink-0">+</span>
                      <span>{item.packageItems.length - 4} more item{item.packageItems.length - 4 !== 1 ? 's' : ''}...</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Action Button - Only text changes based on type */}
          <div className="mt-auto pt-2">
            <button
              onClick={handleAction}
              disabled={isPending}
              className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 active:scale-[0.985] disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base"
            >
              <ShoppingCart className="w-4 h-4" />
              {isPending ? 'Joining...' : isPackage ? 'JOIN NOW' : 'ADD TO CART'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal />
    </>
  );
};

export default ProductCard;