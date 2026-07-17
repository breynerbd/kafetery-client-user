import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RestaurantMap from "./RestaurantMap";
import { openMaps } from "../../../shared/constants/openMaps";
import ReviewsModal from "./ReviewsModal";

const InfoRow = ({ icon, label, value }) => (
    <View style={styles.row}>
        <Ionicons name={icon} size={18} color="#8B4513" />

        <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>{label}</Text>
        </View>

        <Text style={styles.rowValue}>
            {value || "--"}
        </Text>
    </View>
);

const extractCoords = (location) => {
    if (!location) return { latitude: undefined, longitude: undefined };

    if (location.latitude != null && location.longitude != null) {
        return { latitude: Number(location.latitude), longitude: Number(location.longitude) };
    }

    if (Array.isArray(location.coordinates) && location.coordinates.length === 2) {
        const [lng, lat] = location.coordinates;
        return { latitude: Number(lat), longitude: Number(lng) };
    }

    return { latitude: undefined, longitude: undefined };
};

const ratingDisplay = (rating, count) => {
    if (!rating || rating === 0) {
        return (
            <View style={styles.rating}>
                <Ionicons name="star-outline" size={12} color="#8C6B55" />
                <Text style={styles.ratingText}>Sin valoraciones</Text>
            </View>
        );
    }

    return (
        <View style={styles.rating}>
            <Ionicons name="star" size={12} color="#f4b300ff" />
            <Text style={styles.ratingText}>
                {rating.toFixed(1)} {count !== undefined ? `(${count})` : ""}
            </Text>
        </View>
    );
};



const RestaurantDetails = ({ visible, restaurant, onClose }) => {
    if (!restaurant) return null;

    const { latitude, longitude } = extractCoords(restaurant?.location);
    const hasValidCoords =
        typeof latitude === "number" && !isNaN(latitude) &&
        typeof longitude === "number" && !isNaN(longitude);

    const schedule =
        restaurant?.openingTime && restaurant?.closingTime
            ? `${restaurant.openingTime} - ${restaurant.closingTime}`
            : "No disponible";

    const [reviewsVisible, setReviewsVisible] = useState(false);
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>

                    <View style={styles.header}>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={styles.title}
                                numberOfLines={1}
                            >
                                {restaurant.name}
                            </Text>

                            <Text style={styles.subtitle}>
                                Restaurante
                            </Text>
                        </View>

                        <Pressable onPress={onClose}>
                            <Ionicons
                                name="close-circle"
                                size={30}
                                color="#8B4513"
                            />
                        </Pressable>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >

                        <View style={styles.heroCard}>

                            <Ionicons
                                name="storefront"
                                size={42}
                                color="#FFF"
                            />

                            <Text
                                style={styles.heroTitle}
                                numberOfLines={1}
                            >
                                {restaurant.name}
                            </Text>

                            <Text style={styles.heroLabel}>
                                RESTAURANTE
                            </Text>

                        </View>

                        <View style={styles.section}>

                            <Text style={styles.sectionTitle}>
                                Información
                            </Text>

                            <InfoRow
                                icon="call-outline"
                                label="Teléfono"
                                value={restaurant.phone}
                            />

                            <InfoRow
                                icon="time-outline"
                                label="Horario"
                                value={schedule}
                            />

                            <InfoRow
                                icon="star-outline"
                                label="Calificación"
                                value={
                                    restaurant.averageRating
                                        ? `${restaurant.averageRating.toFixed(1)} (${restaurant.totalRatings || 0})`
                                        : "Sin valoraciones"
                                }
                            />

                            <Pressable
                                style={styles.reviewsButton}
                                onPress={() => setReviewsVisible(true)}
                            >
                                <Ionicons name="star-outline" size={16} color="#FFF" />
                                <Text style={styles.reviewsButtonText}>
                                    Ver reseñas ({restaurant.totalRatings || 0})
                                </Text>
                            </Pressable>

                            <ReviewsModal
                                visible={reviewsVisible}
                                onClose={() => setReviewsVisible(false)}
                                reviews={restaurant.ratings}
                            />

                        </View>

                        {hasValidCoords ? (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Ubicación</Text>
                                <RestaurantMap latitude={latitude} longitude={longitude} />
                                <Pressable style={styles.mapButton} onPress={() => openMaps(latitude, longitude)}>
                                    <Ionicons name="navigate" size={18} color="#FFF" />
                                    <Text style={styles.mapButtonText}>Abrir en Google Maps</Text>
                                </Pressable>
                            </View>
                        ) : (
                            <Text style={{ textAlign: 'center', color: '#8C6B55', marginBottom: 20 }}>
                                Ubicación no disponible
                            </Text>
                        )}

                    </ScrollView>

                </View>
            </View>
        </Modal>
    );
};

export default RestaurantDetails;

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },

    reviewsButton: {
        flexDirection: "row",
        backgroundColor: "#C4622D",
        padding: 12,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        gap: 8
    },
    reviewsButtonText: { color: "#FFF", fontWeight: "700" },

    modal: {
        backgroundColor: "#FAF6F1",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxHeight: "88%",
        padding: 22,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#2C1A0E",
    },

    subtitle: {
        marginTop: 4,
        color: "#8B4513",
        fontWeight: "600",
    },

    heroCard: {
        backgroundColor: "#4A3728",
        borderRadius: 20,
        paddingVertical: 26,
        paddingHorizontal: 20,
        alignItems: "center",
        marginBottom: 22,
    },

    heroTitle: {
        marginTop: 12,
        fontSize: 22,
        color: "#FFF",
        fontWeight: "700",
        textAlign: "center",
    },

    heroLabel: {
        marginTop: 6,
        color: "#EADDCA",
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 1,
    },

    section: {
        marginBottom: 22,
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#2C1A0E",
        marginBottom: 12,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#EEE",
        gap: 10,
    },

    rowLabel: {
        fontSize: 13,
        color: "#8C6B55",
    },

    rowValue: {
        fontSize: 14,
        color: "#2C1A0E",
        fontWeight: "700",
        maxWidth: "50%",
        textAlign: "right",
    },

    button: {
        backgroundColor: "#8B4513",
        paddingVertical: 15,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },

    buttonText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16,
    },

    mapButton: {
        marginTop: 16,
        backgroundColor: "#4A3728",
        borderRadius: 14,
        paddingVertical: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },

    mapButtonText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 15,
    },

    map: {
        width: "100%",
        height: 220,
        borderRadius: 18,
    },

});