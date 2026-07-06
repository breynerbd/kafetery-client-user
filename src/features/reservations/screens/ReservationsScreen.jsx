import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useReservations } from "../hooks/useReservations.js";
import { ReservationModal } from "./ReservationModal.jsx";

export const ReservationsScreen = () => {
    const { reservations, getReservations, deleteReservation, loading } = useReservations();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    useFocusEffect(
        useCallback(() => {
            getReservations();
        }, [getReservations])
    );

    const handleEdit = (reservation) => {
        setSelectedReservation(reservation);
        setModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedReservation(null);
        setModalOpen(true);
    };

    const handleDeleteConfirmation = (id, date) => {
        const readableDate = new Date(date).toLocaleDateString();
        Alert.alert(
            "Cancelar Reserva",
            `¿Estás seguro de que deseas cancelar la reserva del día ${readableDate}?`,
            [
                { text: "No", style: "cancel" },
                {
                    text: "Cancelar Reserva",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteReservation(id);
                            Alert.alert("Éxito", "La reserva fue cancelada.");
                        } catch (err) {
                            Alert.alert("Error", err || "No se pudo cancelar.");
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => {
        const resDate = new Date(item.date).toLocaleDateString();
        const restaurantName = typeof item.restaurant === 'object' ? item.restaurant?.name : "Sucursal Seleccionada";
        const tableNumber = typeof item.table === 'object' ? item.table?.tableNumber : `Nº ${item.table}`;
        const guests = item.people || item.guests || 0;

        return (
            <View style={styles.card}>
                <View style={styles.cardTopRow}>
                    <View style={styles.iconWrap}>
                        <Ionicons name="calendar" size={24} color="#C4622D" />
                    </View>

                    <View style={styles.cardBody}>
                        <Text style={styles.idLabel}>
                            ID: {String(item._id || item.id).substring(0, 8).toUpperCase()}...
                        </Text>
                        <Text style={styles.cardTitle}>{resDate}</Text>

                        <View style={styles.infoItem}>
                            <Ionicons name="time-outline" size={13} color="#8C6B55" />
                            <Text style={styles.infoText}>{item.time}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Ionicons name="storefront-outline" size={13} color="#8C6B55" />
                            <Text style={styles.infoText} numberOfLines={1}>{restaurantName}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Ionicons name="grid-outline" size={13} color="#8C6B55" />
                            <Text style={styles.infoText}>
                                Mesa: {item.table ? tableNumber : "No especificada"}
                            </Text>
                        </View>

                        <View style={styles.badge}>
                            <Ionicons name="people-outline" size={11} color="#EADDCA" />
                            <Text style={styles.badgeText}>{guests} Persona(s)</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actionsContainer}>
                    <Pressable style={styles.btnEdit} onPress={() => handleEdit(item)}>
                        <Ionicons name="create-outline" size={16} color="#C4622D" />
                        <Text style={styles.btnEditText}>Editar</Text>
                    </Pressable>
                    <Pressable
                        style={styles.btnDelete}
                        onPress={() => handleDeleteConfirmation(item._id || item.id, item.date)}
                    >
                        <Ionicons name="trash-outline" size={16} color="#DC2626" />
                        <Text style={styles.btnDeleteText}>Cancelar</Text>
                    </Pressable>
                </View>
            </View>
        );
    };

    if (loading && !reservations?.length) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#C4622D" />
                <Text style={styles.loadingText}>Cargando tus reservas…</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBand}>
                <View style={styles.topBandTextWrap}>
                    <Text style={styles.topBandLabel}>GESTIONA TUS RESERVAS</Text>
                    <Text style={styles.topBandTitle}>Mis Reservas</Text>
                </View>
                <Pressable style={styles.btnCreate} onPress={handleCreate}>
                    <Ionicons name="add" size={22} color="#FFFFFF" />
                </Pressable>
            </View>
            <Text style={styles.countText}>
                {reservations?.length ?? 0} reservas agendadas
            </Text>

            <FlatList
                data={reservations}
                keyExtractor={(item) => item._id || item.id}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={getReservations}
                        colors={["#C4622D"]}
                        tintColor="#C4622D"
                    />
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <Ionicons name="calendar-outline" size={48} color="#C4B5A8" />
                        <Text style={styles.emptyTitle}>Sin reservas activas</Text>
                        <Text style={styles.emptyText}>
                            No tienes reservas agendadas en este momento.
                        </Text>
                    </View>
                }
            />

            <ReservationModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedReservation(null);
                }}
                reservation={selectedReservation}
                onSuccess={getReservations}
            />
        </View>
    );
};

export default ReservationsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF6F1",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#FAF6F1",
    },
    loadingText: {
        fontSize: 14,
        color: "#8C6B55",
    },
    topBand: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        backgroundColor: "#2C1A0E",
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 56,
        paddingBottom: 28,
    },
    topBandTextWrap: {
        flexShrink: 1,
    },
    topBandLabel: {
        fontSize: 10,
        color: "#C4B5A8",
        letterSpacing: 1.5,
        fontWeight: "600",
        marginBottom: 4,
    },
    topBandTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#FAF6F1",
        letterSpacing: -0.3,
    },
    btnCreate: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: "#8C6B55",
        justifyContent: "center",
        alignItems: "center",
    },
    countText: {
        fontSize: 12,
        color: "#8C6B55",
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: 0.6,
        marginTop: 12,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 70,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        shadowColor: "#2C1A0E",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
    },
    cardTopRow: {
        flexDirection: "row",
        gap: 14,
    },
    iconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "#FFF0E8",
        justifyContent: "center",
        alignItems: "center",
    },
    cardBody: {
        flex: 1,
        gap: 4,
    },
    idLabel: {
        fontSize: 8,
        fontWeight: "800",
        color: "#D2B48C",
        letterSpacing: 1,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2C1A0E",
        marginBottom: 2,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    infoText: {
        fontSize: 13,
        color: "#6F4E37",
        flex: 1,
    },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4A3728",
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        gap: 4,
        marginTop: 4,
    },
    badgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "600",
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#FAF6F1",
    },
    btnEdit: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF0E8",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 10,
        gap: 4,
    },
    btnEditText: {
        fontSize: 12,
        color: "#C4622D",
        fontWeight: "700",
    },
    btnDelete: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF5F5",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 10,
        gap: 4,
    },
    btnDeleteText: {
        fontSize: 12,
        color: "#DC2626",
        fontWeight: "700",
    },
    emptyWrap: {
        alignItems: "center",
        paddingTop: 60,
        gap: 8,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2C1A0E",
    },
    emptyText: {
        fontSize: 13,
        color: "#8C6B55",
        textAlign: "center",
        paddingHorizontal: 20,
    },
});