import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { router, useNavigation } from "expo-router";

export default function ChooseSportScreen() {
  const navigation = useNavigation();
  const [selectedSport, setSelectedSport] = useState("Football");
  const [selectedFormat, setSelectedFormat] = useState("Team");

  const sports = ["Football", "Badminton", "Volleyball", "Basketball", "Tennis", "Pickleball"];
  const formats = ["Singles", "Doubles", "Team"];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/background.png")} // Put your image in assets/images
        resizeMode="contain"
        className="flex-1"
      >
        <ScrollView className="px-4 mt-10">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={()=> navigation.goBack()} className="mr-8">
              <ArrowLeft size={24} color="black" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-extrabold text-gray-900 mb-1">
                Choose the Sport
              </Text>
              <Text className="text-sm text-gray-500 mb-6">
                Choose Format & Sport according your match
              </Text>
            </View>
          </View>

          {/* Sports Section */}
          <View className="flex-row flex-wrap justify-between mt-10">
            {sports.map((sport) => {
              const isSelected = selectedSport === sport;
              return (
                <TouchableOpacity
                  key={sport}
                  className="w-[30%] h-16 mb-4 rounded-xl overflow-hidden"
                  onPress={() => setSelectedSport(sport)}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={["#FFE600", "#EDEDED"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="flex-1 items-center justify-center rounded-xl border border-gray-400"
                    >
                      <Text className="font-extrabold text-base text-black">
                        {sport}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View className="flex-1 items-center justify-center rounded-xl border border-gray-400 bg-gray-100">
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
          <View className="flex-row justify-between">
            {formats.map((format) => {
              const isSelected = selectedFormat === format;
              return (
                <TouchableOpacity
                  key={format}
                  className="w-[30%] h-16 mb-4 rounded-xl overflow-hidden"
                  onPress={() => setSelectedFormat(format)}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={["#FFE600", "#EDEDED"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="flex-1 items-center justify-center rounded-xl border border-gray-400"
                    >
                      <Text className="font-extrabold text-base text-black">
                        {format}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View className="flex-1 items-center justify-center rounded-xl border border-gray-400 bg-gray-100">
                      <Text className="text-base text-black">{format}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom Button */}
          <TouchableOpacity onPress={() => router.push('/scoring/selectTeamsScreen')} className="h-12 rounded-xl overflow-hidden mt-48">
            <LinearGradient
              colors={["#FFE600", "#FFE600"]}
              className="flex-1 items-center justify-center rounded-xl"
            >
              <Text className="font-extrabold text-base text-black">
                Select Teams
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
