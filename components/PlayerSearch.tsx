import React from 'react';
import { View, TextInput, ActivityIndicator, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Player } from "@/store/slices/matchScoringSlice";

interface PlayerSearchProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  suggestions: Player[];
  loading: boolean;
  onSelectPlayer: (player: Player) => void;
  placeholder?: string;
}

export const PlayerSearch: React.FC<PlayerSearchProps> = ({
  searchQuery,
  onSearchChange,
  suggestions,
  loading,
  onSelectPlayer,
  placeholder = "Search players..."
}) => {
  return (
    <View className="mb-4">
      {/* Search Bar */}
      <View className="flex-row items-center border border-gray-400 rounded-full px-4 bg-white">
        <TextInput
          className="flex-1 text-base py-3"
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Ionicons name="search" size={20} color="black" />
        )}
      </View>

      {/* Search Instructions */}
      {searchQuery.length === 1 && (
        <Text className="text-xs text-gray-500 mt-2 px-2">
          Type at least 2 characters to search...
        </Text>
      )}

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <View className="bg-white border border-gray-300 rounded-lg mt-2 max-h-60 shadow-lg">
          <ScrollView 
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {suggestions.map((player) => (
              <TouchableOpacity
                key={player.id}
                onPress={() => onSelectPlayer(player)}
                className="flex-row items-center p-3 border-b border-gray-100 active:bg-gray-50"
              >
                {/* Player Avatar */}
                {player.profilePicture ? (
                  <Image 
                    source={{ uri: player.profilePicture }} 
                    className="w-12 h-12 rounded-full mr-3"
                  />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mr-3">
                    <Text className="text-gray-600 font-medium text-lg">
                      {player.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                
                {/* Player Info */}
                <View className="flex-1">
                  <Text className="font-semibold text-base">{player.name}</Text>
                  <View className="flex-row flex-wrap">
                    {player.email && (
                      <Text className="text-gray-500 text-sm mr-3">{player.email}</Text>
                    )}
                    {player.mobile && (
                      <Text className="text-gray-500 text-sm">{player.mobile}</Text>
                    )}
                  </View>
                </View>
                
                {/* Add Button */}
                <TouchableOpacity 
                  onPress={() => onSelectPlayer(player)}
                  className="bg-green-500 w-8 h-8 rounded-full items-center justify-center"
                >
                  <Ionicons name="add" size={16} color="white" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* No Results Message */}
      {searchQuery.length >= 2 && suggestions.length === 0 && !loading && (
        <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-2">
          <Text className="text-yellow-800 text-center">
            No players found for "{searchQuery}"
          </Text>
        </View>
      )}
    </View>
  );
};