import React from "react";
import { Modal, View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ReviewsModal = ({ visible, onClose, reviews }) => {

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
                        <Text style={styles.title}>Reseñas de clientes</Text>
                        <Pressable onPress={onClose}>
                            <Ionicons name="close-circle" size={30} color="#8B4513" />
                        </Pressable>
                    </View>

                    <FlatList
                        data={reviews || []}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.reviewCard}>
                                <Text style={styles.userName}>{item.user.name || "Cliente anónimo"}</Text>
                                <View style={styles.ratingRow}>
                                    {[...Array(5)].map((_, i) => (
                                        <Ionicons
                                            key={i}
                                            name={i < item.stars ? "star" : "star-outline"}
                                            size={14}
                                            color="#F4B400"
                                        />
                                    ))}
                                </View>
                                {item.comment ? <Text style={styles.comment}>{item.comment}</Text> : null}
                            </View>
                        )}
                        ListEmptyComponent={<Text style={styles.empty}>Aún no hay reseñas.</Text>}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default ReviewsModal;

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    modal: { backgroundColor: "#FAF6F1", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, maxHeight: "80%" },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
    title: { fontSize: 20, fontWeight: "700", color: "#2C1A0E" },
    reviewCard: { backgroundColor: "#FFF", padding: 15, borderRadius: 15, marginBottom: 10, elevation: 2 },
    userName: { fontWeight: "bold", color: "#4A3728" },
    ratingRow: { flexDirection: "row", marginVertical: 5 },
    comment: { fontSize: 14, color: "#6F4E37", marginTop: 5 },
    empty: { textAlign: "center", color: "#8C6B55", marginTop: 20 }
});