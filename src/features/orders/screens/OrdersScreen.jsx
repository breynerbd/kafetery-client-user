import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOrders } from "../hooks/useOrders.js";
import OrderDetails from "./OrderDetails";

const OrdersScreen = () => {
    const { orders, loading, getOrders } = useOrders();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        getOrders();
    }, []);

    const openDetails = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const closeDetails = () => {
        setModalVisible(false);
        setSelectedOrder(null);
    };

    const pendingOrders = orders?.filter(
        (o) => o.status !== "DELIVERED"
    );

    const deliveredOrders = orders?.filter(
        (o) => o.status === "DELIVERED"
    );

    const [tab, setTab] = useState("PENDING");

    const renderItem = ({ item }) => (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => openDetails(item)}
        >
            <View style={styles.iconWrap}>
                <Ionicons name="receipt-outline" size={22} color="#C4622D" />
            </View>

            <View style={styles.cardBody}>
                <View style={styles.idContainer}>
                    <Text style={styles.idLabel}>ORDER ID</Text>
                    <Text style={styles.idText} numberOfLines={1}>
                        {String(item._id || item.id).toUpperCase()}
                    </Text>
                </View>

                <View style={styles.infoItem}>
                    <Ionicons name="restaurant-outline" size={13} color="#8C6B55" />
                    <Text style={styles.infoText} numberOfLines={1}>
                        Mesa: {item.table?.tableNumber || "N/A"}
                    </Text>
                </View>

                <View style={styles.badge}>
                    <Ionicons name="fast-food-outline" size={11} color="#EADDCA" />
                    <Text style={styles.badgeText}>
                        {item.items?.length || 0} Prod.
                    </Text>
                </View>
            </View>

            <View style={styles.rightActionWrap}>
                <Text style={styles.priceText}>
                    Q{(item.totalPrice ?? 0).toFixed(2)}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#C4B5A8" />
            </View>
        </Pressable>
    );

    if (loading && !orders?.length) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#C4622D" />
                <Text style={styles.loadingText}>Sincronizando tus pedidos…</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBand}>
                <Text style={styles.topBandLabel}>HISTORIAL DE CONSUMO</Text>
                <Text style={styles.topBandTitle}>Mis Órdenes</Text>
            </View>
            <Text style={styles.countText}>
                {orders?.length ?? 0} Órdenes registradas
            </Text>

            <View style={styles.tabs}>
                <Pressable
                    style={[styles.tab, tab === "PENDING" && styles.tabActive]}
                    onPress={() => setTab("PENDING")}
                >
                    <Text style={[styles.tabText, tab === "PENDING" && styles.tabActiveText]}>Pendientes</Text>
                </Pressable>

                <Pressable
                    style={[styles.tab, tab === "DELIVERED" && styles.tabActive]}
                    onPress={() => setTab("DELIVERED")}
                >
                    <Text style={[styles.tabText, tab === "DELIVERED" && styles.tabActiveText]}>Entregadas</Text>
                </Pressable>
            </View>

            <FlatList
                data={tab === "PENDING" ? pendingOrders : deliveredOrders}
                keyExtractor={(item) => item._id || item.id}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={getOrders}
                        colors={["#C4622D"]}
                    />
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <Ionicons name="receipt-outline" size={48} color="#C4B5A8" />
                        <Text style={styles.emptyTitle}>Sin órdenes activas</Text>
                        <Text style={styles.emptyText}>
                            Aún no has realizado pedidos en el establecimiento.
                        </Text>
                    </View>
                }
            />

            <OrderDetails
                visible={modalVisible}
                order={selectedOrder}
                onClose={closeDetails}
            />
        </View>
    );
};

export default OrdersScreen;

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
        backgroundColor: "#2C1A0E",
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 56,
        paddingBottom: 28,
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
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        gap: 14,
        shadowColor: "#2C1A0E",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
    },
    cardPressed: {
        backgroundColor: "#FAF6F1",
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
    idContainer: {
        marginBottom: 2,
    },
    idLabel: {
        fontSize: 8,
        fontWeight: "800",
        color: "#D2B48C",
        letterSpacing: 1,
    },
    idText: {
        fontSize: 11,
        fontFamily: "System",
        fontWeight: "700",
        color: "#8B4513",
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    infoText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#2C1A0E",
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
        marginTop: 2,
    },
    badgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "600",
    },
    rightActionWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    priceText: {
        fontSize: 15,
        fontWeight: "900",
        color: "#8B4513",
        fontStyle: "italic",
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
    tabs: {
        flexDirection: "row",
        paddingHorizontal: 36,
        marginTop: 2,
        marginBottom: 12,
        gap: 10,
    },

    tab: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: "#E8DDD4",
        alignItems: "center",
    },

    tabActive: {
        backgroundColor: "#4A3728",
    },

    tabText: {
        fontWeight: "700",
        color: "#4A3728",
    },

    tabActiveText: {
        color: "#FFFFFF",
    },
});