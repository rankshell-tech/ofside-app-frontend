import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import { Search, Plus, MapPin } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, FontAwesome, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/hooks/useTheme";
import { router, useLocalSearchParams } from "expo-router";

const teamsData = [
  {
    id: "1",
    name: "Stallions",
    matches: 272,
    won: 126,
    lost: 86,
    location: "New Delhi",
    manager: "Swarti Jain",
  },
  {
    id: "2",
    name: "Stallions",
    matches: 272,
    won: 126,
    lost: 86,
    location: "New Delhi",
    manager: "Swarti Jain",
  },
  {
    id: "3",
    name: "Stallions",
    matches: 272,
    won: 126,
    lost: 86,
    location: "New Delhi",
    manager: "Swarti Jain",
  },
];

export default function SelectTeamsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { sport, format } = useLocalSearchParams<{ sport: string; format: string }>();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedTeams((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
        <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2 mb-5" >
          <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
        </View>

        <View className="p-2">
          <Text className="text-xl ml-2 font-bold mb-5">Select teams for the Tournament</Text>
          {/* Search */}
          <View className="flex-row justify-between items-center border border-gray-400 rounded-full px-3 py-1 mb-4">
            <TextInput
              placeholder="Search team name..."
              placeholderTextColor="#888"
            />
            <Search size={20} color="black" />
          </View>

          {/* Add Teams */}
          <TouchableOpacity className="bg-[#fff201] py-2 rounded-lg flex-row items-center justify-center mb-4 border">
            <Text className="font-bold text-base mr-2">Add Teams</Text>
            <Plus size={20} color="black" strokeWidth={3} />
          </TouchableOpacity>

          {/* Team List */}
          <FlatList
            data={teamsData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const selected = selectedTeams.includes(item.id);
              return (
                <TouchableOpacity
                  onPress={() => toggleSelect(item.id)}
                >
                  <View
                      key={item.id}
                    //   className="flex-row items-center bg-white border border-gray-300 rounded-2xl p-4 mb-4 shadow-sm"
                      className={`flex-row items-center rounded-2xl p-4 mb-3 border ${
                        selected ? "bg-[#55ba75]" : "bg-white"
                    }`}
                    >
                      <View
                        style={{ backgroundColor: theme.colors.grey }}
                        className="w-20 h-20 rounded-full items-center justify-center shadow"
                      >
                        <FontAwesome name="user" size={40} color={theme.colors.accent} />
                      </View>
                      <View className="flex-1">
                        <View className="flex-1 flex-row items-baseline justify-between mx-2">
                          <Text className="font-bold text-lg">{item.name}</Text>
                          <TouchableOpacity>
                            <Text className="text-blue-600 text-xs underline">View team</Text>
                          </TouchableOpacity>
                        </View>
                        <View className="flex-1 mx-2">
                          <Text className="text-xs text-gray-500">Matches: {item.matches}</Text>
                          <Text className="text-xs text-gray-500">
                            Won: {item.won} | Loss: {item.lost}
                          </Text>
                          <View className="flex-row justify-end mt-2">
                            <Ionicons name="location" size={14} color="red" />
                            <Text className="mx-1 text-xs text-gray-600">{item.location}</Text>
                            <MaterialCommunityIcons name="crown-circle" size={16} color="gold" />
                            <Text className="text-xs text-gray-600 mx-1">{item.manager}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>

      {/* Next button */}
      <TouchableOpacity onPress={() => router.push({
                                      pathname: "/tournament/teamSelectionViaScanner",
                                      params: { sport, format },})}
                        className="bg-[#fff201] py-3 rounded-lg items-center mt-4">
        <Text className="font-bold text-lg">Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
