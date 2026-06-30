import { create } from "zustand";

export const usePromotionsStore = create((set) => ({
    promotions: [],
    setPromotions: (data) => set({ promotions: data }),
}));