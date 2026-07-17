import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOrders } from "../hooks/useOrders";

const RatingModal = ({ visible, order, onClose }) => {

    const { reviewOrder, loading } = useOrders();

    const [restaurantRating, setRestaurantRating] = useState(0);
    const [restaurantComment, setRestaurantComment] = useState("");

    const [menuRatings, setMenuRatings] = useState([]);

    useEffect(() => {

        if (visible && order) {

            setRestaurantRating(0);
            setRestaurantComment("");

            setMenuRatings(
                order.items.map(item => ({
                    menu: item.menu._id,
                    rating: 0,
                    comment: "",
                }))
            );

        }

    }, [visible, order]);

    const updateMenuRating = (index, rating) => {

        const copy = [...menuRatings];
        copy[index].rating = rating;

        setMenuRatings(copy);

    };

    const updateMenuComment = (index, comment) => {

        const copy = [...menuRatings];
        copy[index].comment = comment;

        setMenuRatings(copy);

    };

    const renderStars = (value, onChange) => (

        <View style={styles.starContainer}>

            {[1, 2, 3, 4, 5].map((star) => (

                <Pressable
                    key={star}
                    onPress={() => onChange(star)}
                >

                    <Ionicons
                        name={
                            star <= value
                                ? "star"
                                : "star-outline"
                        }
                        size={34}
                        color="#F4B400"
                        style={{ marginHorizontal: 3 }}
                    />

                </Pressable>

            ))}

        </View>

    );

    const submitReview = async () => {
        if (restaurantRating === 0) {
            Alert.alert("Calificación requerida", "Por favor, califica el restaurante.");
            return;
        }

        const hasMissing = menuRatings.some(item => item.rating === 0);
        if (hasMissing) {
            Alert.alert("Calificación requerida", "Debes calificar todos los platillos.");
            return;
        }

        const payload = {
            restaurantRating,
            restaurantComment,
            menus: menuRatings,
        };

        try {
            await reviewOrder(order._id, payload);
            Alert.alert("Éxito", "Tu calificación fue enviada correctamente.");
            onClose();
        } catch (error) {
            Alert.alert("Error", error.message || "No se pudo procesar tu calificación.");
        }
    };


    if (!order) return null;

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
                        <Text style={styles.title}>
                            Calificar experiencia
                        </Text>

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

                        <View style={styles.card}>

                            <Ionicons
                                name="storefront"
                                size={45}
                                color="#C4622D"
                            />

                            <Text style={styles.restaurantName}>
                                {order.restaurant?.name}
                            </Text>

                            <Text style={styles.subtitle}>
                                ¿Cómo fue tu experiencia en este restaurante?
                            </Text>

                            {renderStars(
                                restaurantRating,
                                setRestaurantRating
                            )}

                            <TextInput
                                style={styles.input}
                                placeholder="Escribe un comentario sobre el restaurante..."
                                value={restaurantComment}
                                onChangeText={setRestaurantComment}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />

                        </View>

                        <Text style={styles.sectionTitle}>
                            Califica tus platillos
                        </Text>

                        {order.items.map((item, index) => (

                            <View
                                key={item.menu._id}
                                style={styles.menuCard}
                            >

                                <View style={styles.menuHeader}>

                                    <Ionicons
                                        name="fast-food"
                                        size={24}
                                        color="#C4622D"
                                    />

                                    <Text style={styles.menuName}>
                                        {item.menu.name}
                                    </Text>

                                </View>

                                {renderStars(
                                    menuRatings[index]?.rating || 0,
                                    (rating) =>
                                        updateMenuRating(index, rating)
                                )}

                                <TextInput
                                    style={styles.input}
                                    placeholder={`¿Qué te pareció ${item.menu.name}?`}
                                    value={menuRatings[index]?.comment || ""}
                                    onChangeText={(text) =>
                                        updateMenuComment(index, text)
                                    }
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />

                            </View>

                        ))}

                        <Pressable
                            style={styles.submitButton}
                            onPress={submitReview}
                        >

                            <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color="#FFF"
                            />

                            <Text style={styles.submitText}>
                                Enviar calificación
                            </Text>

                        </Pressable>

                        <Pressable
                            style={styles.skipButton}
                            onPress={onClose}
                        >

                            <Text style={styles.skipText}>
                                Omitir por ahora
                            </Text>

                        </Pressable>

                    </ScrollView>

                </View>
            </View>
        </Modal>
    );
};

export default RatingModal;

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },

    modal: {
        backgroundColor: "#FAF6F1",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxHeight: "90%",
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

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        marginBottom: 22,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },

        elevation: 2,
        alignItems: "center",
    },

    restaurantName: {
        marginTop: 12,
        fontSize: 20,
        fontWeight: "700",
        color: "#2C1A0E",
        textAlign: "center",
    },

    subtitle: {
        marginTop: 8,
        marginBottom: 15,
        color: "#8C6B55",
        textAlign: "center",
        fontSize: 14,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2C1A0E",
        marginBottom: 15,
    },

    menuCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        marginBottom: 18,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },

        elevation: 2,
    },

    menuHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    menuName: {
        marginLeft: 12,
        flex: 1,
        fontSize: 16,
        fontWeight: "700",
        color: "#2C1A0E",
    },

    starContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },

    input: {
        backgroundColor: "#FAF6F1",
        borderWidth: 1,
        borderColor: "#E6D8CC",
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 60,
        width: "100%",
        fontSize: 14,
        color: "#2C1A0E",
    },

    submitButton: {
        marginTop: 10,
        backgroundColor: "#4A3728",
        borderRadius: 15,
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    submitText: {
        marginLeft: 8,
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16,
    },

    skipButton: {
        marginTop: 15,
        marginBottom: 10,
        alignItems: "center",
        paddingVertical: 12,
    },

    skipText: {
        color: "#8B4513",
        fontWeight: "700",
        fontSize: 15,
    },

});