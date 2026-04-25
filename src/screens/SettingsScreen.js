import { View, Text, StyleSheet } from "react-native";

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>SETTINGS</Text>

            <View style={styles.item}>
                <Text style={styles.label}>Mode</Text>
                <Text style={styles.value}>Auto (Online/Offline)</Text>
            </View>

            <View style={styles.item}>
                <Text style={styles.label}>GPS Status</Text>
                <Text style={styles.value}>Active</Text>
            </View>

            <View style={styles.item}>
                <Text style={styles.label}>Bluetooth</Text>
                <Text style={styles.value}>Enabled</Text>
            </View>

            <View style={styles.item}>
                <Text style={styles.label}>Version</Text>
                <Text style={styles.value}>v1.0</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f0f10",
        padding: 16,
    },

    title: {
        color: "#ff6b6b",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },

    item: {
        backgroundColor: "#1a1a1c",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },

    label: {
        color: "#aaa",
        fontSize: 12,
    },

    value: {
        color: "#fff",
        fontSize: 16,
        marginTop: 4,
    },
});