import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Zocial from "@expo/vector-icons/Zocial";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
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

export default function MatchSettings() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { sport, format } = useLocalSearchParams<{ sport: string; format: string }>();

  const menuItems = [
    { label: "Manage tournament rules", icon: "user" , onPress: () => router.push({
                                                        pathname: "/tournament/tournamentRules",
                                                        params: { sport, format },})},
    { label: "Edit/Update/Delete Tornament", icon: "calendar", },
    { label: "Tournament advance settings", icon: "exclamationcircleo" },
    { label: "Start a match", icon: "team" },
    { label: "Add Teams", icon: "pluscircleo" },
    { label: "Schedule matches", icon: "gift" },
    { label: "Add/Remove scorer", icon: "gift" },
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
        <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2" >
          <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
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
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
