
import React from "react";
import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

const WinnerScreen = () => {
    const theme = useTheme();
  return (
    <SafeAreaView className="flex-1">
      {/* Background Gradient */}
      <LinearGradient
        colors={["#FFD700", "#FFEB99"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1 justify-center items-center"
      >
        {/* Confetti Effect (simple - can also use animation lib like lottie) */}
        <Image
          source={require("../../assets/images/bg.png")} // optional: transparent PNG of confetti
          className="absolute w-full h-full"
          resizeMode="cover"
        />

        {/* Profile / Team Circle */}
        <View className="w-40 h-40 bg-white rounded-full justify-center items-center shadow-lg" >
                <FontAwesome name="user" size={60} color={theme.colors.grey} />
        </View>

        {/* Winner Name */}
        <Text className="mt-6 text-base font-semibold text-black">
          Winning Team/Player Name
        </Text>

        {/* WINNER Text */}
        <Text className="text-4xl font-extrabold text-black mt-2 tracking-wider">
          WINNER
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default WinnerScreen;
