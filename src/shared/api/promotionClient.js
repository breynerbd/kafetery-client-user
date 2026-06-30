import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { useAuthStore } from "../store/authStore";

const promotionClient = axios.create({
    baseURL: ENDPOINTS.USER,
});

promotionClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        console.log("Interceptor Promociones: Token detectado =", token ? "SI" : "NO");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default promotionClient;