import React,{ useEffect } from "react";
import { View, Text, ImageBackground, Image } from "react-native";
import { useTheme } from '@/hooks/useTheme';
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";

const TournamentCreated = () => {
  const theme = useTheme();
    const { sport, format } = useLocalSearchParams<{ sport: string; format: string }>();
  const navigation = useNavigation();
    useEffect(() => {
    const timer = setTimeout(() => {
      router.replace({
                    pathname: "/tournament/teamSelection",
                    params: { sport, format }
                  })
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
          <Text className="text-4xl font-semibold text-green-600 mr-2">Tournament created</Text>
          <Image
            source={require('../../assets/images/check.png')}
            style={{ width: 50, height: 50, resizeMode: 'contain' }}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default TournamentCreated;
