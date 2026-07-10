import { api } from "@/src/shared/api/api";
import { CategoriesResult, ResponseData } from "@/src/shared/model/types";
import { create } from "zustand";

interface ICategoriesStore {
  categories: ResponseData<CategoriesResult>;
  isLoading: boolean;
  error: string | null;
  getCategories: () => Promise<void>;
}

const initialCategories: ResponseData<CategoriesResult> = {
  count: 0,
  next: null,
  prev: null,
  results: [],
};

export const useCategoriesStore = create<ICategoriesStore>((set) => ({
  categories: initialCategories,
  isLoading: true,
  error: null,
  getCategories: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/catalog/categories/");

      if (response.statusText != "OK") {
        throw new Error();
      }

      set({ categories: response.data });
    } catch (error) {
    } finally {
      set({ isLoading: false });
    }
  },
}));
