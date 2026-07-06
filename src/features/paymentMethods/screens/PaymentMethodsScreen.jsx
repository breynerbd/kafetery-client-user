import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePaymentMethods } from "../hooks/usePaymentMethods";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const PaymentMethodsScreen = () => {
    const { cards, getCards, deleteCard, loading } = usePaymentMethods();

    useFocusEffect(
        useCallback(() => {
            getCards();
        }, [])
    );

    const confirmDelete = (card) => {
        Alert.alert(
            "Eliminar tarjeta",
            `¿Seguro que deseas eliminar la tarjeta terminada en ${String(card.cardNumber).slice(-4)}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteCard(card._id);
                            await getCards();
                        } catch (err) {
                            Alert.alert("Error", err.message || "No se pudo eliminar");
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#C4622D" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBand} />

            <View style={styles.cardWrapper}>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.walletRing}>
                        <View style={styles.walletBg}>
                            <Ionicons name="wallet" size={48} color="#C4622D" />
                        </View>
                    </View>
                    <Text style={styles.title}>Mis tarjetas</Text>
                </View>

                <FlatList
                    data={cards}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Ionicons name="card-outline" size={50} color="#C4B5A8" />
                            <Text style={styles.emptyText}>No tienes tarjetas registradas</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.creditCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.brandText}>{item.brand}</Text>
                                <Ionicons name="card" size={24} color="#FFF" />
                            </View>

                            <Text style={styles.cardNumber}>•••• {String(item.cardNumber).slice(-4)}</Text>

                            <View style={styles.cardFooter}>
                                <View>
                                    <Text style={styles.footerLabel}>EXPIRY</Text>
                                    <Text style={styles.footerValue}>{item.expiryMonth}/{item.expiryYear}</Text>
                                </View>

                                <Pressable
                                    onPress={() => confirmDelete(item)}
                                    style={({ pressed }) => [styles.deleteBtnCredit, pressed && { opacity: 0.7 }]}
                                >
                                    <Ionicons name="trash" size={18} color="#FFF" />
                                </Pressable>
                            </View>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

export default PaymentMethodsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF6F1",
        paddingBottom: 100,
    },
    topBand: {
        width: "100%",
        height: 160,
        backgroundColor: "#2C1A0E",
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    cardWrapper: {
        flex: 1,
        marginTop: -60,
        width: "88%",
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
        shadowColor: "#2C1A0E",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.90,
        shadowRadius: 16,
        elevation: 6,
        borderRadius: 24,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#2C1A0E",
        paddingHorizontal: 24,
        alignSelf: "center",
        marginBottom: 10,
    },
    listContent: {
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAF6F1",
    },
    empty: {
        marginTop: 100,
        alignItems: "center",
    },
    emptyText: {
        marginTop: 10,
        color: "#8C6B55",
    },
    card: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#2C1A0E",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "#FFF0E8",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    cardInfo: {
        flex: 1,
    },
    brand: {
        fontSize: 14,
        fontWeight: "700",
        color: "#2C1A0E",
    },
    number: {
        fontSize: 16,
        fontWeight: "600",
        color: "#8B4513",
        marginVertical: 2,
    },
    expiry: {
        fontSize: 12,
        color: "#A08C7D",
    },
    deleteBtn: {
        padding: 8,
        backgroundColor: "#FFF0E8",
        borderRadius: 10,
    },
    creditCard: {
        backgroundColor: "#2C1A0E",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    brandText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    cardNumber: {
        color: "#FFF",
        fontSize: 22,
        fontWeight: "600",
        letterSpacing: 4,
        marginBottom: 20,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    footerLabel: {
        color: "#A08C7D",
        fontSize: 9,
        fontWeight: "700",
    },
    footerValue: {
        color: "#FFF",
        fontSize: 14,
    },
    deleteBtnCredit: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        padding: 8,
        borderRadius: 8,
    },
    walletRing: {
        alignSelf: "center",
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: "#FAF6F1",
        borderWidth: 3,
        borderColor: "#E8DDD4",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14,
    },
    walletBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#FFF0E8",
        justifyContent: "center",
        alignItems: "center",
    },
});