import {
    View,
    Text,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

import Input from "../../../shared/components/Input.jsx";
import Button from "../../../shared/components/Button.jsx";
import { useAuth } from "../hooks/useAuth.js";

import logo from "../../../../assets/Kafetery_logo.png";

const LoginScreen = () => {
    const navigation = useNavigation();

    const { handleLogin, loading } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        const success = await handleLogin(data);

        if (success) {
        } else {
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Image
                        source={logo}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>
                        Bienvenido
                    </Text>

                    <Text style={styles.subtitle}>
                        Inicia sesión para continuar
                    </Text>
                </View>

                <View>

                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: "El correo es obligatorio",
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Correo electrónico"
                                placeholder="correo@ejemplo.com"
                                value={value}
                                onChangeText={onChange}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                error={errors.email?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: "La contraseña es obligatoria",
                            minLength: {
                                value: 8,
                                message: "Debe tener mínimo 8 caracteres",
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Contraseña"
                                placeholder="••••••••"
                                secureTextEntry
                                value={value}
                                onChangeText={onChange}
                                error={errors.password?.message}
                            />
                        )}
                    />

                    <Button
                        title={loading ? "Cargando..." : "Iniciar Sesión"}
                        onPress={handleSubmit(onSubmit)}
                        style={styles.button}
                    />

                    <Text
                        style={styles.forgot}
                        onPress={() => navigation.navigate("ForgotPassword")}
                    >
                        ¿Olvidaste tu contraseña?
                    </Text>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            ¿No tienes cuenta?
                        </Text>

                        <Text
                            style={styles.link}
                            onPress={() => navigation.navigate("Register")}
                        >
                            Registrarse
                        </Text>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F5F2",
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 25,
    },

    header: {
        alignItems: "center",
        marginBottom: 40,
    },

    logo: {
        width: 180,
        height: 180,
        marginBottom: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#4A3728",
    },

    subtitle: {
        fontSize: 16,
        color: "#777",
        marginTop: 5,
    },

    button: {
        marginTop: 20,
    },

    forgot: {
        textAlign: "center",
        marginTop: 20,
        color: "#8B4513",
        fontWeight: "600",
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
    },

    footerText: {
        color: "#666",
        fontSize: 15,
    },

    link: {
        color: "#8B4513",
        fontWeight: "bold",
        marginLeft: 5,
        fontSize: 15,
    },
});