import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, Image } from "react-native";
import { useTheme } from '@/hooks/useTheme';
import { Entypo } from "@expo/vector-icons";
import { ArrowLeft } from "lucide-react-native";
import { router, useNavigation } from "expo-router";

export default function SelectTeamsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      resizeMode="contain"
      className="flex-1 bg-white"
    >
        <TouchableOpacity onPress={()=> navigation.goBack()} className="mx-2 my-14">
            <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 mt-20 items-center">
            {/* Team A */}
            <TouchableOpacity className="flex-row items-center mb-16" onPress={() => router.push('/scoring/teamsScreen')}>
            <View className="w-16 h-16 rounded-full items-center justify-center" style={{ backgroundColor: theme.colors.primary }}>
                <Entypo name="plus" size={36} color="black" />
            </View>
            <Text className="ml-4 text-4xl font-bold text-black">
                Select Team A
            </Text>
            </TouchableOpacity>

            {/* VS Logo */}
            <Image
                source={require("../../assets/images/vsIcon.png")}
                style={{width:150, height:150}}
                resizeMode="contain"
            />

            {/* Team B */}
            <TouchableOpacity className="flex-row items-center mt-16">
            <View className="w-16 h-16 rounded-full items-center justify-center" style={{ backgroundColor: theme.colors.primary }}>
                <Entypo name="plus" size={36} color="black" />
            </View>
            <Text className="ml-4 text-4xl font-bold text-black">
                Select Team B
            </Text>
            </TouchableOpacity>
        </View>
    </ImageBackground>
  );
}
