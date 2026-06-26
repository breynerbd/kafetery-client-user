import { StyleSheet } from "react-native";
import {
    COLORS,
    SPACING,
    FONT_SIZE,
} from "../constants/theme";

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.lg,
    },

    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: SPACING.lg,
        elevation: 3,
    },

    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "bold",
        color: COLORS.text,
    },

    subtitle: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
    },

    center: {
        justifyContent: "center",
        alignItems: "center",
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
    },

    shadow: {
        elevation: 4,
    },
});