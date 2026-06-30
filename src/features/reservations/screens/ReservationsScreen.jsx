import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useReservations } from "../hooks/useReservations.js";
import { ReservationModal } from "./ReservationModal.jsx"; // Importación local en la misma carpeta

export const ReservationsScreen = () => {
    const { reservations, getReservations, deleteReservation, loading } = useReservations();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    useEffect(() => {
        getReservations();
    }, []);

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
            "Eliminar Reserva",
            `¿Estás seguro de que deseas cancelar la reserva del día ${readableDate}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await deleteReservation(id);
                            Alert.alert("Éxito", "La reserva fue eliminada.");
                        } catch (err) {
                            Alert.alert("Error", err || "No se pudo eliminar.");
                        }
                    } 
                }
            ]
        );
    };

    const renderItem = ({ item }) => {
        const resDate = new Date(item.date).toLocaleDateString();
        const restaurantName = typeof item.restaurant === 'object' ? item.restaurant?.name : "Sucursal Seleccionada";
        
        // Renderizado seguro de la mesa elegida
        const tableName = typeof item.table === 'object' ? (item.table?.number || item.table?.name) : `Nº ${item.table}`;

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.headerLeft}>
                        <View style={styles.iconWrap}>
                            <Ionicons name="calendar" size={22} color="#FAF6F1" />
                        </View>
                        <View>
                            <Text style={styles.cardId}>ID: {(item._id || item.id).substring(0, 8)}...</Text>
                            <Text style={styles.cardTitle}>{resDate}</Text>
                            <View style={styles.infoItem}>
                                <Ionicons name="time-outline" size={13} color="#8C6B55" />
                                <Text style={styles.infoText}>{item.time}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.people || item.guests} 🍽️</Text>
                    </View>
                </View>

                {/* Cuerpo con la sucursal y la mesa asignada */}
                <View style={styles.cardBody}>
                    <View style={styles.infoItem}>
                        <Ionicons name="storefront-outline" size={13} color="#8C6B55" />
                        <Text style={styles.infoText} numberOfLines={1}>{restaurantName}</Text>
                    </View>
                    <View style={[styles.infoItem, { marginTop: 6 }]}>
                        <Ionicons name="grid-outline" size={13} color="#8C6B55" />
                        <Text style={styles.infoText}>Mesa asignada: {item.table ? tableName : "No especificada"}</Text>
                    </View>
                </View>

                {/* Botones de Acción */}
                <View style={styles.actionsContainer}>
                    <Pressable style={styles.btnEdit} onPress={() => handleEdit(item)}>
                        <Ionicons name="create-outline" size={16} color="#4A3728" />
                        <Text style={styles.btnEditText}>Editar</Text>
                    </Pressable>
                    <Pressable style={styles.btnDelete} onPress={() => handleDeleteConfirmation(item._id || item.id, item.date)}>
                        <Ionicons name="trash-outline" size={16} color="#DC2626" />
                        <Text style={styles.btnDeleteText}>Eliminar</Text>
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mis Reservas</Text>
                <Pressable style={styles.btnCreate} onPress={handleCreate}>
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                    <Text style={styles.btnCreateText}>Nueva</Text>
                </Pressable>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#4A3728" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={reservations}
                    keyExtractor={(item) => item._id || item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No tienes reservas agendadas en este momento.</Text>
                    }
                />
            )}

            <ReservationModal 
                isOpen={modalOpen} 
                onClose={() => {
                    setModalOpen(false);
                    setSelectedReservation(null);
                }} 
                reservation={selectedReservation} 
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
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        color: "#2C1A0E",
    },
    btnCreate: {
        backgroundColor: "#4A3728",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 4,
    },
    btnCreateText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 14,
    },
    listContainer: {
        padding: 20,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#4A3728",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderBottomWidth: 1,
        borderBottomColor: "#FAF6F1",
        paddingBottom: 12,
    },
    headerLeft: {
        flexDirection: "row",
        gap: 12,
    },
    iconWrap: {
        backgroundColor: "#4A3728",
        padding: 10,
        borderRadius: 14,
    },
    cardId: {
        fontSize: 10,
        color: "#C4B5A8",
        fontWeight: "600",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2C1A0E",
        marginTop: 1,
    },
    badge: {
        backgroundColor: "#EADDCA",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#4A3728",
    },
    cardBody: {
        paddingVertical: 12,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    infoText: {
        fontSize: 13,
        color: "#5C4033",
        fontWeight: "600",
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: "#FAF6F1",
        paddingTop: 12,
    },
    btnEdit: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EADDCA",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 4,
    },
    btnEditText: {
        fontSize: 12,
        color: "#4A3728",
        fontWeight: "700",
    },
    btnDelete: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF5F5",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 4,
    },
    btnDeleteText: {
        fontSize: 12,
        color: "#DC2626",
        fontWeight: "700",
    },
    emptyText: {
        textAlign: "center",
        color: "#8C6B55",
        marginTop: 40,
        fontSize: 14,
        fontWeight: "600",
    },
});