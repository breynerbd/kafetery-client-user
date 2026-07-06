import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../../shared/store/authStore";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
    const { user, logout } = useAuthStore();
    const navigation = useNavigation();

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.topBand} />

            <View style={styles.avatarCard}>
                <View style={styles.avatarRing}>
                    <View style={styles.avatarBg}>
                        <Ionicons name="person" size={48} color="#C4622D" />
                    </View>
                </View>
                <Text style={styles.userName}>{user?.name || "Sin nombre"} {user?.surname || "Sin apellido"}</Text>
                <Text style={styles.userUsername}>@{user?.username || "Sin usuario"}</Text>
                <Text style={styles.userEmail}>{user?.email || "Sin correo"}</Text>

                <View style={styles.badge}>
                    <Ionicons name="cafe-outline" size={13} color="#C4622D" />
                    <Text style={styles.badgeText}>Miembro activo</Text>
                </View>
            </View>

            <View style={styles.statsCard}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{user?.loyaltyPoints ?? 0}</Text>
                    <Text style={styles.statLabel}>Puntos</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {user?.totalOrders ?? 0}
                    </Text>
                    <Text style={styles.statLabel}>Ordenes Fin.</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {user?.loyaltyPoints >= 500 ? "Oro" : user?.loyaltyPoints >= 200 ? "Plata" : "Base"}
                    </Text>
                    <Text style={styles.statLabel}>Nivel</Text>
                </View>
            </View>

            <View style={styles.menuCard}>
                {[
                    {
                        icon: "receipt-outline",
                        label: "Mis pedidos",
                        screen: "Pedidos",
                    },
                    {
                        icon: "card-outline",
                        label: "Mis tarjetas",
                        screen: "PaymentMethods",
                    },
                ].map((item, i, arr) => (
                    <Pressable
                        key={item.label}
                        style={({ pressed }) => [
                            styles.menuItem,
                            pressed && styles.menuItemPressed,
                            i === arr.length - 1 && styles.menuItemLast,
                        ]}
                        onPress={() => navigation.navigate(item.screen)}
                    >
                        <View style={styles.menuIconWrap}>
                            <Ionicons
                                name={item.icon}
                                size={20}
                                color="#C4622D"
                            />
                        </View>

                        <Text style={styles.menuLabel}>
                            {item.label}
                        </Text>

                        <Ionicons
                            name="chevron-forward"
                            size={16}
                            color="#C4B5A8"
                        />
                    </Pressable>
                ))}
            </View>

            <Pressable
                style={({ pressed }) => [
                    styles.logoutBtn,
                    pressed && styles.logoutBtnPressed,
                ]}
                onPress={logout}
            >
                <Ionicons name="log-out-outline" size={18} color="#8C3A20" />
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>

            <Text style={styles.version}>v1.0.0</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: "#FAF6F1",
    },
    container: {
        alignItems: "center",
        paddingBottom: 40,
    },

    topBand: {
        width: "100%",
        height: 160,
        backgroundColor: "#2C1A0E",
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },

    avatarCard: {
        alignItems: "center",
        marginTop: -60,
        marginBottom: 20,
        width: "88%",
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        paddingTop: 24,
        paddingBottom: 28,
        paddingHorizontal: 20,
        shadowColor: "#2C1A0E",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.10,
        shadowRadius: 16,
        elevation: 6,
    },
    avatarRing: {
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
    avatarBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#FFF0E8",
        justifyContent: "center",
        alignItems: "center",
    },
    userName: {
        fontSize: 22,
        fontWeight: "700",
        color: "#2C1A0E",
        letterSpacing: -0.3,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: "#8C6B55",
        marginBottom: 14,
    },
    userUsername: {
        fontSize: 14,
        color: "#8C6B55",
        marginBottom: 12,
    },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#FFF0E8",
        borderWidth: 1,
        borderColor: "#F5D5C0",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    badgeText: {
        fontSize: 12,
        color: "#C4622D",
        fontWeight: "600",
        letterSpacing: 0.2,
    },

    statsCard: {
        flexDirection: "row",
        width: "88%",
        backgroundColor: "#2C1A0E",
        borderRadius: 20,
        paddingVertical: 22,
        marginBottom: 16,
        shadowColor: "#2C1A0E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.20,
        shadowRadius: 12,
        elevation: 5,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statNumber: {
        fontSize: 22,
        fontWeight: "700",
        color: "#FAF6F1",
        marginBottom: 3,
    },
    statLabel: {
        fontSize: 11,
        color: "#C4B5A8",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        fontWeight: "500",
    },
    statDivider: {
        width: 1,
        backgroundColor: "#4A3728",
        marginVertical: 4,
    },

    menuCard: {
        width: "88%",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        marginBottom: 24,
        shadowColor: "#2C1A0E",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F0EAE4",
        gap: 14,
    },
    menuItemPressed: {
        backgroundColor: "#FAF6F1",
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    menuIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#FFF0E8",
        justifyContent: "center",
        alignItems: "center",
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        color: "#2C1A0E",
        fontWeight: "500",
    },

    logoutBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#FFF0E8",
        borderWidth: 1.5,
        borderColor: "#F5C5A8",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 32,
        marginBottom: 24,
    },
    logoutBtnPressed: {
        backgroundColor: "#FFE0CC",
    },
    logoutText: {
        color: "#8C3A20",
        fontWeight: "700",
        fontSize: 15,
    },

    version: {
        fontSize: 11,
        color: "#C4B5A8",
        letterSpacing: 0.5,
    },
});

export default ProfileScreen;