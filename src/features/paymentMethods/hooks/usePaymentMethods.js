import { useState, useCallback } from "react";
import apiClient from "../../../shared/api/apiClient.js";

export const usePaymentMethods = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(null);

    const getCards = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get("/payment-methods");
            const data = res.data.data || res.data;
            setCards(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al obtener tus tarjetas");
            console.error("Error en usePaymentMethods:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const addCard = useCallback(async (cardData) => {
        try {
            setCreating(true);
            setError(null);

            const res = await apiClient.post("/payment-methods", cardData);
            const newCard = res.data.data || res.data;

            setCards((prev) => [...prev, newCard]);
            return newCard;
        } catch (err) {
            const message = err.response?.data?.message || "Error al agregar la tarjeta";
            setError(message);
            throw new Error(message);
        } finally {
            setCreating(false);
        }
    }, []);

    const deleteCard = useCallback(async (id) => {
        try {
            await apiClient.delete(`/payment-methods/${id}`);

            setCards((prev) =>
                prev.filter((card) => card._id !== id)
            );
        } catch (err) {
            throw new Error(
                err.response?.data?.message || "Error al eliminar"
            );
        }
    }, []);

    return { cards, getCards, addCard, deleteCard, loading, creating, error };
};