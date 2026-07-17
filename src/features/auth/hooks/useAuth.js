import { useState } from "react";
import apiClient from "../../../shared/api/apiClient.js";
import { useAuthStore } from "../../../shared/store/authStore.js";
import axios from "axios";
import { ENDPOINTS } from "../../../shared/constants/endpoints";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginStore = useAuthStore((state) => state.login);
    const logoutStore = useAuthStore((state) => state.logout);

    const handleLogin = async (data) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${ENDPOINTS.AUTH}/login`,
                {
                    email: data.email,
                    password: data.password,
                }
            );

            console.log("Datos que llegan del login:", response.data.user);

            const { accessToken, refreshToken, user } = response.data;

            await loginStore(accessToken, user, refreshToken);

            await fetchProfileData();

            return {
                success: true,
            };
        } catch (err) {
            console.log("--- ERROR DETALLADO ---");
            console.log("Status:", err.response?.status);
            console.log("Data:", err.response?.data);
            console.log("Message:", err.message);
            console.log("-----------------------");

            let message = "Error de conexión con el servidor.";

            if (err.response) {
                const status = err.response.status;
                if (status === 400 || status === 401) {
                    message = "Correo o contraseña incorrectos.";
                } else if (status >= 500) {
                    message = "Error interno del servidor. Intenta más tarde.";
                } else {
                    message = err.response.data?.message || "Error al iniciar sesión.";
                }
            }

            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (data) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.post(`${ENDPOINTS.AUTH}/register`, {
                name: data.name,
                surname: data.surname,
                username: data.username,
                email: data.email,
                password: data.password,
                role: "CLIENT",
            });

            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al registrarse");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleLogin,
        handleRegister,
        logout: logoutStore,
        loading,
        error,
    };
};

const fetchProfileData = async () => {
    try {
        const response = await apiClient.get(`${ENDPOINTS.USER}/users/profile`);

        useAuthStore.getState().setUser(response.data.data);
    } catch (err) {
        console.error("Error al cargar perfil:", err);
    }
};