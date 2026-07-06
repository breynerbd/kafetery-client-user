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
import { useRestaurants } from "../hooks/useRestaurants.js";
import RestaurantDetails from "./RestaurantDetails";
import { openMaps } from "../../../shared/constants/openMaps.js";

const RestaurantsScreen = () => {
    const { restaurants, loading, getRestaurants } = useRestaurants();
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        getRestaurants();
    }, []);

    const openDetails = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setModalVisible(true);
    };

    const closeDetails = () => {
        setModalVisible(false);
        setSelectedRestaurant(null);
    };

    const renderItem = ({ item }) => (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => openDetails(item)}
        >
            <View style={styles.cardHero}>
                <Ionicons name="storefront" size={30} color="#C4622D" />
            </View>

            <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.name}
                </Text>

                <View style={styles.infoItem}>
                    <Ionicons name="call-outline" size={12} color="#8C6B55" />
                    <Text style={styles.infoText} numberOfLines={1}>
                        {item.phone || "Sin teléfono"}
                    </Text>
                </View>

                <Pressable
                    style={styles.mapRow}
                    onPress={() => openMaps(item.location?.latitude, item.location?.longitude)}
                >
                    <Ionicons name="location-outline" size={12} color="#C4622D" />
                    <Text style={styles.mapLinkText} numberOfLines={1}>
                        Ver en Maps
                    </Text>
                </Pressable>
            </View>
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
            <View style={styles.topBand}>
                <Text style={styles.topBandLabel}>NUESTRAS SUCURSALES</Text>
                <Text style={styles.topBandTitle}>Restaurantes</Text>
            </View>
            <Text style={styles.countText}>
                {restaurants?.length ?? 0} sucursales disponibles
            </Text>

            <FlatList
                key={2}
                data={restaurants}
                keyExtractor={(item) => item._id || item.id}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={getRestaurants}
                        colors={["#C4622D"]}
                    />
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <Ionicons name="storefront-outline" size={48} color="#C4B5A8" />
                        <Text style={styles.emptyTitle}>Sin sucursales</Text>
                        <Text style={styles.emptyText}>Por el momento no hay sucursales disponibles</Text>
                    </View>
                }
            />

            <RestaurantDetails
                visible={modalVisible}
                restaurant={selectedRestaurant}
                onClose={closeDetails}
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
    columnWrapper: {
        justifyContent: "space-between",
        marginBottom: 14,
    },
    card: {
        width: "48%",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "#2C1A0E",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
    },
    cardPressed: {
        opacity: 0.9,
    },
    cardHero: {
        height: 80,
        backgroundColor: "#FFF0E8",
        justifyContent: "center",
        alignItems: "center",
    },
    cardBody: {
        padding: 12,
        gap: 6,
    },
    cardTitle: {
        fontSize: 14,
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
        fontSize: 12,
        color: "#6F4E37",
        flex: 1,
    },
    mapRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginTop: 2,
        paddingTop: 3,
        borderTopWidth: 1,
        borderTopColor: "#FAF6F1",
    },
    mapLinkText: {
        fontSize: 12,
        color: "#8C6B55",
        fontWeight: "700",
    },
    emptyWrap: {
        alignItems: "center",
        paddingTop: 60,
        gap: 8,
        width: "100%",
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