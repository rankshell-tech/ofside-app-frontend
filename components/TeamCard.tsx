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
}

// TeamCard.tsx - Simplified
export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  isSelected,
  onSelect,
  onEditTeam, // Add this prop
}) => {
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Check if current user can edit this team
  const canEditTeam = user?._id === team.admin || user?._id === team.createdBy;

  return (
    <TouchableOpacity
      onPress={() => onSelect(team)}
      className={`flex-row items-center border border-gray-300 rounded-2xl p-4 mb-4 shadow-sm ${
        isSelected ? 'bg-[#55ba75]' : 'bg-white'
      }`}
    >
      {/* Team Logo */}
      <View className="w-20 h-20 rounded-full items-center justify-center bg-gray-200">
        {team.logoUrl ? (
          <Image source={{ uri: team.logoUrl }} className="w-16 h-16 rounded-full" />
        ) : (
          <FontAwesome name="users" size={30} color="gray" />
        )}
      </View>

      {/* Team Info */}
      <View className="flex-1 ml-4">
        <View className="flex-row items-center justify-between">
          <Text className="font-bold text-lg">
            {team.name} {' '}
            {team.matches === 0 && (
              <Text className="text-sm text-yellow-500 font-semibold ml-2">
                New Team
              </Text>
            )}
          </Text>
          
          {/* Edit Button - Only show if user has permission */}
          {canEditTeam && (
            <TouchableOpacity onPress={() => onEditTeam(team)}>
              <Text className="text-blue-600 text-xs underline">Edit Team</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Team Stats */}
        <Text className="text-xs text-gray-500 mt-1">
          Matches: {team.matches || 0} • Players: {team.players?.length || 0}
        </Text>
        
        {/* Location & Captain */}
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Ionicons name="location" size={14} color="red" />
            <Text className="mx-1 text-xs text-gray-600">
              {team.city || team.homeGround || 'No location'}
            </Text>
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="crown-circle" size={16} color="gold" />
            <Text className="text-xs text-gray-600 mx-1">
              {team.captain?.[0]?.name || 'No captain'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
