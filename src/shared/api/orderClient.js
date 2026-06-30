import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { useAuthStore } from "../store/authStore";

const orderClient = axios.create({
    baseURL: ENDPOINTS.USER,
});

orderClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        console.log("Interceptor Órdenes: Token detectado =", token ? "SI" : "NO");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default orderClient;