import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from '@/hooks/useTheme';
import { Team } from "@/store/slices/matchScoringSlice";

interface TeamCardProps {
  team: Team;
  isSelected: boolean;
  onSelect: (team: Team) => void;
  onViewTeam?: () => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  isSelected,
  onSelect,
  onViewTeam
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onSelect(team)}
      className={`flex-row items-center border border-gray-300 rounded-2xl p-4 mb-4 shadow-sm ${
        isSelected ? "bg-[#55ba75]" : "bg-white"
      }`}
    >
      <View
        style={{ backgroundColor: theme.colors.grey }}
        className="w-20 h-20 rounded-full items-center justify-center shadow"
      >
        {team.logoUrl ? (
          <Image source={{ uri: team.logoUrl }} className="w-16 h-16 rounded-full" />
        ) : (
          <FontAwesome name="users" size={30} color={theme.colors.accent} />
        )}
      </View>
      <View className="flex-1 ml-4">
        <View className="flex-row items-center justify-between">
          <Text className="font-bold text-lg">{team.name}</Text>
          <TouchableOpacity onPress={onViewTeam}>
            <Text className="text-blue-600 text-xs underline">View team</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-500 mt-1">Matches: {team.matches}</Text>
        <Text className="text-xs text-gray-500">
          Won: {team.won} | Loss: {team.loss}
        </Text>
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Ionicons name="location" size={14} color="red" />
            <Text className="mx-1 text-xs text-gray-600">{team.location}</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="crown-circle" size={16} color="gold" />
            <Text className="text-xs text-gray-600 mx-1">{team.captain}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};