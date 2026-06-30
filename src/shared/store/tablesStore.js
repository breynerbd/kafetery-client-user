import { create } from "zustand";

export const useTablesStore = create((set) => ({
    tables: [],
    setTables: (data) => set({ tables: data }),
}));