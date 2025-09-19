// App.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from '@/hooks/useTheme';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function CreateTornamnent() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, isGuest } = useSelector((state: RootState) => state.auth);

  type MenuButtonProps = {
    title: string;
    comingSoon?: boolean;
    onPress?: () => void;
    subtitle?: string
  };

  const MenuButton = ({title, comingSoon, onPress, subtitle} : MenuButtonProps) => (
    <LinearGradient
        colors={["#FFF201", "#EAEAEA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="flex-1 mx-1 rounded-xl"
    >
        <TouchableOpacity
            className="flex-1 p-6 items-center justify-center border rounded-lg"
            onPress={onPress}
        >
            {/* Title at center */}
            <Text className="text-lg font-extrabold text-black text-center">
            {title}
            </Text>

            {/* Coming Soon Badge */}
            {comingSoon && (
            <View className="absolute right-4 top-8 px-2 py-0.5 rounded">
                <Text className="text-[8px] font-bold -rotate-45 text-red-500 uppercase">
                Coming Soon
                </Text>
            </View>
            )}

            {/* Subtitle at bottom with lines */}
            {subtitle && (
            <View className="absolute bottom-4 left-0 right-0 flex-row items-center justify-center px-4">
                <View className="flex-1 border-t" />
                <Text className="mx-2 text-xs text-gray-700">
                {subtitle}
                </Text>
                <View className="flex-1 border-t" />
            </View>
            )}
        </TouchableOpacity>
    </LinearGradient>
  );
  const handleRoute = () => {
    router.push({
        pathname: "/xplore/chooseSportScreen",
        params: { isTournament: "true"},
    })

  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/background.png")} // Put your image in assets/images
        resizeMode="contain"
        className="flex-1"
      >
        {/* Profile Section */}
        <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2" >
          <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
        </View>
        <View className="px-5 py-10">
            <Text className="text-2xl font-extrabold text-gray-900 mb-1">Start a new Match</Text>
        </View>
        <ScrollView>
          <View className="p-2">
            {/* Buttons */}
            <View className="flex-row mt-4 w-full h-32">
              <MenuButton title="New individual match" onPress={()=>handleRoute()} />
              <MenuButton title="ZYS Tournament" subtitle="Football"/>
            </View>
        </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
