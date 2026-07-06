import apiClient from "../api/apiClient";
import { useAuthStore } from "../store/authStore";

export const refreshUserService = async () => {
    const res = await apiClient.get("/users/profile");

    const user = res.data.data;

    useAuthStore.getState().setUser({
        ...user,
        loyaltyPoints: user.loyaltyPoints,
    });

    return user;
};