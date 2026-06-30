import React, { useEffect } from "react";
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
import { useTables } from "../hooks/useTables.js";

const TablesScreen = () => {
    const { tables, loading, getTables } = useTables();

    useEffect(() => {
        getTables();
    }, []);

    const renderItem = ({ item }) => (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
            <View style={styles.iconWrap}>
                <Text style={styles.tablePrefix}>Mesa</Text>
                <Text style={styles.tableNumber}>{item.tableNumber}</Text>
            </View>

            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Mesa Disponible</Text>
                
                <View style={styles.infoItem}>
                    <Ionicons name="people-outline" size={14} color="#8B4513" />
                    <Text style={styles.infoText}>
                        Capacidad máxima: {item.capacity} personas
                    </Text>
                </View>

                <View style={styles.infoItem}>
                    <Ionicons name="key-outline" size={12} color="#D2B48C" />
                    <Text style={styles.infoCode} numberOfLines={1}>
                        Ref: {item._id || item.id}
                    </Text>
                </View>
            </View>

            <Ionicons name="chevron-forward" size={16} color="#C4B5A8" />
        </Pressable>
    );

    if (loading && !tables?.length) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#C4622D" />
                <Text style={styles.loadingText}>Cargando distribución de mesas…</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={tables}
                keyExtractor={(item) => item._id || item.id}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={getTables}
                        colors={["#C4622D"]}
                    />
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
                        <View style={styles.topBand}>
                            <Text style={styles.topBandLabel}>DISTRIBUCIÓN EN SALA</Text>
                            <Text style={styles.topBandTitle}>Disponibilidad</Text>
                        </View>
                        <Text style={styles.countText}>
                            {tables?.length ?? 0} Mesas listas en el establecimiento
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <Ionicons name="search-outline" size={48} color="#C4B5A8" />
                        <Text style={styles.emptyTitle}>No se encontraron mesas</Text>
                        <Text style={styles.emptyText}>Por ahora no hay mesas asignadas.</Text>
                    </View>
                }
            />
        </View>
    );
};

export default TablesScreen;

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
        marginHorizontal: -16,
        marginBottom: 20,
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
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 30,
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
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: "#4A3728",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    tablePrefix: {
        fontSize: 9,
        fontWeight: "800",
        color: "#C4B5A8",
        textTransform: "uppercase",
        lineHeight: 10,
    },
    tableNumber: {
        fontSize: 20,
        fontWeight: "900",
        color: "#FFFFFF",
        lineHeight: 22,
    },
    cardBody: {
        flex: 1,
        gap: 3,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2C1A0E",
        marginBottom: 1,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    infoText: {
        fontSize: 13,
        color: "#6F4E37",
        fontWeight: "500",
    },
    infoCode: {
        fontSize: 11,
        color: "#D2B48C",
    },
    emptyWrap: {
        alignItems: "center",
        paddingTop: 80,
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
    },
});