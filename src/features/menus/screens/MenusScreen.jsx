import React from "react";
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
import { useMenus } from "../hooks/useMenus.js";

const MenusScreen = () => {
    const { menus, loading, getMenus } = useMenus();

    const renderItem = ({ item }) => (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
            <View style={styles.iconWrap}>
                <Ionicons name="fast-food" size={24} color="#C4622D" />
            </View>

            <View style={styles.cardBody}>
                <View style={styles.titleRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={styles.priceTag}>Q{item.price?.toFixed(2)}</Text>
                </View>

                {item.description ? (
                    <Text style={styles.descriptionText} numberOfLines={2}>
                        {item.description}
                    </Text>
                ) : null}

                <View style={styles.metaRow}>
                    <View style={styles.infoItem}>
                        <Ionicons name="time-outline" size={13} color="#8C6B55" />
                        <Text style={styles.infoText}>{item.prepTime || "--"} min</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Ionicons name="cube-outline" size={13} color="#8C6B55" />
                        <Text style={styles.infoText}>Stock: {item.stock ?? 0}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Ionicons name="alarm-outline" size={13} color="#8C6B55" />
                        <Text style={styles.infoText}>{item.availableFrom || "00:00"}</Text>
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
            <FlatList
                data={menus}
                keyExtractor={(item) => item._id || item.id}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={getMenus}
                        colors={["#C4622D"]}
                    />
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
                        <View style={styles.topBand}>
                            <Text style={styles.topBandLabel}>NUESTRAS ELABORACIONES</Text>
                            <Text style={styles.topBandTitle}>Menú Completo</Text>
                        </View>
                        <Text style={styles.countText}>
                            {menus?.length ?? 0} platillos listos para ti
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <Ionicons name="fast-food-outline" size={48} color="#C4B5A8" />
                        <Text style={styles.emptyTitle}>Menú vacío</Text>
                        <Text style={styles.emptyText}>Por ahora no hay platillos disponibles.</Text>
                    </View>
                }
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
        alignSelf: "flex-start",
    },
    cardBody: {
        flex: 1,
        gap: 4,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2C1A0E",
        flex: 1,
    },
    priceTag: {
        fontSize: 14,
        fontWeight: "800",
        color: "#C4622D",
        backgroundColor: "#FFF0E8",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        overflow: "hidden",
    },
    descriptionText: {
        fontSize: 12,
        color: "#6F4E37",
        lineHeight: 16,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 6,
        paddingTop: 6,
        borderTopWidth: 1,
        borderTopColor: "#FAF6F1",
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    infoText: {
        fontSize: 12,
        color: "#6F4E37",
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