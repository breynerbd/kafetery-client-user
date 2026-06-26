import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import RestaurantsScreen from "../features/restaurants/screens/RestaurantsScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import MenusScreen from "../features/menus/screens/MenusScreen.jsx";
import TablesScreen from "../features/tables/screens/TablesScreens.jsx";

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
                    if (route.name === "Restaurantes") iconName = focused ? "storefront" : "storefront-outline";
                    else if (route.name === "Perfil") iconName = focused ? "person" : "person-outline";
                    else if (route.name === "Menús") iconName = focused ? "restaurant" : "restaurant-outline";
                    else if (route.name === "Mesas") iconName = focused ? "grid" : "grid-outline";
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Restaurantes" component={RestaurantsScreen} />
            <Tab.Screen name="Menús" component={MenusScreen} />
            <Tab.Screen name="Mesas" component={TablesScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
};
export default MainTabs;