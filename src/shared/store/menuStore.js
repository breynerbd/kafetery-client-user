import { create } from "zustand";

export const useMenuStore = create((set) => ({
    menus: [],
    setMenus: (data) => set({ menus: data }),
}));