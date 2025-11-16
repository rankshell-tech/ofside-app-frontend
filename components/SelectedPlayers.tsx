import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { Player } from "@/store/slices/matchScoringSlice";
import { useTheme } from '@/hooks/useTheme';

interface SelectedPlayersProps {
  players: Player[];
  onRemovePlayer: (playerId: string) => void;
  title?: string;
}

export const SelectedPlayers: React.FC<SelectedPlayersProps> = React.memo(({
  players,
  onRemovePlayer,
  title = "Selected Players"
}) => {
  const theme = useTheme();
  
  if (players.length === 0) return null;

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-2">
        {title} ({players.length})
      </Text>
      
      <View className="flex-row flex-wrap">
        {players.map((player) => (
          <View key={`selected-${player.id}`} className="w-1/3 p-1">
            <TouchableOpacity
              onPress={() => onRemovePlayer(player.id)}
              className="rounded-2xl border border-gray-300 p-2 items-center bg-yellow-100 shadow-sm"
            >
              {/* Avatar */}
              <View
                style={{ backgroundColor: theme.colors.grey }}
                className="w-16 h-16 rounded-full items-center justify-center"
              >
                {player.profilePicture ? (
                  <Image 
                    source={{ uri: player.profilePicture }} 
                    className="w-14 h-14 rounded-full"
                  />
                ) : (
                  <FontAwesome name="user" size={30} color={theme.colors.accent} />
                )}
              </View>
              {/* Name */}
              <Text className="text-xs font-bold mt-1 text-center" numberOfLines={2}>
                {player.name}
              </Text>
              {/* Remove Text */}
              <Text className="text-red-500 text-xs font-medium mt-1">Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      
      {/* Summary */}
      <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
        <Text className="text-blue-800 text-center">
          {players.length} player(s) selected
        </Text>
      </View>
    </View>
  );
});

export default SelectedPlayers;