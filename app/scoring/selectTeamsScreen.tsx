import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, Image } from "react-native";
import { useTheme } from '@/hooks/useTheme';
import { Entypo } from "@expo/vector-icons";
import { ArrowLeft } from "lucide-react-native";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectTeamsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  return (
    <SafeAreaView className="flex-1 bg-white">
        <ImageBackground
            source={require("../../assets/images/background.png")}
            resizeMode="contain"
            className="flex-1 bg-white"
        >
            {/* 🔙 Back button fixed at top-left */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute top-4 left-4 p-2"
            >
                <ArrowLeft size={24} color="black" />
            </TouchableOpacity>

            {/* ✅ Centered content */}
            <View className="flex-1 items-center justify-center">
                {/* Team A */}
                <TouchableOpacity
                    className="flex-row items-center mb-8"
                    onPress={() => router.push("/scoring/teamsScreen")}
                >
                <View
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: theme.colors.primary }}
                >
                    <Entypo name="plus" size={36} color="black" />
                </View>
                <Text className="ml-4 text-4xl font-bold text-black">
                    Select Team A
                </Text>
                </TouchableOpacity>

                {/* VS Logo */}
                <Image
                source={require("../../assets/images/vsIcon.png")}
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
                />

                {/* Team B */}
                <TouchableOpacity className="flex-row items-center mt-8">
                <View
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: theme.colors.primary }}
                >
                    <Entypo name="plus" size={36} color="black" />
                </View>
                <Text className="ml-4 text-4xl font-bold text-black">
                    Select Team B
                </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    </SafeAreaView>
  );
}
