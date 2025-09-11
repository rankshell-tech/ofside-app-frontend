// App.tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from '@/hooks/useTheme';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function App() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, isGuest } = useSelector((state: RootState) => state.auth);

  type MenuButtonProps = {
    title: string;
    comingSoon?: boolean;
    onPress?: () => void;
  };

  const MenuButton = ({title, comingSoon, onPress} : MenuButtonProps) => (
    <LinearGradient
      colors={["#FFF201", "#EAEAEA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="flex-1 mx-3 rounded-full"
    >
      <TouchableOpacity className="p-6 items-center justify-center" onPress={onPress}>
        <Text className="text-lg font-bold text-black">{title}</Text>
        {comingSoon && (
          <View className="absolute right-4 top-8 px-2 py-0.5 rounded">
            <Text className="text-[8px] font-bold -rotate-45 text-red-500 uppercase">
              Coming Soon
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/background.png")} // Put your image in assets/images
        resizeMode="contain"
        className="flex-1"
      >
        {/* Profile Section */}
        <View className="flex-row items-center mx-5 my-5">
          <Ionicons onPress={()=> navigation.goBack()} name="chevron-back-circle-outline" size={22} color="black" />
          <View
            className="w-14 h-14 rounded-full items-center justify-center mx-4 shadow"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <FontAwesome name="user" size={40} color={theme.colors.accent} />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold">Hi Swarit!</Text>
            <View className="flex-row mt-2 items-center">
              <View className="border border-black rounded px-2 py-1 mr-2" >
                <Text className="text-xs">Hard hitter</Text>
              </View>
            </View>
          </View>
        </View>
        <ScrollView>
          <View className="p-4">
            {/* Buttons */}
            <View className="flex-row mt-4 w-full h-28">
              <MenuButton title="Start a match" onPress={()=>router.push(`/xplore/chooseSportScreen`)} />
              <MenuButton title="Create Tournament" onPress={()=> router.push('/tournament/createTournament')} />
            </View>
            <View className="flex-row mt-4 w-full h-28">
              <MenuButton title="My Game" />
              <MenuButton title="My Performance" />
            </View>
            <View className="flex-row mt-4 w-full h-28">
              <MenuButton title="My Team" />
              <MenuButton title="Team Performance" />
            </View>

            <View className="my-4">
              <MenuButton title="Strength & Weekness" comingSoon />
            </View>
            <View className="my-4">
              <MenuButton title="Leaderboard" comingSoon />
            </View>
        </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
