import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";

import MapScreen      from "../screens/MapScreen";
import AlertsScreen   from "../screens/AlertsScreen";
import SOSScreen      from "../screens/SOSScreen";
import ContactsScreen from "../screens/ContactsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

// ─── Color tokens (must stay in sync with screens) ───────────────────────────
const C = {
    background:            "#131315",
    surfaceContainerHigh:  "#2a2a2c",
    surfaceContainerLow:   "#1b1b1d",
    primary:               "#ffb4aa",
    inverseRed:            "#c0000a",
    inactive:              "#39393b",
    white:                 "#ffffff",
};

// ─── Tab icon map (text glyphs, no dependency on icon libs) ──────────────────
const TAB_CONFIG = [
    { name: "Map",      label: "MAP",      icon: "◉" },
    { name: "Alerts",   label: "ALERTS",   icon: "⚠" },
    { name: "SOS",      label: "SOS",      icon: "✱" },
    { name: "Contacts", label: "CONTACTS", icon: "⊕" },
    { name: "Settings", label: "SETTINGS", icon: "⚙" },
];

const SCREENS = {
    Map:      MapScreen,
    Alerts:   AlertsScreen,
    SOS:      SOSScreen,
    Contacts: ContactsScreen,
    Settings: SettingsScreen,
};

// ─── Custom tab bar button ─────────────────────────────────────────────────────
function TabIcon({ label, icon, focused }) {
    return (
        <View style={[styles.tabCell, focused && styles.tabCellActive]}>
            <Text style={[styles.tabIcon, focused ? styles.tabIconActive : styles.tabIconInactive]}>
                {icon}
            </Text>
            <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : styles.tabLabelInactive]}>
                {label}
            </Text>
        </View>
    );
}

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
                tabBarIcon: ({ focused }) => {
                    const cfg = TAB_CONFIG.find((t) => t.name === route.name);
                    return <TabIcon label={cfg.label} icon={cfg.icon} focused={focused} />;
                },
            })}
        >
            {TAB_CONFIG.map(({ name }) => (
                <Tab.Screen
                    key={name}
                    name={name}
                    component={SCREENS[name]}
                />
            ))}
        </Tab.Navigator>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: C.background,
        borderTopWidth: 2,
        borderTopColor: C.surfaceContainerHigh,
        height: 62,
        paddingHorizontal: 0,
        paddingBottom: 0,
        paddingTop: 0,
        elevation: 0,
    },

    tabCell: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 10,
        gap: 3,
    },
    tabCellActive: {
        backgroundColor: C.inverseRed,
    },

    tabIcon: {
        fontSize: 18,
        lineHeight: 22,
    },
    tabIconActive: {
        color: C.white,
    },
    tabIconInactive: {
        color: C.inactive,
    },

    tabLabel: {
        fontSize: 8,
        fontWeight: "800",
        letterSpacing: 0.5,
        textTransform: "uppercase",
    },
    tabLabelActive: {
        color: C.white,
    },
    tabLabelInactive: {
        color: C.inactive,
    },
});