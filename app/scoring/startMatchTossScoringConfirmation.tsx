// startMatchTossScoringConfirmation.tsx
import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function StartMatchTossScoringConfirmation() {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleStartNow = () => {
    // Navigate to scoring screen
    router.push('/scoring/matchTossScreen'); // Update with your actual scoring route
  };

  const handleStartLater = () => {
    // Navigate back or to home
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/background.png")}
        resizeMode="contain"
        className="flex-1 bg-white"
      >
        <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2">
          <Entypo onPress={() => navigation.goBack()} name="chevron-left" size={20} color="black" />
        </View>

        <View className="flex-1 px-5 justify-center items-center">
          {/* Icon/Illustration */}
          <View style={{ backgroundColor: theme.colors.primary }} className="w-32 h-32 rounded-full items-center justify-center mb-8 shadow">
            <Entypo name="game-controller" size={60} color={theme.colors.accent} />
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-center mb-4">
            Ready to Start Scoring?
          </Text>

          {/* Description */}
          <Text className="text-base text-gray-600 text-center mb-12 px-4">
            Would you like to start the match scoring now or do it later?
          </Text>

          {/* Buttons */}
          <View className="w-full px-4 space-y-4">
            <TouchableOpacity 
              onPress={handleStartNow} 
              className="w-full py-4 rounded-xl border-2" 
              style={{ backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }}
            >
              <Text className="text-black font-bold text-lg text-center">
                Start Scoring Now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleStartLater} 
              className="w-full py-4 rounded-xl border-2 border-gray-300 bg-white"
            >
              <Text className="text-gray-700 font-semibold text-lg text-center">
                Start Later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
