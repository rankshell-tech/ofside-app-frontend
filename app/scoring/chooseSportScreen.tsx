import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";

export default function ChooseSportScreen() {
  const navigation = useNavigation();
  const [selectedSport, setSelectedSport] = useState("Football");
  const [selectedFormat, setSelectedFormat] = useState("Team");
  const { isTournament } = useLocalSearchParams<{ isTournament?: string }>();
  const tournamentMode = isTournament === "true";

  const sports = ["Football", "Badminton", "Volleyball", "Basketball", "Tennis", "Pickleball"];
  const sportFormats: Record<string, string[]> = {
    Football: ["Team"],
    Basketball: ["Team"],
    Badminton: ["Singles", "Doubles"],
    Tennis: ["Singles", "Doubles"],
    Pickleball: ["Singles", "Doubles", "Team"],
    Volleyball: ["Two Player", "Team"],
  };
  const formats = sportFormats[selectedSport] || [];

  const handleSportSelect = (sport: string) => {
    setSelectedSport(sport);
    const availableFormats = sportFormats[sport];
    setSelectedFormat(availableFormats[0]); // Default to first option
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/background.png")} // Put your image in assets/images
        resizeMode="contain"
        className="flex-1"
      >
        <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2" >
          <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
        </View>
        <ScrollView className="px-4 mt-10 mb-20">
          {/* Sports Section */}
          <View className="flex-1">
            <Text className="text-2xl font-extrabold text-gray-900 mb-1">
              Choose the Sport
            </Text>
            <Text className="text-sm text-gray-500 mb-6">
              Choose Format & Sport according your match
            </Text>
          </View>
          <View className="flex-row flex-wrap justify-between mt-10">
            {sports.map((sport) => {
              const isSelected = selectedSport === sport;
              return (
                <TouchableOpacity
                  key={sport}
                  className="w-[30%] h-16 mb-4 rounded-xl border overflow-hidden"
                  onPress={() => handleSportSelect(sport)}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={["#FFF201", "#EDEDED"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="flex-1 items-center justify-center"
                    >
                      <Text className="font-extrabold text-base text-black">
                        {sport}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View className="flex-1 items-center justify-center bg-gray-100">
                      <Text className="text-base text-black">{sport}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Format Section */}
          <Text className="text-2xl font-extrabold text-gray-900 mt-10 mb-5">
            Choose Format
          </Text>
          <View className="flex-row justify-center">
            {formats.map((format) => {
              const isSelected = selectedFormat === format;
              return (
                <TouchableOpacity
                  key={format}
                  className="w-[30%] h-16 mb-4 mx-2 rounded-xl overflow-hidden border"
                  onPress={() => setSelectedFormat(format)}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={["#FFF201", "#EDEDED"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="flex-1 items-center justify-center rounded-xl"
                    >
                      <Text className="font-extrabold text-base text-black">
                        {format}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View className="flex-1 items-center justify-center rounded-xl bg-gray-100">
                      <Text className="text-base text-black">{format}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View className="absolute bottom-4 left-4 right-4">
          <TouchableOpacity
             onPress={() =>
              tournamentMode
              ? router.push({
                  pathname: "/tournament/editTournament",
                  params: { sport: selectedSport, format: selectedFormat },
                })
              : router.push({
                  pathname: "/scoring/selectTeamsScreen",
                  params: { sport: selectedSport, format: selectedFormat },
                })
              }
            className="h-12 rounded-xl overflow-hidden mt-48">
            <LinearGradient
              colors={["#FFF201", "#FFF201"]}
              className="flex-1 items-center justify-center rounded-xl"
            >
              <Text className="font-extrabold text-base text-black">
                Select Teams
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
