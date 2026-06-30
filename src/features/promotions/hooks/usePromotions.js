import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import promotionClient from "../../../shared/api/promotionClient.js";
import { usePromotionsStore } from "../../../shared/store/promotionsStore.js";

export const usePromotions = () => {
    const { promotions, setPromotions } = usePromotionsStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getPromotions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const res = await promotionClient.get("/promotions");
            // Se adapta por si la API responde con la propiedad estructurada u objeto directo
            const data = res.data.data || res.data;
            
            setPromotions(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al obtener las promociones");
            console.error("Error en usePromotions:", err);
        } finally {
            setLoading(false);
        }
    }, [setPromotions]);

    useFocusEffect(
        useCallback(() => {
            getPromotions();
        }, [getPromotions])
    );

    return { promotions, getPromotions, loading, error };
};