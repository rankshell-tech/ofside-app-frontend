import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Team } from '@/store/slices/matchScoringSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface TeamCardProps {
  team: Team;
  isSelected: boolean;
  onSelect: (team: Team) => void;
  onViewTeam?: () => void;
  onEditTeam: (team: Team) => void; // New prop for editing team
  selectedPlayersCount?: number; // Number of players selected for this match
  onSelectPlayers?: () => void; // New prop for selecting players
}

// TeamCard.tsx - Simplified
export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  isSelected,
  onSelect,
  onEditTeam, // Add this prop
  selectedPlayersCount,
  onSelectPlayers,
}) => {
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Check if current user can edit this team
  const canEditTeam = user?._id === team.admin || user?._id === team.createdBy;

  return (
    <View
      className={`border-2 rounded-2xl mb-4 shadow-sm overflow-hidden ${
        isSelected ? 'border-[#FFF201] bg-yellow-50' : 'border-gray-200 bg-white'
      }`}
    >
      <TouchableOpacity
        onPress={() => onSelect(team)}
        className="flex-row items-center p-4"
      >
        {/* Team Logo */}
        <View className={`w-16 h-16 rounded-full items-center justify-center ${
          isSelected ? 'bg-[#FFF201]' : 'bg-gray-200'
        }`}>
          {team.logoUrl ? (
            <Image source={{ uri: team.logoUrl }} className="w-14 h-14 rounded-full" />
          ) : (
            <FontAwesome name="users" size={24} color={isSelected ? "black" : "gray"} />
          )}
        </View>

        {/* Team Info */}
        <View className="flex-1 ml-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className={`font-bold text-lg ${isSelected ? 'text-black' : 'text-gray-800'}`}>
                {team.name}
              </Text>
              {team.matches === 0 && (
                <View className="mt-1 px-2 py-0.5 bg-yellow-200 rounded-full self-start">
                  <Text className="text-xs text-yellow-800 font-semibold">
                    New Team
                  </Text>
                </View>
              )}
            </View>
            
            {/* Edit Button - Only show if user has permission */}
            {canEditTeam && (
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  onEditTeam(team);
                }}
                className="ml-2"
              >
                <Ionicons name="create-outline" size={18} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>

          {/* Team Stats */}
          <View className="flex-row items-center mt-2 flex-wrap">
            <View className="flex-row items-center mr-3">
              <Ionicons name="trophy-outline" size={12} color="#6B7280" />
              <Text className="text-xs text-gray-600 ml-1">
                {team.matches || 0} matches
              </Text>
            </View>
            <View className="flex-row items-center mr-3">
              <FontAwesome name="users" size={12} color="#6B7280" />
              <Text className="text-xs text-gray-600 ml-1">
                {team.players?.length || 0} players
              </Text>
            </View>
            {isSelected && selectedPlayersCount !== undefined && selectedPlayersCount > 0 && (
              <View className="px-2 py-0.5 rounded-full bg-[#FFF201]">
                <Text className="text-xs text-black font-semibold">
                  {selectedPlayersCount} selected
                </Text>
              </View>
            )}
          </View>
          
          {/* Location & Captain */}
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center flex-1">
              <Ionicons name="location-outline" size={12} color="#6B7280" />
              <Text className="ml-1 text-xs text-gray-600" numberOfLines={1}>
                {team.city || team.homeGround || 'No location'}
              </Text>
            </View>
            {team.captain?.[0]?.name && (
              <View className="flex-row items-center ml-2">
                <MaterialCommunityIcons name="crown" size={14} color="#F59E0B" />
                <Text className="text-xs text-gray-600 ml-1" numberOfLines={1}>
                  {team.captain[0].name}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Select Players Button - Only show when team is selected */}
      {isSelected && onSelectPlayers && (
        <View className="px-4 pb-3 pt-2 border-t border-gray-200">
          <TouchableOpacity
            onPress={onSelectPlayers}
            className="flex-row items-center justify-center py-2.5 rounded-lg"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <FontAwesome name="users" size={14} color="black" />
            <Text className="ml-2 font-semibold text-black text-sm">
              Select Players {selectedPlayersCount !== undefined && selectedPlayersCount > 0 && `(${selectedPlayersCount})`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
