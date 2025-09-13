import Iconify from "@/components/Iconify";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Zocial from "@expo/vector-icons/Zocial";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { User } from "lucide-react-native";
import React from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const navigation = useNavigation();

  const menuItems = [
    { label: "Complete profile", icon: "user" , onPress: () => router.push("/settings/editProfile")},
    { label: "Your Bookings", icon: "calendar", onPress: () => router.push("/booking/booking") },
    { label: "Refunds/Cancellation policy", icon: "exclamationcircleo" },
    { label: "Corporate event booking", icon: "team" },
    { label: "Add/Update your Venue", icon: "pluscircleo" },
    { label: "Invite & Earn", icon: "gift" },
    { label: "Help & Support", icon: "customerservice" },
    { label: "About Ofside", icon: "infocirlceo" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/background.png")}
        resizeMode="cover"
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons onPress={()=> navigation.goBack()} name="chevron-back-circle-outline" size={22} color="black" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View className="flex-row items-center px-10">
          <View className="mr-4">
            <View  className="w-24 h-24 rounded-full items-center justify-center" style={{ backgroundColor: theme.colors.accent }}>
              <FontAwesome name="user" size={65} color="white" />
            </View>
          </View>
          <View>
            <Text className="text-3xl font-bold text-gray-900">
              Hi Swarit!
            </Text>
          </View>
        </View>

        {/* Menu List */}
        <ScrollView className="flex-1 mt-6 px-6">
          <View className="space-y-3">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center p-3 bg-white rounded-xl shadow-sm border border-black justify-center mb-2"
                activeOpacity={0.7}
                onPress={item.onPress}
              >
                <Text className="text-base font-bold">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity className="mt-2">
              <Text className="text-center font-bold text-xl">Sign out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Social Icons */}
        <View className="flex-row absoloute bottom-10 w-full justify-center">
          <TouchableOpacity className="w-14 h-14 border border-black rounded-lg items-center justify-center mr-8">
            <Zocial name="email" size={26} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="w-14 h-14 border border-black rounded-lg items-center justify-center mr-8">
            <Iconify icon="skill-icons:instagram" size={35} type="svg" />
          </TouchableOpacity>
          <TouchableOpacity className="w-14 h-14 border border-black rounded-lg items-center justify-center">
            <Iconify icon="flowbite:facebook-solid" size={35} color="blue" type="svg" />
          </TouchableOpacity>
        </View>

      </ImageBackground>
    </SafeAreaView>
  );
}
