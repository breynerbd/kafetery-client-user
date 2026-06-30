import { create } from "zustand";

export const useOrdersStore = create((set) => ({
    orders: [],
    setOrders: (data) => set({ orders: data }),
}));