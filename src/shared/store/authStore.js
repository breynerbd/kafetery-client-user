import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,

            login: async (accessToken, user, refreshToken) => {
                try {
                    set({
                        token: accessToken,
                        user: user,
                        isAuthenticated: true,
                        setUser: (userData) => set({ user: userData }),
                    });

                    if (refreshToken) {
                        if (Platform.OS === "web") {
                            localStorage.setItem("refreshToken", refreshToken);
                        } else {
                            const SecureStore = await import("expo-secure-store");
                            await SecureStore.setItemAsync("refreshToken", refreshToken);
                        }
                    }
                    console.log("Store: Login completado con éxito");
                } catch (error) {
                    console.error("Store: Error al guardar credenciales:", error);
                }
            },

            logout: async () => {
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                });

                if (Platform.OS !== "web") {
                    const { deleteItemAsync } = await import("expo-secure-store");
                    await deleteItemAsync("refreshToken");
                } else {
                    localStorage.removeItem("refreshToken");
                }
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);