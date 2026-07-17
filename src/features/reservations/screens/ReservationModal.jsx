import React, { useState, useEffect, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Pressable,
    ScrollView,
    TextInput,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRestaurants } from "../../restaurants/hooks/useRestaurants.js";
import { useTables } from "../../tables/hooks/useTables.js";
import apiClient from "../../../shared/api/apiClient.js";

const STATUS_LABEL = {
    AVAILABLE: "Disponible",
    RESERVED: "Reservada",
    OCCUPIED: "Ocupada",
};

export const ReservationModal = ({ isOpen, onClose, reservation, onSuccess }) => {
    const isEditing = !!reservation;

    const { restaurants, getRestaurants, loading: loadingRestaurants } = useRestaurants();
    const { tables, getTables, loading: loadingTables } = useTables();

    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [people, setPeople] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            getRestaurants();
            getTables();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        if (reservation) {
            const restaurantId =
                typeof reservation.restaurant === "object"
                    ? reservation.restaurant?._id
                    : reservation.restaurant;
            const tableId =
                typeof reservation.table === "object" ? reservation.table?._id : reservation.table;

            setSelectedRestaurant(restaurantId || null);
            setSelectedTable(tableId || null);
            setDate(
                reservation.date ? new Date(reservation.date).toISOString().slice(0, 10) : ""
            );
            setTime(reservation.time || "");
            setPeople(reservation.people || reservation.guests || 1);
        } else {
            setSelectedRestaurant(null);
            setSelectedTable(null);
            setDate("");
            setTime("");
            setPeople(1);
        }
    }, [isOpen, reservation]);

    const filteredTables = useMemo(() => {
        if (!selectedRestaurant) return [];
        return (tables || []).filter((t) => {
            const tRestaurantId = typeof t.restaurant === "object" ? t.restaurant?._id : t.restaurant;
            return tRestaurantId === selectedRestaurant;
        });
    }, [tables, selectedRestaurant]);

    const currentTableData = filteredTables.find((t) => (t._id || t.id) === selectedTable);

    const incrementPeople = () => {
        setPeople((p) => {
            const next = p + 1;
            if (currentTableData?.capacity && next > currentTableData.capacity) return p;
            return next;
        });
    };

    const decrementPeople = () => setPeople((p) => Math.max(1, p - 1));

    const validate = () => {
        if (!selectedRestaurant) return "Selecciona un restaurante";
        if (!selectedTable) return "Selecciona una mesa";
        if (!date) return "Ingresa la fecha (YYYY-MM-DD)";
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
            return "Formato de fecha inválido, usa YYYY-MM-DD";

        if (!time) return "Ingresa la hora (HH:MM)";
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
            return "Formato de hora inválido, usa HH:MM";

        const selectedDateTime = new Date(`${date}T${time}:00`);

        if (isNaN(selectedDateTime.getTime())) {
            return "La fecha u hora no son válidas.";
        }

        const minReservationDate = new Date();
        minReservationDate.setMinutes(minReservationDate.getMinutes() + 30);

        if (selectedDateTime < minReservationDate) {
            return "La reserva debe realizarse con al menos 30 minutos de anticipación.";
        }

        if (currentTableData?.capacity && people > currentTableData.capacity) {
            return `La mesa seleccionada tiene capacidad máxima de ${currentTableData.capacity}`;
        }

        return null;
    };

    const handleSubmit = async () => {
        const validationError = validate();
        if (validationError) {
            Alert.alert("Datos incompletos", validationError);
            return;
        }

        const payload = {
            restaurant: selectedRestaurant,
            table: selectedTable,
            date,
            time,
            people,
        };

        try {
            setSubmitting(true);
            if (isEditing) {
                const id = reservation._id || reservation.id;
                await apiClient.put(`/reservations/${id}`, payload);
                Alert.alert("Éxito", "Reserva actualizada correctamente.");
            } else {
                await apiClient.post("/reservations", payload);
                Alert.alert("Éxito", "Reserva creada correctamente.");
            }
            onSuccess?.();
            onClose();
        } catch (err) {
            const message = err.response?.data?.message || "No se pudo guardar la reserva.";
            Alert.alert("Error", message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    <View style={styles.modalHandle} />

                    <ScrollView
                        style={styles.scrollArea}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.modalIconWrap}>
                            <Ionicons name="calendar" size={26} color="#694f3dff" />
                        </View>

                        <Text style={styles.modalTitle}>
                            {isEditing ? "Editar Reserva" : "Nueva Reserva"}
                        </Text>

                        <Text style={styles.sectionLabel}>Restaurante</Text>
                        {loadingRestaurants && !restaurants?.length ? (
                            <ActivityIndicator color="#C4622D" style={{ marginVertical: 10 }} />
                        ) : (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.chipsRow}
                            >
                                {(restaurants || []).map((r) => {
                                    const id = r._id || r.id;
                                    const active = selectedRestaurant === id;
                                    return (
                                        <Pressable
                                            key={id}
                                            style={[styles.chip, active && styles.chipActive]}
                                            onPress={() => {
                                                setSelectedRestaurant(id);
                                                setSelectedTable(null);
                                            }}
                                        >
                                            <Text style={[styles.chipText, active && styles.chipTextActive]}>
                                                {r.name}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                        )}

                        <Text style={styles.sectionLabel}>Mesa</Text>
                        {!selectedRestaurant ? (
                            <Text style={styles.hintText}>Primero selecciona un restaurante</Text>
                        ) : loadingTables && !tables?.length ? (
                            <ActivityIndicator color="#C4622D" style={{ marginVertical: 10 }} />
                        ) : filteredTables.length === 0 ? (
                            <Text style={styles.hintText}>No hay mesas para este restaurante</Text>
                        ) : (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.chipsRow}
                            >
                                {filteredTables.map((t) => {
                                    const id = t._id || t.id;
                                    const active = selectedTable === id;
                                    const isOccupied =
                                        t.status && t.status !== "AVAILABLE" && id !== selectedTable;
                                    return (
                                        <Pressable
                                            key={id}
                                            disabled={isOccupied}
                                            style={[
                                                styles.chip,
                                                active && styles.chipActive,
                                                isOccupied && styles.chipDisabled,
                                            ]}
                                            onPress={() => setSelectedTable(id)}
                                        >
                                            <Text
                                                style={[
                                                    styles.chipText,
                                                    active && styles.chipTextActive,
                                                    isOccupied && styles.chipTextDisabled,
                                                ]}
                                            >
                                                Mesa {t.tableNumber ?? id} · {t.capacity} pers.
                                            </Text>
                                            {isOccupied && (
                                                <Text style={styles.chipSubtext}>
                                                    {STATUS_LABEL[t.status] || t.status}
                                                </Text>
                                            )}
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                        )}

                        <View style={styles.row}>
                            <View style={styles.halfField}>
                                <Text style={styles.sectionLabel}>Fecha</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor="#C4B5A8"
                                    value={date}
                                    onChangeText={setDate}
                                    keyboardType="numbers-and-punctuation"
                                />
                            </View>
                            <View style={styles.halfField}>
                                <Text style={styles.sectionLabel}>Hora</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="HH:MM"
                                    placeholderTextColor="#C4B5A8"
                                    value={time}
                                    onChangeText={setTime}
                                    keyboardType="numbers-and-punctuation"
                                />
                            </View>
                        </View>

                        <Text style={styles.sectionLabel}>Personas</Text>
                        <View style={styles.stepperRow}>
                            <Pressable style={styles.stepperBtn} onPress={decrementPeople}>
                                <Ionicons name="remove" size={18} color="#C4622D" />
                            </Pressable>
                            <Text style={styles.stepperValue}>{people}</Text>
                            <Pressable style={styles.stepperBtn} onPress={incrementPeople}>
                                <Ionicons name="add" size={18} color="#C4622D" />
                            </Pressable>
                            {currentTableData?.capacity && (
                                <Text style={styles.capacityHint}>
                                    Máx. {currentTableData.capacity}
                                </Text>
                            )}
                        </View>
                    </ScrollView>

                    <View style={styles.actionsRow}>
                        <Pressable style={styles.btnCancel} onPress={onClose} disabled={submitting}>
                            <Text style={styles.btnCancelText}>Cancelar</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.btnSave, submitting && styles.btnSaveDisabled]}
                            onPress={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text style={styles.btnSaveText}>
                                    {isEditing ? "Guardar cambios" : "Crear reserva"}
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ReservationModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(44, 26, 14, 0.5)",
    },
    modalCard: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 24,
        paddingHorizontal: 24,
        alignItems: "center",
        maxHeight: "90%",
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#E5DAD0",
        marginBottom: 16,
    },
    scrollArea: {
        alignSelf: "stretch",
    },
    scrollContent: {
        alignItems: "center",
        paddingBottom: 10,
    },
    modalIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#FFF0E8",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 19,
        fontWeight: "700",
        color: "#2C1A0E",
        marginBottom: 16,
        textAlign: "center",
    },
    sectionLabel: {
        alignSelf: "flex-start",
        fontSize: 12,
        fontWeight: "700",
        color: "#2C1A0E",
        textTransform: "uppercase",
        letterSpacing: 0.6,
        marginBottom: 8,
        marginTop: 12,
    },
    hintText: {
        alignSelf: "flex-start",
        fontSize: 13,
        color: "#8C6B55",
        marginBottom: 4,
    },
    chipsRow: {
        alignSelf: "stretch",
    },
    chip: {
        backgroundColor: "#FFF0E8",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        marginRight: 8,
        borderWidth: 1.5,
        borderColor: "transparent",
    },
    chipActive: {
        backgroundColor: "#2C1A0E",
        borderColor: "#C4622D",
    },
    chipDisabled: {
        backgroundColor: "#F2F2F2",
        opacity: 0.6,
    },
    chipText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6F4E37",
    },
    chipTextActive: {
        color: "#FAF6F1",
    },
    chipTextDisabled: {
        color: "#A8A8A8",
    },
    chipSubtext: {
        fontSize: 10,
        color: "#DC2626",
        fontWeight: "700",
        marginTop: 2,
    },
    row: {
        flexDirection: "row",
        alignSelf: "stretch",
        gap: 12,
    },
    halfField: {
        flex: 1,
    },
    input: {
        backgroundColor: "#FAF6F1",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 14,
        color: "#2C1A0E",
        borderWidth: 1,
        borderColor: "#EADDCA",
    },
    stepperRow: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 14,
    },
    stepperBtn: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: "#FFF0E8",
        justifyContent: "center",
        alignItems: "center",
    },
    stepperValue: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2C1A0E",
        minWidth: 20,
        textAlign: "center",
    },
    capacityHint: {
        fontSize: 11,
        color: "#8C6B55",
        marginLeft: 4,
    },
    actionsRow: {
        flexDirection: "row",
        alignSelf: "stretch",
        gap: 12,
        paddingTop: 16,
        paddingBottom: 24,
    },
    btnCancel: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 14,
        backgroundColor: "#FFF0E8",
        alignItems: "center",
    },
    btnCancelText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#6F4E37",
    },
    btnSave: {
        flex: 1.4,
        paddingVertical: 13,
        borderRadius: 14,
        backgroundColor: "#8C6B55",
        alignItems: "center",
        justifyContent: "center",
    },
    btnSaveDisabled: {
        opacity: 0.7,
    },
    btnSaveText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#FFFFFF",
    },
});