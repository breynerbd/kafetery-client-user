import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const formatDate = (date) => {
    if (!date) return "No disponible";

    return new Date(date).toLocaleDateString("es-GT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const formatDays = (days = []) => {
    if (!days.length) return "Todos los días";

    return days.join(", ");
};

const PromotionDetails = ({ visible, promotion, onClose }) => {
    if (!promotion) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>

                    {/* Header */}

                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>
                                {promotion.title}
                            </Text>

                            <Text style={styles.subtitle}>
                                Código: {promotion.code}
                            </Text>
                        </View>

                        <Pressable onPress={onClose}>
                            <Ionicons
                                name="close-circle"
                                size={30}
                                color="#8B4513"
                            />
                        </Pressable>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >

                        {/* Descuento */}

                        <View style={styles.discountCard}>
                            <Text style={styles.discountValue}>
                                {promotion.value}
                            </Text>

                            <Text style={styles.discountLabel}>
                                {promotion.type === "PERCENTAGE"
                                    ? "% DE DESCUENTO"
                                    : promotion.type}
                            </Text>
                        </View>

                        {/* Descripción */}

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Descripción
                            </Text>

                            <Text style={styles.sectionText}>
                                {promotion.description ||
                                    "Sin descripción"}
                            </Text>
                        </View>

                        {/* Información */}

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Información
                            </Text>

                            <InfoRow
                                icon="calendar-outline"
                                label="Válido desde"
                                value={formatDate(
                                    promotion.validFrom
                                )}
                            />

                            <InfoRow
                                icon="calendar"
                                label="Hasta"
                                value={formatDate(
                                    promotion.validTo
                                )}
                            />

                            <InfoRow
                                icon="time-outline"
                                label="Horario"
                                value={`${promotion.startHour || "--"} - ${promotion.endHour || "--"
                                    }`}
                            />

                            <InfoRow
                                icon="today-outline"
                                label="Días"
                                value={formatDays(
                                    promotion.validDays
                                )}
                            />

                            <InfoRow
                                icon="cash-outline"
                                label="Compra mínima"
                                value={
                                    promotion.minPurchase
                                        ? `Q ${promotion.minPurchase}`
                                        : "No aplica"
                                }
                            />

                            <InfoRow
                                icon="repeat-outline"
                                label="Máx. usos"
                                value={
                                    promotion.maxUsesPerUser ||
                                    "Sin límite"
                                }
                            />

                            <InfoRow
                                icon="checkmark-circle-outline"
                                label="Estado"
                                value={
                                    promotion.isActive
                                        ? "Activa"
                                        : "Inactiva"
                                }
                            />
                        </View>

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const InfoRow = ({ icon, label, value }) => (
    <View style={styles.row}>
        <Ionicons
            name={icon}
            size={18}
            color="#8B4513"
        />

        <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>{label}</Text>
        </View>

        <Text style={styles.rowValue}>
            {value}
        </Text>
    </View>
);

export default PromotionDetails;

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
        maxHeight: "88%",
        padding: 22,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#2C1A0E",
    },

    subtitle: {
        marginTop: 4,
        color: "#8B4513",
        fontWeight: "600",
    },

    discountCard: {
        backgroundColor: "#4A3728",
        borderRadius: 20,
        paddingVertical: 24,
        alignItems: "center",
        marginBottom: 22,
    },

    discountValue: {
        fontSize: 42,
        color: "#FFF",
        fontWeight: "900",
    },

    discountLabel: {
        color: "#EADDCA",
        fontSize: 13,
        marginTop: 6,
        fontWeight: "700",
        letterSpacing: 1,
    },

    section: {
        marginBottom: 22,
    },

    sectionTitle: {
        fontWeight: "700",
        fontSize: 17,
        color: "#2C1A0E",
        marginBottom: 12,
    },

    sectionText: {
        color: "#6F4E37",
        lineHeight: 22,
        fontSize: 15,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#EEE",
        gap: 10,
    },

    rowLabel: {
        color: "#8C6B55",
        fontSize: 13,
    },

    rowValue: {
        color: "#2C1A0E",
        fontWeight: "700",
        maxWidth: "45%",
        textAlign: "right",
    },

    button: {
        backgroundColor: "#8B4513",
        paddingVertical: 15,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },

    buttonText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16,
    },
});