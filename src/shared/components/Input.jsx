import React from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from "react-native";

import {
    COLORS,
    FONT_SIZE,
    SPACING,
} from "../constants/theme";

const Input = ({
    label,
    error,
    style,
    ...props
}) => {
    return (
        <View style={styles.container}>

            {label && (
                <Text style={styles.label}>
                    {label}
                </Text>
            )}

            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError,
                    style,
                ]}
                placeholderTextColor="#999"
                {...props}
            />

            {error && (
                <Text style={styles.error}>
                    {error}
                </Text>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },

    label: {
        marginBottom: 6,
        color: COLORS.text,
        fontSize: FONT_SIZE.sm,
        fontWeight: "600",
    },

    input: {
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: COLORS.surface,
        color: COLORS.text,
        fontSize: FONT_SIZE.md,
    },

    inputError: {
        borderColor: COLORS.error,
    },

    error: {
        marginTop: 5,
        color: COLORS.error,
        fontSize: FONT_SIZE.sm,
    },
});

export default Input;