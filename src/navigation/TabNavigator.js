import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MapScreen from "../screens/MapScreen";
import AlertsScreen from "../screens/AlertsScreen";
import SOSScreen from "../screens/SOSScreen";
import ContactsScreen from "../screens/ContactsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,

                // Tab bar styling
                tabBarStyle: {
                    backgroundColor: "#1a1a1c",
                    borderTopWidth: 0,
                    height: 60,
                    paddingBottom: 5,
                },

                tabBarActiveTintColor: "#ff6b6b",
                tabBarInactiveTintColor: "#888",

                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                },
            }}
        >
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Alerts" component={AlertsScreen} />
            <Tab.Screen name="SOS" component={SOSScreen} />
            <Tab.Screen name="Contacts" component={ContactsScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}