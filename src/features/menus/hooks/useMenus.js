import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import menuClient from "../../../shared/api/menuClient.js";
import { useMenuStore } from "../../../shared/store/menuStore.js";

export const useMenus = () => {
    const { menus, setMenus } = useMenuStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getMenus = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Hacemos el GET al endpoint de menús del usuario
            const res = await menuClient.get("/menus");
            // Adaptamos según responda tu API (ej. res.data.data o directamente res.data)
            const menuData = res.data.data || res.data;
            setMenus(menuData);
            return menuData;
        } catch (err) {
            setError(err.response?.data?.message || "Error al obtener el menú");
            console.error("Error en useMenus:", err);
        } finally {
            setLoading(false);
        }
    }, [setMenus]);

    useFocusEffect(
        useCallback(() => {
            getMenus();
        }, [getMenus])
    );

    return { menus, getMenus, loading, error };
};