import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import apiClient from "../../../shared/api/apiClient.js";
import { useOrdersStore } from "../../../shared/store/ordersStore.js";
import { useAuthStore } from "../../../shared/store/authStore";
import { refreshUserService } from "../../../shared/services/userService";

export const useOrders = () => {
    const { orders, setOrders } = useOrdersStore();
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(null);

    const authStore = useAuthStore();

    const getOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get("/orders");
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

    const createOrder = useCallback(async ({ restaurant, table, items }) => {
        try {
            setCreating(true);
            setError(null);
            const payload = {
                restaurant,
                table,
                items: items.map((it) => ({
                    menu: it.menu._id,
                    quantity: it.quantity,
                })),
            };
            console.log("Enviando orden con payload:", payload);
            const res = await apiClient.post("/orders", payload);
            const newOrder = res.data.data || res.data;
            await getOrders();
            return newOrder;
        } catch (err) {
            const message = err.response?.data?.message || "Error al crear la orden";
            setError(message);
            throw new Error(message);
        } finally {
            setCreating(false);
        }
    }, [getOrders]);

    const deleteOrder = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.delete(`/orders/${id}`);
            const data = res.data.data || res.data;
            await getOrders();
            return data;
        } catch (err) {
            const message =
                err.response?.data?.message || "Error al eliminar la orden";
            setError(message);
            console.error("Error en deleteOrder:", err);
            throw new Error(message);
        }
    };

    const updatePaymentMethod = useCallback(async (orderId, { paymentMethod, paymentCard }) => {
        try {
            setLoading(true);
            setError(null);

            const payload = { paymentMethod };
            if (paymentMethod === "CARD" && paymentCard) {
                payload.paymentCard = paymentCard;
            }

            console.log("Enviando al backend:", JSON.stringify(payload, null, 2));

            const res = await apiClient.put(`/orders/${orderId}/payment`, payload);
            const updatedOrder = res.data.data || res.data;

            await getOrders();
            return updatedOrder;
        } catch (err) {
            const message = err.response?.data?.message || "Error al guardar el método de pago";
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [getOrders]);

    const completeOrder = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);

            const res = await apiClient.put(`/orders/${id}/complete`);

            const data = res.data.data;

            await getOrders();
            await refreshUserService();

            return data;
        } catch (err) {
            const message = err.response?.data?.message || "Error al completar la orden";
            console.log("COMPLETE ORDER ERROR:", err.response?.data || err);
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [getOrders]);

    useFocusEffect(
        useCallback(() => {
            getOrders();
        }, [getOrders])
    );

    return { orders, getOrders, createOrder, deleteOrder, updatePaymentMethod, completeOrder, loading, creating, error };
};