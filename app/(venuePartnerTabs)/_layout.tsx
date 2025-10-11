import { Tabs } from "expo-router";
import { Ionicons, Foundation, MaterialIcons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export default function VenuePartnerTabs() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.accent,
          tabBarLabelStyle: {
            fontSize: 14,
            fontFamily: 'Inter-Medium',
          },
          tabBarIconStyle: { marginBottom: -4 },
        }}
    >
      <Tabs.Screen
        name="ManageSlots"
        options={{
        title: "Manage Slots",
        tabBarIcon: ({ size, color }) => (
          <View style={{ width: size, height: size }}>
              {/* Base calendar icon */}
              <FontAwesome name="calendar" size={24} color={color} />

              {/* Overlapping timer icon */}
              <Ionicons
                name="time"
                size={size * 0.6}
                color={color}
                style={{
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                }}
              />
          </View>
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <Foundation name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ size, color }) => (
          <View style={{ width: size, height: size }}>
              {/* Base calendar icon */}
               <Ionicons name="call" size={size} color={color}/>

              {/* Overlapping timer icon */}
              <MaterialCommunityIcons
                name="clock-time-two-outline"
                size={size}
                color={color}
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: -6,
                }}
              />
          </View>
          ),
        }}
      />
    </Tabs>
  );
}
