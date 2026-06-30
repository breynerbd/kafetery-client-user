import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import reservationClient from "../../../shared/api/reservationClient.js";
import { useReservationStore } from "../../../shared/store/reservationsStore.js";

export const useReservations = () => {
    const { reservations, setReservations } = useReservationStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Obtener todas las reservas del usuario conectado
    const getReservations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await reservationClient.get("/reservations"); // Ajusta el sub-endpoint si varía
            setReservations(res.data.data || res.data);
            return res.data.data || res.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al obtener reservas");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setReservations]);

    // Guardar una reserva (Sirve tanto para Crear como para Editar si pasas un ID)
    const saveReservation = useCallback(async (formData, id = null) => {
        try {
            setLoading(true);
            setError(null);
            let res;
            
            if (id) {
                // Modo Edición
                res = await reservationClient.put(`/reservations/${id}`, formData);
            } else {
                // Modo Creación
                res = await reservationClient.post("/reservations", formData);
            }
            
            // Volvemos a pedir la lista actualizada al servidor para mantener consistencia
            await getReservations();
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al procesar la reserva");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getReservations]);

    // Eliminar o Cancelar una reserva
    const deleteReservation = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);
            await reservationClient.delete(`/reservations/${id}`);
            
            // Refrescar la lista local tras borrar exitosamente
            await getReservations();
        } catch (err) {
            setError(err.response?.data?.message || "Error al eliminar la reserva");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getReservations]);

    // Escucha el foco de la pantalla de React Navigation para auto-cargar
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