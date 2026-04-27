import React, { useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
    ScrollView,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

// ─── Color Tokens ──────────────────────────────────────────────────────────────
const C = {
    background:               "#131315",
    surfaceContainerLowest:   "#0e0e10",
    surfaceContainerLow:      "#1b1b1d",
    surfaceContainer:         "#1f1f21",
    surfaceContainerHigh:     "#2a2a2c",
    surfaceContainerHighest:  "#353437",
    surfaceBright:            "#39393b",
    onBackground:             "#e4e2e4",
    onSurfaceVariant:         "#e7bdb7",
    primary:                  "#ffb4aa",
    primaryContainer:         "#ff5545",
    onPrimary:                "#690003",
    secondary:                "#ffbc7c",
    secondaryContainer:       "#fe9400",
    tertiary:                 "#53e16f",
    tertiaryContainer:        "#00a741",
    inverseRed:               "#c0000a",
    outlineVariant:           "#5d3f3b",
};

// ─── Animated Scan Line ────────────────────────────────────────────────────────
function ScanLine() {
    const anim = useRef(new Animated.Value(-100)).current;
    useEffect(() => {
        Animated.loop(
            Animated.timing(anim, {
                toValue: H,
                duration: 8000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);
    return (
        <Animated.View
            pointerEvents="none"
            style={[styles.scanLine, { transform: [{ translateY: anim }] }]}
        />
    );
}

// ─── Pulsing uncertainty ring ──────────────────────────────────────────────────
function UncertaintyRing() {
    const pulse = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 0.25, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1,    duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();
    }, []);
    return (
        <View style={styles.ringWrapper} pointerEvents="none">
            <View style={styles.ringOuter}>
                <Animated.View style={[styles.ringDashed, { opacity: pulse }]} />
            </View>
            <View style={styles.ringLabel}>
                <Text style={styles.ringLabelText}>UNCERTAINTY_RADIUS: 140M</Text>
            </View>
        </View>
    );
}

// ─── GPS Marker ────────────────────────────────────────────────────────────────
function GPSMarker() {
    const glow = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glow, { toValue: 1.6, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(glow, { toValue: 1,   duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();
    }, []);
    return (
        <View style={styles.markerWrapper} pointerEvents="none">
            {/* Glow blob */}
            <Animated.View style={[styles.markerGlow, { transform: [{ scale: glow }] }]} />
            {/* Icon square */}
            <View style={styles.markerIcon}>
                <Text style={styles.markerIconText}>▲</Text>
            </View>
            {/* Telemetry tag */}
            <View style={styles.telemetryTag}>
                <View style={styles.tagRow}>
                    <Text style={styles.tagLabel}>Current Node</Text>
                    <Text style={styles.tagCoord}>35.6895° N</Text>
                </View>
                <View style={styles.tagRow}>
                    <Text style={styles.tagName}>USER_01_DELTA</Text>
                    <Text style={styles.tagCoord}>139.6917° E</Text>
                </View>
            </View>
        </View>
    );
}

// ─── Left Data Column ─────────────────────────────────────────────────────────
function LeftColumn() {
    return (
        <View style={styles.leftColumn} pointerEvents="none">
            {/* Environment */}
            <View style={[styles.dataCard, { borderLeftColor: C.secondary }]}>
                <Text style={[styles.dataCardLabel, { color: C.secondary }]}>Environment</Text>
                <View style={styles.dataCardRow}>
                    <Text style={styles.dataCardValue}>14.2°C</Text>
                    <Text style={styles.dataCardIcon}>🌡</Text>
                </View>
                <Text style={styles.dataCardSub}>Humidity: 84%</Text>
            </View>
            {/* Heading */}
            <View style={[styles.dataCard, { borderLeftColor: C.primary }]}>
                <Text style={[styles.dataCardLabel, { color: C.primary }]}>Heading</Text>
                <View style={styles.dataCardRow}>
                    <Text style={styles.dataCardValue}>284° WNW</Text>
                    <Text style={styles.dataCardIcon}>🧭</Text>
                </View>
            </View>
        </View>
    );
}

// ─── Right Control Cluster ─────────────────────────────────────────────────────
function RightCluster() {
    const [zoom, setZoom] = useState(1);
    return (
        <View style={styles.rightCluster}>
            <CtrlBtn icon="⊞" />
            <CtrlBtn icon="+" onPress={() => setZoom(z => Math.min(z + 0.25, 3))} />
            <CtrlBtn icon="−" onPress={() => setZoom(z => Math.max(z - 0.25, 0.5))} />
            <View style={{ height: 16 }} />
            <CtrlBtn icon="◎" accent />
        </View>
    );
}

function CtrlBtn({ icon, onPress, accent }) {
    const scale = useRef(new Animated.Value(1)).current;
    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1,    duration: 120, useNativeDriver: true }),
        ]).start();
        onPress?.();
    };
    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={1}>
            <Animated.View style={[
                styles.ctrlBtn,
                accent && styles.ctrlBtnAccent,
                { transform: [{ scale }] },
            ]}>
                <Text style={[styles.ctrlBtnText, accent && { color: C.primary }]}>{icon}</Text>
            </Animated.View>
        </TouchableOpacity>
    );
}

// ─── Bottom Bento Tray ─────────────────────────────────────────────────────────
function BottomTray() {
    const sosScale = useRef(new Animated.Value(1)).current;
    const handleSOS = () => {
        Animated.sequence([
            Animated.timing(sosScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
            Animated.timing(sosScale, { toValue: 1,   duration: 150, useNativeDriver: true }),
        ]).start();
    };
    return (
        <View style={styles.tray}>
            {/* Telemetry strip */}
            <View style={styles.trayTelemetry}>
                <View style={styles.trayCell}>
                    <Text style={styles.trayCellLabel}>Altitude</Text>
                    <View style={styles.trayCellValueRow}>
                        <Text style={styles.trayCellValue}>1,204</Text>
                        <Text style={styles.trayCellUnit}> m</Text>
                    </View>
                </View>
                <View style={[styles.trayCell, styles.trayCellBorder]}>
                    <Text style={styles.trayCellLabel}>Velocity</Text>
                    <View style={styles.trayCellValueRow}>
                        <Text style={styles.trayCellValue}>0.0</Text>
                        <Text style={styles.trayCellUnit}> km/h</Text>
                    </View>
                </View>
                <View style={[styles.trayCell, styles.trayCellBorder]}>
                    <Text style={styles.trayCellLabel}>Battery</Text>
                    <View style={styles.trayCellValueRow}>
                        <Text style={[styles.trayCellValue, { color: C.tertiary }]}>94%</Text>
                    </View>
                </View>
            </View>

            {/* SOS Button */}
            <TouchableOpacity onPress={handleSOS} activeOpacity={0.85}>
                <Animated.View style={[styles.sosBtn, { transform: [{ scale: sosScale }] }]}>
                    <Text style={styles.sosBtnIcon}>✱</Text>
                    <Text style={styles.sosBtnText}>SEND SOS</Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}

// ─── Status Bar ───────────────────────────────────────────────────────────────
function StatusStrip() {
    const dot = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(dot, { toValue: 0.2, duration: 900, useNativeDriver: true }),
                Animated.timing(dot, { toValue: 1,   duration: 900, useNativeDriver: true }),
            ])
        ).start();
    }, []);
    return (
        <View style={styles.statusStrip}>
            <View style={styles.statusLeft}>
                <Animated.View style={[styles.statusDot, { opacity: dot }]} />
                <Text style={styles.statusText}>Connection: <Text style={styles.statusVal}>Online</Text></Text>
                <View style={styles.statusDivider} />
                <Text style={styles.statusText}>⊙ GPS: <Text style={styles.statusVal}>Live</Text></Text>
            </View>
            <Text style={styles.statusText}>Queue: <Text style={styles.statusVal}>0</Text></Text>
        </View>
    );
}

// ─── Dot Grid Background ──────────────────────────────────────────────────────
function DotGrid() {
    const cols = Math.ceil(W / 40) + 1;
    const rows = Math.ceil(H / 40) + 1;
    const dots = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            dots.push(
                <View
                    key={`${r}-${c}`}
                    style={{
                        position: "absolute",
                        width: 1.5,
                        height: 1.5,
                        borderRadius: 1,
                        backgroundColor: "#2a2a2c",
                        left: c * 40,
                        top: r * 40,
                    }}
                />
            );
        }
    }
    return <View style={StyleSheet.absoluteFill} pointerEvents="none">{dots}</View>;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function MapScreen() {
    return (
        <View style={styles.root}>
            {/* Telemetry status strip */}
            <StatusStrip />

            {/* Map canvas */}
            <View style={styles.mapCanvas}>
                {/* Dark base */}
                <View style={styles.mapBase} />

                {/* Dot grid */}
                <DotGrid />

                {/* Scan line */}
                <ScanLine />

                {/* Uncertainty ring */}
                <UncertaintyRing />

                {/* GPS marker — centred */}
                <GPSMarker />

                {/* Left data column */}
                <LeftColumn />

                {/* Right controls */}
                <RightCluster />

                {/* Bottom bento tray */}
                <BottomTray />
            </View>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: C.background,
    },

    // ── Status Strip ──────────────────────────────────────────────────────────
    statusStrip: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: C.surfaceContainerLow,
        borderBottomWidth: 1,
        borderBottomColor: C.surfaceContainerHigh,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    statusLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: C.tertiary,
    },
    statusText: {
        color: C.onSurfaceVariant,
        fontSize: 9,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1.5,
    },
    statusVal: {
        color: C.onBackground,
    },
    statusDivider: {
        width: 1,
        height: 12,
        backgroundColor: C.surfaceContainerHighest,
    },

    // ── Map Canvas ────────────────────────────────────────────────────────────
    mapCanvas: {
        flex: 1,
        position: "relative",
        overflow: "hidden",
        backgroundColor: C.surfaceContainerLowest,
    },
    mapBase: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#0e0e10",
    },

    // ── Scan Line ─────────────────────────────────────────────────────────────
    scanLine: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: C.primary,
        opacity: 0.18,
        zIndex: 1,
    },

    // ── Uncertainty Ring ──────────────────────────────────────────────────────
    ringWrapper: {
        position: "absolute",
        top: "28%",
        left: "22%",
        width: 260,
        height: 260,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
    },
    ringOuter: {
        width: 260,
        height: 260,
        borderWidth: 1,
        borderColor: "rgba(255,180,170,0.2)",
        backgroundColor: "rgba(255,180,170,0.04)",
        alignItems: "center",
        justifyContent: "center",
    },
    ringDashed: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderWidth: 1,
        borderColor: "rgba(255,180,170,0.3)",
        borderStyle: "dashed",
    },
    ringLabel: {
        position: "absolute",
        top: -14,
        backgroundColor: C.surfaceContainerHigh,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    ringLabelText: {
        color: C.primary,
        fontSize: 7,
        fontWeight: "800",
        letterSpacing: 2,
        textTransform: "uppercase",
    },

    // ── GPS Marker ────────────────────────────────────────────────────────────
    markerWrapper: {
        position: "absolute",
        top: "50%",
        left: "50%",
        alignItems: "flex-start",
        zIndex: 20,
        transform: [{ translateX: -12 }, { translateY: -12 }],
    },
    markerGlow: {
        position: "absolute",
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(255,180,170,0.35)",
        top: -12,
        left: -12,
        // blur-like effect via large border radius + opacity
    },
    markerIcon: {
        width: 26,
        height: 26,
        backgroundColor: C.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    markerIconText: {
        color: C.onPrimary,
        fontSize: 13,
        fontWeight: "900",
    },
    telemetryTag: {
        position: "absolute",
        left: 34,
        top: 0,
        backgroundColor: C.surfaceContainerLow,
        borderLeftWidth: 2,
        borderLeftColor: C.primary,
        paddingHorizontal: 8,
        paddingVertical: 6,
        width: 170,
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    tagRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
    },
    tagLabel: {
        color: C.primary,
        fontSize: 8,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    tagName: {
        color: C.onBackground,
        fontSize: 13,
        fontWeight: "800",
        letterSpacing: -0.5,
    },
    tagCoord: {
        color: C.onSurfaceVariant,
        fontSize: 8,
        fontFamily: "monospace",
    },

    // ── Left Data Column ──────────────────────────────────────────────────────
    leftColumn: {
        position: "absolute",
        left: 16,
        top: 16,
        zIndex: 30,
        gap: 8,
        flexDirection: "column",
    },
    dataCard: {
        backgroundColor: "rgba(27,27,29,0.88)",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderLeftWidth: 2,
        width: 148,
    },
    dataCardLabel: {
        fontSize: 7,
        fontWeight: "900",
        textTransform: "uppercase",
        letterSpacing: 2.5,
        marginBottom: 4,
    },
    dataCardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dataCardValue: {
        color: C.onBackground,
        fontSize: 20,
        fontWeight: "800",
        letterSpacing: -0.5,
    },
    dataCardIcon: {
        fontSize: 14,
        opacity: 0.9,
    },
    dataCardSub: {
        color: C.onSurfaceVariant,
        fontSize: 9,
        marginTop: 2,
    },

    // ── Right Control Cluster ─────────────────────────────────────────────────
    rightCluster: {
        position: "absolute",
        right: 16,
        top: 16,
        zIndex: 30,
        flexDirection: "column",
        gap: 4,
    },
    ctrlBtn: {
        width: 46,
        height: 46,
        backgroundColor: C.surfaceContainerHigh,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    ctrlBtnAccent: {
        borderBottomColor: C.primary,
    },
    ctrlBtnText: {
        color: C.onBackground,
        fontSize: 18,
        fontWeight: "600",
    },

    // ── Bottom Bento Tray ─────────────────────────────────────────────────────
    tray: {
        position: "absolute",
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 30,
        flexDirection: "row",
        alignItems: "stretch",
        gap: 8,
    },
    trayTelemetry: {
        flex: 1,
        backgroundColor: "rgba(27,27,29,0.92)",
        borderTopWidth: 3,
        borderTopColor: C.primary,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
    },
    trayCell: {
        flex: 1,
        gap: 2,
    },
    trayCellBorder: {
        borderLeftWidth: 1,
        borderLeftColor: C.surfaceContainerHighest,
        paddingLeft: 16,
    },
    trayCellLabel: {
        color: C.onSurfaceVariant,
        fontSize: 8,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 2,
    },
    trayCellValueRow: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    trayCellValue: {
        color: C.onBackground,
        fontSize: 24,
        fontWeight: "800",
        letterSpacing: -1,
    },
    trayCellUnit: {
        color: C.onSurfaceVariant,
        fontSize: 11,
        fontWeight: "400",
    },

    // ── SOS Button ────────────────────────────────────────────────────────────
    sosBtn: {
        width: 86,
        aspectRatio: 1,
        backgroundColor: C.primary,
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        shadowColor: C.primary,
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 10,
    },
    sosBtnIcon: {
        color: C.onPrimary,
        fontSize: 34,
        fontWeight: "900",
        lineHeight: 36,
    },
    sosBtnText: {
        color: C.onPrimary,
        fontSize: 8,
        fontWeight: "900",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
});