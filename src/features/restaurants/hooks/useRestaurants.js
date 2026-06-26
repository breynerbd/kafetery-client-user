import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import restaurantClient from "../../../shared/api/restaurantClient.js";
import { useRestaurantStore } from "../../../shared/store/restaurantsStore.js";

export const useRestaurants = () => {
    const { restaurants, setRestaurants } = useRestaurantStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRestaurants = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await restaurantClient.get("/restaurants");
            setRestaurants(res.data.data);
            return res.data.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al obtener restaurantes");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            getRestaurants();
        }, [getRestaurants])
    );

    return { restaurants, getRestaurants, loading, error };
};