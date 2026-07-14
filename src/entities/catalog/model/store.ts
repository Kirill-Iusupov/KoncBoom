import { api } from "@/src/shared/api/api";
import { Product, ResponseData } from "@/src/shared/model/types";
import { create } from "zustand";

const initialProducts: ResponseData<Product> = {
  count: 0,
  next: null,
  prev: null,
  results: [],
};

interface ICatalogStore {
  products: ResponseData<Product>;
  isLoading: boolean;
  error: string | null;
  getProducts: () => Promise<void>;
}

export const useProductsStore = create<ICatalogStore>((set) => ({
  products: initialProducts,
  isLoading: true,
  error: null,
  getProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await api.get("/catalog/products");
      set({
        products: res.data,
      });
    } catch (error) {
    } finally {
      set({ isLoading: false });
    }
  },
}));
