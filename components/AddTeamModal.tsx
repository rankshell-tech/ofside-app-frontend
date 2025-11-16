import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { TeamForm } from './TeamForm';
import { PlayerSearch } from './PlayerSearch';
import { SelectedPlayers } from './SelectedPlayers';
import { Player, Team } from "@/store/slices/matchScoringSlice";

interface AddTeamModalProps {
  visible: boolean;
  onClose: () => void;
  newTeam: any;
  setNewTeam: (team: any) => void;
  selectedPlayers: Player[];
  setSelectedPlayers: (players: Player[]) => void;
  loading: boolean;
  sport: string;
  onCreateTeam: () => Promise<void>;
  // Player search props
  playerSearchQuery: string;
  onPlayerSearchChange: (text: string) => void;
  playerSuggestions: Player[];
  playerLoading: boolean;
  onSelectPlayer: (player: Player) => void;
  onRemovePlayer: (playerId: string) => void;
}

export const AddTeamModal: React.FC<AddTeamModalProps> = ({
  visible,
  onClose,
  newTeam,
  setNewTeam,
  selectedPlayers,
  setSelectedPlayers,
  loading,
  sport,
  onCreateTeam,
  playerSearchQuery,
  onPlayerSearchChange,
  playerSuggestions,
  playerLoading,
  onSelectPlayer,
  onRemovePlayer
}) => {
  const handleTeamChange = (field: string, value: string) => {
    setNewTeam((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    if (!newTeam.name.trim()) {
      Alert.alert("Error", "Team name is required");
      return;
    }
    await onCreateTeam();
  };

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
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: '90%' }}>
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
              <TeamForm 
                team={newTeam}
                onTeamChange={handleTeamChange}
                sport={sport}
              />

              {/* Add Players Section */}
              <View className="mb-6">
                <Text className="text-lg font-bold mb-3">Add Players to Team</Text>
                
                <PlayerSearch
                  searchQuery={playerSearchQuery}
                  onSearchChange={onPlayerSearchChange}
                  suggestions={playerSuggestions}
                  loading={playerLoading}
                  onSelectPlayer={onSelectPlayer}
                  placeholder="Search players to add to team..."
                />

                <SelectedPlayers
                  players={selectedPlayers}
                  onRemovePlayer={onRemovePlayer}
                  title="Selected Players"
                />
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