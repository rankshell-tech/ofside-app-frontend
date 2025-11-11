import Iconify from "@/components/Iconify";
import { useTheme } from "@/hooks/useTheme";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Zocial from "@expo/vector-icons/Zocial";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useRouter } from "expo-router";
import { User } from "lucide-react-native";
import React from "react";
// Redux: dispatch typed with our store and select user data from auth slice
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
  const navigation = useNavigation();

  // Typed dispatcher for any profile-related actions; select current user info
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  console.log('user:', user);

  const menuItems = [
    { label: "Update profile", icon: "user" ,},
    { label: "Update existing venue", icon: "calendar",},
    { label: "Update Operational timing & day", icon: "team" },
    { label: "Update Images", icon: "pluscircleo"},
    { label: "Venue Amenities", icon: "gift" },
    { label: "Refunds/Cancellation policy", icon: "exclamationcircleo" },
    { label: "Help & Support", icon: "customerservice" },
    { label: "About Ofside", icon: "infocirlceo" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">

    <LinearGradient
        colors={["#FFF201", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1"
    >
        {/* Header */}
        <View className="w-8 h-8 rounded-full border-4 mx-2 mt-2" >
          <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
        </View>

        {/* Profile Section */}
          <View className="flex-row mx-10">
            <View  className="w-20 h-20 rounded-full items-center justify-center bg-black mr-2">
                <FontAwesome name="user" size={50} color="#FFF201" />
            </View>
            <View className="flex-row items-center">
                <Text className="font-bold text-2xl mr-1">
                Hi {user?.name}!
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
              >
                <Text className="text-base font-bold">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity className="mt-2" onPress={() => {router.replace("/login/loginScreen")}}>
              <Text className="text-center font-bold text-xl">Sign outss</Text>
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
      </LinearGradient>
    </SafeAreaView>
  );
}
