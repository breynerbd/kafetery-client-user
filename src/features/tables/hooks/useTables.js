import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import apiClient from "../../../shared/api/apiClient.js";
import { useTablesStore } from "../../../shared/store/tablesStore.js";

export const useTables = () => {
    const { tables, setTables } = useTablesStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getTables = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get("/tables");
            const data = res.data.data || res.data;

            setTables(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al obtener las mesas");
            console.error("Error en useTables:", err);
        } finally {
            setLoading(false);
        }
    }, [setTables]);

    useFocusEffect(
        useCallback(() => {
            getTables();
        }, [getTables])
    );

    return { tables, getTables, loading, error };
};