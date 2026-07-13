
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartProduct {
  id: number | string;
  title: string;
  price: number;
  quantity: number;
  image: string; 
  brand?: string; 
  stock?: number;
}

interface CartState {
  items: CartProduct[];
  totalQuantity: number;
  totalPrice: number;
  addToCart: (product: any) => void;
  removeFromCart: (id: number | string) => void;
  incrementQuantity: (id: number | string) => void;
  decrementQuantity: (id: number | string) => void;
  setProductQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
}

const calculateTotals = (items: CartProduct[]) => {
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = items.reduce((acc, item) => acc + (Math.abs(Number(item.price)) * item.quantity), 0);
  return { totalQuantity, totalPrice };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,

      addToCart: (product) => {
        const { items } = get();
        const existingItemIndex = items.findIndex((item) => item.id === product.id);

        let newItems;
        if (existingItemIndex !== -1) {
          newItems = items.filter((item) => item.id !== product.id);
        } else {
          newItems = [...items, { ...product, quantity: 1 }];
        }
        
        set({ items: newItems, ...calculateTotals(newItems) });
      },

      removeFromCart: (id) => {
        const newItems = get().items.filter((item) => item.id !== id);
        set({ items: newItems, ...calculateTotals(newItems) });
      },

      incrementQuantity: (id) => {
        const newItems = get().items.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        set({ items: newItems, ...calculateTotals(newItems) });
      },

      decrementQuantity: (id) => {
        const newItems = get().items.map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        set({ items: newItems, ...calculateTotals(newItems) });
      },


setProductQuantity: (id, quantity) => {
  const newItems = get().items.map((item) =>
    item.id === id ? { ...item, quantity: quantity } : item
  );
  set({ items: newItems, ...calculateTotals(newItems) });
},

      clearCart: () => set({ items: [], totalQuantity: 0, totalPrice: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);