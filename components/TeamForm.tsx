import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface TeamFormProps {
  team: {
    name: string;
    logoUrl: string;
    captain: string;
    description: string;
    homeGround: string;
    city: string;
  };
  onTeamChange: (field: string, value: string) => void;
  sport: string;
}

export const TeamForm: React.FC<TeamFormProps> = ({
  team,
  onTeamChange,
  sport
}) => {
  return (
    <View>
      {/* Team Name */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-2">Team Name *</Text>
        <TextInput
          placeholder="Enter team name"
          value={team.name}
          onChangeText={(text) => onTeamChange('name', text)}
          className="border border-gray-300 rounded-lg p-3 bg-white"
          autoCapitalize="words"
        />
      </View>

      {/* Team Bio/Description */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-2">Team Description</Text>
        <TextInput
          placeholder="Enter team description or bio (optional)"
          value={team.description}
          onChangeText={(text) => onTeamChange('description', text)}
          className="border border-gray-300 rounded-lg p-3 bg-white min-h-[100px]"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Logo URL */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-2">Logo URL</Text>
        <TextInput
          placeholder="Enter logo URL (optional)"
          value={team.logoUrl}
          onChangeText={(text) => onTeamChange('logoUrl', text)}
          className="border border-gray-300 rounded-lg p-3 bg-white"
          autoCapitalize="none"
          keyboardType="url"
        />
      </View>

      {/* Sport (Auto-filled but display only) */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-2">Sport</Text>
        <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
          <Text className="text-gray-700 capitalize">
            {sport || "Not specified"}
          </Text>
        </View>
        <Text className="text-xs text-gray-500 mt-1">
          Sport is automatically set from your current selection
        </Text>
      </View>

      {/* Captain */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-2">Captain</Text>
        <TextInput
          placeholder="Enter captain name (optional)"
          value={team.captain}
          onChangeText={(text) => onTeamChange('captain', text)}
          className="border border-gray-300 rounded-lg p-3 bg-white"
          autoCapitalize="words"
        />
      </View>

      {/* Home Ground/Venue */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-2">Home Ground</Text>
        <TextInput
          placeholder="Enter home ground or venue (optional)"
          value={team.homeGround}
          onChangeText={(text) => onTeamChange('homeGround', text)}
          className="border border-gray-300 rounded-lg p-3 bg-white"
          autoCapitalize="words"
        />
      </View>

      {/* City/Location */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-2">City</Text>
        <TextInput
          placeholder="Enter city (optional)"
          value={team.city}
          onChangeText={(text) => onTeamChange('city', text)}
          className="border border-gray-300 rounded-lg p-3 bg-white"
          autoCapitalize="words"
        />
      </View>
    </View>
  );
};