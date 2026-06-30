import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { useAuthStore } from "../store/authStore";

const menuClient = axios.create({
    baseURL: ENDPOINTS.USER,
});

menuClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        console.log("Interceptor Menús: Token detectado =", token ? "SI" : "NO");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default menuClient;