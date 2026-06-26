import { create } from "zustand";

export const useRestaurantStore = create((set) => ({
    restaurants: [],

    setRestaurants: (data) => set({ restaurants: data }),

}));