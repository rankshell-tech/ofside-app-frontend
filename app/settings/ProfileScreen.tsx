import Iconify from "@/components/Iconify";
import { useTheme } from "@/hooks/useTheme";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Zocial from "@expo/vector-icons/Zocial";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { User } from "lucide-react-native";
import React from "react";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AppDispatch } from '@/store';
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

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  console.log('user:', user);

  const menuItems = [
    { label: "Complete profile", icon: "user" , onPress: () => router.push("/settings/editProfile")},
    { label: "Your Bookings", icon: "calendar", onPress: () => router.push("/booking/booking") },
    { label: "Refunds/Cancellation policy", icon: "exclamationcircleo" },
    { label: "Corporate event booking", icon: "team" },
    { label: "Add/Update your Venue", icon: "pluscircleo", onPress: () => router.push("/venue/addVenue") },
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
        <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2" >
          <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
        </View>

        {/* Profile Section */}
        <LinearGradient
          colors={["#004aad", "#000428"]} // blue gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-row items-center border rounded-xl overflow-hidden p-2 m-4"
        >
          {/* Avatar */}
          <View  className="w-20 h-20 rounded-full items-center justify-center bg-white mr-2">
            <FontAwesome name="user" size={50} color="#004aad" />
          </View>

          {/* Text + Icon */}
          <View>
            <View className="flex-row items-center">
              <Text className="text-white font-bold text-2xl mr-1">
                Hi {user?.name}!
              </Text>
              <View  className="w-6 h-6 rounded-full items-center justify-center" style={{ backgroundColor: theme.colors.primary }}>
                <FontAwesome5 name="crown" size={12} color="black" />
              </View>

            </View>
            <Text className="text-[#fff201] text-sm">Elite/Club Member</Text>
          </View>
        </LinearGradient>

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
            <TouchableOpacity className="mt-2" onPress={() => {router.replace("/login/loginScreen")}}>
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
