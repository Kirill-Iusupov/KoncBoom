import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PreviewItem {
  product_id: number | string;
  title: string;
  quantity: number;
  stock: number;
  stock_ok: boolean;
  unit_price: string;
  final_unit_price: string;
  line_total: string;
  line_discount: string;
  has_discount: boolean;
  applied_promo: {
    title: string;
    discount: number;
    condition_type: string;
  } | null;
  hint: string;
}

export interface PreviewResponse {
  items: PreviewItem[];
  subtotal: string;
  discount_total: string;
  total: string;
}

export interface CartProduct {
  id: number | string;
  title: string;
  price: number | string;
  quantity: number;
  image: string;
  brand?: string;
  stock?: number;
}

interface CartState {
  items: CartProduct[];
  totalQuantity: number;
  totalPrice: number;
  previewData: PreviewResponse | null;
  isLoading: boolean;
  isError: boolean;
  
  addToCart: (product: any) => void;
  removeFromCart: (id: number | string) => void;
  incrementQuantity: (id: number | string) => void;
  decrementQuantity: (id: number | string) => void;
  setProductQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  
  fetchPreview: (items: { product_id: number | string; quantity: number }[]) => Promise<void>;
}

// Локальный подсчет итогов для мгновенного обновления интерфейса
const calculateTotals = (items: CartProduct[]) => {
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (Math.abs(Number(item.price)) * item.quantity), 0);
  return { totalQuantity, totalPrice };
};

// Встроенный Дебаунс (таймер), чтобы не спамить сервер
let previewTimeout: NodeJS.Timeout;

const fetchPreviewDebounced = (items: any[], set: any) => {
  if (items.length === 0) {
    set({ previewData: null, isLoading: false, isError: false });
    return;
  }

  // Сбрасываем предыдущий таймер, если пользователь кликает очень быстро
  clearTimeout(previewTimeout);
  
  set({ isLoading: true, isError: false });

  // Ждем 300мс после последнего клика
  previewTimeout = setTimeout(async () => {
    try {
      
      // ВНИМАНИЕ: Если ваш бэкенд находится на другом адресе, 
      // добавьте его сюда, например: process.env.NEXT_PUBLIC_BASE_URL + '/api/orders/preview/'
      const response = await fetch('/api/orders/preview/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (response.status === 429) {
        console.warn('[Корзина] Ошибка 429: Слишком много запросов');
        set({ isLoading: false });
        return;
      }

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data: PreviewResponse = await response.json();
      set({ previewData: data, isLoading: false, isError: false });
      
    } catch (error) {
      console.error('[Корзина] Ошибка при запросе:', error);
      set({ isError: true, isLoading: false }); 
    }
  }, 300);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      const updateStateAndTriggerPreview = (newItems: CartProduct[]) => {
        const totals = calculateTotals(newItems);
        set({ items: newItems, ...totals });
        
        const payload = newItems.map((i) => ({ product_id: i.id, quantity: i.quantity }));
        fetchPreviewDebounced(payload, set);
      };

      return {
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
        previewData: null,
        isLoading: false,
        isError: false,

        fetchPreview: async (items) => {
          fetchPreviewDebounced(items, set);
        },

        addToCart: (product) => {
          const { items } = get();
          const existingItemIndex = items.findIndex((item) => item.id === product.id);

          let newItems;
          if (existingItemIndex !== -1) {
             newItems = items.map(item => 
               item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
             );
          } else {
            newItems = [...items, { ...product, quantity: 1 }];
          }
          updateStateAndTriggerPreview(newItems);
        },

        removeFromCart: (id) => {
          const newItems = get().items.filter((item) => item.id !== id);
          updateStateAndTriggerPreview(newItems);
        },

        incrementQuantity: (id) => {
          const newItems = get().items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          );
          updateStateAndTriggerPreview(newItems);
        },

        decrementQuantity: (id) => {
          const newItems = get().items.map((item) =>
            item.id === id && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
          updateStateAndTriggerPreview(newItems);
        },

        setProductQuantity: (id, quantity) => {
          const newItems = get().items.map((item) =>
            item.id === id ? { ...item, quantity: quantity } : item
          );
          updateStateAndTriggerPreview(newItems);
        },

        clearCart: () => {
          set({ items: [], totalQuantity: 0, totalPrice: 0, previewData: null });
        },
      };
    },
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items,
        totalQuantity: state.totalQuantity,
        totalPrice: state.totalPrice
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.items.length > 0) {
           const payload = state.items.map((i) => ({ product_id: i.id, quantity: i.quantity }));
           state.fetchPreview(payload);
        }
      }
    }
  )
);
