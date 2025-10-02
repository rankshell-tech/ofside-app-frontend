
import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";

const WinnerScreen = () => {
    const theme = useTheme();
    useEffect(() => {
        const timer = setTimeout(() => {
         router.dismissAll();
        }, 2000); // 2 seconds

        return () => clearTimeout(timer);
      });
  return (
    <SafeAreaView className="flex-1">
      {/* Background Gradient */}
      <LinearGradient
        colors={["#FFF201", "#FFEB99"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1 justify-center items-center"
      >
        {/* Confetti Effect (simple - can also use animation lib like lottie) */}
        <Image
          source={require("../../assets/images/winner.png")} // optional: transparent PNG of confetti
          className="absolute w-full h-full"
          resizeMode="cover"
        />

        {/* Profile / Team Circle */}
        <View className="w-60 h-60 bg-white rounded-full justify-center items-center shadow-lg mt-14" >
                <FontAwesome name="user" size={150} color={theme.colors.accent} />
        </View>

        {/* Winner Name */}
        <Text className="mt-16 text-3xl font-bold text-black">
          Winning Team/Player Name
        </Text>

        {/* WINNER Text */}
        {/* <Text className="text-4xl font-extrabold text-black mt-2 tracking-wider">
          WINNER
        </Text> */}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default WinnerScreen;
