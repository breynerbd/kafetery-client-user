import { create } from "zustand";

export const useReservationStore = create((set) => ({
    reservations: [],
    
    setReservations: (data) => set({ reservations: data }),
}));