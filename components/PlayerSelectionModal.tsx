import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Image, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useDebounce } from '@/hooks/useDebounce';
import { useTheme } from '@/hooks/useTheme';
import { Player, Team } from '@/store/slices/matchScoringSlice';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

interface PlayerSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  team: Team | null;
  selectedPlayers: Player[];
  onConfirm: (players: Player[]) => void;
  userToken?: string;
}

export const PlayerSelectionModal: React.FC<PlayerSelectionModalProps> = ({
  visible,
  onClose,
  team,
  selectedPlayers: initialSelectedPlayers,
  onConfirm,
  userToken,
}) => {
  const theme = useTheme();
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>(initialSelectedPlayers);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch team players when modal opens
  useEffect(() => {
    if (visible && team?._id) {
      fetchTeamPlayers();
      // Reset selected players when modal opens - use initialSelectedPlayers if provided, otherwise empty
      const initialPlayers = Array.isArray(initialSelectedPlayers) ? initialSelectedPlayers : [];
      // Remove duplicates and ensure valid players
      const uniquePlayers = initialPlayers.filter((player, index, self) =>
        player && player.id && index === self.findIndex(p => p && p.id === p.id && p.id === player.id)
      );
      setSelectedPlayers(uniquePlayers);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  }, [visible, team?._id]);

  // Don't auto-update from initialSelectedPlayers after modal is open - only on open

  // Search for players
  const searchPlayers = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/search?q=${encodeURIComponent(query.trim())}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(userToken && { 'Authorization': `Bearer ${userToken}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search players');
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.users)) {
        const players: Player[] = data.users.map((user: any) => ({
          id: user._id,
          name: user.name,
          username: user.username || user.name,
          email: user.email,
          mobile: user.mobile,
          profilePicture: user.profilePicture,
        }));
        setSearchResults(players);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error('Error searching players:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setSearchLoading(false);
    }
  }, [userToken, API_URL]);

  // Effect for debounced search
  useEffect(() => {
    searchPlayers(debouncedSearch);
  }, [debouncedSearch, searchPlayers]);

  const fetchTeamPlayers = async () => {
    if (!team?._id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/teams/${team._id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(userToken && { 'Authorization': `Bearer ${userToken}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team players');
      }

      const data = await response.json();
      const teamData = data.data || data;
      
      // Convert team players to Player format
      const players: Player[] = (teamData.players || []).map((p: any) => ({
        id: p._id || p.id,
        name: p.name || '',
        username: p.username || p.name || '',
        email: p.email,
        mobile: p.mobile,
        profilePicture: p.profilePicture,
        role: p.role,
      }));

      setTeamPlayers(players);
    } catch (error) {
      console.error('Error fetching team players:', error);
      // Fallback to team.players if API fails
      if (team?.players) {
        setTeamPlayers(team.players);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePlayerSelection = (player: Player) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.some(p => p.id === player.id);
      if (isSelected) {
        return prev.filter(p => p.id !== player.id);
      } else {
        // Ensure we don't add duplicates
        if (!prev.some(p => p.id === player.id)) {
          return [...prev, player];
        }
        return prev;
      }
    });
    // Clear search when player is selected
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleAddNewPlayer = (player: Player) => {
    // Add to team players if not already there
    setTeamPlayers(prev => {
      if (!prev.some(p => p.id === player.id)) {
        return [...prev, player];
      }
      return prev;
    });
    
    // Add to selected players if not already selected
    setSelectedPlayers(prev => {
      if (!prev.some(p => p.id === player.id)) {
        return [...prev, player];
      }
      return prev;
    });
    
    // Clear search
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleConfirm = () => {
    onConfirm(selectedPlayers);
    onClose();
  };

  const isPlayerSelected = (playerId: string) => {
    return selectedPlayers.some(p => p.id === playerId);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View 
          className="bg-white rounded-t-3xl"
          style={{ 
            maxHeight: '90%',
            height: '90%',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-800">
                Select Players
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {team?.name || 'Team'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Selected Count */}
          <View className="px-5 py-3 bg-gray-50 border-b border-gray-200">
            <Text className="text-sm text-gray-600">
              {selectedPlayers.length} player{selectedPlayers.length !== 1 ? 's' : ''} selected
            </Text>
          </View>

          {/* Search Bar */}
          <View className="px-5 py-3 border-b border-gray-200 bg-white">
            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Search to add new players..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-2 text-base text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <View className="mt-2 bg-white border-2 border-[#FFF201] rounded-lg max-h-48 shadow-lg" style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 1000 }}>
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item: player }) => {
                    const isAlreadyInTeam = teamPlayers.some(p => p.id === player.id);
                    const isSelected = selectedPlayers.some(p => p.id === player.id);
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (!isAlreadyInTeam) {
                            // Add new player to team and select them
                            handleAddNewPlayer(player);
                          } else {
                            // Player is already in team, just toggle selection
                            togglePlayerSelection(player);
                          }
                        }}
                        className={`flex-row items-center p-3 border-b border-gray-100 ${
                          isSelected ? 'bg-yellow-50' : 'bg-white'
                        }`}
                      >
                        <View className="w-10 h-10 rounded-full items-center justify-center bg-gray-200 overflow-hidden">
                          {player.profilePicture ? (
                            <Image
                              source={{ uri: player.profilePicture }}
                              className="w-10 h-10 rounded-full"
                              resizeMode="cover"
                            />
                          ) : (
                            <FontAwesome name="user" size={18} color="#9CA3AF" />
                          )}
                        </View>
                        <View className="flex-1 ml-3">
                          {player.name && (
                            <Text className="font-medium text-gray-800 text-sm">
                              {player.name}
                            </Text>
                          )}
                          {player.username && player.username !== player.name && (
                            <Text className="text-xs text-gray-500 mt-0.5">
                              @{player.username}
                            </Text>
                          )}
                        </View>
                        {isSelected ? (
                          <View className="flex-row items-center">
                            <View className="w-5 h-5 rounded-full bg-[#FFF201] items-center justify-center mr-2">
                              <Ionicons name="checkmark" size={12} color="black" />
                            </View>
                            <Text className="text-xs text-gray-600 font-medium">Selected</Text>
                          </View>
                        ) : isAlreadyInTeam ? (
                          <View className="flex-row items-center">
                            <Text className="text-xs text-gray-500 mr-2">In team</Text>
                            <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
                          </View>
                        ) : (
                          <Ionicons name="add-circle" size={20} color={theme.colors.primary} />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                  nestedScrollEnabled
                />
              </View>
            )}
            {searchLoading && (
              <View className="mt-2 items-center py-2">
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            )}
          </View>

          {/* Players List */}
          <View style={{ flex: 1 }}>
            {loading ? (
              <View className="py-20 items-center justify-center" style={{ flex: 1 }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text className="text-gray-500 mt-4">Loading players...</Text>
              </View>
            ) : teamPlayers.length === 0 ? (
              <View className="py-20 items-center justify-center" style={{ flex: 1 }}>
                <FontAwesome name="users" size={48} color="#D1D5DB" />
                <Text className="text-gray-500 mt-4 text-center px-5">
                  No players found in this team
                </Text>
              </View>
            ) : (
              <FlatList
                data={teamPlayers}
                keyExtractor={(item) => item.id}
                renderItem={({ item: player }) => {
                  const isSelected = isPlayerSelected(player.id);
                  return (
                    <TouchableOpacity
                      onPress={() => togglePlayerSelection(player)}
                      className={`flex-row items-center py-2.5 px-3 mb-2 mx-5 rounded-lg border ${
                        isSelected
                          ? 'bg-green-50 border-green-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      {/* Player Avatar */}
                      <View className="w-10 h-10 rounded-full items-center justify-center bg-gray-200 overflow-hidden">
                        {player.profilePicture ? (
                          <Image
                            source={{ uri: player.profilePicture }}
                            className="w-10 h-10 rounded-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <FontAwesome name="user" size={18} color="#9CA3AF" />
                        )}
                      </View>

                      {/* Player Info - Only Name and Username */}
                      <View className="flex-1 ml-3">
                        {player.name && (
                          <Text className="font-medium text-gray-800 text-sm">
                            {player.name}
                          </Text>
                        )}
                        {player.username && player.username !== player.name && (
                          <Text className="text-xs text-gray-500 mt-0.5">
                            @{player.username}
                          </Text>
                        )}
                        {!player.name && player.username && (
                          <Text className="font-medium text-gray-800 text-sm">
                            @{player.username}
                          </Text>
                        )}
                      </View>

                      {/* Selection Indicator */}
                      <View
                        className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                          isSelected
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark" size={12} color="white" />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
                contentContainerStyle={{ paddingVertical: 8, paddingBottom: 12 }}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
              />
            )}
          </View>

          {/* Footer Actions */}
          <View className="px-5 py-4 border-t border-gray-200 bg-white">
            <View className="flex-row" style={{ gap: 12 }}>
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 py-3 rounded-lg items-center border-2 border-gray-300"
              >
                <Text className="font-semibold text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                className="flex-1 py-3 rounded-lg items-center"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <Text className="font-semibold text-black">
                  Confirm ({selectedPlayers.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

