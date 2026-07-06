import { create } from "zustand";

export const useCartStore = create((set, get) => ({
    restaurant: null,
    items: [],

    addItem: (menu, restaurant, quantity = 1) => {
        const state = get();

        if (state.restaurant && state.restaurant._id !== restaurant._id) {
            set({
                restaurant,
                items: [{ menu, quantity }],
            });
            return { switchedRestaurant: true };
        }

        const existing = state.items.find((it) => it.menu._id === menu._id);

        if (existing) {

            const newQuantity = Math.min(
                existing.quantity + quantity,
                menu.stock
            );

            set({
                restaurant,
                items: state.items.map((it) =>
                    it.menu._id === menu._id
                        ? {
                            ...it,
                            quantity: newQuantity
                        }
                        : it
                ),
            });

        } else {
            set({
                restaurant,
                items: [...state.items, { menu, quantity }],
            });
        }

        return { switchedRestaurant: false };
    },

    updateQuantity: (menuId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(menuId);
            return;
        }
        set((state) => ({
            items: state.items.map((it) =>
                it.menu._id === menuId ? { ...it, quantity } : it
            ),
        }));
    },

    removeItem: (menuId) => {
        set((state) => {
            const newItems = state.items.filter((it) => it.menu._id !== menuId);
            return {
                items: newItems,
                restaurant: newItems.length === 0 ? null : state.restaurant,
            };
        });
    },

    clearCart: () => set({ restaurant: null, items: [] }),

    getTotalItems: () => get().items.reduce((sum, it) => sum + it.quantity, 0),

    getTotalPrice: () =>
        get().items.reduce((sum, it) => sum + it.menu.price * it.quantity, 0),
}));