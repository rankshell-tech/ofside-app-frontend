// App.tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
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
      className="flex-1 mx-3 rounded-xl overflow-hidden border"
    >
      <TouchableOpacity className="flex-1 p-5 items-center justify-center" onPress={onPress}>
        <Text className="text-xl font-extrabold text-black">{title}</Text>
        {comingSoon && (
          <View className="absolute right-8 top-0 px-2 py-0.5 rounded">
            <Image
              source={require("../../assets/images/comingSoon.png")}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
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
        <LinearGradient
          colors={["#004aad", "#000428"]} // blue gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-row items-center border rounded-xl overflow-hidden p-2 m-4"
        >
          {/* Avatar */}
          <View  className="w-20 h-20 rounded-full items-center justify-center bg-white mr-2">
            <FontAwesome name="user" size={50} color="#004aad" />
          </View>

          {/* Text + Icon */}
          <View>
            <View className="flex-row items-center">
              <Text className="text-white font-bold text-2xl mr-1">
                Hi Swarit!
              </Text>
              <View  className="w-6 h-6 rounded-full items-center justify-center" style={{ backgroundColor: theme.colors.primary }}>
                <FontAwesome5 name="crown" size={12} color="black" />
              </View>

            </View>
            <Text className="text-[#fff201] text-sm">Elite/Club Member</Text>
          </View>
        </LinearGradient>
        <ScrollView>
            {/* Buttons */}
            <View className="flex-row mt-5 w-full h-28">
              <MenuButton title="Start a match" onPress={()=>router.push(`/scoring/chooseSportScreen`)} />
              <MenuButton title="Create Tournament" onPress={()=> router.push('/tournament/createTournament')} />
            </View>
            <View className="flex-row mt-5 w-full h-28">
              <MenuButton title="My Game" onPress={()=> router.push('/myGame/myGame')} />
              <MenuButton title="My Performance" />
            </View>
            <View className="flex-row mt-5 w-full h-28">
              <MenuButton title="My Team & Performance" />
            </View>
            <View className="mt-5">
              <MenuButton title="ABCD - Your AI Coach" comingSoon />
            </View>
            <View className="my-4">
              <MenuButton title="Game Leaderboard" onPress={()=> router.push('/leaderboard/leaderboard')} />
            </View>

        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
