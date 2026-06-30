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
import { usePromotions } from "../hooks/usePromotions.js";

const PromotionsScreen = () => {
    const { promotions, loading, getPromotions } = usePromotions();

    useEffect(() => {
        getPromotions();
    }, []);

    const renderItem = ({ item }) => (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
            {/* Contenedor Izquierdo - Icono de Etiqueta */}
            <View style={styles.iconWrap}>
                <Ionicons name="pricetag" size={22} color="#C4622D" />
            </View>

            {/* Cuerpo Informativo de la Promoción */}
            <View style={styles.cardBody}>
                <View style={styles.headerRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.valueText}>
                        {item.value}% OFF
                    </Text>
                </View>
                
                <Text style={styles.cardDescription} numberOfLines={2}>
                    {item.description}
                </Text>

                {/* Badge con el Código de Cupón Exclusivo */}
                <View style={styles.badge}>
                    <Ionicons name="gift-outline" size={11} color="#EADDCA" />
                    <Text style={styles.badgeText}>
                        CÓDIGO: {String(item.code).toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* Indicador visual pasivo */}
            <Ionicons name="chevron-forward" size={16} color="#C4B5A8" />
        </Pressable>
    );

    if (loading && !promotions?.length) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#C4622D" />
                <Text style={styles.loadingText}>Buscando las mejores ofertas…</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={promotions}
                keyExtractor={(item) => item._id || item.id}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={getPromotions}
                        colors={["#C4622D"]}
                    />
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
                        <View style={styles.topBand}>
                            <Text style={styles.topBandLabel}>BENEFICIOS EXCLUSIVOS</Text>
                            <Text style={styles.topBandTitle}>Promociones</Text>
                        </View>
                        <Text style={styles.countText}>
                            {promotions?.length ?? 0} Cupones disponibles para ti
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <Ionicons name="pricetags-outline" size={48} color="#C4B5A8" />
                        <Text style={styles.emptyTitle}>Sin promociones vigentes</Text>
                        <Text style={styles.emptyText}>
                            No hay cupones activos en este momento. ¡Vuelve pronto!
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

export default PromotionsScreen;

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
    headerRow: {
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
    valueText: {
        fontSize: 14,
        fontWeight: "900",
        color: "#8B4513",
        fontStyle: "italic",
    },
    cardDescription: {
        fontSize: 12,
        color: "#6F4E37",
        lineHeight: 16,
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
        fontFamily: "System",
        fontWeight: "700",
        letterSpacing: 0.5,
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