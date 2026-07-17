import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../../../shared/store/cartStore.js";
import ReviewsModal from "./ReviewsModal";

const MenuDetails = ({ visible, menu, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);
    const clearCart = useCartStore((state) => state.clearCart);
    const restaurant = useCartStore((state) => state.restaurant);
    const [reviewsVisible, setReviewsVisible] = useState(false);

    if (!menu) return null;

    const handleAddToCart = () => {
        const currentRestaurant =
            typeof menu.restaurant === "object"
                ? {
                    _id: menu.restaurant._id,
                    name: menu.restaurant.name,
                }
                : {
                    _id: menu.restaurant,
                    name: "Restaurante",
                };

        const item = {
            _id: menu._id,
            name: menu.name,
            price: menu.price,
            stock: menu.stock,
        };

        if (
            restaurant &&
            restaurant._id !== currentRestaurant._id
        ) {
            Alert.alert(
                "Cambiar restaurante",
                "Ya tienes productos de otro restaurante en tu carrito.\n\nSi continúas, se eliminarán los productos actuales. ¿Deseas continuar?",
                [
                    {
                        text: "Conservar carrito",
                        style: "cancel",
                    },
                    {
                        text: "Sí, reemplazar",
                        style: "destructive",
                        onPress: () => {
                            clearCart();
                            addItem(item, currentRestaurant, quantity);
                            setQuantity(1);
                            onClose();
                        },
                    },
                ]
            );

            return;
        }

        addItem(item, currentRestaurant, quantity);
        setQuantity(1);
        onClose();
    };

    const ratingDisplay = (rating, count) => {
        if (!rating || rating === 0) {
            return (
                <View style={styles.metaItem}>
                    <Ionicons name="star-outline" size={12} color="#8C6B55" />
                    <Text style={styles.metaText}>Vacío</Text>
                </View>
            );
        }
        return (
            <View style={styles.metaItem}>
                <Ionicons name="star" size={12} color="#8C6B55" />
                <Text style={styles.metaText}>{rating ? rating.toFixed(1) : "0.0"} {count !== undefined ? `(${count})` : ""}</Text>
            </View>
        );
    };


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
                            <Text style={styles.title} numberOfLines={1}>
                                {menu.name}
                            </Text>
                            {ratingDisplay(menu.averageRating, menu.totalRatings)}
                            <Text style={styles.subtitle}>Q{menu.price?.toFixed(2)}</Text>
                        </View>

                        <Pressable onPress={onClose}>
                            <Ionicons name="close-circle" size={30} color="#8B4513" />
                        </Pressable>
                    </View>

                    <View style={styles.heroCard}>
                        {menu.image ? (
                            <Image source={{ uri: menu.image }} style={styles.menuImage} />
                        ) : (
                            <Ionicons name="fast-food" size={38} color="#FFF" />
                        )}
                    </View>

                    {menu.description ? (
                        <Text style={styles.description}>{menu.description}</Text>
                    ) : null}

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={15} color="#8C6B55" />
                            <Text style={styles.metaText}>{menu.prepTime || "--"} min</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="storefront-outline" size={15} color="#8C6B55" />
                            <Text style={styles.metaText}> {menu.restaurant?.name || "Restaurante"}</Text>
                        </View>
                    </View>

                    <Pressable
                        style={styles.reviewsButton}
                        onPress={() => setReviewsVisible(true)}
                    >
                        <Ionicons name="star-outline" size={16} color="#FFF" />
                        <Text style={styles.reviewsButtonText}>
                            Ver reseñas ({menu.totalRatings || 0})
                        </Text>
                    </Pressable>
                    {reviewsVisible && (
                        <ReviewsModal
                            visible={reviewsVisible}
                            reviews={menu.ratings || []}
                            onClose={() => setReviewsVisible(false)}
                        />
                    )}

                    <View style={styles.quantitySection}>
                        <Text style={styles.quantityLabel}>Cantidad</Text>
                        <View style={styles.stepper}>
                            <Pressable
                                style={styles.stepperButton}
                                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                            >
                                <Ionicons name="remove" size={18} color="#C4622D" />
                            </Pressable>

                            <Text style={styles.quantityValue}>{quantity}</Text>

                            <Pressable
                                style={styles.stepperButton}
                                onPress={() => setQuantity((q) => Math.min(menu.stock ?? 99, q + 1))}
                            >
                                <Ionicons name="add" size={18} color="#C4622D" />
                            </Pressable>
                        </View>
                    </View>

                    <Pressable
                        style={[styles.addButton, (menu.stock ?? 0) === 0 && styles.addButtonDisabled]}
                        onPress={handleAddToCart}
                        disabled={(menu.stock ?? 0) === 0}
                    >
                        <Ionicons name="cart-outline" size={18} color="#FFF" />
                        <Text style={styles.addButtonText}>
                            {(menu.stock ?? 0) === 0
                                ? "Sin stock disponible"
                                : `Agregar · Q${(menu.price * quantity).toFixed(2)}`}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

export default MenuDetails;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    reviewsButton: {
        backgroundColor: "#A0522D",
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    },
    reviewsButtonText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 6,
    },
    modal: {
        backgroundColor: "#FAF6F1",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 22,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2C1A0E",
    },
    subtitle: {
        marginTop: 4,
        color: "#C4622D",
        fontWeight: "800",
        fontSize: 16,
    },
    heroCard: {
        backgroundColor: "#4A3728",
        borderRadius: 20,
        paddingVertical: 24,
        alignItems: "center",
        marginBottom: 16,
    },
    menuImage: {
        width: 190,
        height: 190,
        resizeMode: 'cover',
        borderRadius: 15,
    },
    description: {
        fontSize: 13,
        color: "#6F4E37",
        lineHeight: 18,
        marginBottom: 16,
    },
    metaRow: {
        flexDirection: "row",
        gap: 20,
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EADDCA",
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    metaText: {
        fontSize: 13,
        color: "#6F4E37",
        fontWeight: "600",
    },
    quantitySection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    quantityLabel: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2C1A0E",
    },
    stepper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#EADDCA",
    },
    stepperButton: {
        width: 38,
        height: 38,
        justifyContent: "center",
        alignItems: "center",
    },
    quantityValue: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2C1A0E",
        minWidth: 28,
        textAlign: "center",
    },
    addButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#8C6B55",
        borderRadius: 14,
        paddingVertical: 15,
        marginBottom: 8,
    },
    addButtonDisabled: {
        backgroundColor: "#C4B5A8",
    },
    addButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 15,
    },
});