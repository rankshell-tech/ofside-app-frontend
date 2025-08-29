import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image,FlatList, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from '@/hooks/useTheme';
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

interface Player {
  id: string;
  name: string;
  role: string;
}

const players: Player[] = [
  { id: "1", name: "Swarit Jain", role: "Aspirant" },
  { id: "2", name: "Swarit Jain", role: "Aspirant" },
  { id: "3", name: "Swarit Jain", role: "Aspirant" },
  { id: "4", name: "Swarit Jain", role: "Aspirant" },
  { id: "5", name: "Swarit Jain", role: "Aspirant" },
  { id: "6", name: "Swarit Jain", role: "Aspirant" },
];

export default function TeamsScreen() {
  const theme = useTheme();
    const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"My Teams" | "Opponents" | "Add Players">("My Teams");
  const [searchOpponents, setSearchOpponents] = useState("");
  const [searchPlayer, setSearchPlayer] = useState("");

    const filteredPlayers = players.filter((p) =>
      p.name.toLowerCase().includes(searchPlayer.toLowerCase())
    );

  const teams = [
    { id: 1, name: "Stallions", matches: 212, won: 126, loss: 86, location: "New Delhi", captain: "Swarti Jain" },
    { id: 2, name: "Stallions", matches: 212, won: 126, loss: 86, location: "New Delhi", captain: "Swarti Jain" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/background.png")}
        resizeMode="contain"
        className="flex-1 bg-white"
      >
        <View className="flex-row items-center mx-4 mt-4">
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <ArrowLeft size={24} color="black" />
          </TouchableOpacity>

          {/* Tabs */}
          <View className="flex-row flex-1 border border-gray-300 rounded-xl overflow-hidden">
          {["My Teams", "Opponents", "Add Players"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as typeof activeTab)}
              className={`flex-1 py-2 items-center ${
                activeTab === tab ? "bg-black" : ""
              }`}
            >
              <Text
                className={`${
                  activeTab === tab ? "text-white font-bold" : "text-black"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
          </View>
        </View>

        {/* Content */}
        {activeTab === "My Teams" && (
          <View className="flex-1">
            {/* Add Teams button */}
            <TouchableOpacity className="mx-6 mt-6 rounded-lg py-3 flex-row justify-center items-center" style={{ backgroundColor: theme.colors.primary }}>
              <Text className="font-bold text-black mr-2">Add Teams</Text>
              <FontAwesome name="plus" size={20} color="black" />
            </TouchableOpacity>

            {/* Teams List */}
            <ScrollView className="mt-6 px-4">
              {teams.map((team) => (
                <View
                  key={team.id}
                  className="flex-row items-center bg-white border border-gray-300 rounded-2xl p-4 mb-4 shadow-sm"
                >
                  <View className="w-14 h-14 rounded-full bg-gray-200 items-center justify-center">
                    <Ionicons name="person" size={32} color="gray" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="font-bold text-lg">{team.name}</Text>
                    <Text className="text-xs text-gray-500">Matches: {team.matches}</Text>
                    <Text className="text-xs text-gray-500">
                      Won: {team.won} | Loss: {team.loss}
                    </Text>
                    <View className="flex-row justify-end mt-2">
                      <Ionicons name="location" size={14} color="red" />
                      <Text className="mx-1 text-xs text-gray-600">{team.location}</Text>
                      <MaterialCommunityIcons name="crown-circle" size={16} color="gold" />
                      <Text className="text-xs text-gray-600 mx-1">{team.captain}</Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Text className="text-blue-600 text-xs">View team</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === "Opponents" && (
          <View className="flex-1">
            {/* Search Bar */}
            <View className="flex-row items-center border border-gray-400 rounded-full mx-6 mt-6 px-3">
              <TextInput
                placeholder="Search Opponent..."
                value={searchOpponents}
                onChangeText={setSearchOpponents}
                className="flex-1 py-2 px-2 text-gray-700"
              />
              <Ionicons name="search" size={20} color="black" />
            </View>

            {/* Opponents List */}
            <ScrollView className="mt-6 px-4">
              {teams
                .filter((o) => o.name.toLowerCase().includes(searchOpponents.toLowerCase()))
                .map((team) => (
                  <View
                    key={team.id}
                    className="flex-row items-center bg-white border border-gray-300 rounded-2xl p-4 mb-4 shadow-sm"
                  >
                    <View className="w-14 h-14 rounded-full bg-gray-200 items-center justify-center">
                      <Ionicons name="person" size={32} color="gray" />
                    </View>
                    <View className="flex-1 ml-4">
                      <Text className="font-bold text-lg">{team.name}</Text>
                      <Text className="text-xs text-gray-500">Matches: {team.matches}</Text>
                      <Text className="text-xs text-gray-500">
                        Won: {team.won} | Loss: {team.loss}
                      </Text>
                      <View className="flex-row justify-end mt-2">
                          <Ionicons name="location" size={14} color="red" />
                          <Text className="mx-1 text-xs text-gray-600">{team.location}</Text>
                          <MaterialCommunityIcons name="crown-circle" size={16} color="gold" />
                          <Text className="text-xs text-gray-600 mx-1">{team.captain}</Text>
                      </View>
                    </View>
                    <TouchableOpacity>
                      <Text className="text-blue-600 text-xs">View team</Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>
          </View>
        )}

        {activeTab === "Add Players" && (
          <View className="flex-1 p-4">
              {/* Header */}
              <View className="flex-row justify-between items-center mb-5 ">
                  <View>
                      <Text className="text-2xl font-bold">Stallions</Text>
                      <Text className="text-gray-500 text-sm">Select Playing Team</Text>
                  </View>
                  <View>
                      <TouchableOpacity onPress={() => router.push('/scoring/addPlayer')}  className="px-2 py-1 rounded" style={{ backgroundColor: theme.colors.primary }}>
                          <Text className="text-xs font-medium">+ Add new player</Text>
                      </TouchableOpacity>
                      <View className="flex-row justify-end items-center">
                          <Text className="text-sm font-medium mr-2">Select all</Text>
                          <Ionicons name="checkbox-outline" size={18} color="black" />
                      </View>
                  </View>
              </View>

              {/* Select All */}


              {/* Search Bar */}
              <View className="flex-row items-center border border-gray-400 rounded-full px-4 mb-4">
                  <TextInput
                  className="flex-1 text-base"
                  placeholder="Search player..."
                  value={searchPlayer}
                  onChangeText={setSearchPlayer}
                  />
                  <Ionicons name="search" size={20} color="black" />
              </View>

              {/* Player List */}
              <View className="flex-1">
                <FlatList
                  data={filteredPlayers}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                  renderItem={({ item }) => (
                    <View className="bg-white rounded-2xl border border-gray-300 p-2 m-1 w-[48%] items-center shadow-sm">
                      {/* Avatar */}
                      <View style={{ backgroundColor: theme.colors.grey }} className="w-32 h-32 rounded-full items-center justify-center shadow">
                          <FontAwesome name="user" size={80} color={theme.colors.accent} />
                        </View>
                      {/* Name */}
                      <Text className="text-lg font-bold">{item.name}</Text>
                      {/* Role */}
                      <Text className="text-gray-500 text-sm">{item.role}</Text>
                    </View>
                  )}
                />
              </View>

              {/* Next Button */}
              <TouchableOpacity onPress={() => router.push('/scoring/matchSetupScreen')}   className="py-3 rounded-md mt-3" style={{ backgroundColor: theme.colors.primary }}>
                  <Text className="text-center text-black font-bold text-base">Next</Text>
              </TouchableOpacity>
          </View>
        )}
    </ImageBackground>
    </SafeAreaView>
  );
}
