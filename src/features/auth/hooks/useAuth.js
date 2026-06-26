import { useState } from "react";
import authClient from "../../../shared/api/authClient.js";
import { useAuthStore } from "../../../shared/store/authStore.js";
import restaurantClient from "../../../shared/api/restaurantClient.js";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);

    const handleLogin = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authClient.post("/login", {
                Email: data.email,
                Password: data.password,
            });

            const { accessToken, refreshToken } = response.data;

            await login(accessToken, null, refreshToken);

            const profileRes = await restaurantClient.get("/users/profile");

            console.log("DEBUG | Datos del perfil recibidos:", JSON.stringify(profileRes.data.data, null, 2));
            useAuthStore.getState().setUser(profileRes.data.data);

            return true;
        } catch (err) {
            const message = err.response?.data?.message || err.message;
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (data) => {
        try {
            setLoading(true);
            setError(null);

            const payload = {
                name: data.name,
                surname: data.surname,
                username: data.username,
                email: data.email,
                password: data.password,
                role: "USER",
            };

            const response = await authClient.post("/register", payload);

            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al registrarse");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, handleRegister, loading, error, logout };
};