import React,{ useEffect } from "react";
import { View, Text, ImageBackground } from "react-native";
import { Feather,  } from "@expo/vector-icons";
import { useTheme } from '@/hooks/useTheme';
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

const PlayerAddedScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
    useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/scoring/matchTossScreen")
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
        source={require("../../assets/images/background.png")}
        resizeMode="contain"
        className="flex-1 bg-white"
      >
      <View className="flex-1 items-center justify-center">
        {/* Text */}
        <View className="flex-row items-center space-x-2">
          <Text className="text-4xl font-semibold text-blue-700">Match Rules Saved</Text>

          {/* Check Icon */}
          <View className="w-18 h-18 rounded-full ml-2" >
            <Feather name="check-circle" size={50} color={theme.colors.primary } />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PlayerAddedScreen;
