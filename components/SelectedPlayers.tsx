import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Player } from "@/store/slices/matchScoringSlice";

interface SelectedPlayersProps {
  players: Player[];
  onRemovePlayer: (playerId: string) => void;
  title?: string;
}

export const SelectedPlayers: React.FC<SelectedPlayersProps> = ({
  players,
  onRemovePlayer,
  title = "Selected Players"
}) => {
  if (players.length === 0) return null;

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-2">
        {title} ({players.length})
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="mb-2"
      >
        <View className="flex-row flex-wrap">
          {players.map((player) => (
            <View key={player.id} className="flex-row items-center bg-green-100 rounded-full px-3 py-2 m-1">
              {player.profilePicture ? (
                <Image 
                  source={{ uri: player.profilePicture }} 
                  className="w-6 h-6 rounded-full mr-2"
                />
              ) : (
                <View className="w-6 h-6 rounded-full bg-gray-300 items-center justify-center mr-2">
                  <Text className="text-xs font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <Text className="text-sm font-medium flex-1">{player.name}</Text>
              <TouchableOpacity 
                onPress={() => onRemovePlayer(player.id)}
                className="ml-2"
              >
                <Ionicons name="close-circle" size={16} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      
      {/* Summary */}
      <View className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <Text className="text-blue-800 text-center">
          {players.length} player(s) selected
        </Text>
      </View>
    </View>
  );
};