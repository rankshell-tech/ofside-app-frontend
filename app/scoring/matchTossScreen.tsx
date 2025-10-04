import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks/useTheme";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TossScreen({ navigation }: any) {
    const { sport, format } = useLocalSearchParams<{ sport: string; format: string }>();
  const [tossWinner, setTossWinner] = useState<string | null>("B");
  const [kickOff, setKickOff] = useState<string | null>("B");
  const [side, setSide] = useState<string | null>("L");
    const theme = useTheme();

  const renderOption = (
    label: string,
    selected: boolean,
    onPress: () => void
  ) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="flex-1 mx-2 rounded-xl overflow-hidden"
      >
        {selected ? (
          <LinearGradient
            colors={["#FFF201", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="p-4 items-center justify-center"
          >
            <Text className="text-2xl font-bold">{label}</Text>
          </LinearGradient>
        ) : (
          <View className="p-4 items-center justify-center border border-gray-300 rounded-xl bg-white">
            <Text className="text-2xl">{label}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
        <ImageBackground
            source={require("../../assets/images/background.png")}
            resizeMode="contain"
            className="flex-1 bg-white"
        >
            <View className="flex-1 mt-10 mb-5">
            {/* Header */}
            <View className="flex-row justify-between items-center mt-2 mx-2">
                <View className="w-8 h-8 bg-white rounded-full border-4" >
                  <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
                </View>
                <TouchableOpacity>
                  <Text className="text-gray-600 font-medium underline">Skip</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Title */}
                <Text className="text-3xl font-extrabold mb-6">Toss time</Text>
                <View className="rounded-xl p-4 mb-6" style={{backgroundColor:theme.colors.grey}}>
                    {/* Toss Winner */}
                    <LinearGradient
                      colors={["#FFF201", "transparent"]} // 👈 fade to transparent
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0.8, y: 0 }}
                      className="px-1 py-1 rounded-t-md mb-3"
                    >
                      <Text className="text-[10px] font-bold">Select the toss winner</Text>
                    </LinearGradient>
                    <View className="flex-row mb-6">
                        {renderOption("Team A", tossWinner === "A", () => setTossWinner("A"))}
                        {renderOption("Team B", tossWinner === "B", () => setTossWinner("B"))}
                    </View>
                </View>

                {/* Kick Off */}
                <View className="rounded-xl p-4 mb-6" style={{backgroundColor:theme.colors.grey}}>
                    {/* Toss Winner */}
                    <LinearGradient
                      colors={["#FFF201", "transparent"]} // 👈 fade to transparent
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="px-1 py-1 rounded-t-md mb-3"
                    >
                        <Text className="text-[10px] font-bold">Which team will take the first Kick-Off ?</Text>
                    </LinearGradient>
                    <View className="flex-row mb-6">
                        {renderOption("Team A", kickOff === "A", () => setKickOff("A"))}
                        {renderOption("Team B", kickOff === "B", () => setKickOff("B"))}
                    </View>
                </View>

                {/* Side Choice */}
                <View className="rounded-xl p-4 mb-6" style={{backgroundColor:theme.colors.grey}}>
                    {/* Toss Winner */}
                    <LinearGradient
                      colors={["#FFF201", "transparent"]} // 👈 fade to transparent
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="px-1 py-1 rounded-t-md mb-3"
                    >
                        <Text className="text-[10px] font-bold">Choose the side of toss winning team</Text>
                    </LinearGradient>
                    <View className="flex-row mb-6">
                        {renderOption("Left", side === "L", () => setSide("L"))}
                        {renderOption("Right", side === "R", () => setSide("R"))}
                    </View>
                </View>

            </ScrollView>

            {/* Kick off Button */}
            <View className="px-4 mb-5">
                <TouchableOpacity
                    onPress={()=> router.push({ pathname: "/scoring/scoringScreen",
                                                        params: { sport, format }})}
                    className="rounded-lg py-3 items-center" style={{ backgroundColor: theme.colors.primary }}>
                <Text className="font-bold text-black text-lg">{sport === 'Football' ? "Kick off" : "Start match"}</Text>
                </TouchableOpacity>
            </View>
            </View>
        </ImageBackground>
    </SafeAreaView>
  );
}
