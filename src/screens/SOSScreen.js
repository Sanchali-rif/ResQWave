import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function SOSScreen() {
    return (
        <View style={styles.container}>

            {/* Title */}
            <Text style={styles.title}>EMERGENCY SOS</Text>

            {/* Big SOS Button */}
            <TouchableOpacity style={styles.sosButton}>
                <Text style={styles.sosText}>SOS</Text>
            </TouchableOpacity>

            {/* Instruction */}
            <Text style={styles.subText}>
                Press and hold to send emergency alert
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f0f10",
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        color: "#ff6b6b",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 40,
    },

    sosButton: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: "#c1121f",
        justifyContent: "center",
        alignItems: "center",
        elevation: 10,
    },

    sosText: {
        color: "white",
        fontSize: 28,
        fontWeight: "bold",
    },

    subText: {
        color: "#aaa",
        marginTop: 30,
        fontSize: 12,
    },
});