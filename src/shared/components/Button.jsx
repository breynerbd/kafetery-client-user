import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { COLORS, FONT_SIZE } from "../constants/theme.js";

const Button = ({
    title,
    onPress,
    loading = false,
    style,
    disabled = false,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                style,
                (disabled || loading) && styles.disabled,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={COLORS.white} />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    text: {
        color: COLORS.white,
        fontSize: FONT_SIZE.md,
        fontWeight: "bold",
    },

    disabled: {
        opacity: 0.6,
    },
});

export default Button;