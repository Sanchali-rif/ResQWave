import { View, Text, StyleSheet, FlatList } from "react-native";

const dummyContacts = [
    { id: "1", name: "Rescue Team Alpha", status: "Nearby" },
    { id: "2", name: "Device B12", status: "Connected" },
    { id: "3", name: "Unknown Device", status: "Weak Signal" },
];

export default function ContactsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>CONTACTS</Text>

            <FlatList
                data={dummyContacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.status}>{item.status}</Text>
                    </View>
                )}
            />
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
        marginBottom: 16,
    },

    card: {
        backgroundColor: "#1a1a1c",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },

    name: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },

    status: {
        color: "#888",
        fontSize: 12,
        marginTop: 4,
    },
});