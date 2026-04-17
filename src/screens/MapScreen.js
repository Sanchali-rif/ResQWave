import { View, Text, StyleSheet } from "react-native";

export default function MapScreen() {
    return (
        <View style={styles.container}>

            {/* Top Status Bar */}
            <View style={styles.topBar}>
                <View>
                    <Text style={styles.title}>RESQWAVE</Text>
                    <Text style={styles.subText}>
                        GPS: 2s ago | Queue: 0
                    </Text>
                </View>

                <Text style={styles.status}>ONLINE</Text>
            </View>

            {/* Map Area (placeholder) */}
            <View style={styles.map}>
                <Text style={styles.mapText}>MAP AREA</Text>
            </View>

            {/* SOS Button */}
            <View style={styles.sosButton}>
                <Text style={styles.sosText}>SOS</Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f0f10",
    },

    topBar: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#1a1a1c",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    title: {
        color: "#ff6b6b",
        fontWeight: "bold",
        fontSize: 16,
    },

    subText: {
        color: "#aaa",
        fontSize: 10,
        marginTop: 2,
    },

    status: {
        color: "#4caf50",
        fontSize: 12,
        fontWeight: "500",
    },

    map: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    mapText: {
        color: "#888",
    },

    sosButton: {
        position: "absolute",
        bottom: 30,
        right: 20,
        backgroundColor: "#c1121f",
        padding: 20,
        borderRadius: 50,
        elevation: 5,
    },

    sosText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});