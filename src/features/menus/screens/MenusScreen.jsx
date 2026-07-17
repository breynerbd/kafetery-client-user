import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    Pressable,
    ActivityIndicator,
    RefreshControl,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMenus } from "../hooks/useMenus.js";
import { useCartStore } from "../../../shared/store/cartStore.js";
import MenuDetails from "./MenuDetails";
import CartScreen from "../../cart/screens/CartScreen.jsx";

const MenusScreen = () => {
    const navigation = useNavigation();
    const { menus, loading, getMenus } = useMenus();
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const totalCartItems = useCartStore((state) => state.getTotalItems());
    const [cartModalVisible, setCartModalVisible] = useState(false);

    const openDetails = (menu) => {
        setSelectedMenu(menu);
        setModalVisible(true);
    };

    const closeDetails = () => {
        setModalVisible(false);
        setSelectedMenu(null);
    };

    const ratingDisplay = (rating, count) => {
        if (!rating || rating === 0) {
            return (
                <View style={styles.infoItem}>
                    <Ionicons name="star-outline" size={12} color="#8C6B55" />
                    <Text style={styles.infoText}>Vacío</Text>
                </View>
            );
        }
        return (
            <View style={styles.infoItem}>
                <Ionicons name="star" size={12} color="#f4b300ff" />
                <Text style={styles.infoText}>{rating ? rating.toFixed(1) : "0.0"} {count !== undefined ? `(${count})` : ""}</Text>
            </View>
        );
    };

    const restaurantOptions = useMemo(() => {
        const map = new Map();
        (menus || []).forEach((m) => {
            const r = m.restaurant;
            if (r?._id && !map.has(r._id)) {
                map.set(r._id, { _id: r._id, name: r.name || "Restaurante" });
            }
        });
        return Array.from(map.values());
    }, [menus]);

    const filteredMenus = selectedRestaurant
        ? menus.filter((m) => m.restaurant?._id === selectedRestaurant)
        : menus;

    const renderItem = ({ item }) => (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => openDetails(item)}
        >
            <View style={styles.cardHero}>
                <Image source={{ uri: item.image }} style={styles.menuImage} />
                <View style={styles.priceTag}>
                    <Text style={styles.priceTagText}>Q{item.price?.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.name}
                </Text>

                {item.description ? (
                    <Text style={styles.descriptionText} numberOfLines={2}>
                        {item.description}
                    </Text>
                ) : (
                    <View style={{ height: 30 }} />
                )}

                <View style={styles.metaRow}>
                    <View style={styles.infoItem}>
                        <Ionicons name="time-outline" size={12} color="#8C6B55" />
                        <Text style={styles.infoText}>{item.prepTime || "--"} min</Text>
                        <View style={{ width: 2 }} />
                        <Ionicons name="cube-outline" size={12} color="#8C6B55" />
                        <Text style={styles.infoText}>{item.stock ?? 0}</Text>
                        <View style={{ width: 2 }} />
                        {ratingDisplay(item.averageRating, item.totalRatings)}
                    </View>
                </View>
            </View>
        </Pressable>
    );

    if (loading && !menus?.length) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#C4622D" />
                <Text style={styles.loadingText}>Cargando menú…</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBand}>
                <Text style={styles.topBandLabel}>NUESTRAS ELABORACIONES</Text>
                <Text style={styles.topBandTitle}>Menú Completo</Text>
            </View>
            <Text style={styles.countText}>
                {filteredMenus?.length ?? 0} platillos listos para ti
            </Text>

            {restaurantOptions.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                    contentContainerStyle={styles.filterRow}
                >
                    <Pressable
                        onPress={() => setSelectedRestaurant(null)}
                        style={[styles.filterChip, !selectedRestaurant && styles.filterChipActive]}
                    >
                        <Text
                            style={[styles.filterChipText, !selectedRestaurant && styles.filterChipTextActive]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            Todos
                        </Text>
                    </Pressable>

                    {restaurantOptions.map((r) => {
                        const active = selectedRestaurant === r._id;
                        return (
                            <Pressable
                                key={r._id}
                                onPress={() => setSelectedRestaurant(r._id)}
                                style={[styles.filterChip, active && styles.filterChipActive]}
                            >
                                <Text
                                    style={[styles.filterChipText, active && styles.filterChipTextActive]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {r.name}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            )}

            <FlatList
                data={filteredMenus}
                keyExtractor={(item) => item._id || item.id}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={getMenus}
                        colors={["#C4622D"]}
                    />
                }
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <Ionicons name="fast-food-outline" size={48} color="#C4B5A8" />
                        <Text style={styles.emptyTitle}>
                            {selectedRestaurant ? "Sin platillos para este restaurante" : "Menú vacío"}
                        </Text>
                        <Text style={styles.emptyText}>
                            {selectedRestaurant
                                ? "Prueba con otro restaurante o revisa \"Todos\"."
                                : "Por ahora no hay platillos disponibles."}
                        </Text>
                    </View>
                }
            />

            {selectedMenu && (
                <MenuDetails
                    visible={modalVisible}
                    menu={selectedMenu}
                    onClose={closeDetails}
                />
            )}

            {totalCartItems > 0 && (
                <Pressable
                    style={styles.cartFab}
                    onPress={() => setCartModalVisible(true)}
                >
                    <Ionicons name="cart" size={24} color="#FFFFFF" />
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
                    </View>
                </Pressable>
            )}

            <CartScreen
                visible={cartModalVisible}
                onClose={() => setCartModalVisible(false)}
            />
        </View>
    );
};

export default MenusScreen;

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
        marginBottom: 8,
        paddingHorizontal: 20,
    },
    filterScroll: {
        height: 56,
        flexGrow: 0,
    },
    filterRow: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: "center",
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#EADDCA",
        marginRight: 8,
        maxWidth: 150,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
    },
    filterChipActive: {
        backgroundColor: "#4A3728",
        borderColor: "#4A3728",
    },
    filterChipText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#4A3728",
    },
    filterChipTextActive: {
        color: "#FFFFFF",
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
        height: 90,
        backgroundColor: "#FFF0E8",
        justifyContent: "center",
        alignItems: "center",
    },
    priceTag: {
        position: "absolute",
        bottom: 8,
        right: 8,
        backgroundColor: "#2C1A0E",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    priceTagText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    cardBody: {
        padding: 12,
        gap: 4,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#2C1A0E",
    },
    descriptionText: {
        fontSize: 11,
        color: "#6F4E37",
        lineHeight: 15,
        minHeight: 30,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 6,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#FAF6F1",
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    infoText: {
        fontSize: 11,
        color: "#6F4E37",
        fontWeight: "600",
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
    cartFab: {
        position: "absolute",
        bottom: 75,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#C4622D",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#2C1A0E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    cartBadge: {
        position: "absolute",
        top: -4,
        right: -4,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#DC2626",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: "#FAF6F1",
    },
    cartBadgeText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "800",
    },
    menuImage: {
        width: "100%",
        height: "100%",
        resizeMode: 'cover',
        borderRadius: 15,
    },
});