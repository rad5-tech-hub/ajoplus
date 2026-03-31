// src/app/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  type: 'package' | 'product';
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) => set((state) => ({ 
        items: [...state.items, { ...item, id: item.id || Date.now().toString() }] 
      })),
      removeFromCart: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),
      clearCart: () => set({ items: [] }),
      getCount: () => get().items.length,
      getTotal: () => get().items.reduce((sum, item) => sum + item.price, 0),
    }),
    { name: 'ajoplus-cart' }
  )
);