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
            sessionExpired: false,

            setSessionExpired: (value) => set({ sessionExpired: value }),
            setAccessToken: (token) => set({ token }),
            setUser: (user) => set({ user }),

            login: async (accessToken, user, refreshToken) => {
                set({
                    token: accessToken,
                    user,
                    isAuthenticated: true,
                    sessionExpired: false,
                });

                if (refreshToken) {
                    if (Platform.OS === "web") {
                        localStorage.setItem("refreshToken", refreshToken);
                    } else {
                        const SecureStore = await import("expo-secure-store");
                        await SecureStore.setItemAsync("refreshToken", refreshToken);
                    }
                }
            },

            logout: async () => {
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                    sessionExpired: false,
                });

                if (Platform.OS !== "web") {
                    const { deleteItemAsync } = await import("expo-secure-store");
                    await deleteItemAsync("refreshToken");
                } else {
                    localStorage.removeItem("refreshToken");
                }
            },

            setUser: (user) => set({ user }),
        }),

        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);