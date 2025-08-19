import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Clock, Users, Undo, Settings, User, Mail, Phone, X } from 'lucide-react-native';
import { ScorerFactory } from '@/lib/scoring/ScorerFactory';
import { IScorer } from '@/lib/scoring/base/IScorer';
import { SportName, Side, MatchState, Player, MatchPlayers } from '@/types/scoring';
import { SPORT_CONFIGS } from '@/lib/scoring/configs';

export default function ScoringScreen() {
  const router = useRouter();
  const theme = useTheme();
  
  const [selectedSport, setSelectedSport] = useState<SportName>('badminton');
  const [scorer, setScorer] = useState<IScorer | null>(null);
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [isMatchActive, setIsMatchActive] = useState(false);
  const [showSportSelector, setShowSportSelector] = useState(false);
  const [showPlayerSetup, setShowPlayerSetup] = useState(false);
  const [matchPlayers, setMatchPlayers] = useState<MatchPlayers | null>(null);
  
  // Player registration form state
  const [playerAForm, setPlayerAForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [playerBForm, setPlayerBForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const supportedSports: Array<{ id: SportName; name: string; icon: string }> = [
    { id: 'badminton', name: 'Badminton', icon: '🏸' },
    { id: 'tennis', name: 'Tennis', icon: '🎾' },
    { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
    { id: 'football', name: 'Football', icon: '⚽' },
    { id: 'pickleball', name: 'Pickleball', icon: '🏓' },
  ];

  useEffect(() => {
    initializeScorer();
  }, [selectedSport]);

  const initializeScorer = () => {
    try {
      const newScorer = ScorerFactory.create(selectedSport);
      setScorer(newScorer);
      setMatchState(newScorer.getState());
      setIsMatchActive(false);
    } catch (error) {
      console.error('Failed to initialize scorer:', error);
      Alert.alert('Error', 'Failed to initialize scoring system');
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validatePlayerForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    // Validate Player A
    if (!playerAForm.name.trim()) {
      errors.playerAName = 'Player A name is required';
    }
    if (!playerAForm.email.trim()) {
      errors.playerAEmail = 'Player A email is required';
    } else if (!validateEmail(playerAForm.email)) {
      errors.playerAEmail = 'Invalid email format for Player A';
    }
    if (!playerAForm.phone.trim()) {
      errors.playerAPhone = 'Player A phone is required';
    } else if (!validatePhone(playerAForm.phone)) {
      errors.playerAPhone = 'Invalid phone format for Player A';
    }

    // Validate Player B
    if (!playerBForm.name.trim()) {
      errors.playerBName = 'Player B name is required';
    }
    if (!playerBForm.email.trim()) {
      errors.playerBEmail = 'Player B email is required';
    } else if (!validateEmail(playerBForm.email)) {
      errors.playerBEmail = 'Invalid email format for Player B';
    }
    if (!playerBForm.phone.trim()) {
      errors.playerBPhone = 'Player B phone is required';
    } else if (!validatePhone(playerBForm.phone)) {
      errors.playerBPhone = 'Invalid phone format for Player B';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const setupPlayers = () => {
    if (!validatePlayerForm()) {
      return;
    }

    const players: MatchPlayers = {
      playerA: {
        id: Date.now().toString(),
        name: playerAForm.name.trim(),
        email: playerAForm.email.trim(),
        phone: playerAForm.phone.trim(),
      },
      playerB: {
        id: (Date.now() + 1).toString(),
        name: playerBForm.name.trim(),
        email: playerBForm.email.trim(),
        phone: playerBForm.phone.trim(),
      },
    };

    setMatchPlayers(players);
    setShowPlayerSetup(false);
    
    // Auto-start match after player setup
    setIsMatchActive(true);
  };

  const startMatch = () => {
    if (!matchPlayers) {
      setShowPlayerSetup(true);
      return;
    }
    setIsMatchActive(true);
  };

  const addPoint = (side: Side) => {
    if (!scorer || !isMatchActive || !matchPlayers) return;
    
    scorer.addPoint(side);
    const newState = scorer.getState();
    setMatchState(newState);
    
    if (newState.over) {
      setIsMatchActive(false);
      const winnerPlayer = newState.winner === 0 ? matchPlayers.playerA : matchPlayers.playerB;
      Alert.alert(
        'Match Complete!',
        `${winnerPlayer.name} wins!\n\n${scorer.getScore()}`,
        [{ text: 'OK' }]
      );
    }
  };

  const undoLastPoint = () => {
    if (!scorer) return;
    
    scorer.undoLast();
    setMatchState(scorer.getState());
  };

  const resetMatch = () => {
    Alert.alert(
      'Reset Match',
      'Are you sure you want to reset the current match?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            if (scorer) {
              scorer.reset();
              setMatchState(scorer.getState());
              setIsMatchActive(false);
            }
          }
        }
      ]
    );
  };

  const changeSport = (sport: SportName) => {
    setSelectedSport(sport);
    setShowSportSelector(false);
    setMatchPlayers(null);
    setIsMatchActive(false);
  };

  const getSportIcon = (sport: SportName) => {
    return supportedSports.find(s => s.id === sport)?.icon || '🏆';
  };

  const getSportName = (sport: SportName) => {
    return supportedSports.find(s => s.id === sport)?.name || sport;
  };

  const getParticipantLabel = (sport: SportName) => {
    const config = SPORT_CONFIGS[sport];
    switch (config.participants) {
      case 'teams': return 'Team';
      case 'doubles': return 'Pair';
      default: return 'Player';
    }
  };

  const renderScoreDisplay = () => {
    if (!matchState || !scorer || !matchPlayers) return null;

    return (
      <View style={[styles.scoreDisplay, { backgroundColor: theme.colors.background }]}>
        <View style={styles.scoreHeader}>
          <ThemedText size="lg" weight="bold">
            {getSportName(selectedSport)} Match
          </ThemedText>
          <ThemedText size="lg">{getSportIcon(selectedSport)}</ThemedText>
        </View>

        {/* Player Names */}
        <View style={styles.playersHeader}>
          <ThemedText size="base" weight="medium" style={styles.playerName}>
            {matchPlayers.playerA.name}
          </ThemedText>
          <ThemedText size="sm" variant="secondary">vs</ThemedText>
          <ThemedText size="base" weight="medium" style={styles.playerName}>
            {matchPlayers.playerB.name}
          </ThemedText>
        </View>

        {/* Main Score */}
        <View style={styles.mainScore}>
          <View style={styles.playerScore}>
            <ThemedText size="sm" variant="secondary">{matchPlayers.playerA.name}</ThemedText>
            <ThemedText size="4xl" weight="bold" style={{ color: theme.colors.primary }}>
              {matchState.currentUnit.a}
            </ThemedText>
          </View>
          
          <View style={styles.scoreDivider}>
            <ThemedText size="2xl" weight="bold" variant="secondary">–</ThemedText>
          </View>
          
          <View style={styles.playerScore}>
            <ThemedText size="sm" variant="secondary">{matchPlayers.playerB.name}</ThemedText>
            <ThemedText size="4xl" weight="bold" style={{ color: theme.colors.primary }}>
              {matchState.currentUnit.b}
            </ThemedText>
          </View>
        </View>

        {/* Current Unit Label */}
        <ThemedText size="base" variant="secondary" style={styles.unitLabel}>
          {matchState.currentUnit.label}
        </ThemedText>

        {/* Sport-specific details */}
        {selectedSport === 'tennis' && matchState.tennis && (
          <View style={styles.tennisDetails}>
            <ThemedText size="sm" variant="secondary">
              Games: {matchState.tennis.games.a}–{matchState.tennis.games.b}
            </ThemedText>
            <ThemedText size="sm" variant="secondary">
              Points: {matchState.tennis.points.labelA}–{matchState.tennis.points.labelB}
            </ThemedText>
            {matchState.tennis.tiebreak && (
              <ThemedText size="sm" style={{ color: theme.colors.warning }}>
                Tiebreak in progress
              </ThemedText>
            )}
            <ThemedText size="xs" variant="secondary">
              Server: {matchState.tennis.server === 0 ? matchPlayers.playerA.name : matchPlayers.playerB.name}
            </ThemedText>
          </View>
        )}

        {selectedSport === 'badminton' && matchState.badminton?.isGoldenPoint && (
          <View style={[styles.goldenPoint, { backgroundColor: theme.colors.warning }]}>
            <ThemedText size="sm" weight="bold" style={{ color: theme.colors.background }}>
              🏆 GOLDEN POINT
            </ThemedText>
          </View>
        )}

        {selectedSport === 'volleyball' && matchState.volleyball?.decidingSetTo && (
          <View style={[styles.decidingSet, { backgroundColor: theme.colors.accent }]}>
            <ThemedText size="sm" weight="bold" style={{ color: theme.colors.background }}>
              Deciding Set (to {matchState.volleyball.decidingSetTo})
            </ThemedText>
          </View>
        )}

        {selectedSport === 'football' && matchState.football && (
          <View style={styles.footballDetails}>
            <ThemedText size="sm" variant="secondary">
              Period: {matchState.football.period}
            </ThemedText>
            <ThemedText size="sm" variant="secondary">
              Time: {Math.floor(matchState.football.secondsElapsed / 60)}:{(matchState.football.secondsElapsed % 60).toString().padStart(2, '0')}
            </ThemedText>
          </View>
        )}

        {/* Sets/Games Summary */}
        {matchState.setsOrGamesSummary.length > 0 && (
          <View style={styles.setsHistory}>
            <ThemedText size="sm" variant="secondary" style={styles.historyTitle}>
              Completed Sets/Games:
            </ThemedText>
            <View style={styles.historyContainer}>
              {matchState.setsOrGamesSummary.map((set, index) => (
                <View key={index} style={[styles.historyItem, { backgroundColor: theme.colors.surface }]}>
                  <ThemedText size="xs" weight="medium">
                    {set.a}–{set.b}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Human-readable score */}
        <View style={[styles.readableScore, { backgroundColor: theme.colors.surface }]}>
          <ThemedText size="sm" style={styles.readableScoreText}>
            {scorer.getScore()}
          </ThemedText>
        </View>
      </View>
    );
  };

  const renderPlayerSetupModal = () => (
    <Modal
      visible={showPlayerSetup}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowPlayerSetup(false)}
    >
      <KeyboardAvoidingView 
        style={styles.modalContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText size="lg" weight="bold">
              Setup {getParticipantLabel(selectedSport)}s
            </ThemedText>
            <TouchableOpacity onPress={() => setShowPlayerSetup(false)}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <ThemedText size="base" variant="secondary" style={styles.setupDescription}>
              Enter {getParticipantLabel(selectedSport).toLowerCase()} details for match analytics and tracking
            </ThemedText>

            {/* Player A Form */}
            <View style={[styles.playerForm, { backgroundColor: theme.colors.background }]}>
              <View style={styles.playerFormHeader}>
                <View style={[styles.playerIcon, { backgroundColor: theme.colors.primary }]}>
                  <User size={20} color={theme.colors.accent} />
                </View>
                <ThemedText size="lg" weight="bold">
                  {getParticipantLabel(selectedSport)} A
                </ThemedText>
              </View>

              <View style={styles.inputContainer}>
                <ThemedText size="sm" weight="medium" style={styles.inputLabel}>
                  Full Name *
                </ThemedText>
                <View style={styles.inputWrapper}>
                  <User size={16} color={theme.colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { 
                      color: theme.colors.text,
                      backgroundColor: theme.colors.surface,
                      borderColor: formErrors.playerAName ? theme.colors.error : theme.colors.border 
                    }]}
                    value={playerAForm.name}
                    onChangeText={(text) => {
                      setPlayerAForm(prev => ({ ...prev, name: text }));
                      if (formErrors.playerAName) {
                        setFormErrors(prev => ({ ...prev, playerAName: '' }));
                      }
                    }}
                    placeholder="Enter full name"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
                {formErrors.playerAName && (
                  <ThemedText size="xs" style={{ color: theme.colors.error, marginTop: 4 }}>
                    {formErrors.playerAName}
                  </ThemedText>
                )}
              </View>

              <View style={styles.inputContainer}>
                <ThemedText size="sm" weight="medium" style={styles.inputLabel}>
                  Email Address *
                </ThemedText>
                <View style={styles.inputWrapper}>
                  <Mail size={16} color={theme.colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { 
                      color: theme.colors.text,
                      backgroundColor: theme.colors.surface,
                      borderColor: formErrors.playerAEmail ? theme.colors.error : theme.colors.border 
                    }]}
                    value={playerAForm.email}
                    onChangeText={(text) => {
                      setPlayerAForm(prev => ({ ...prev, email: text }));
                      if (formErrors.playerAEmail) {
                        setFormErrors(prev => ({ ...prev, playerAEmail: '' }));
                      }
                    }}
                    placeholder="Enter email address"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {formErrors.playerAEmail && (
                  <ThemedText size="xs" style={{ color: theme.colors.error, marginTop: 4 }}>
                    {formErrors.playerAEmail}
                  </ThemedText>
                )}
              </View>

              <View style={styles.inputContainer}>
                <ThemedText size="sm" weight="medium" style={styles.inputLabel}>
                  Phone Number *
                </ThemedText>
                <View style={styles.inputWrapper}>
                  <Phone size={16} color={theme.colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { 
                      color: theme.colors.text,
                      backgroundColor: theme.colors.surface,
                      borderColor: formErrors.playerAPhone ? theme.colors.error : theme.colors.border 
                    }]}
                    value={playerAForm.phone}
                    onChangeText={(text) => {
                      setPlayerAForm(prev => ({ ...prev, phone: text }));
                      if (formErrors.playerAPhone) {
                        setFormErrors(prev => ({ ...prev, playerAPhone: '' }));
                      }
                    }}
                    placeholder="Enter phone number"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="phone-pad"
                  />
                </View>
                {formErrors.playerAPhone && (
                  <ThemedText size="xs" style={{ color: theme.colors.error, marginTop: 4 }}>
                    {formErrors.playerAPhone}
                  </ThemedText>
                )}
              </View>
            </View>

            {/* Player B Form */}
            <View style={[styles.playerForm, { backgroundColor: theme.colors.background }]}>
              <View style={styles.playerFormHeader}>
                <View style={[styles.playerIcon, { backgroundColor: theme.colors.accent }]}>
                  <User size={20} color={theme.colors.background} />
                </View>
                <ThemedText size="lg" weight="bold">
                  {getParticipantLabel(selectedSport)} B
                </ThemedText>
              </View>

              <View style={styles.inputContainer}>
                <ThemedText size="sm" weight="medium" style={styles.inputLabel}>
                  Full Name *
                </ThemedText>
                <View style={styles.inputWrapper}>
                  <User size={16} color={theme.colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { 
                      color: theme.colors.text,
                      backgroundColor: theme.colors.surface,
                      borderColor: formErrors.playerBName ? theme.colors.error : theme.colors.border 
                    }]}
                    value={playerBForm.name}
                    onChangeText={(text) => {
                      setPlayerBForm(prev => ({ ...prev, name: text }));
                      if (formErrors.playerBName) {
                        setFormErrors(prev => ({ ...prev, playerBName: '' }));
                      }
                    }}
                    placeholder="Enter full name"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
                {formErrors.playerBName && (
                  <ThemedText size="xs" style={{ color: theme.colors.error, marginTop: 4 }}>
                    {formErrors.playerBName}
                  </ThemedText>
                )}
              </View>

              <View style={styles.inputContainer}>
                <ThemedText size="sm" weight="medium" style={styles.inputLabel}>
                  Email Address *
                </ThemedText>
                <View style={styles.inputWrapper}>
                  <Mail size={16} color={theme.colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { 
                      color: theme.colors.text,
                      backgroundColor: theme.colors.surface,
                      borderColor: formErrors.playerBEmail ? theme.colors.error : theme.colors.border 
                    }]}
                    value={playerBForm.email}
                    onChangeText={(text) => {
                      setPlayerBForm(prev => ({ ...prev, email: text }));
                      if (formErrors.playerBEmail) {
                        setFormErrors(prev => ({ ...prev, playerBEmail: '' }));
                      }
                    }}
                    placeholder="Enter email address"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {formErrors.playerBEmail && (
                  <ThemedText size="xs" style={{ color: theme.colors.error, marginTop: 4 }}>
                    {formErrors.playerBEmail}
                  </ThemedText>
                )}
              </View>

              <View style={styles.inputContainer}>
                <ThemedText size="sm" weight="medium" style={styles.inputLabel}>
                  Phone Number *
                </ThemedText>
                <View style={styles.inputWrapper}>
                  <Phone size={16} color={theme.colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { 
                      color: theme.colors.text,
                      backgroundColor: theme.colors.surface,
                      borderColor: formErrors.playerBPhone ? theme.colors.error : theme.colors.border 
                    }]}
                    value={playerBForm.phone}
                    onChangeText={(text) => {
                      setPlayerBForm(prev => ({ ...prev, phone: text }));
                      if (formErrors.playerBPhone) {
                        setFormErrors(prev => ({ ...prev, playerBPhone: '' }));
                      }
                    }}
                    placeholder="Enter phone number"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="phone-pad"
                  />
                </View>
                {formErrors.playerBPhone && (
                  <ThemedText size="xs" style={{ color: theme.colors.error, marginTop: 4 }}>
                    {formErrors.playerBPhone}
                  </ThemedText>
                )}
              </View>
            </View>

            {/* Analytics Info */}
            <View style={[styles.analyticsInfo, { backgroundColor: theme.colors.surface }]}>
              <ThemedText size="sm" weight="bold" style={styles.analyticsTitle}>
                📊 Player Analytics
              </ThemedText>
              <ThemedText size="xs" variant="secondary" style={styles.analyticsText}>
                Player data will be used for performance tracking, match history, and personalized insights.
              </ThemedText>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={() => setShowPlayerSetup(false)}
              variant="outline"
              style={styles.modalButton}
            />
            <Button
              title="Start Match"
              onPress={setupPlayers}
              style={styles.modalButton}
            />
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          Live Scoring
        </ThemedText>
        <TouchableOpacity onPress={() => setShowSportSelector(true)}>
          <Settings size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Sport Selection */}
        <View style={[styles.sportSelector, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity 
            style={styles.currentSport}
            onPress={() => setShowSportSelector(true)}
          >
            <ThemedText size="lg">{getSportIcon(selectedSport)}</ThemedText>
            <ThemedText size="base" weight="bold" style={styles.sportName}>
              {getSportName(selectedSport)}
            </ThemedText>
            <ThemedText size="sm" variant="secondary">Tap to change sport</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Player Setup Status */}
        {!matchPlayers && (
          <View style={[styles.setupPrompt, { backgroundColor: theme.colors.surface }]}>
            <Users size={24} color={theme.colors.primary} />
            <ThemedText size="base" weight="medium" style={styles.setupTitle}>
              Setup {getParticipantLabel(selectedSport)}s
            </ThemedText>
            <ThemedText size="sm" variant="secondary" style={styles.setupDescription}>
              Add {getParticipantLabel(selectedSport).toLowerCase()} details before starting the match
            </ThemedText>
            <Button
              title={`Add ${getParticipantLabel(selectedSport)}s`}
              onPress={() => setShowPlayerSetup(true)}
              size="md"
              style={styles.setupButton}
            />
          </View>
        )}

        {/* Score Display */}
        {renderScoreDisplay()}

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          {!isMatchActive ? (
            <Button
              title={matchPlayers ? "Start Match" : `Setup ${getParticipantLabel(selectedSport)}s`}
              onPress={startMatch}
              size="lg"
              style={styles.startButton}
            />
          ) : (
            <View style={styles.scoringButtons}>
              <TouchableOpacity
                style={[styles.scoreButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => addPoint(0)}
              >
                <ThemedText size="lg" weight="bold" style={{ color: theme.colors.accent }}>
                  +1
                </ThemedText>
                <ThemedText size="sm" style={{ color: theme.colors.accent }}>
                  {matchPlayers?.playerA.name || 'Player A'}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.scoreButton, { backgroundColor: theme.colors.accent }]}
                onPress={() => addPoint(1)}
              >
                <ThemedText size="lg" weight="bold" style={{ color: theme.colors.background }}>
                  +1
                </ThemedText>
                <ThemedText size="sm" style={{ color: theme.colors.background }}>
                  {matchPlayers?.playerB.name || 'Player B'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
              onPress={undoLastPoint}
              disabled={!scorer || scorer.getEvents().length === 0}
            >
              <Undo size={20} color={theme.colors.textSecondary} />
              <ThemedText size="sm" variant="secondary" style={styles.actionText}>
                Undo
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
              onPress={resetMatch}
            >
              <RotateCcw size={20} color={theme.colors.textSecondary} />
              <ThemedText size="sm" variant="secondary" style={styles.actionText}>
                Reset
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => setShowPlayerSetup(true)}
            >
              <Users size={20} color={theme.colors.textSecondary} />
              <ThemedText size="sm" variant="secondary" style={styles.actionText}>
                Players
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Match Info */}
        <View style={[styles.matchInfo, { backgroundColor: theme.colors.surface }]}>
          <ThemedText size="sm" weight="bold" style={styles.infoTitle}>
            Match Configuration
          </ThemedText>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <ThemedText variant="secondary" size="xs">Format:</ThemedText>
              <ThemedText size="xs" weight="medium">
                Best of {SPORT_CONFIGS[selectedSport].bestOf}
              </ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText variant="secondary" size="xs">Participants:</ThemedText>
              <ThemedText size="xs" weight="medium">
                {SPORT_CONFIGS[selectedSport].participants}
              </ThemedText>
            </View>
            {SPORT_CONFIGS[selectedSport].winUnitsTo && (
              <View style={styles.infoItem}>
                <ThemedText variant="secondary" size="xs">Points to win:</ThemedText>
                <ThemedText size="xs" weight="medium">
                  {SPORT_CONFIGS[selectedSport].winUnitsTo}
                </ThemedText>
              </View>
            )}
            {SPORT_CONFIGS[selectedSport].mustWinBy && (
              <View style={styles.infoItem}>
                <ThemedText variant="secondary" size="xs">Must win by:</ThemedText>
                <ThemedText size="xs" weight="medium">
                  {SPORT_CONFIGS[selectedSport].mustWinBy}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Player Setup Modal */}
      {renderPlayerSetupModal()}

      {/* Sport Selector Modal */}
      <Modal
        visible={showSportSelector}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSportSelector(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText size="lg" weight="bold">
              Select Sport
            </ThemedText>
            <TouchableOpacity onPress={() => setShowSportSelector(false)}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {supportedSports.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={[
                  styles.sportOption,
                  {
                    backgroundColor: selectedSport === sport.id 
                      ? theme.colors.primary 
                      : theme.colors.background,
                  },
                ]}
                onPress={() => changeSport(sport.id)}
              >
                <ThemedText size="2xl">{sport.icon}</ThemedText>
                <View style={styles.sportOptionContent}>
                  <ThemedText
                    size="base"
                    weight="bold"
                    style={{
                      color: selectedSport === sport.id 
                        ? theme.colors.accent 
                        : theme.colors.text,
                    }}
                  >
                    {sport.name}
                  </ThemedText>
                  <ThemedText
                    size="sm"
                    variant="secondary"
                    style={{
                      color: selectedSport === sport.id 
                        ? theme.colors.accent 
                        : theme.colors.textSecondary,
                    }}
                  >
                    {SPORT_CONFIGS[sport.id].participants} • Best of {SPORT_CONFIGS[sport.id].bestOf}
                  </ThemedText>
                </View>
                {selectedSport === sport.id && (
                  <Trophy size={20} color={theme.colors.accent} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  sportSelector: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currentSport: {
    alignItems: 'center',
  },
  sportName: {
    marginTop: 8,
    marginBottom: 4,
  },
  setupPrompt: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  setupTitle: {
    marginTop: 12,
    marginBottom: 8,
  },
  setupDescription: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  setupButton: {
    paddingHorizontal: 32,
  },
  playersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  playerName: {
    flex: 1,
    textAlign: 'center',
  },
  scoreDisplay: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  mainScore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  playerScore: {
    alignItems: 'center',
    flex: 1,
  },
  scoreDivider: {
    paddingHorizontal: 20,
  },
  unitLabel: {
    textAlign: 'center',
    marginBottom: 16,
  },
  tennisDetails: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  footballDetails: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  goldenPoint: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  decidingSet: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  setsHistory: {
    marginBottom: 16,
  },
  historyTitle: {
    marginBottom: 8,
  },
  historyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  historyItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  readableScore: {
    padding: 12,
    borderRadius: 12,
  },
  readableScoreText: {
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  controlsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  startButton: {
    marginBottom: 16,
  },
  scoringButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  scoreButton: {
    flex: 1,
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionText: {
    marginLeft: 8,
  },
  matchInfo: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  infoTitle: {
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  setupDescription: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  playerForm: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  playerFormHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  playerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  analyticsInfo: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  analyticsTitle: {
    marginBottom: 8,
  },
  analyticsText: {
    lineHeight: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  sportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sportOptionContent: {
    flex: 1,
    marginLeft: 16,
  },
});