import React from "react";
import { View, Text, StyleSheet, Modal, FlatList, Pressable, ActivityIndicator, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../../../shared/store/cartStore.js";
import { useOrders } from "../../orders/hooks/useOrders.js";
import { useTables } from "../../tables/hooks/useTables.js";
import { useEffect, useMemo, useState } from "react";

const CartScreen = ({ visible, onClose }) => {
    const { restaurant, items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
    const { createOrder, creating } = useOrders();

    const totalPrice = getTotalPrice();

    const { tables, getTables, loading: loadingTables } = useTables();

    const [selectedTable, setSelectedTable] = useState(null);
    useEffect(() => {
        if (visible) {
            getTables();
            setSelectedTable(null);
        }
    }, [visible]);

    const filteredTables = useMemo(() => {
        if (!restaurant) return [];

        return (tables || []).filter((table) => {
            const restaurantId =
                typeof table.restaurant === "object"
                    ? table.restaurant._id
                    : table.restaurant;

            return (
                restaurantId === restaurant._id &&
                table.isActive &&
                table.status === "AVAILABLE"
            );
        });
    }, [tables, restaurant]);

    const handleCreateOrder = async () => {
        if (items.length === 0) return;

        if (!selectedTable) {
            Alert.alert("Mesa requerida", "Selecciona una mesa.");
            return;
        }

        console.log("Enviando orden con mesa ID:", selectedTable);

        try {
            await createOrder({
                restaurant: restaurant._id,
                table: selectedTable,
                items,
            });

            clearCart();
            Alert.alert("¡Orden creada!", "Tu pedido fue registrado con éxito.");
            onClose();
        } catch (err) {
            Alert.alert("Error", err.message || "No se pudo crear la orden");
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.topBandLabel}>TU PEDIDO</Text>
                            <Text style={styles.topBandTitle}>Orden</Text>
                        </View>
                        <Pressable onPress={onClose}>
                            <Ionicons name="close-circle" size={30} color="#8B4513" />
                        </Pressable>
                    </View>

                    {restaurant && (
                        <View style={styles.restaurantBadge}>
                            <Ionicons name="storefront-outline" size={13} color="#EADDCA" />
                            <Text style={styles.restaurantBadgeText}>{restaurant?.name || "Restaurante"}</Text>
                        </View>
                    )}

                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.menu._id}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <View style={styles.iconWrap}>
                                    <Ionicons name="fast-food" size={20} color="#C4622D" />
                                </View>
                                <View style={styles.cardBody}>
                                    <Text style={styles.itemName}>{item.menu.name}</Text>
                                    <Text style={styles.itemPrice}>Q{item.menu.price.toFixed(2)} c/u</Text>
                                </View>
                                <View style={styles.stepper}>
                                    <Pressable
                                        style={styles.stepperButton}
                                        onPress={() =>
                                            updateQuantity(
                                                item.menu._id,
                                                item.quantity - 1
                                            )
                                        }
                                    >
                                        <Ionicons name="remove" size={16} color="#C4622D" />
                                    </Pressable>
                                    <Text style={styles.quantityValue}>{item.quantity}</Text>
                                    <Pressable
                                        style={styles.stepperButton}
                                        onPress={() =>
                                            updateQuantity(
                                                item.menu._id,
                                                Math.min(item.quantity + 1, item.menu.stock)
                                            )
                                        }
                                    >
                                        <Ionicons name="add" size={16} color="#C4622D" />
                                    </Pressable>
                                </View>
                                <Pressable style={styles.removeButton} onPress={() => removeItem(item.menu._id)}>
                                    <Ionicons name="trash-outline" size={18} color="#DC2626" />
                                </Pressable>
                            </View>
                        )}
                        contentContainerStyle={styles.listContent}
                    />

                    <Text style={styles.sectionLabel}>Selecciona una mesa</Text>

                    {loadingTables ? (
                        <ActivityIndicator color="#C4622D" />
                    ) : filteredTables.length === 0 ? (
                        <Text style={styles.emptyTableText}>
                            No hay mesas disponibles para este restaurante.
                        </Text>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.chipsRow}
                        >
                            {filteredTables.map((table) => {
                                const id = table._id || table.id;
                                const active = selectedTable === id;

                                return (
                                    <Pressable
                                        key={id}
                                        style={[
                                            styles.chip,
                                            active && styles.chipActive
                                        ]}
                                        onPress={() => setSelectedTable(id)}
                                    >
                                        <Text
                                            style={[
                                                styles.chipText,
                                                active && styles.chipTextActive
                                            ]}
                                        >
                                            Mesa {table.tableNumber}
                                        </Text>

                                        <Text
                                            style={[
                                                styles.chipCapacity,
                                                active && styles.chipTextActive
                                            ]}
                                        >
                                            {table.capacity} personas
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    )}

                    {items.length > 0 && (
                        <View style={styles.footer}>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>Q{totalPrice.toFixed(2)}</Text>
                            </View>
                            <Pressable style={styles.checkoutButton} onPress={handleCreateOrder} disabled={creating}>
                                {creating ? <ActivityIndicator color="#FFF" /> : <Text style={styles.checkoutButtonText}>Crear Orden</Text>}
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end"
    },
    modal: {
        backgroundColor: "#FAF6F1",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxHeight: "80%",
        padding: 22
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    topBandLabel: {
        fontSize: 10,
        color: "#8C6B55",
        letterSpacing: 1,
        fontWeight: "700"
    },
    topBandTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#2C1A0E"
    },
    restaurantBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#4A3728",
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        marginBottom: 16
    },
    restaurantBadgeText: {
        color: "#EADDCA",
        fontSize: 12,
        fontWeight: "600"
    },
    listContent: {
        paddingBottom: 20
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        gap: 10,
        elevation: 2
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#FFF0E8",
        justifyContent: "center",
        alignItems: "center"
    },
    cardBody: {
        flex: 1
    },
    itemName: {
        fontSize: 14,
        fontWeight: "700",
        color: "#2C1A0E"
    },
    itemPrice: {
        fontSize: 12,
        color: "#8C6B55"
    },
    stepper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FAF6F1",
        borderRadius: 10
    },
    stepperButton: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center"
    },
    quantityValue: {
        fontSize: 13,
        fontWeight: "700",
        color: "#2C1A0E",
        minWidth: 20,
        textAlign: "center"
    },
    removeButton: {
        padding: 6
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: "#EADDCA",
        paddingTop: 16
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#8C6B55"
    },
    totalValue: {
        fontSize: 20,
        fontWeight: "900",
        color: "#4A3728"
    },
    checkoutButton: {
        backgroundColor: "#6F4E37",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center"
    },
    checkoutButtonText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#2C1A0E",
        marginBottom: 8,
        marginTop: 12,
        textTransform: "uppercase",
    },

    chipsRow: {
        marginBottom: 15,
    },

    chip: {
        backgroundColor: "#FFF0E8",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "transparent",
    },

    chipActive: {
        backgroundColor: "#2C1A0E",
        borderColor: "#C4622D",
    },

    chipText: {
        color: "#6F4E37",
        fontWeight: "600",
    },

    chipTextActive: {
        color: "#FFF",
    },

    chipCapacity: {
        fontSize: 11,
        color: "#8C6B55",
        marginTop: 3,
    },
    emptyTableText: {
        color: "#8C6B55",
        marginBottom: 15,
        fontSize: 13,
    },
});