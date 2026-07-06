import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import apiClient from "../../../shared/api/apiClient.js";
import { useReservationStore } from "../../../shared/store/reservationsStore.js";

export const useReservations = () => {
    const { reservations, setReservations } = useReservationStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getReservations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get("/reservations");
            setReservations(res.data.data || res.data);
            return res.data.data || res.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al obtener reservas");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setReservations]);

    const saveReservation = useCallback(async (formData, id = null) => {
        try {
            setLoading(true);
            setError(null);
            let res;

            if (id) {
                res = await apiClient.put(`/reservations/${id}`, formData);
            } else {
                res = await apiClient.post("/reservations", formData);
            }

            await getReservations();
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al procesar la reserva");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getReservations]);

    const deleteReservation = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);
            await apiClient.delete(`/reservations/${id}`);

            await getReservations();
        } catch (err) {
            setError(err.response?.data?.message || "Error al eliminar la reserva");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getReservations]);

    useFocusEffect(
        useCallback(() => {
            getReservations();
        }, [getReservations])
    );

    return {
        reservations,
        getReservations,
        saveReservation,
        deleteReservation,
        loading,
        error
    };
};