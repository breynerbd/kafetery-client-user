import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Platform } from "react-native";

import RestaurantsScreen from "../features/restaurants/screens/RestaurantsScreen";
import MenusScreen from "../features/menus/screens/MenusScreen.jsx";
import OrdersScreen from "../features/orders/screens/OrdersScreen.jsx";
import PromotionsScreen from "../features/promotions/screens/PromotionsScreen.jsx";
import ReservationsScreen from "../features/reservations/screens/ReservationsScreen.jsx";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import CartScreen from "../features/cart/screens/CartScreen.jsx";
import PaymentMethodsScreen from "../features/paymentMethods/screens/PaymentMethodsScreen.jsx";

const Tab = createBottomTabNavigator();

const TAB_ICON = {
    Sucursales: "storefront",
    Menús: "restaurant",
    Pedidos: "receipt",
    Promos: "pricetag",
    Reservas: "calendar",
    Perfil: "person",
};

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#4A3728",
                tabBarInactiveTintColor: "#A8A8A8",
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: true,
                tabBarIcon: ({ focused, color, size }) => {
                    const iconName = TAB_ICON[route.name];
                    return (
                        <Ionicons
                            name={focused ? iconName : `${iconName}-outline`}
                            size={24}
                            color={color}
                        />
                    );
                },
            })}
        >
            <Tab.Screen name="Sucursales" component={RestaurantsScreen} />
            <Tab.Screen name="Menús" component={MenusScreen} />
            <Tab.Screen name="Reservas" component={ReservationsScreen} />
            <Tab.Screen name="Pedidos" component={OrdersScreen} />
            <Tab.Screen name="Promos" component={PromotionsScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
            <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' } }} />
            <Tab.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' } }} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        height: 68,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        position: 'absolute',
    },
    activeTabBackground: {
        backgroundColor: "#4A3728",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        color: "#FFFFFF",
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default MainTabs;