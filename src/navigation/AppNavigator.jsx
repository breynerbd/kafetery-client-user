import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import { useAuthStore } from "../shared/store/authStore";

const AppNavigator = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [isReady, setIsReady] = React.useState(false);
    const { sessionExpired } = useAuthStore();

    React.useEffect(() => {
        setIsReady(true);
    }, []);

    return (
        <NavigationContainer>
            {sessionExpired ? <AuthStack /> : (isAuthenticated ? <MainTabs /> : <AuthStack />)}
        </NavigationContainer>
    );
};

export default AppNavigator;