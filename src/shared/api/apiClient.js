import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/authStore";
import { ENDPOINTS } from "../constants/endpoints";

const apiClient = axios.create({
    baseURL: ENDPOINTS.USER,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) =>
        error ? reject(error) : resolve(token)
    );
    failedQueue = [];
};


apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return apiClient(originalRequest);
            });
        }

        isRefreshing = true;

        try {
            const refreshToken = await SecureStore.getItemAsync("refreshToken");

            if (!refreshToken) {
                throw new Error("No refresh token");
            }

            const { data } = await axios.post(
                `${ENDPOINTS.AUTH}/refresh`,
                { refreshToken }
            );

            const newAccessToken = data.accessToken;
            const newRefreshToken = data.refreshToken;

            useAuthStore.getState().setAccessToken(newAccessToken);

            await SecureStore.setItemAsync("refreshToken", newRefreshToken);

            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return apiClient(originalRequest);
        } catch (err) {
            processQueue(err, null);

            const store = useAuthStore.getState();

            store.setSessionExpired(true);

            if (err.response?.status === 401) {
                store.logout();
            }

            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);

export default apiClient;