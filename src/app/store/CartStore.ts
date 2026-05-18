import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useMutation } from '@tanstack/react-query';
import * as cartAPI from '@/api/cart';

interface CartItem {
  id: string;
  title?: string;
  price: number;
  image?: string;
  type: 'package' | 'product';
  quantity: number;
  itemId?: string;
  cartId?: string;
}

interface CartStore {
  items: CartItem[];
  cartId?: string;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCount: () => number;
  getTotal: () => number;
  setCartId: (cartId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return { items: state.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeFromCart: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity < 1
            ? state.items.filter((item) => item.id !== id)
            : state.items.map((item) => item.id === id ? { ...item, quantity } : item),
        })),
      clearCart: () => set({ items: [] }),
      setCartId: (cartId: string) => set({ cartId }),
      getCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: 'AbaGold-cart' }
  )
);

export const useCartId = () => useCartStore((state) => state.cartId);

export const useAddToCart = () => {
  const setCartId = useCartStore((state) => state.setCartId);
  return useMutation({
    mutationFn: (payload: cartAPI.AddToCartRequest) => cartAPI.addToCart(payload),
    onSuccess: (response) => {
      if (response.data.cartId) setCartId(response.data.cartId);
    },
    onError: (error) => console.error('Failed to add item to cart:', error),
  });
};
