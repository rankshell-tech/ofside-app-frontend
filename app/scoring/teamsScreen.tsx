import React, { useState, useCallback, useEffect, use } from "react";
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { useTheme } from '@/hooks/useTheme';
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from 'react-redux';
import { setTeams } from '@/store/slices/matchScoringSlice';
import { RootState } from "@/store";
import { Team, Player } from "@/store/slices/matchScoringSlice";

// Components
import { AddTeamModal } from '@/components/AddTeamModal';
import { TeamCard } from '@/components/TeamCard';

import { AppDispatch } from '@/store';
// Hooks
import { useDebounce } from '@/hooks/useDebounce';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

// Services
const playerSearchService = {
  searchPlayers: async (query: string): Promise<Player[]> => {
    if (!query.trim() || query.length < 2) return [];
    console.log("hellooo")
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
      return [];
    }
  }
};

export default function TeamsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { sport, format, activatedTab } = useLocalSearchParams<{ 
    sport: string; 
    format: string; 
    activatedTab: "My Teams" 
  }>();
  
  // State
  const [activeTab, setActiveTab] = useState<"My Teams" | "Opponents">(
    activatedTab as any || "My Teams"
  );
  const [searchOpponents, setSearchOpponents] = useState("");
  const [searchPlayer, setSearchPlayer] = useState("");
  const [modalSearchPlayer, setModalSearchPlayer] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [opponentTeam, setOpponentTeam] = useState<Team | null>(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Player[]>([]);
  const [modalSuggestions, setModalSuggestions] = useState<Player[]>([]);

  const [bothTeamsSelected, setBothTeamsSelected] = useState(false);



  useEffect(() => {
    setBothTeamsSelected(selectedTeam !== null && opponentTeam !== null);
  }, [selectedTeam, opponentTeam]);

  // Debounced searches
  const debouncedSearch = useDebounce(searchPlayer, 300);
  const debouncedModalSearch = useDebounce(modalSearchPlayer, 300);

  const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
  const { setup } = useSelector((state: RootState) => state.matchScoring);

  // Team creation state
  const [newTeam, setNewTeam] = useState({
    name: "",
    shortName: "",
    logoUrl: "",
    captain: "",
    description: "",
    homeGround: "",
    city: ""
  });

  const [teams, setTeams] = useState<Team[]>([]);


  const handleFetchAllTeams = async () => {
    console.log("Fetching teams...");
      setLoading(true);
      
      const response = await fetch(`${API_URL}/api/teams?user=${user?._id || "68a02a5aff19fcb1bfe9236b"}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const teams = await response.json();
      
      setTeams(teams.data);
      setLoading(false);
      // You can set the teams state here if you have one
  }

  useEffect(() => {
    handleFetchAllTeams();
  }, []);

  // Search handlers
  const handleSearchPlayers = useCallback(async (query: string, setSuggestions: React.Dispatch<React.SetStateAction<Player[]>>) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setPlayerLoading(true);
    try {
      const results = await playerSearchService.searchPlayers(query);
      setSuggestions(results);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setPlayerLoading(false);
    }
  }, []);

  // Effects for debounced search
  useEffect(() => {
    handleSearchPlayers(debouncedSearch, setSuggestions);
  }, [debouncedSearch, handleSearchPlayers]);

  useEffect(() => {
    handleSearchPlayers(debouncedModalSearch, setModalSuggestions);
  }, [debouncedModalSearch, handleSearchPlayers]);

  // Player selection handlers
  const handleSelectPlayer = (player: Player, setSelected: React.Dispatch<React.SetStateAction<Player[]>>, setSearch: React.Dispatch<React.SetStateAction<string>>, setSuggestions: React.Dispatch<React.SetStateAction<Player[]>>) => {
    setSelected(prev => {
      if (!prev.find(p => p.id === player.id)) {
        return [...prev, player];
      }
      return prev;
    });
    setSearch("");
    setSuggestions([]);
  };

  const handleRemovePlayer = (playerId: string, setSelected: React.Dispatch<React.SetStateAction<Player[]>>) => {
    setSelected(prev => prev.filter(p => p.id !== playerId));
  };

  // Team creation
  const handleTeamCreated = (newTeam: Team) => {
    const currentTeams = setup?.teams || [null, null];
    const teamIndex = activeTab === "My Teams" ? 0 : 1;
    
    const updatedTeams = [...currentTeams] as [Team | null, Team | null];
    updatedTeams[teamIndex] = newTeam;
    setTeams(updatedTeams as [Team, Team]);
    setShowAddTeamModal(false);
  };


     
  const createNewTeam = async () => {
    if (!newTeam.name.trim()) {
      Alert.alert("Error", "Team name is required");
      return;
    }

    try {
      const teamData = {
        name: newTeam.name.trim(),
        logoUrl: newTeam.logoUrl.trim() || undefined,
        sport: sport.toLowerCase(),
        players: selectedPlayers.map(p => p.id),
        captain: newTeam.captain.trim() || undefined,
        description: newTeam.description.trim() || undefined,
        homeGround: newTeam.homeGround.trim() || undefined,
        city: newTeam.city.trim() || undefined,
        createdBy: user?._id
      };
      
      setLoading(true);
      const response = await fetch(`${API_URL}/api/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdTeam = await response.json();
      handleTeamCreated(createdTeam);
    } catch (error: any) {
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
      description: "",
      homeGround: "",
      city: ""
    });
    setSelectedPlayers([]);
    setModalSearchPlayer("");
    setModalSuggestions([]);
  };

  const handleCloseModal = () => {
    setShowAddTeamModal(false);
    resetNewTeamForm();
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
          {["My Teams", "Opponents"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as typeof activeTab)}
              className={`flex-1 py-3 items-center ${
                activeTab === tab ? "bg-black" : "bg-white"
              }`}
            >
              <Text className={activeTab === tab ? "text-white font-bold" : "text-black"}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {activeTab === "My Teams" && (
          <View className="flex-1">
              <Text className="mx-6 mt-6 text-lg font-bold text-black mr-2">Select a Team</Text>
              
            <TouchableOpacity 
              onPress={() => setShowAddTeamModal(true)}
              className="mx-6 mt-6 rounded-lg py-3 flex-row justify-center items-center" 
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Text className="font-bold text-black mr-2">Create New Team</Text>
              <FontAwesome name="plus" size={20} color="black" />
            </TouchableOpacity>

            <ScrollView className="mt-6 px-4" showsVerticalScrollIndicator={false}>
              {teams?.map((team) => (
                <TeamCard
                  key={team._id}
                  team={team}
                  isSelected={team._id === selectedTeam?._id}
                  onSelect={setSelectedTeam}
                  onEditTeam={() => {
                    setSelectedTeam(team);
                    setShowAddTeamModal(true);
                  }}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === "Opponents" && (
          <View className="flex-1">
            <TouchableOpacity 
              onPress={() => setShowAddTeamModal(true)}
              className="mx-6 mt-6 rounded-lg py-3 flex-row justify-center items-center" 
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Text className="font-bold text-black mr-2">Add Team</Text>
              <FontAwesome name="plus" size={20} color="black" />
            </TouchableOpacity>

            <ScrollView className="mt-6 px-4" showsVerticalScrollIndicator={false}>
              {teams
                .filter((o) => o.name.toLowerCase().includes(searchOpponents.toLowerCase()))
                .map((team) => (
                  <TeamCard
                    key={team._id}
                    team={team}
                    isSelected={team._id === opponentTeam?._id}
                    onSelect={setOpponentTeam}
                    onEditTeam={() => {
                      setOpponentTeam(team);
                      setShowAddTeamModal(true);
                    }}
                  />
                ))}
            </ScrollView>

             
          </View>
        )}

        { <TouchableOpacity
              disabled={!bothTeamsSelected}

              
                onPress={() => {
    if (selectedTeam && opponentTeam) {
      // Create teams array from individual team objects
      const teamsArray = [selectedTeam, opponentTeam];
      
      router.push({
        pathname: "/scoring/matchSetupScreen",
        params: { 
          sport, 
          format,
          teams: JSON.stringify(teamsArray) // ✅ Pass as array
        },
      });
    }
  }}
              className={`py-3 mx-4 rounded-md mt-3 ${bothTeamsSelected ? 'text-red-600' : ' text-white opacity-50'}`}
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Text className={`text-center text-black font-bold text-base  `}>{bothTeamsSelected ? "Next" : "Please Select Both Teams"}</Text>
            </TouchableOpacity>}

        <AddTeamModal
          visible={showAddTeamModal}
          onClose={handleCloseModal}
          newTeam={newTeam}
          setNewTeam={setNewTeam}
          selectedPlayers={selectedPlayers}
          setSelectedPlayers={setSelectedPlayers}
          loading={loading}
          sport={sport}
          onCreateTeam={createNewTeam}
          playerSearchQuery={modalSearchPlayer}
          onPlayerSearchChange={setModalSearchPlayer}
          playerSuggestions={modalSuggestions}
          playerLoading={playerLoading}
          onSelectPlayer={(player) => handleSelectPlayer(player, setSelectedPlayers, setModalSearchPlayer, setModalSuggestions)}
          onRemovePlayer={(playerId) => handleRemovePlayer(playerId, setSelectedPlayers)}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}