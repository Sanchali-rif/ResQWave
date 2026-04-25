import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Easing,
} from "react-native";

// ─── Colour tokens (matching the Tailwind config) ────────────────────────────
const C = {
    background:            "#131315",
    surfaceContainerLow:   "#1b1b1d",
    surfaceContainerHigh:  "#2a2a2c",
    surfaceContainerHighest: "#353437",
    onBackground:          "#e4e2e4",
    onSurfaceVariant:      "#e7bdb7",
    primary:               "#ffb4aa",
    secondary:             "#ffbc7c",
    tertiary:              "#53e16f",
    immediateRed:          "#FF4D6D",
    priorityAmber:         "#FFB703",
    routineGreen:          "#2D6A4F",
    buttonSalmon:          "#FF8577",
    invertedRed:           "#c0000a",
    cyan:                  "#00FFFF",
    outlineVariant:        "#5d3f3b",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const ALERTS = [
    {
        id: "AX-902-T",
        level: "IMMEDIATE",
        levelColor: C.immediateRed,
        glowColor: "rgba(255,77,109,0.25)",
        title: "Severe Bleeding - Trauma",
        coords: "40.7128° N, 74.0060° W",
        time: "2 MINS AGO",
        hops: "2 HOPS",
        gpsTag: "FRESH GPS",
        gpsColor: C.tertiary,
        gpsIcon: "✓",
        action: "ROUTE",
        actionBg: C.buttonSalmon,
        actionText: "#000",
    },
    {
        id: "B2-114-K",
        level: "PRIORITY",
        levelColor: C.priorityAmber,
        levelTextColor: "#000",
        glowColor: "rgba(255,183,3,0.18)",
        title: "Thermal Anomaly Detected",
        coords: "40.7306° N, 73.9352° W",
        time: "14 MINS AGO",
        hops: "1 HOP",
        gpsTag: "ESTIMATED",
        gpsColor: C.secondary,
        gpsIcon: "⚠",
        action: "ASSIGN",
        actionBg: C.buttonSalmon,
        actionText: "#000",
    },
    {
        id: "S9-001-Z",
        level: "ROUTINE",
        levelColor: C.routineGreen,
        levelTextColor: "#fff",
        glowColor: null,
        title: "Supply Cache Request",
        coords: "40.7589° N, 73.9851° W",
        time: "41 MINS AGO",
        hops: "4 HOPS",
        gpsTag: "FRESH GPS",
        gpsColor: C.tertiary,
        gpsIcon: "✓",
        action: "VIEW",
        actionBg: C.surfaceContainerHighest,
        actionText: "rgba(255,255,255,0.5)",
    },
];

const FILTERS = ["All", "Critical", "Injured", "OK"];

// ─── Pulsing dot component ────────────────────────────────────────────────────
function PulseDot() {
    const opacity = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.2, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 1,   duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();
    }, []);
    return <Animated.Text style={[styles.pulseIcon, { opacity }]}>⬤</Animated.Text>;
}

// ─── Alert Card ───────────────────────────────────────────────────────────────
function AlertCard({ item }) {
    const levelTextColor = item.levelTextColor ?? "#000";
    return (
        <View
            style={[
                styles.card,
                { borderLeftColor: item.levelColor },
                item.glowColor && { shadowColor: item.levelColor, shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: -4, height: 0 }, elevation: 8 },
            ]}
        >
            {/* Row 1 – meta */}
            <View style={styles.cardMeta}>
                <Text style={styles.uid}>UID: {item.id}</Text>
                <View style={[styles.levelBadge, { backgroundColor: item.levelColor }]}>
                    <Text style={[styles.levelText, { color: levelTextColor }]}>{item.level}</Text>
                </View>
                <Text style={styles.timeText}>{item.time}</Text>
            </View>

            {/* Title */}
            <Text style={styles.cardTitle}>{item.title}</Text>

            {/* Coords */}
            <View style={styles.coordRow}>
                <Text style={styles.coordIcon}>📍</Text>
                <Text style={styles.coordText}>{item.coords}</Text>
            </View>

            {/* Tags + Action */}
            <View style={styles.cardBottom}>
                <View style={styles.tags}>
                    <View style={styles.tag}>
                        <Text style={styles.tagIconText}>✦</Text>
                        <Text style={styles.tagText}>{item.hops}</Text>
                    </View>
                    <View style={styles.tag}>
                        <Text style={[styles.tagIconText, { color: item.gpsColor }]}>{item.gpsIcon}</Text>
                        <Text style={[styles.tagText, { color: item.gpsColor }]}>{item.gpsTag}</Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: item.actionBg }]} activeOpacity={0.8}>
                    <Text style={[styles.actionText, { color: item.actionText }]}>{item.action}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AlertsScreen() {
    const [activeFilter, setActiveFilter] = useState("All");

    return (
        <View style={styles.root}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Telemetry Header ── */}
                <View style={styles.telemetryRow}>
                    <View style={styles.telemetryCell}>
                        <Text style={styles.telemetryLabel}>Connection</Text>
                        <View style={styles.telemetryValue}>
                            <Text style={[styles.telemetryIcon, { color: C.tertiary }]}>≋</Text>
                            <Text style={styles.telemetryValueText}>MESH-04</Text>
                        </View>
                    </View>
                    <View style={styles.telemetryCell}>
                        <Text style={styles.telemetryLabel}>GPS Status</Text>
                        <View style={styles.telemetryValue}>
                            <Text style={[styles.telemetryIcon, { color: C.tertiary }]}>◎</Text>
                            <Text style={styles.telemetryValueText}>LOCK</Text>
                        </View>
                    </View>
                    <View style={styles.telemetryCell}>
                        <Text style={styles.telemetryLabel}>Queue</Text>
                        <View style={styles.telemetryValue}>
                            <Text style={[styles.telemetryIcon, { color: C.secondary }]}>≡</Text>
                            <Text style={styles.telemetryValueText}>02 ACT</Text>
                        </View>
                    </View>
                </View>

                {/* ── Section Header ── */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Mission Alerts</Text>
                    <Text style={styles.sectionSub}>Monitoring 14 mesh nodes across Zone A-1</Text>
                </View>

                {/* ── Filter Bar ── */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                    contentContainerStyle={styles.filterContent}
                >
                    {FILTERS.map((f) => {
                        const active = f === activeFilter;
                        return (
                            <TouchableOpacity
                                key={f}
                                style={[styles.filterBtn, active && styles.filterBtnActive]}
                                onPress={() => setActiveFilter(f)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.filterText, active && styles.filterTextActive]}>{f}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* ── Alert Cards ── */}
                {ALERTS.map((alert) => (
                    <AlertCard key={alert.id} item={alert} />
                ))}

                {/* ── Bento Stats ── */}
                <View style={styles.bento}>
                    <View style={[styles.bentoCard, { borderTopColor: C.primary }]}>
                        <Text style={styles.bentoIcon}>📈</Text>
                        <Text style={[styles.bentoLabel, { color: C.primary }]}>Network Health</Text>
                        <Text style={styles.bentoValue}>98.2%</Text>
                        <Text style={styles.bentoSub}>UPTIME ZONE A-1</Text>
                    </View>
                    <View style={[styles.bentoCard, { borderTopColor: C.tertiary }]}>
                        <Text style={styles.bentoIcon}>🔋</Text>
                        <Text style={[styles.bentoLabel, { color: C.tertiary }]}>System Power</Text>
                        <Text style={styles.bentoValue}>12.4h</Text>
                        <Text style={styles.bentoSub}>REMAINING OPS</Text>
                    </View>
                </View>

                {/* ── Node Heartbeat ── */}
                <View style={styles.heartbeatRow}>
                    <PulseDot />
                    <Text style={styles.heartbeatText}>
                        Node #144 reported heartbeat ping... Status: NOMINAL. Auto-resolving minor latency jitter in Sector 4.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: C.background,
    },
    scroll: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
        gap: 0,
    },

    // Telemetry
    telemetryRow: {
        flexDirection: "row",
        backgroundColor: C.surfaceContainerLow,
        padding: 4,
        gap: 4,
        marginBottom: 24,
    },
    telemetryCell: {
        flex: 1,
        backgroundColor: C.surfaceContainerHigh,
        paddingVertical: 10,
        paddingHorizontal: 4,
        alignItems: "center",
    },
    telemetryLabel: {
        color: C.onSurfaceVariant,
        fontSize: 9,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    telemetryValue: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    telemetryIcon: {
        fontSize: 13,
        fontWeight: "700",
    },
    telemetryValueText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 13,
        letterSpacing: 0.5,
    },

    // Section header
    sectionHeader: { marginBottom: 16 },
    sectionTitle: {
        color: "#fff",
        fontSize: 34,
        fontWeight: "900",
        textTransform: "uppercase",
        letterSpacing: -1,
        lineHeight: 38,
    },
    sectionSub: {
        color: C.onSurfaceVariant,
        fontSize: 13,
        fontWeight: "500",
        marginTop: 4,
    },

    // Filter bar
    filterScroll: { marginBottom: 20 },
    filterContent: { gap: 8, paddingRight: 16 },
    filterBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: C.outlineVariant,
    },
    filterBtnActive: {
        backgroundColor: C.cyan,
        borderColor: C.cyan,
    },
    filterText: {
        color: C.onSurfaceVariant,
        fontSize: 11,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    filterTextActive: {
        color: "#000",
    },

    // Alert card
    card: {
        backgroundColor: C.surfaceContainerLow,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
    },
    cardMeta: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    uid: {
        color: C.onSurfaceVariant,
        fontSize: 9,
        fontFamily: "monospace",
    },
    levelBadge: {
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
    levelText: {
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: 0.5,
        textTransform: "uppercase",
    },
    timeText: {
        color: C.onSurfaceVariant,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    cardTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "800",
        letterSpacing: -0.5,
        lineHeight: 28,
        marginBottom: 10,
    },
    coordRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 14,
    },
    coordIcon: { fontSize: 12, color: C.onSurfaceVariant },
    coordText: {
        color: "#fff",
        fontSize: 11,
        fontFamily: "monospace",
    },
    cardBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    tags: { flexDirection: "row", gap: 8 },
    tag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.surfaceContainerHighest,
        paddingHorizontal: 8,
        paddingVertical: 5,
        gap: 4,
    },
    tagIconText: {
        color: "#fff",
        fontSize: 11,
    },
    tagText: {
        color: "#fff",
        fontSize: 9,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    actionBtn: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    actionText: {
        fontSize: 13,
        fontWeight: "900",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },

    // Bento
    bento: {
        flexDirection: "row",
        gap: 16,
        marginTop: 16,
        marginBottom: 16,
    },
    bentoCard: {
        flex: 1,
        backgroundColor: C.surfaceContainerLow,
        padding: 16,
        height: 140,
        borderTopWidth: 2,
        justifyContent: "space-between",
    },
    bentoIcon: {
        fontSize: 28,
        opacity: 0.15,
        alignSelf: "flex-end",
        marginTop: -8,
        marginRight: -4,
    },
    bentoLabel: {
        fontSize: 9,
        fontWeight: "900",
        textTransform: "uppercase",
        letterSpacing: 1.5,
    },
    bentoValue: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "800",
        letterSpacing: -1,
        lineHeight: 34,
    },
    bentoSub: {
        color: C.onSurfaceVariant,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: 1,
    },

    // Heartbeat
    heartbeatRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0e0e10",
        borderWidth: 1,
        borderColor: "rgba(93,63,59,0.1)",
        padding: 12,
        gap: 10,
    },
    pulseIcon: {
        color: C.onSurfaceVariant,
        fontSize: 8,
    },
    heartbeatText: {
        flex: 1,
        color: C.onSurfaceVariant,
        fontSize: 11,
        fontStyle: "italic",
        lineHeight: 16,
    },
});