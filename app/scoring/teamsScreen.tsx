import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image,FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from '@/hooks/useTheme';
import { router } from "expo-router";

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
      {/* Tabs */}
      <View className="flex-row border border-gray-300 rounded-xl mx-4 mt-4 overflow-hidden">
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

      {/* Content */}
      {activeTab === "My Teams" && (
        <View className="flex-1">
          {/* Add Teams button */}
          <TouchableOpacity className="mx-6 mt-6 rounded-lg py-3 flex-row justify-center items-center" style={{ backgroundColor: theme.colors.primary }}>
            <Text className="font-bold text-black mr-2">Add Teams</Text>
            <Ionicons name="add" size={20} color="black" />
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
        <View className="flex-1 bg-white p-4">
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
            <View className="flex-row items-center bg-white border border-gray-400 rounded-full px-4 mb-4">
                <TextInput
                className="flex-1 text-base"
                placeholder="Search player..."
                value={searchPlayer}
                onChangeText={setSearchPlayer}
                />
                <Ionicons name="search" size={20} color="black" />
            </View>

            {/* Player List */}
            <FlatList
                data={filteredPlayers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                <View className="flex-row items-center border border-gray-300 rounded-2xl p-3 mb-3 bg-white">
                    <Image
                    source={{
                        uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    }}
                    className="w-10 h-10 rounded-full mr-3"
                    />
                    <View>
                    <Text className="font-bold text-lg">{item.name}</Text>
                    <Text className="text-gray-500 text-xs">{item.role}</Text>
                    </View>
                </View>
                )}
            />

            {/* Next Button */}
            <TouchableOpacity className="py-3 rounded-md mt-3" style={{ backgroundColor: theme.colors.primary }}>
                <Text className="text-center text-black font-bold text-base">Next</Text>
            </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
