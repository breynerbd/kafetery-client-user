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
import { useRestaurants } from "../hooks/useRestaurants.js";

const RestaurantsScreen = () => {
    const { restaurants, loading, getRestaurants } = useRestaurants();

    useEffect(() => {
        getRestaurants();
    }, []);

    const renderItem = ({ item }) => (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
            <View style={styles.iconWrap}>
                <Ionicons name="storefront" size={24} color="#C4622D" />
            </View>

            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.infoItem}>
                    <Ionicons name="location-outline" size={13} color="#8C6B55" />
                    <Text style={styles.infoText} numberOfLines={1}>{item.address}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="call-outline" size={13} color="#8C6B55" />
                    <Text style={styles.infoText}>{item.phone}</Text>
                </View>
            </View>

            <Ionicons name="chevron-forward" size={16} color="#C4B5A8" />
        </Pressable>
    );

    if (loading && !restaurants?.length) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#C4622D" />
                <Text style={styles.loadingText}>Cargando restaurantes…</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={restaurants}
                keyExtractor={(item) => item._id || item.id}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={getRestaurants}
                        colors={["#C4622D"]}
                    />
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
                        <View style={styles.topBand}>
                            <Text style={styles.topBandLabel}>NUESTRAS SUCURSALES</Text>
                            <Text style={styles.topBandTitle}>Restaurantes</Text>
                        </View>
                        <Text style={styles.countText}>
                            {restaurants?.length ?? 0} sucursales disponibles
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <Ionicons name="storefront-outline" size={48} color="#C4B5A8" />
                        <Text style={styles.emptyTitle}>Sin sucursales</Text>
                        <Text style={styles.emptyText}>Por el momento no hay sucursales disponibles</Text>
                    </View>
                }
            />
        </View>
    );
};

export default RestaurantsScreen;

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
    },
});