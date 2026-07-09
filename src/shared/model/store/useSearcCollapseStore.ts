import { create } from "zustand";

interface ISearcStore {
  collapsed: boolean;
  setCollapsed: (data: boolean) => void;
}

export const useSearchStore = create<ISearcStore>((set) => ({
  collapsed: true,
  setCollapsed: (data: boolean) => set(() => ({ collapsed: data })),
}));
