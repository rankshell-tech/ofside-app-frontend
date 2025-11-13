import React, { useState, useCallback, use, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, FlatList, ImageBackground, Alert, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from '@/hooks/useTheme';
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import Constants from 'expo-constants';
import { ScrollableComponent } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from 'react-redux';
import { updateSetup, setTeams } from '@/store/slices/matchScoringSlice';
import { RootState } from "@/store";
const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';
import { Team,Player } from "@/store/slices/matchScoringSlice";



// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
// Move AddTeamModal outside the main component to prevent re-renders
const AddTeamModal = ({ 
  visible, 
  onClose, 
  newTeam, 
  setNewTeam, 
  selectedPlayers, 
  loading, 
  sport, 
  onCreateTeam 
}: any) => {
  const handleCreate = useCallback(async () => {
    await onCreateTeam();
  }, [onCreateTeam]);

  return (
<Modal
  visible={visible}
  animationType="slide"
  transparent={true}
  onRequestClose={onClose}
>
  <View style={{ flex: 1, justifyContent: 'flex-end' }}>
    {/* Backdrop */}
    <TouchableOpacity 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
      }} 
      onPress={onClose}
      activeOpacity={1}
    />
    
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View className="bg-white rounded-t-3xl" style={{ maxHeight: '85%' }}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-200">
          <Text className="text-xl font-bold">Create New Team</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="px-6 py-4" 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Team Name */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2">Team Name *</Text>
            <TextInput
              placeholder="Enter team name"
              value={newTeam.name}
              onChangeText={(text) => setNewTeam((prev: any) => ({...prev, name: text}))}
              className="border border-gray-300 rounded-lg p-3 bg-white"
              autoCapitalize="words"
            />
          </View>

          {/* Short Name */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2">Short Name</Text>
            <TextInput
              placeholder="Enter short name (optional)"
              value={newTeam.shortName}
              onChangeText={(text) => setNewTeam((prev: any) => ({...prev, shortName: text}))}
              className="border border-gray-300 rounded-lg p-3 bg-white"
              autoCapitalize="words"
            />
          </View>

           {/* Team Bio/Description */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2">Team Description</Text>
            <TextInput
              placeholder="Enter team description or bio (optional)"
              value={newTeam.description}
              onChangeText={(text) => setNewTeam((prev: any) => ({...prev, description: text}))}
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
              value={newTeam.logoUrl}
              onChangeText={(text) => setNewTeam((prev: any) => ({...prev, logoUrl: text}))}
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
              value={newTeam.captain}
              onChangeText={(text) => setNewTeam((prev: any) => ({...prev, captain: text}))}
              className="border border-gray-300 rounded-lg p-3 bg-white"
              autoCapitalize="words"
            />
          </View>

          {/* Home Ground/Venue */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2">Home Ground</Text>
            <TextInput
              placeholder="Enter home ground or venue (optional)"
              value={newTeam.homeGround}
              onChangeText={(text) => setNewTeam((prev: any) => ({...prev, homeGround: text}))}
              className="border border-gray-300 rounded-lg p-3 bg-white"
              autoCapitalize="words"
            />
          </View>

          {/* City/Location */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2">City</Text>
            <TextInput
              placeholder="Enter city (optional)"
              value={newTeam.city}
              onChangeText={(text) => setNewTeam((prev: any) => ({...prev, city: text}))}
              className="border border-gray-300 rounded-lg p-3 bg-white"
              autoCapitalize="words"
            />
          </View>

         


          {/* Selected Players Count */}
          <View className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Text className="text-sm font-medium text-center text-gray-800">
              Selected Players: {selectedPlayers.length}
            </Text>
            <Text className="text-xs text-gray-600 text-center mt-1">
              Players selected from the "Add Players" tab will be automatically added to this team
            </Text>
            {selectedPlayers.length > 0 && (
              <View className="mt-2">
                <Text className="text-xs text-green-600 text-center font-medium">
                  ✓ {selectedPlayers.length} player{selectedPlayers.length !== 1 ? 's' : ''} ready to join
                </Text>
              </View>
            )}
          </View>

          {/* Required Fields Note */}
          <View className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <Text className="text-xs text-yellow-800 text-center">
              * Required fields must be filled to create the team
            </Text>
          </View>
        </ScrollView>

        {/* Fixed buttons */}
        <View className="flex-row space-x-3 px-6 py-4 border-t border-gray-200 bg-white">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 border border-gray-300 rounded-lg py-3 items-center"
          >
            <Text className="text-gray-700 font-medium">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleCreate}
            disabled={loading || !newTeam.name.trim()}
            className={`flex-1 rounded-lg py-3 items-center ${
              loading || !newTeam.name.trim() ? 'bg-gray-400' : 'bg-black'
            }`}
          >
            <Text className="text-white font-medium">
              {loading ? "Creating..." : "Create Team"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  </View>
</Modal>
  );
};



export default function TeamsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { sport, format, activatedTab } = useLocalSearchParams<{ sport: string; format: string, activatedTab: "My Teams" }>();
  const [activeTab, setActiveTab] = useState<"My Teams" | "Opponents" | "Add Players">(activatedTab as any || "My Teams");
  const [searchOpponents, setSearchOpponents] = useState("");
  const [searchPlayer, setSearchPlayer] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [opponentTeam, setOpponentTeam] = useState<Team | null>(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
 
  
    const { setup } = useSelector((state: RootState) => state.matchScoring);

  
const handleTeamCreated = (newTeam: Team) => {
  const currentTeams = setup?.teams || [null, null];
  const teamIndex = activeTab === "My Teams" ? 0 : 1;
  
  const updatedTeams = [...currentTeams] as [Team | null, Team | null];
  updatedTeams[teamIndex] = newTeam;
  
  dispatch(setTeams(updatedTeams as [Team, Team]));
  router.back();
};
  
  const [players,setPlayers] = useState<Player[]>([]);
  
  // New team form state
  const [newTeam, setNewTeam] = useState({
    name: "",
    shortName: "",
    logoUrl: "",
    captain: "",
  });

  // const filteredPlayers = players.filter((p) =>
  //   p.name.toLowerCase().includes(searchPlayer.toLowerCase())
  // );

  const teams: Team[] = [
    { _id: "mmkhlkhlkhlhl", name: "Stallions", matches: 212, won: 126, loss: 86, location: "New Delhi", captain: "Swarti Jain", sport: "football", players: [] },
    { _id: "jkoj;j;j;j;", name: "Stallions", matches: 212, won: 126, loss: 86, location: "New Delhi", captain: "Swarti Jain", sport: "football", players: [] },
  ];


  // Memoized search function
const handleFetchPlayersOnSuggestion = useCallback(async (query: string): Promise<Player[]> => {
  if (!query.trim() || query.length < 2) return [];

  try {
    const response = await fetch(`${API_URL}/api/users/search?q=${encodeURIComponent(query.trim())}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && Array.isArray(data.users)) {
      return data.users.map((user: any) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profilePicture: user.profilePicture
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Fetch player suggestions error:', error);
    // You might want to show a toast message here
    return [];
  }
}, [API_URL]);

const [suggestions, setSuggestions] = useState<Player[]>([]);
  
  const debouncedSearch = useDebounce(searchPlayer, 300);
  // Trigger the search when debounced search changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearch.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await handleFetchPlayersOnSuggestion(debouncedSearch);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch, handleFetchPlayersOnSuggestion]);

  // Handle player selection from suggestions
  const handleSelectPlayer = (player: Player) => {
    // Check if player is already selected
    if (!selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers(prev => [...prev, player]);
    }
    setSearchPlayer(""); // Clear search
    setSuggestions([]); // Hide suggestions
  };

  // Remove selected player
  const handleRemovePlayer = (playerId: string) => {
    setSelectedPlayers(prev => prev.filter(p => p.id !== playerId));
  };



  // Toggle select all
  // const handleSelectAll = () => {
  //   if (selectAll) {
  //     setSelectedPlayers([]);
  //     setSelectAll(false);
  //   } else {
  //     setSelectedPlayers(filteredPlayers);
  //     setSelectAll(true);
  //   }
  // };

  // Toggle single player
  const togglePlayer = (id: string) => {
    const player = selectedPlayers.find(p => p.id === id);
    if (!player) return;
    
    if (selectedPlayers.find(p => p.id === id)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== id));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  // Create new team function
const createNewTeam = async () => {
  if (!newTeam.name.trim()) {
    Alert.alert("Error", "Team name is required");
    return;
  }

  if (!sport) {
    Alert.alert("Error", "Sport is required");
    return;
  }

  try {
    const teamData = {
      name: newTeam.name.trim(),
      shortName: newTeam.shortName.trim() || undefined,
      logoUrl: newTeam.logoUrl.trim() || undefined,
      sport: sport.toLowerCase(),
      players: selectedPlayers.map(p => p.id),
      captain: newTeam.captain.trim() || undefined,
      createdBy: "currentUserId"
    };
    setLoading(true);

    const response = await fetch(`${API_URL}/api/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create team');
    }

    const result = await response.json();
    
    // Call handleTeamCreated with the created team
    const createdTeam: Team = {
      _id: result.data._id || result.data.id,
      name: result.data.name,
      shortName: result.data.shortName,
      logoUrl: result.data.logoUrl,
      matches: result.data.matches || 0,
      won: result.data.won || 0,
      loss: result.data.loss || 0,
      location: result.data.location || '',
      captain: result.data.captain || '',
      sport: result.data.sport,
      players: result.data.players || []
    };
    
    handleTeamCreated(createdTeam);
    
    Alert.alert("Success", "Team created successfully!");
    setShowAddTeamModal(false);
    resetNewTeamForm();
    
  } catch (error: any) {
    console.error('Create team error:', error);
    Alert.alert("Error", error.message || "Failed to create team");
  } finally {
    setLoading(false);
  }
};
  const resetNewTeamForm = () => {
    setNewTeam({
      name: "",
      shortName: "",
      logoUrl: "",
      captain: "",
    });
  };

  const handleCloseModal = () => {
    setShowAddTeamModal(false);
    resetNewTeamForm();
  };


  const renderPlayerCard = ({ item: player }: { item: Player }) => {
    const isSelected = selectedPlayers.some(p => p.id === player.id);
    return (
      <TouchableOpacity
        onPress={() => togglePlayer(player.id)}
        className={`rounded-2xl border p-2 m-1 w-[48%] items-center shadow-sm ${
          isSelected ? "bg-[#55ba75]" : "bg-yellow-200"
        }`}
      >
        {/* Avatar */}
        <View
          style={{ backgroundColor: theme.colors.grey }}
          className="w-28 h-28 rounded-full items-center justify-center shadow"
        >
          <FontAwesome name="user" size={60} color={theme.colors.accent} />
        </View>
        {/* Name */}
        <Text className="text-lg font-bold">{player.name}</Text>
        {/* Role */}
        <Text className="text-gray-500 text-sm">{player.role}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/background.png")}
        resizeMode="contain"
        className="flex-1 bg-white"
      >
        {/* Header */}
        <View className="flex-row items-center p-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-8 h-8 bg-white rounded-full border border-gray-300 items-center justify-center mr-3"
          >
            <Entypo name="chevron-left" size={20} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold flex-1">Teams</Text>
        </View>

        {/* Tabs */}
        <View className="flex-row border border-gray-300 rounded-xl overflow-hidden mx-5">
          {["My Teams", "Opponents", "Add Players"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as typeof activeTab)}
              className={`flex-1 py-3 items-center ${
                activeTab === tab ? "bg-black" : "bg-white"
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
            <TouchableOpacity 
              onPress={() => setShowAddTeamModal(true)}
              className="mx-6 mt-6 rounded-lg py-3 flex-row justify-center items-center" 
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Text className="font-bold text-black mr-2">Add Team</Text>
              <FontAwesome name="plus" size={20} color="black" />
            </TouchableOpacity>

            {/* Teams List */}
            <ScrollView className="mt-6 px-4" showsVerticalScrollIndicator={false}>
              {teams.map((team) => (
                <TouchableOpacity
                  onPress={() => setMyTeam(team)}
                  key={team._id}
                  className="flex-row items-center bg-white border border-gray-300 rounded-2xl p-4 mb-4 shadow-sm"
                  style={{ backgroundColor: team?._id == myTeam?._id ? "#55ba75" : "white"}}
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
                      <TouchableOpacity>
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
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === "Opponents" && (
          <View className="flex-1">
            {/* Add Teams button */}
            <TouchableOpacity 
              onPress={() => setShowAddTeamModal(true)}
              className="mx-6 mt-6 rounded-lg py-3 flex-row justify-center items-center" 
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Text className="font-bold text-black mr-2">Add Team</Text>
              <FontAwesome name="plus" size={20} color="black" />
            </TouchableOpacity>

            {/* Opponents List */}
            <ScrollView className="mt-6 px-4" showsVerticalScrollIndicator={false}>
              {teams
                .filter((o) => o.name.toLowerCase().includes(searchOpponents.toLowerCase()))
                .map((team) => (
                  <TouchableOpacity
                    onPress={() => setOpponentTeam(team)}
                    key={team._id}
                    className="flex-row items-center bg-white border border-gray-300 rounded-2xl p-4 mb-4 shadow-sm"
                    style={{ backgroundColor: team?._id == opponentTeam?._id ? "#55ba75" : "white"}}
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
                        <TouchableOpacity>
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
                ))}
            </ScrollView>
          </View>
        )}

        {activeTab === "Add Players" && (
          <View className="flex-1 p-4">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-5">
              <View>
                <Text className="text-2xl font-bold">Stallions</Text>
                <Text className="text-gray-500 text-sm">Select Playing Team</Text>
              </View>

              <View>
                <TouchableOpacity
                  onPress={() => router.push("/scoring/addPlayer")}
                  className="px-2 py-1 rounded mb-2"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Text className="text-xs font-medium">+ Add new player</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  onPress={handleSelectAll}
                  className="flex-row justify-end items-center"
                >
                  <Text className="text-sm font-medium mr-2">
                    {selectAll ? "Deselect all" : "Select all"}
                  </Text>
                  <Ionicons
                    name={selectAll ? "checkbox" : "square-outline"}
                    size={18}
                    color="black"
                  />
                </TouchableOpacity> */}
              </View>
            </View>

     <View className="flex-1">
      {/* Search Bar with Loading Indicator */}
      <View className="flex-row items-center border border-gray-400 rounded-full px-4 mb-4 bg-white">
        <TextInput
          className="flex-1 text-base py-3"
          placeholder="Search player by name or username..."
          value={searchPlayer}
          onChangeText={setSearchPlayer}
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
      {searchPlayer.length === 1 && (
        <Text className="text-xs text-gray-500 mb-2 px-2">
          Type at least 2 characters to search...
        </Text>
      )}

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <View className="bg-white border border-gray-300 rounded-lg mb-4 max-h-60 shadow-lg">
          <ScrollView 
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {suggestions.map((player) => (
              <TouchableOpacity
                key={player.id}
                onPress={() => handleSelectPlayer(player)}
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
                      <Text className="text-gray-500 text-sm mr-3">{player.username}</Text>
                    )}
                    {player.mobile && (
                      <Text className="text-gray-500 text-sm">{player.email}</Text>
                    )}
                  </View>
                </View>
                
                {/* Add Button */}
                <TouchableOpacity 
                  onPress={() => handleSelectPlayer(player)}
                  className="bg-green-500 px-3 py-1 rounded-full"
                >
                  <Text className="text-white text-sm font-medium">Add</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* No Results Message */}
      {debouncedSearch.length >= 2 && suggestions.length === 0 && !loading && (
        <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <Text className="text-yellow-800 text-center">
            No players found for "{debouncedSearch}"
          </Text>
        </View>
      )}

      {/* Selected Players Section */}
      {selectedPlayers.length > 0 && (
     <View className="mb-6">
  <Text className="text-lg font-bold mb-3">
    Selected Players ({selectedPlayers.length})
  </Text>
  
  {selectedPlayers.length > 0 ? (
 <FlatList
      data={selectedPlayers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderPlayerCard}
      numColumns={3} // 👈 shows 3 per row
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: 10,
        paddingHorizontal: 4,
      }}
    />
  ) : (
    <View className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <Text className="text-gray-500 text-center">
        No players selected yet. Search and add players above.
      </Text>
    </View>
  )}
</View>
      )}

 
    
    </View>

            {/* Next Button */}
            <TouchableOpacity
              onPress={() => router.push({
                pathname: "/scoring/matchSetupScreen",
                params: { sport, format },
              })}
              className="py-3 rounded-md mt-3"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Text className="text-center text-black font-bold text-base">Next</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Add Team Modal - Now properly separated */}
        <AddTeamModal
          visible={showAddTeamModal}
          onClose={handleCloseModal}
          newTeam={newTeam}
          setNewTeam={setNewTeam}
          selectedPlayers={selectedPlayers}
          loading={loading}
          sport={sport}
          onCreateTeam={createNewTeam}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}