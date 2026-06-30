import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Importaciones de todas las pantallas basadas en tu estructura de carpetas
import RestaurantsScreen from "../features/restaurants/screens/RestaurantsScreen";
import MenusScreen from "../features/menus/screens/MenusScreen.jsx";
import TablesScreen from "../features/tables/screens/TablesScreen.jsx";
import OrdersScreen from "../features/orders/screens/OrdersScreen.jsx";
import PromotionsScreen from "../features/promotions/screens/PromotionsScreen.jsx";
import ReservationsScreen from "../features/reservations/screens/ReservationsScreen.jsx";
import ProfileScreen from "../features/profile/screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#4A3728",
                tabBarInactiveTintColor: "#A8A8A8",
                tabBarStyle: { paddingBottom: 5, height: 60 },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    
                    // Mapeo dinámico de iconos según la pestaña
                    if (route.name === "Restaurantes") {
                        iconName = focused ? "storefront" : "storefront-outline";
                    } else if (route.name === "Menús") {
                        iconName = focused ? "restaurant" : "restaurant-outline";
                    } else if (route.name === "Mesas") {
                        iconName = focused ? "grid" : "grid-outline";
                    } else if (route.name === "Pedidos") {
                        iconName = focused ? "receipt" : "receipt-outline";
                    } else if (route.name === "Promos") {
                        iconName = focused ? "pricetag" : "pricetag-outline";
                    } else if (route.name === "Reservas") {
                        iconName = focused ? "calendar" : "calendar-outline";
                    } else if (route.name === "Perfil") {
                        iconName = focused ? "person" : "person-outline";
                    }
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Restaurantes" component={RestaurantsScreen} />
            <Tab.Screen name="Menús" component={MenusScreen} />
            <Tab.Screen name="Mesas" component={TablesScreen} />
            <Tab.Screen name="Pedidos" component={OrdersScreen} />
            <Tab.Screen name="Promos" component={PromotionsScreen} />
            <Tab.Screen name="Reservas" component={ReservationsScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default MainTabs;