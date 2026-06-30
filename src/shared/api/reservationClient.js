import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { useAuthStore } from "../store/authStore";

const reservationClient = axios.create({
    baseURL: ENDPOINTS.USER,
});

reservationClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        console.log("Interceptor Reservas: Token detectado =", token ? "SI" : "NO");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default reservationClient;