import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import orderClient from "../../../shared/api/orderClient.js";
import { useOrdersStore } from "../../../shared/store/ordersStore.js";

export const useOrders = () => {
    const { orders, setOrders } = useOrdersStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const res = await orderClient.get("/orders");
            const data = res.data.data || res.data;
            
            setOrders(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al obtener tus órdenes");
            console.error("Error en useOrders:", err);
        } finally {
            setLoading(false);
        }
    }, [setOrders]);

    useFocusEffect(
        useCallback(() => {
            getOrders();
        }, [getOrders])
    );

    return { orders, getOrders, loading, error };
};