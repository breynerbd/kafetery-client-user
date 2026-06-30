import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { useAuthStore } from "../store/authStore";

const tableClient = axios.create({
    baseURL: ENDPOINTS.USER,
});

tableClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        console.log("Interceptor Mesas: Token detectado =", token ? "SI" : "NO");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default tableClient;