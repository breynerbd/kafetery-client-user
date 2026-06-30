import { useState, useCallback } from "react";
import tableClient from "../../../shared/api/tableClient.js"; 
import { useTablesStore } from "../../../shared/store/tablesStore.js";

export const useTables = () => {
    const { tables, setTables } = useTablesStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getTables = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const res = await tableClient.get("/tables");
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

    return { tables, getTables, loading, error };
};