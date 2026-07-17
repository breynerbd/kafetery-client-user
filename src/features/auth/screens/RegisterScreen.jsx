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

const RegisterScreen = () => {
    const navigation = useNavigation();

    const { handleRegister, loading, error } = useAuth();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            surname: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    const onSubmit = async (data) => {
        try {
            await handleRegister({
                name: data.name,
                surname: data.surname,
                username: data.username,
                email: data.email,
                password: data.password,
            });

            navigation.navigate("Login");
        } catch (err) {
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
                        Crear Cuenta
                    </Text>

                    <Text style={styles.subtitle}>
                        Únete y empieza a disfrutar
                    </Text>
                </View>

                <View>

                    {error ? (
                        <Text style={styles.serverError}>{error}</Text>
                    ) : null}

                    <View style={styles.row}>
                        <View style={styles.rowItem}>
                            <Controller
                                control={control}
                                name="name"
                                rules={{
                                    required: "El nombre es obligatorio",
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Nombre"
                                        placeholder="Juan"
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.name?.message}
                                    />
                                )}
                            />
                        </View>

                        <View style={styles.rowItem}>
                            <Controller
                                control={control}
                                name="surname"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Apellido"
                                        placeholder="Pérez"
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.surname?.message}
                                    />
                                )}
                            />
                        </View>
                    </View>

                    <Controller
                        control={control}
                        name="username"
                        rules={{
                            required: "El usuario es obligatorio",
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Usuario"
                                placeholder="juanperez"
                                value={value}
                                onChangeText={onChange}
                                autoCapitalize="none"
                                error={errors.username?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: "El correo es obligatorio",
                            pattern: {
                                value: /.+@.+\..+/,
                                message: "Correo no válido",
                            },
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
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                                message: "Debe tener al menos una mayúscula, un número y un carácter especial",
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

                    <Controller
                        control={control}
                        name="confirmPassword"
                        rules={{
                            required: "Confirma tu contraseña",
                            validate: (value) =>
                                value === password || "Las contraseñas no coinciden",
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Confirmar contraseña"
                                placeholder="••••••••"
                                secureTextEntry
                                value={value}
                                onChangeText={onChange}
                                error={errors.confirmPassword?.message}
                            />
                        )}
                    />

                    <Button
                        title={loading ? "Creando cuenta..." : "Registrarse"}
                        onPress={handleSubmit(onSubmit)}
                        style={styles.button}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            ¿Ya tienes cuenta?
                        </Text>

                        <Text
                            style={styles.link}
                            onPress={() => navigation.navigate("Login")}
                        >
                            Iniciar sesión
                        </Text>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;

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
        marginBottom: 30,
    },

    logo: {
        width: 120,
        height: 120,
        marginBottom: 12,
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

    row: {
        flexDirection: "row",
        gap: 12,
    },

    rowItem: {
        flex: 1,
    },

    serverError: {
        textAlign: "center",
        color: "#DC2626",
        fontWeight: "600",
        marginBottom: 12,
    },

    button: {
        marginTop: 20,
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