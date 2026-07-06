import React, { useEffect, useState, useCallback } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOrders } from "../hooks/useOrders";
import { useFocusEffect } from '@react-navigation/native';
import { usePaymentMethods } from "../../paymentMethods/hooks/usePaymentMethods";
import AddCardModal from "../../paymentMethods/screens/AddCardModal";

const STATUS_MAP = {
    PENDING: {
        label: "Pendiente",
        color: "#C4622D",
        icon: "time-outline",
    },
    CONFIRMED: {
        label: "Confirmada",
        color: "#3B7DD8",
        icon: "checkmark-circle-outline",
    },
    PREPARING: {
        label: "En preparación",
        color: "#D8A13B",
        icon: "flame-outline",
    },
    READY: {
        label: "Lista",
        color: "#2E9E5B",
        icon: "fast-food-outline",
    },
    DELIVERED: {
        label: "Entregada",
        color: "#2E9E5B",
        icon: "checkmark-done-outline",
    },
    CANCELED: {
        label: "Cancelada",
        color: "#C4392D",
        icon: "close-circle-outline",
    },
};

const PAYMENT_METHOD_MAP = {
    CASH: { label: "Efectivo", icon: "cash-outline" },
    CARD: { label: "Tarjeta", icon: "card-outline" },
};

const PAYMENT_STATUS_MAP = {
    PENDING: { label: "Pendiente", color: "#C4622D" },
    PAID: { label: "Pagado", color: "#2E9E5B" },
};

const InfoRow = ({ icon, label, value }) => (
    <View style={styles.row}>
        <Ionicons
            name={icon}
            size={18}
            color="#8B4513"
        />

        <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>
                {label}
            </Text>
        </View>

        <Text style={styles.rowValue}>
            {value}
        </Text>
    </View>
);

const OrderDetails = ({ visible, order, onClose }) => {
    const { deleteOrder, updatePaymentMethod, completeOrder, loading } = useOrders(); const { cards, getCards } = usePaymentMethods();
    const [selectedMethod, setSelectedMethod] = useState("CASH");
    const [selectedCard, setSelectedCard] = useState(null);
    const [addCardVisible, setAddCardVisible] = useState(false);
    const [savingPayment, setSavingPayment] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);

    useEffect(() => {
        if (visible && order && !order.paymentMethod) {
            getCards();
            setSelectedMethod("CASH");
            setSelectedCard(null);
        }
    }, [visible, order?._id]);

    useFocusEffect(
        useCallback(() => {
            getCards();
        }, [])
    );

    if (!order) return null;

    const status =
        STATUS_MAP[order.status] || STATUS_MAP.PENDING;

    const paymentMethodInfo = PAYMENT_METHOD_MAP[order.paymentMethod] || null;
    const paymentStatusInfo = PAYMENT_STATUS_MAP[order.paymentStatus] || PAYMENT_STATUS_MAP.PENDING;

    const card = typeof order.paymentCard === "object" ? order.paymentCard : null;
    const cardLast4 = card?.cardNumber ? String(card.cardNumber).slice(-4) : null;

    const needsPaymentSelection = !order.paymentMethod && order.paymentStatus !== "PAID";

    const fetchPaymentMethods = async () => {
        const data = await getCards();
        setPaymentMethods(data);
    };

    const handleCardAdded = (newCard) => {
        setSelectedCard(newCard._id || newCard.id);
    };

    const handleSavePayment = async () => {
        if (selectedMethod === "CARD" && !selectedCard) {
            Alert.alert("Tarjeta requerida", "Selecciona una tarjeta o agrega una nueva.");
            return;
        }

        try {
            setSavingPayment(true);
            await updatePaymentMethod(order._id, {
                paymentMethod: selectedMethod,
                paymentCard: selectedMethod === "CARD" ? selectedCard : undefined,
            });
            Alert.alert("Listo", "Método de pago guardado.");
        } catch (err) {
            Alert.alert("Error", err.message || "No se pudo guardar el método de pago");
        } finally {
            setSavingPayment(false);
        }
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
                            <Text style={styles.title}>
                                Pedido
                            </Text>

                            <Text style={styles.subtitle}>
                                #{String(order._id || order.id).slice(-8)}
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
                                name="receipt-outline"
                                size={42}
                                color="#FFF"
                            />

                            <Text style={styles.heroTitle}>
                                Q {(order.totalPrice ?? 0).toFixed(2)}
                            </Text>

                            <Text style={styles.heroLabel}>
                                TOTAL DEL PEDIDO
                            </Text>

                            <View
                                style={[
                                    styles.statusBadge,
                                    {
                                        backgroundColor:
                                            status.color,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={status.icon}
                                    size={15}
                                    color="#FFF"
                                />

                                <Text
                                    style={styles.statusText}
                                >
                                    {status.label}
                                </Text>
                            </View>

                        </View>

                        {order.status !== "DELIVERED" && (
                            <Pressable
                                style={styles.completeButton}
                                onPress={() => {
                                    Alert.alert(
                                        "Finalizar orden",
                                        "¿Confirmas que la orden ya fue entregada?",
                                        [
                                            { text: "Cancelar", style: "cancel" },
                                            {
                                                text: "Sí, finalizar",
                                                onPress: async () => {
                                                    try {
                                                        await completeOrder(order._id);

                                                        Alert.alert(
                                                            "Listo",
                                                            "Orden finalizada correctamente"
                                                        );

                                                        onClose();
                                                    } catch (err) {
                                                        Alert.alert("Error", err.message);
                                                    }
                                                }
                                            }
                                        ]
                                    );
                                }}
                            >
                                <Ionicons name="checkmark-done-circle" size={18} color="#FFF" />
                                <Text style={styles.cancelButtonText}>
                                    Completar orden
                                </Text>
                            </Pressable>
                        )}

                        <View style={styles.section}>

                            <Text style={styles.sectionTitle}>
                                Información
                            </Text>

                            <InfoRow
                                icon="restaurant-outline"
                                label="Mesa"
                                value={
                                    order.table?.tableNumber ??
                                    "N/A"
                                }
                            />

                            <InfoRow
                                icon="calendar-outline"
                                label="Fecha"
                                value={
                                    order.createdAt
                                        ? new Date(
                                            order.createdAt
                                        ).toLocaleString(
                                            "es-GT",
                                            {
                                                dateStyle:
                                                    "medium",
                                                timeStyle:
                                                    "short",
                                            }
                                        )
                                        : "No disponible"
                                }
                            />

                            {!!order.estimatedTime && (
                                <InfoRow
                                    icon="time-outline"
                                    label="Tiempo estimado"
                                    value={`${order.estimatedTime} min`}
                                />
                            )}

                            <InfoRow
                                icon="storefront-outline"
                                label="Restaurante"
                                value={order.restaurant?.name}
                            />

                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Método de Pago
                            </Text>

                            {needsPaymentSelection ? (
                                <View style={styles.paymentSelectCard}>
                                    <View style={styles.paymentMethodRow}>
                                        <Pressable
                                            style={[
                                                styles.paymentChip,
                                                selectedMethod === "CASH" && styles.paymentChipActive,
                                            ]}
                                            onPress={() => setSelectedMethod("CASH")}
                                        >
                                            <Ionicons
                                                name="cash-outline"
                                                size={16}
                                                color={selectedMethod === "CASH" ? "#FFFFFF" : "#4A3728"}
                                            />
                                            <Text
                                                style={[
                                                    styles.paymentChipText,
                                                    selectedMethod === "CASH" && styles.paymentChipTextActive,
                                                ]}
                                            >
                                                Efectivo
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            style={[
                                                styles.paymentChip,
                                                selectedMethod === "CARD" && styles.paymentChipActive,
                                            ]}
                                            onPress={() => setSelectedMethod("CARD")}
                                        >
                                            <Ionicons
                                                name="card-outline"
                                                size={16}
                                                color={selectedMethod === "CARD" ? "#FFFFFF" : "#4A3728"}
                                            />
                                            <Text
                                                style={[
                                                    styles.paymentChipText,
                                                    selectedMethod === "CARD" && styles.paymentChipTextActive,
                                                ]}
                                            >
                                                Tarjeta
                                            </Text>
                                        </Pressable>
                                    </View>

                                    {selectedMethod === "CARD" && (
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            style={styles.cardsRow}
                                        >
                                            {cards.map((c) => {
                                                const id = c._id || c.id;
                                                const active = selectedCard === id;
                                                const last4 = String(c.cardNumber).slice(-4);

                                                return (

                                                    <Pressable
                                                        key={id}
                                                        style={[styles.cardChip, active && styles.cardChipActive]}
                                                        onPress={() => setSelectedCard(id)}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cardChipText,
                                                                active && styles.cardChipTextActive,
                                                            ]}
                                                        >
                                                            {c.brand} | •••• {last4}
                                                        </Text>
                                                    </Pressable>
                                                );
                                            })}

                                            <Pressable
                                                style={styles.addCardChip}
                                                onPress={() => setAddCardVisible(true)}
                                            >
                                                <Ionicons name="add" size={16} color="#C4622D" />
                                                <Text style={styles.addCardChipText}>Agregar tarjeta</Text>
                                            </Pressable>
                                        </ScrollView>
                                    )}

                                    <Pressable
                                        style={styles.savePaymentButton}
                                        onPress={handleSavePayment}
                                        disabled={savingPayment}
                                    >
                                        {savingPayment ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <Text style={styles.savePaymentButtonText}>
                                                Confirmar método de pago
                                            </Text>
                                        )}
                                    </Pressable>
                                </View>
                            ) : (
                                <View style={styles.paymentCard}>
                                    <View style={styles.paymentTopRow}>
                                        <View style={styles.paymentIconWrap}>
                                            <Ionicons
                                                name={paymentMethodInfo?.icon || "help-circle-outline"}
                                                size={22}
                                                color="#C4622D"
                                            />
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.paymentMethodText}>
                                                {paymentMethodInfo?.label || "No especificado"}
                                            </Text>

                                            {order.paymentMethod === "CARD" && (
                                                <Text style={styles.paymentSubtext}>
                                                    {cardLast4
                                                        ? `${card?.brand || "Tarjeta"} •••• ${cardLast4}`
                                                        : "Tarjeta no disponible"}
                                                </Text>
                                            )}
                                        </View>

                                        <View
                                            style={[
                                                styles.paymentStatusBadge,
                                                { backgroundColor: paymentStatusInfo.color },
                                            ]}
                                        >
                                            <Text style={styles.paymentStatusText}>
                                                {paymentStatusInfo.label}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>

                        <InfoRow
                            icon="person-outline"
                            label="Cliente"
                            value={order.user?.name}
                        />

                        <InfoRow
                            icon="mail-outline"
                            label="Correo"
                            value={order.user?.email}
                        />

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Productos
                            </Text>

                            {order.items?.map((item, index) => {
                                const subtotal = item.quantity * (item.menu?.price ?? 0);

                                return (
                                    <View
                                        key={index}
                                        style={styles.productCard}
                                    >
                                        <View style={styles.productHeader}>
                                            <View style={styles.productIcon}>
                                                <Ionicons
                                                    name="fast-food"
                                                    size={22}
                                                    color="#C4622D"
                                                />
                                            </View>

                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.productName}>
                                                    {item.menu?.name}
                                                </Text>

                                                <Text style={styles.productId}>
                                                    Producto #{index + 1}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.productDivider} />

                                        <View style={styles.productInfoRow}>
                                            <Text style={styles.productLabel}>
                                                Cantidad
                                            </Text>

                                            <Text style={styles.productValue}>
                                                {item.quantity}
                                            </Text>
                                        </View>

                                        <View style={styles.productInfoRow}>
                                            <Text style={styles.productLabel}>
                                                Precio unitario
                                            </Text>

                                            <Text style={styles.productValue}>
                                                Q {item.menu?.price?.toFixed(2)}
                                            </Text>
                                        </View>

                                        <View style={styles.productInfoRow}>
                                            <Text style={styles.productLabel}>
                                                Subtotal
                                            </Text>

                                            <Text style={styles.productSubtotal}>
                                                Q {subtotal.toFixed(2)}
                                            </Text>
                                        </View>

                                    </View>
                                );
                            })}
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Resumen
                            </Text>

                            {order?.subtotal != null && (
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>
                                        Subtotal
                                    </Text>

                                    <Text style={styles.summaryValue}>
                                        Q {order.subtotal.toFixed(2)}
                                    </Text>
                                </View>
                            )}

                            {order.discount != null && (
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>
                                        Descuento
                                    </Text>

                                    <Text style={[styles.summaryValue, styles.discountValue]}>
                                        -Q {(order.discount ?? 0).toFixed(2)}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.totalCard}>
                                <Text style={styles.totalLabel}>
                                    Total
                                </Text>

                                <Text style={styles.totalValue}>
                                    Q {(order.totalPrice ?? 0).toFixed(2)}
                                </Text>
                            </View>

                            {order.status === "PENDING" && (
                                <Pressable
                                    style={[styles.cancelButton, { backgroundColor: "#8B4513" }]}
                                    disabled={loading}
                                    onPress={() => {
                                        Alert.alert(
                                            "Cancelar orden",
                                            "¿Estás seguro de que deseas cancelar esta orden? Esta acción no se puede deshacer.",
                                            [
                                                {
                                                    text: "No",
                                                    style: "cancel",
                                                },
                                                {
                                                    text: "Sí, cancelar",
                                                    style: "destructive",
                                                    onPress: async () => {
                                                        try {
                                                            await deleteOrder(order._id);

                                                            Alert.alert(
                                                                "Éxito",
                                                                "La orden fue cancelada."
                                                            );

                                                            onClose();
                                                        } catch (err) {
                                                            Alert.alert(
                                                                "Error",
                                                                err.message || "No se pudo cancelar."
                                                            );
                                                        }
                                                    },
                                                },
                                            ],
                                            {
                                                cancelable: true,
                                            }
                                        );
                                    }}
                                >
                                    <Ionicons
                                        name="close-circle"
                                        size={18}
                                        color="#FFF"
                                    />

                                    <Text style={styles.cancelButtonText}>
                                        Cancelar orden
                                    </Text>
                                </Pressable>
                            )}
                        </View>

                    </ScrollView>
                </View>
            </View>

            <AddCardModal
                visible={addCardVisible}
                onClose={() => setAddCardVisible(false)}
                onAdded={(newCard) => {
                    fetchPaymentMethods();
                    setPaymentMethods(prev => [...prev, newCard]);
                }}
            />
        </Modal>
    );
};

export default OrderDetails;

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
        maxHeight: "88%",
        padding: 22,
    },

    completeButton: {
        marginTop: -14,
        padding: 15,
        marginBottom: 20,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2C1A0E",
    },

    cancelButtonText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16,
        marginLeft: 8,
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
        fontSize: 30,
        fontWeight: "900",
        color: "#FFF",
    },

    heroLabel: {
        marginTop: 6,
        color: "#EADDCA",
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 1,
    },

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },

    statusText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 12,
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
        color: "#8C6B55",
        fontSize: 13,
    },

    rowValue: {
        color: "#2C1A0E",
        fontWeight: "700",
        maxWidth: "45%",
        textAlign: "right",
    },

    paymentCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },

    paymentTopRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    paymentIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#FFF0E8",
        justifyContent: "center",
        alignItems: "center",
    },

    paymentMethodText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2C1A0E",
    },

    paymentSubtext: {
        marginTop: 2,
        fontSize: 12,
        color: "#8C6B55",
    },

    paymentStatusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },

    paymentStatusText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "700",
    },

    paymentSelectCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },

    paymentMethodRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 12,
    },

    paymentChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#EADDCA",
    },

    paymentChipActive: {
        backgroundColor: "#4A3728",
        borderColor: "#4A3728",
    },

    paymentChipText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#4A3728",
    },

    paymentChipTextActive: {
        color: "#FFFFFF",
    },

    cardsRow: {
        marginBottom: 14,
    },

    cardChip: {
        backgroundColor: "#FFF0E8",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "transparent",
    },

    cardChipActive: {
        backgroundColor: "#2C1A0E",
        borderColor: "#C4622D",
    },

    cardChipText: {
        color: "#6F4E37",
        fontWeight: "600",
        fontSize: 13,
    },

    cardChipTextActive: {
        color: "#FFF",
    },

    addCardChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#C4622D",
        borderStyle: "dashed",
    },

    addCardChipText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#C4622D",
    },

    savePaymentButton: {
        backgroundColor: "#C4622D",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
    },

    savePaymentButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 14,
    },

    productCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },

        elevation: 2,
    },

    productHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    productIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "#FFF0E8",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    productName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2C1A0E",
    },

    productId: {
        marginTop: 3,
        fontSize: 12,
        color: "#8C6B55",
    },

    productDivider: {
        height: 1,
        backgroundColor: "#EFE7DF",
        marginVertical: 14,
    },

    productInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    productLabel: {
        color: "#8C6B55",
        fontSize: 13,
    },

    productValue: {
        fontWeight: "700",
        color: "#2C1A0E",
    },

    productSubtotal: {
        fontWeight: "900",
        fontSize: 16,
        color: "#8B4513",
    },

    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },

    summaryLabel: {
        fontSize: 14,
        color: "#6F4E37",
    },

    summaryValue: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2C1A0E",
    },

    discountValue: {
        color: "#C4392D",
    },

    totalCard: {
        marginTop: 12,
        backgroundColor: "#4A3728",
        borderRadius: 18,
        paddingVertical: 18,
        alignItems: "center",
    },

    totalLabel: {
        color: "#EADDCA",
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 1,
    },

    totalValue: {
        marginTop: 6,
        fontSize: 28,
        fontWeight: "900",
        color: "#FFF",
    },

    cancelButton: {
        marginTop: 20,
        padding: 15,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    cancelButtonText: {
        marginLeft: 8,
        color: "#FFF",
        fontWeight: "600",
        fontSize: 14,
    },
});