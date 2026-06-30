import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRestaurants } from "../../restaurants/hooks/useRestaurants.js";
import { useReservations } from "../hooks/useReservations.js"; // Ajustado según tu estructura de hooks

export const ReservationModal = ({ isOpen, onClose, reservation }) => {
    const { restaurants, getRestaurants } = useRestaurants();
    const { saveReservation } = useReservations();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [availableTables, setAvailableTables] = useState([]);

    const [formData, setFormData] = useState({
        restaurant: "",
        table: "",
        date: "",
        time: "",
        people: "1"
    });

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            getRestaurants();

            if (reservation) {
                setFormData({
                    restaurant: reservation.restaurant?._id || reservation.restaurant || "",
                    table: reservation.table?._id || reservation.table || "",
                    date: reservation.date ? reservation.date.split('T')[0] : "",
                    time: reservation.time || "",
                    people: String(reservation.people || reservation.guests || 1)
                });
            } else {
                setFormData({ restaurant: "", table: "", date: "", time: "", people: "1" });
                setAvailableTables([]);
            }
        }
    }, [reservation, isOpen]);

    // Filtra las mesas de la sucursal seleccionada en tiempo real
    useEffect(() => {
        if (formData.restaurant && restaurants?.length > 0) {
            const selectedRest = restaurants.find(
                (r) => (r._id || r.id) === formData.restaurant
            );
            setAvailableTables(selectedRest?.tables || []);
        } else {
            setAvailableTables([]);
        }
    }, [formData.restaurant, restaurants]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.restaurant) newErrors.restaurant = "Selecciona una sucursal";
        if (!formData.table) newErrors.table = "Selecciona una mesa";
        if (!formData.date) newErrors.date = "Fecha requerida (AAAA-MM-DD)";
        if (!formData.time) newErrors.time = "Hora requerida (HH:MM)";
        if (!formData.people || Number(formData.people) < 1) newErrors.people = "Mínimo 1 persona";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                people: Number(formData.people)
            };
            await saveReservation(payload, reservation?._id || reservation?.id);
            Alert.alert("Éxito", reservation ? "Reserva actualizada" : "Reserva creada con éxito");
            onClose();
        } catch (error) {
            Alert.alert("Error", error || "Ocurrió un error al procesar tu solicitud");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={isOpen}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <View style={styles.headerTitleWrap}>
                            <Ionicons name="restaurant" size={20} color="#FAF6F1" />
                            <Text style={styles.modalTitle}>
                                {reservation ? "Editar Reserva" : "Nueva Reserva"}
                            </Text>
                        </View>
                        <Pressable onPress={onClose} style={styles.btnClose}>
                            <Ionicons name="close" size={24} color="#FAF6F1" />
                        </Pressable>
                    </View>

                    {/* Formulario */}
                    <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
                        
                        {/* Selector de Sucursal */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>SUCURSAL / RESTAURANTE</Text>
                            <View style={[styles.pickerWrap, errors.restaurant && styles.inputError]}>
                                <Picker
                                    selectedValue={formData.restaurant}
                                    onValueChange={(itemValue) => {
                                        setFormData({ ...formData, restaurant: itemValue, table: "" });
                                    }}
                                    dropdownIconColor="#4A3728"
                                >
                                    <Picker.Item label="Selecciona una sucursal..." value="" color="#8C6B55" />
                                    {restaurants?.map((r) => (
                                        <Picker.Item key={r._id || r.id} label={r.name} value={r._id || r.id} color="#2C1A0E" />
                                    ))}
                                </Picker>
                            </View>
                            {errors.restaurant && <Text style={styles.errorLabel}>{errors.restaurant}</Text>}
                        </View>

                        {/* Selector de Mesa Dinámico */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>SELECCIONAR MESA</Text>
                            <View style={[styles.pickerWrap, errors.table && styles.inputError]}>
                                <Picker
                                    selectedValue={formData.table}
                                    onValueChange={(itemValue) => setFormData({ ...formData, table: itemValue })}
                                    disabled={!formData.restaurant}
                                    dropdownIconColor="#4A3728"
                                >
                                    <Picker.Item label={formData.restaurant ? "Selecciona una mesa..." : "Primero elige una sucursal"} value="" color="#8C6B55" />
                                    {availableTables.map((t) => (
                                        <Picker.Item 
                                            key={t._id || t.id} 
                                            label={`Mesa ${t.number || t.name} (Capacidad: ${t.capacity || t.chairs || 4})`} 
                                            value={t._id || t.id} 
                                            color="#2C1A0E" 
                                        />
                                    ))}
                                </Picker>
                            </View>
                            {errors.table && <Text style={styles.errorLabel}>{errors.table}</Text>}
                        </View>

                        {/* Campo Fecha */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>FECHA (AAAA-MM-DD)</Text>
                            <TextInput
                                style={[styles.input, errors.date && styles.inputError]}
                                placeholder="Ej: 2026-07-15"
                                placeholderTextColor="#C4B5A8"
                                value={formData.date}
                                onChangeText={(text) => setFormData({ ...formData, date: text })}
                            />
                            {errors.date && <Text style={styles.errorLabel}>{errors.date}</Text>}
                        </View>

                        {/* Campo Hora */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>HORA (HH:MM)</Text>
                            <TextInput
                                style={[styles.input, errors.time && styles.inputError]}
                                placeholder="Ej: 19:30"
                                placeholderTextColor="#C4B5A8"
                                value={formData.time}
                                onChangeText={(text) => setFormData({ ...formData, time: text })}
                            />
                            {errors.time && <Text style={styles.errorLabel}>{errors.time}</Text>}
                        </View>

                        {/* Cantidad de comensales */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>NÚMERO DE COMENSALES</Text>
                            <TextInput
                                style={[styles.input, errors.people && styles.inputError]}
                                keyboardType="numeric"
                                value={formData.people}
                                onChangeText={(text) => setFormData({ ...formData, people: text })}
                            />
                            {errors.people && <Text style={styles.errorLabel}>{errors.people}</Text>}
                        </View>

                        {/* Botón de envío */}
                        <Pressable 
                            style={({ pressed }) => [styles.btnSubmit, pressed && styles.btnSubmitPressed]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.btnSubmitText}>
                                    {reservation ? "GUARDAR CAMBIOS" : "CONFIRMAR RESERVA"}
                                </Text>
                            )}
                        </Pressable>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default ReservationModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(74, 55, 40, 0.6)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: "90%",
    },
    modalHeader: {
        backgroundColor: "#4A3728",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    headerTitleWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#FAF6F1",
    },
    btnClose: {
        padding: 4,
    },
    formContainer: {
        padding: 24,
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 11,
        fontWeight: "700",
        color: "#D2B48C",
        letterSpacing: 1,
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#EADDCA",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: "#2C1A0E",
        fontWeight: "600",
    },
    pickerWrap: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#EADDCA",
        borderRadius: 16,
        overflow: "hidden",
    },
    inputError: {
        borderColor: "#DC2626",
        backgroundColor: "#FFF5F5",
    },
    errorLabel: {
        color: "#DC2626",
        fontSize: 10,
        fontWeight: "700",
        marginTop: 4,
        marginLeft: 4,
    },
    btnSubmit: {
        backgroundColor: "#4A3728",
        borderRadius: 18,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 12,
        shadowColor: "#4A3728",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    btnSubmitPressed: {
        backgroundColor: "#2C1A0E",
    },
    btnSubmitText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 14,
        letterSpacing: 1,
    },
});