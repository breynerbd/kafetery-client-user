import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePaymentMethods } from "../hooks/usePaymentMethods.js";

const AddCardModal = ({ visible, onClose, onAdded }) => {
    const { addCard, creating } = usePaymentMethods();

    const [form, setForm] = useState({
        cardHolder: "",
        cardNumber: "",
        cvv: "",
        expiryMonth: "",
        expiryYear: "",
        brand: "Visa",
    });
    const [errors, setErrors] = useState({});

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
    };

    const validate = () => {
        const errs = {};
        if (!form.cardHolder.trim()) errs.cardHolder = "Obligatorio";
        if (!/^\d{16}$/.test(form.cardNumber)) errs.cardNumber = "Debe tener 16 dígitos";
        if (!/^\d{3,4}$/.test(form.cvv)) errs.cvv = "3 o 4 dígitos";

        const month = parseInt(form.expiryMonth, 10);
        if (!month || month < 1 || month > 12) errs.expiryMonth = "Mes inválido";

        const year = parseInt(form.expiryYear, 10);
        const currentYear = new Date().getFullYear();
        if (!year || year < currentYear || year > currentYear + 20) errs.expiryYear = "Año inválido";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            const newCard = await addCard({
                cardHolder: form.cardHolder.trim(),
                cardNumber: form.cardNumber,
                cvv: form.cvv,
                expiryMonth: parseInt(form.expiryMonth, 10),
                expiryYear: parseInt(form.expiryYear, 10),
                brand: form.brand,
            });

            setForm({
                cardHolder: "",
                cardNumber: "",
                cvv: "",
                expiryMonth: "",
                expiryYear: "",
                brand: "Visa",
            });

            onAdded?.(newCard);
            onClose();
        } catch (err) {
            Alert.alert("Error", err.message || "No se pudo agregar la tarjeta");
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Agregar Tarjeta</Text>
                        <Pressable onPress={onClose}>
                            <Ionicons name="close-circle" size={28} color="#8B4513" />
                        </Pressable>
                    </View>

                    <View style={styles.brandRow}>
                        {["Visa", "Mastercard"].map((b) => (
                            <Pressable
                                key={b}
                                style={[styles.brandChip, form.brand === b && styles.brandChipActive]}
                                onPress={() => updateField("brand", b)}
                            >
                                <Text
                                    style={[
                                        styles.brandChipText,
                                        form.brand === b && styles.brandChipTextActive,
                                    ]}
                                >
                                    {b}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre del titular</Text>
                        <TextInput
                            style={[styles.input, errors.cardHolder && styles.inputError]}
                            placeholder="Juan Pérez"
                            placeholderTextColor="#C4B5A8"
                            value={form.cardHolder}
                            onChangeText={(v) => updateField("cardHolder", v)}
                        />
                        {errors.cardHolder && <Text style={styles.errorText}>{errors.cardHolder}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Número de tarjeta</Text>
                        <TextInput
                            style={[styles.input, errors.cardNumber && styles.inputError]}
                            placeholder="1234123412341234"
                            placeholderTextColor="#C4B5A8"
                            keyboardType="number-pad"
                            maxLength={16}
                            value={form.cardNumber}
                            onChangeText={(v) => updateField("cardNumber", v.replace(/\D/g, ""))}
                        />
                        {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Mes</Text>
                            <TextInput
                                style={[styles.input, errors.expiryMonth && styles.inputError]}
                                placeholder="MM"
                                placeholderTextColor="#C4B5A8"
                                keyboardType="number-pad"
                                maxLength={2}
                                value={form.expiryMonth}
                                onChangeText={(v) => updateField("expiryMonth", v.replace(/\D/g, ""))}
                            />
                            {errors.expiryMonth && <Text style={styles.errorText}>{errors.expiryMonth}</Text>}
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Año</Text>
                            <TextInput
                                style={[styles.input, errors.expiryYear && styles.inputError]}
                                placeholder="AAAA"
                                placeholderTextColor="#C4B5A8"
                                keyboardType="number-pad"
                                maxLength={4}
                                value={form.expiryYear}
                                onChangeText={(v) => updateField("expiryYear", v.replace(/\D/g, ""))}
                            />
                            {errors.expiryYear && <Text style={styles.errorText}>{errors.expiryYear}</Text>}
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>CVV</Text>
                            <TextInput
                                style={[styles.input, errors.cvv && styles.inputError]}
                                placeholder="123"
                                placeholderTextColor="#C4B5A8"
                                keyboardType="number-pad"
                                maxLength={4}
                                secureTextEntry
                                value={form.cvv}
                                onChangeText={(v) => updateField("cvv", v.replace(/\D/g, ""))}
                            />
                            {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
                        </View>
                    </View>

                    <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={creating}>
                        {creating ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.submitButtonText}>Guardar tarjeta</Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

export default AddCardModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    modal: {
        backgroundColor: "#FAF6F1",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 22,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2C1A0E",
    },
    brandRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
    },
    brandChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#EADDCA",
    },
    brandChipActive: {
        backgroundColor: "#4A3728",
        borderColor: "#4A3728",
    },
    brandChipText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#4A3728",
    },
    brandChipTextActive: {
        color: "#FFFFFF",
    },
    row: {
        flexDirection: "row",
        gap: 10,
    },
    inputGroup: {
        marginBottom: 14,
    },
    label: {
        fontSize: 11,
        fontWeight: "700",
        color: "#4A3728",
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 0.4,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 11,
        fontSize: 14,
        color: "#2C1A0E",
        borderWidth: 1,
        borderColor: "#EADDCA",
    },
    inputError: {
        borderColor: "#DC2626",
    },
    errorText: {
        fontSize: 11,
        color: "#DC2626",
        marginTop: 4,
    },
    submitButton: {
        backgroundColor: "#C4622D",
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 8,
        marginBottom: 12,
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 15,
    },
});