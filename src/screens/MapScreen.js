import React, { useRef, useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
} from "react-native";

const ZOOM_MIN  = 0.5;
const ZOOM_MAX  = 3.0;
const ZOOM_STEP = 0.25;
const ZOOM_INIT = 1.0;

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
    const [showTag, setShowTag] = useState(true);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glow, { toValue: 1.6, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(glow, { toValue: 1,   duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.markerWrapper}>
            {/* Glow blob */}
            <Animated.View style={[styles.markerGlow, { transform: [{ scale: glow }] }]} pointerEvents="none" />
            
            {/* Icon square - Interactive */}
            <TouchableOpacity activeOpacity={0.8} onPress={() => setShowTag(!showTag)}>
                <View style={styles.markerIcon}>
                    <Text style={styles.markerIconText}>▲</Text>
                </View>
            </TouchableOpacity>

            {/* Telemetry tag - Toggleable */}
            {showTag && (
                <View style={styles.telemetryTag} pointerEvents="none">
                    <View style={styles.tagRow}>
                        <Text style={styles.tagLabel}>Current Node</Text>
                        <Text style={styles.tagCoord}>35.6895° N</Text>
                    </View>
                    <View style={styles.tagRow}>
                        <Text style={styles.tagName}>USER_01_DELTA</Text>
                        <Text style={styles.tagCoord}>139.6917° E</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

// ─── Left Data Column ─────────────────────────────────────────────────────────
function LeftColumn({ onShowHud }) {
    return (
        <View style={styles.leftColumn}>
            {/* Environment */}
            <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={() => onShowHud("AMBIENT SENSORS: NOMINAL")}
                style={[styles.dataCard, { borderLeftColor: C.secondary }]}
            >
                <Text style={[styles.dataCardLabel, { color: C.secondary }]}>Environment</Text>
                <View style={styles.dataCardRow}>
                    <Text style={styles.dataCardValue}>14.2°C</Text>
                    <Text style={styles.dataCardIcon}>🌡</Text>
                </View>
                <Text style={styles.dataCardSub}>Humidity: 84%</Text>
            </TouchableOpacity>

            {/* Heading */}
            <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={() => onShowHud("MAGNETIC HEADING: 284°")}
                style={[styles.dataCard, { borderLeftColor: C.primary }]}
            >
                <Text style={[styles.dataCardLabel, { color: C.primary }]}>Heading</Text>
                <View style={styles.dataCardRow}>
                    <Text style={styles.dataCardValue}>284° WNW</Text>
                    <Text style={styles.dataCardIcon}>🧭</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

// ─── Right Control Cluster ─────────────────────────────────────────────────────
function RightCluster({ onZoom, onRecenter }) {
    return (
        <View style={styles.rightCluster}>
            <CtrlBtn icon="⊞" label="LAYERS" />
            <CtrlBtn icon="+" label="ZOOM IN"  onPress={() => onZoom(+ZOOM_STEP)} />
            <CtrlBtn icon="−" label="ZOOM OUT" onPress={() => onZoom(-ZOOM_STEP)} />
            <View style={{ height: 16 }} />
            <CtrlBtn icon="◎" label="MY LOCATION" accent onPress={onRecenter} />
        </View>
    );
}

function CtrlBtn({ icon, label, onPress, accent }) {
    const scale      = useRef(new Animated.Value(1)).current;
    const tipOpacity = useRef(new Animated.Value(0)).current;
    const tipTransX  = useRef(new Animated.Value(6)).current;
    const tipTimer   = useRef(null);

    const handlePress = () => {
        // Button spring
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.82, duration: 70,  useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1,    duration: 130, useNativeDriver: true }),
        ]).start();

        // Tooltip slide-in
        if (tipTimer.current) clearTimeout(tipTimer.current);
        tipTransX.setValue(10);
        Animated.parallel([
            Animated.timing(tipOpacity, { toValue: 1, duration: 160, useNativeDriver: true }),
            Animated.timing(tipTransX,  { toValue: 0, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]).start();

        // Auto-hide after 1.2 s
        tipTimer.current = setTimeout(() => {
            Animated.timing(tipOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
        }, 1200);

        onPress?.();
    };

    return (
        <View style={styles.ctrlBtnWrapper}>
            {/* Tooltip label (floats to the left) */}
            <Animated.View
                style={[
                    styles.tooltip,
                    { opacity: tipOpacity, transform: [{ translateX: tipTransX }] },
                ]}
                pointerEvents="none"
            >
                <Text style={styles.tooltipText}>{label}</Text>
            </Animated.View>

            <TouchableOpacity onPress={handlePress} activeOpacity={1}>
                <Animated.View style={[
                    styles.ctrlBtn,
                    accent && styles.ctrlBtnAccent,
                    { transform: [{ scale }] },
                ]}>
                    <Text style={[styles.ctrlBtnText, accent && { color: C.primary }]}>{icon}</Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}

// ─── Bottom Bento Tray ─────────────────────────────────────────────────────────
function BottomTray({ onShowHud }) {
    const sosScale = useRef(new Animated.Value(1)).current;
    const handleSOS = () => {
        Animated.sequence([
            Animated.timing(sosScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
            Animated.timing(sosScale, { toValue: 1,   duration: 150, useNativeDriver: true }),
        ]).start();
        onShowHud("INITIATING EMERGENCY SOS...", 2000);
    };
    return (
        <View style={styles.tray}>
            {/* Telemetry strip */}
            <TouchableOpacity 
                activeOpacity={0.9} 
                onPress={() => onShowHud("SYSTEM TELEMETRY: SYNCED")}
                style={styles.trayTelemetry}
            >
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
            </TouchableOpacity>

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

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Text style={styles.headerIcon}>📶</Text>
                <Text style={styles.headerTitle}>RESQWAVE</Text>
            </View>
            <View style={styles.headerRight}>
                <Text style={styles.headerIcon}>📡</Text>
            </View>
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
                <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.statusText}>Connection: <Text style={styles.statusVal}>Online</Text></Text>
                </TouchableOpacity>
                <View style={styles.statusDivider} />
                <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.statusText}>⊙ GPS: <Text style={styles.statusVal}>Live</Text></Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.statusText}>Queue: <Text style={styles.statusVal}>0</Text></Text>
            </TouchableOpacity>
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
    // ── Zoom state ────────────────────────────────────────────────────────────
    const zoomAnim   = useRef(new Animated.Value(ZOOM_INIT)).current;
    const zoomRef    = useRef(ZOOM_INIT);
    const [zoomLevel, setZoomLevel] = useState(ZOOM_INIT);

    // HUD message system
    const hudOpacity = useRef(new Animated.Value(0)).current;
    const hudTimeout = useRef(null);
    const [hudMsg, setHudMsg] = useState("");

    const showHud = useCallback((msg, duration = 900) => {
        if (hudTimeout.current) clearTimeout(hudTimeout.current);
        setHudMsg(msg);
        Animated.timing(hudOpacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
        hudTimeout.current = setTimeout(() => {
            Animated.timing(hudOpacity, { toValue: 0, duration: 400, useNativeDriver: true }).start();
        }, duration);
    }, [hudOpacity]);

    const handleZoom = useCallback((delta) => {
        const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, parseFloat((zoomRef.current + delta).toFixed(2))));
        if (next === zoomRef.current) return;
        zoomRef.current = next;
        setZoomLevel(next);
        Animated.timing(zoomAnim, {
            toValue: next,
            duration: 220,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
        showHud(`${next.toFixed(2)}× ZOOM`);
    }, [zoomAnim, showHud]);

    const handleRecenter = useCallback(() => {
        zoomRef.current = ZOOM_INIT;
        setZoomLevel(ZOOM_INIT);
        Animated.timing(zoomAnim, {
            toValue: ZOOM_INIT,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
        showHud("POSITION RECENTERED");
    }, [zoomAnim, showHud]);

    return (
        <View style={styles.root}>
            {/* Top Bar Branding */}
            <Header />

            {/* Telemetry status strip */}
            <StatusStrip />

            {/* Map canvas */}
            <View style={styles.mapCanvas}>
                {/* Dark base */}
                <View style={styles.mapBase} />

                {/* ── Zoomable layer (scale transform applied here) ── */}
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        { transform: [{ scale: zoomAnim }] },
                    ]}
                    pointerEvents="none"
                >
                    <DotGrid />
                    <ScanLine />
                    <UncertaintyRing />
                    <GPSMarker />
                </Animated.View>

                {/* ── Fixed overlays (not scaled) ── */}
                <LeftColumn onShowHud={showHud} />
                <RightCluster
                    onZoom={handleZoom}
                    onRecenter={handleRecenter}
                />
                <BottomTray onShowHud={showHud} />

                {/* ── HUD badge ── */}
                <Animated.View style={[styles.zoomHud, { opacity: hudOpacity }]} pointerEvents="none">
                    <Text style={styles.zoomHudText}>{hudMsg}</Text>
                </Animated.View>
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

    // ── Header ────────────────────────────────────────────────────────────────
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: C.background,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: C.surfaceContainerHigh,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    headerIcon: {
        color: C.primary,
        fontSize: 18,
    },
    headerTitle: {
        color: C.primary,
        fontSize: 20,
        fontWeight: "900",
        letterSpacing: 2,
        textTransform: "uppercase",
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
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
    ctrlBtnWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    tooltip: {
        backgroundColor: "rgba(27,27,29,0.95)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
        borderRightWidth: 2,
        borderRightColor: C.primary,
    },
    tooltipText: {
        color: C.onBackground,
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: 1.2,
        textTransform: "uppercase",
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

    // ── Zoom HUD ──────────────────────────────────────────────────────────────
    zoomHud: {
        position: "absolute",
        top: 16,
        alignSelf: "center",
        left: "50%",
        transform: [{ translateX: -100 }],
        width: 200,
        backgroundColor: "rgba(27,27,29,0.92)",
        borderWidth: 1,
        borderColor: C.primary,
        paddingHorizontal: 10,
        paddingVertical: 6,
        zIndex: 50,
        alignItems: "center",
    },
    zoomHudText: {
        color: C.primary,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 1.5,
        textTransform: "uppercase",
        textAlign: "center",
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