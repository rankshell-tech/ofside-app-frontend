// app/screens/ScoringScreen.tsx
import React, { useState, useEffect, use } from "react";
import { View, Text, TouchableOpacity, ScrollView, Pressable,StyleSheet, ImageBackground, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronDown, SlidersHorizontal } from "lucide-react-native";
import { Entypo, Feather, FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useMatchWebSocket } from "@/hooks/useMatchWebSocket";
import Constants from "expo-constants";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

const ScoringScreen = () => {
    const theme = useTheme();
    const { sport, format, matchId } = useLocalSearchParams<{ sport: string; format: string; matchId: string }>();
    const navigation = useNavigation();
    const user = useSelector((state: RootState) => state.auth.user);
    const [matchData, setMatchData] = useState<any>(null);
    
    // WebSocket connection
    const { isConnected, error, emitEvent } = useMatchWebSocket(matchId || null, sport || '');
    
    // Fetch initial match data
    useEffect(() => {
        if (matchId && user?.accessToken) {
            fetchMatchData();
        }
    }, [matchId, user?.accessToken]);

    useEffect(() => {
       fetchMatchData();
    },[])

    const fetchMatchData = async () => {
        console.log('Fetching match data for matchId:', matchId);
        console.log('Fetching match data for sport:', sport);
        try {
            const response = await fetch(`${API_URL}/api/matches/${sport}/${matchId}`, {
                headers: {
                    'Authorization': `Bearer ${user?.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Failed to fetch match data');
            const data = await response.json();
            console.log('Fetched match data-----------------:', data);
            setMatchData(data);
            // Match data will be updated via WebSocket
        } catch (err) {
            console.error('Error fetching match data:', err);
        }
    };


    const [tabType, setTabType] = useState("Scoring");
    const tabTypes = ["Scoring", "Match Feed"];
    const [rulesVisible, setRulesVisible] = useState(false);
    const [teamsVisible, setTeamsVisible] = useState(false);
    const [team, setTeam] = useState<string | null>(null);
    const [goalScorer, setGoalScorer] = useState<string | null>(null);
    const [player, setPlayer] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [selectedAssistId, setSelectedAssistId] = useState<string | null>(null);
    
    // Extract match data
    const teams = matchData?.teams || [];
    const team1 = teams[0];
    const team2 = teams[1];
    const team1Name = team1?.name || "Team 1";
    const team2Name = team2?.name || "Team 2";
    const team1Score = matchData?.score?.team1 || matchData?.totalScore?.team1 || 0;
    const team2Score = matchData?.score?.team2 || matchData?.totalScore?.team2 || 0;
    const matchStatus = matchData?.status || 'scheduled';
    const isLive = matchStatus === 'live';
    
    // Get current time (calculate from match start time)
    const getCurrentTime = () => {
        if (matchData?.startAt) {
            const startTime = new Date(matchData.startAt);
            const now = new Date();
            const diffMs = now.getTime() - startTime.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            return `${hours}:${mins.toString().padStart(2, '0')}`;
        }
        return "0:00";
    };
    const currentTime = getCurrentTime();
    const location = matchData?.location || "Ground";
    const matchType = matchData?.matchType || "Friendly Match";

     const options = [
        { label: "Smash", color: "text-green-600" },
        { label: "Drop", color: "text-green-600" },
        { label: "Net", color: "text-red-600" },
        { label: "Out", color: "text-red-600" },
        { label: "Service Fault", color: "text-red-600" },
        { label: "Body touch", color: "text-red-600" },
    ];
    const tennisOptions = [
        { label: "Smash", color: "text-green-600" },
        { label: "Ace", color: "text-green-600" },
        { label: "Net", color: "text-red-600" },
        { label: "Out", color: "text-red-600" },
        { label: "Double Fault", color: "text-red-600" },
        { label: "Body touch", color: "text-red-600" },
        { label: "Service Fault", color: "text-red-600" },
    ];

    const actions = [
        { label: "Foul", color: "text-red-600", onPress: () => setTeamsVisible(true)},
        { label: "Free Kick", color: "text-black" },
        { label: "Penalty scored/missed", color: "text-black" },
        { label: "Corner Kick", color: "text-black" },
        { label: "Yellow Card", color: "text-yellow-500" },
        { label: "Player substitute/Short", color: "text-black" },
        { label: "Red Card", color: "text-red-600" },
        { label: "Drinks break/ Resume", color: "text-black" },
    ];
    // Extract goals from match data
    const goals = {
        left: (matchData?.goals || []).filter((g: any) => {
            if (!team1?._id) return false;
            const teamId = g.teamId?.toString() || g.teamId;
            return teamId === team1._id.toString() || teamId === team1._id;
        }).map((g: any) => ({
            player: g.scorer?.name || g.scorer?.username || g.scorer || "Unknown",
            minute: `${g.minute || 0}'`
        })),
        right: (matchData?.goals || []).filter((g: any) => {
            if (!team2?._id) return false;
            const teamId = g.teamId?.toString() || g.teamId;
            return teamId === team2._id.toString() || teamId === team2._id;
        }).map((g: any) => ({
            player: g.scorer?.name || g.scorer?.username || g.scorer || "Unknown",
            minute: `${g.minute || 0}'`
        })),
    };
    
    // Extract feeds/commentary from match data
    const feeds = (matchData?.commentary || []).map((c: any) => ({
        time: new Date(c.createdAt || c.time || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        text: c.text || c.commentary || "Match event",
    })).slice(0, 10); // Limit to last 10 feeds
    const basketballActions = [
        { label: "Shooting Foul", color: "text-red-600" },
        { label: "2 Pointer", color: "text-green-600" },
        { label: "Free throw missed", color: "text-black" },
        { label: "1 Pointer/ Free throw", color: "text-green-600" },
    ];
    // Extract sets/games from match data
    const sets = (matchData?.games || []).map((game: any, index: number) => ({
        set: `Set ${index + 1}`,
        teamA: game.team1Points || 0,
        teamB: game.team2Points || 0,
    }));
    
    // Extract quarters from match data (Basketball)
    const quarters = (matchData?.quarters || []).map((q: any, index: number) => ({
        set: `${index + 1} Quarter`,
        teamA: q.team1Score || 0,
        teamB: q.team2Score || 0,
        winner: (q.team1Score || 0) > (q.team2Score || 0) ? team1Name : 
                (q.team2Score || 0) > (q.team1Score || 0) ? team2Name : null,
    }));
    
    // Extract tennis sets
    const tennisSets = teams.map((t: any) => {
        const currentGame = matchData?.games?.[(matchData?.currentGame || 1) - 1];
        return {
            team: t.name || "Unknown",
            score: matchData?.sets?.find((s: any) => s.teamId?.toString() === t._id?.toString())?.score || 0,
            gameScore: currentGame?.team1Points || currentGame?.team2Points || 0,
        };
    });

  return (
    <SafeAreaView className="flex-1 bg-white">
        <ImageBackground
            source={require("../../assets/images/background.png")}
            resizeMode="contain"
            className="flex-1 bg-white"
        >
                {/* Header */}
                <View className="flex-row items-center justify-between mx-3 mt-2 mb-5">
                    <View className="w-8 h-8 bg-white rounded-full border-4" >
                        <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
                    </View>
                    <View className="flex-row items-center">
                        {error && (
                            <Text className="text-red-500 text-xs mr-2">{error}</Text>
                        )}
                        {!isConnected && !error && (
                            <Text className="text-yellow-500 text-xs mr-2">Connecting...</Text>
                        )}
                        <TouchableOpacity onPress={() => setRulesVisible(true)}>
                            <SlidersHorizontal  size={22} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tabs */}
                <View className="flex-row justify-center mb-2">
                    {tabTypes.map((type) => (
                        <TouchableOpacity
                            key={type}
                            className="px-5 py-1 rounded-full mr-2 border w-40 items-center"
                            style={{
                                backgroundColor: tabType === type ? theme.colors.primary : "#dedede",
                                borderColor: tabType === type ? theme.colors.primary : theme.colors.accent
                            }}
                            onPress={() => setTabType(type)}
                        >
                        <Text
                            className={`text-xl ${
                            tabType === type ? "font-semibold text-black" : ""
                            }`}
                        >
                            {type}
                        </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="flex-row justify-end items-center mb-2">
                    <TouchableOpacity className="mr-2">
                        <FontAwesome name="share-square-o" size={20} color="black" />
                    </TouchableOpacity>
                    {isLive && (
                        <TouchableOpacity className="flex-row items-center border bg-red-500 border-red-500 rounded-full px-2 mr-3">
                            <Text className="text-white font-bold">Live</Text>
                            <Octicons className="ml-2" name="dot-fill" size={18} color="white" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Match Info */}
                <View className="py-3 px-4 mx-3 border-[2px] rounded-lg border-yellow-400" style={{backgroundColor: theme.colors.accent}}>
                    <View className="flex-row justify-between">
                    <View className="mt-5">
                        <Text className="text-white font-bold text-2xl">{team1Name}</Text>
                        {team1?.captain?.[0] && (
                            <Text className="text-[8px] text-white">{team1.captain[0].name || team1.captain[0].username} <Text className="font-extrabold">C</Text></Text>
                        )}
                        {sport !== 'Basketball' && team1?.players?.find((p: any) => p.role === 'GK' || p.position === 'GK') && (
                            <Text className="text-[8px] text-white">{team1.players.find((p: any) => p.role === 'GK' || p.position === 'GK')?.name || 'GK'} (GK)</Text>
                        )}

                    </View>
                    <View className="items-center">
                        <Text className="text-xs text-white">{currentTime}</Text>
                        <Text className="text-4xl text-white font-bold">{team1Score} : {team2Score}</Text>
                        <Text className="text-[8px] text-white">{location}</Text>
                        <Text className="text-[8px] text-white">{matchType}</Text>
                    </View>
                    <View className="items-end mt-5">
                        <Text className="text-white font-bold text-2xl">{team2Name}</Text>
                        {team2?.captain?.[0] && (
                            <Text className="text-[8px] text-white">{team2.captain[0].name || team2.captain[0].username} <Text className="font-extrabold">C--</Text></Text>
                        )}
                        {sport !== 'Basketball' && team2?.players?.find((p: any) => p.role === 'GK' || p.position === 'GK') && (
                            <Text className="text-[8px] text-white">{team2.players.find((p: any) => p.role === 'GK' || p.position === 'GK')?.name || 'GK'} (GK)</Text>
                        )}
                    </View>
                    </View>
                </View>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }} // add extra space at bottom
                showsVerticalScrollIndicator={false}
                >

                { tabType === "Scoring" && (
                   <View className="px-2">

                    {/* Undo */}
                    <View className="flex-row justify-end px-4 mt-2">
                        <TouchableOpacity className="flex-row items-center space-x-1">
                            <Text className="text-black">Undo</Text>
                            <MaterialCommunityIcons name="undo-variant" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    {(sport === "Football") &&(
                    <>
                            {/* Actions */}
                            <View className="flex-row flex-wrap justify-between mb-5">
                                <View className="w-[48%]">
                                    <TouchableOpacity onPress={() => setTeamsVisible(true)} className="h-16 mb-3 border border-black rounded-lg bg-gray-100 items-center justify-center">
                                    <Text className="text-red-600 font-semibold text-lg">Self Goal</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        if (!selectedTeamId) {
                                            setTeamsVisible(true);
                                            return;
                                        }
                                        emitEvent('goal_saved', { teamId: selectedTeamId });
                                    }} className="h-16 border border-black rounded-lg bg-gray-100 items-center justify-center">
                                    <Text className="text-green-600 font-semibold text-lg">Goal Saved</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Right column (1 big Goal button spanning both rows) */}
                                <View className="w-[48%] mb-4">
                                    <TouchableOpacity onPress={() => {
                                        // For goal, we need team and player selection
                                        setTeamsVisible(true);
                                    }} className="h-[120px] border border-black rounded-lg bg-gray-100 items-center justify-center">
                                    <Text className="text-green-600 font-bold text-4xl">Goal</Text>
                                    </TouchableOpacity>
                                </View>

                                {actions.map((action, index) => {
                                    const handleAction = () => {
                                        if (action.onPress) {
                                            action.onPress();
                                        } else {
                                            // Map action labels to event types
                                            const eventMap: Record<string, string> = {
                                                'Free Kick': 'free_kick',
                                                'Penalty scored/missed': 'penalty',
                                                'Corner Kick': 'corner_kick',
                                                'Yellow Card': 'yellow_card',
                                                'Player substitute/Short': 'substitution',
                                                'Red Card': 'red_card',
                                                'Drinks break/ Resume': 'timeout',
                                            };
                                            const eventType = eventMap[action.label] || action.label.toLowerCase().replace(/\s+/g, '_');
                                            if (selectedTeamId && selectedPlayerId) {
                                                emitEvent(eventType, {
                                                    teamId: selectedTeamId,
                                                    playerId: selectedPlayerId,
                                                    minute: Math.floor((Date.now() - new Date(matchData?.startAt || Date.now()).getTime()) / 60000),
                                                });
                                            } else {
                                                setTeamsVisible(true);
                                            }
                                        }
                                    };
                                    return (
                                        <TouchableOpacity
                                            onPress={handleAction}
                                            key={index}
                                            className="w-[48%] h-16 border rounded-lg mb-3 items-center justify-center bg-gray-50"
                                        >
                                            <Text className={`text-center font-bold text-lg ${action.color}`}>{action.label}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Select Action Button */}
                            <TouchableOpacity className="py-3 mx-5 mb-5 rounded-lg items-center" style={{backgroundColor: theme.colors.primary}}>
                                <Text className="font-semibold text-black">Select action</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {(sport === "Basketball") &&(
                        <>
                            {/* Actions */}
                            <View className="flex-row flex-wrap justify-between mb-5">
                                <View className="w-[48%]">
                                    <TouchableOpacity className="h-16 mb-3 border border-black rounded-lg bg-gray-100 items-center justify-center">
                                    <Text className="text-red-600 font-semibold text-lg">Flagrant Foul</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity className="h-16 border border-black rounded-lg bg-gray-100 items-center justify-center">
                                    <Text className="text-red-600 font-semibold text-lg">Technical Foul</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Right column (1 big Goal button spanning both rows) */}
                                <View className="w-[48%] mb-4">
                                    <TouchableOpacity onPress={() => {
                                        if (!selectedTeamId || !selectedPlayerId) {
                                            setTeamsVisible(true);
                                            return;
                                        }
                                        emitEvent('3_pointer', {
                                            teamId: selectedTeamId,
                                            playerId: selectedPlayerId,
                                            quarter: matchData?.currentQuarter || 1,
                                        });
                                    }} className="h-[120px] border border-black rounded-lg bg-gray-100 items-center justify-center">
                                    <Text className="text-green-600 font-bold text-4xl">3 Pointer</Text>
                                    </TouchableOpacity>
                                </View>

                                {basketballActions.map((action, index) => {
                                    const handleAction = () => {
                                        const eventMap: Record<string, string> = {
                                            'Shooting Foul': 'foul',
                                            '2 Pointer': '2_pointer',
                                            'Free throw missed': 'free_throw_missed',
                                            '1 Pointer/ Free throw': '1_pointer',
                                        };
                                        const eventType = eventMap[action.label] || action.label.toLowerCase().replace(/\s+/g, '_');
                                        if (selectedTeamId && selectedPlayerId) {
                                            emitEvent(eventType, {
                                                teamId: selectedTeamId,
                                                playerId: selectedPlayerId,
                                                quarter: matchData?.currentQuarter || 1,
                                            });
                                        } else {
                                            setTeamsVisible(true);
                                        }
                                    };
                                    return (
                                        <TouchableOpacity
                                            onPress={handleAction}
                                            key={index}
                                            className="w-[48%] h-16 border rounded-lg mb-3 items-center justify-center bg-gray-50"
                                        >
                                            <Text className={`text-center font-bold text-lg ${action.color}`}>{action.label}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                                <View className="w-[48%]">
                                    <TouchableOpacity onPress={() => {
                                        if (selectedTeamId && selectedPlayerId) {
                                            emitEvent('player_disqualified', {
                                                teamId: selectedTeamId,
                                                playerId: selectedPlayerId,
                                                quarter: matchData?.currentQuarter || 1,
                                            });
                                        } else {
                                            setTeamsVisible(true);
                                        }
                                    }} className="h-[120px] border border-black rounded-lg bg-gray-100 items-center justify-center">
                                        <Text className="text-red-600 font-bold text-lg">Player disqualified</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Right column (1 big Goal button spanning both rows) */}
                                <View className="w-[48%] mb-4">
                                    <TouchableOpacity onPress={() => setTeamsVisible(true)} className="h-16 mb-3 border border-black rounded-lg bg-gray-100 items-center justify-center">
                                        <Text className="font-semibold text-lg">Player substitute</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        if (selectedTeamId) {
                                            emitEvent('timeout', {
                                                teamId: selectedTeamId,
                                                quarter: matchData?.currentQuarter || 1,
                                            });
                                        } else {
                                            setTeamsVisible(true);
                                        }
                                    }} className="h-16 border border-black rounded-lg bg-gray-100 items-center justify-center">
                                        <Text className="font-semibold text-lg">Drinks break/ Resume</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Select Action Button */}
                            <TouchableOpacity className="py-3 mx-5 mb-5 rounded-lg items-center" style={{backgroundColor: theme.colors.primary}}>
                                <Text className="font-semibold text-black">Select action</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {(sport === "Badminton" || sport === "Pickleball" || sport === 'Tennis' || sport === 'Volleyball') && (
                        <>
                            <View className="flex-row justify-between items-center ">
                                    <LinearGradient
                                        colors={["#FFF201", "#FFFFFF"]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        className="items-center justify-center w-48 h-36 mr-2 rounded-2xl"
                                    >
                                        <TouchableOpacity onPress={() => {
                                            if (sport === 'Tennis') {
                                                setVisible(true);
                                            } else {
                                                if (!selectedPlayerId) {
                                                    setTeamsVisible(true);
                                                    return;
                                                }
                                                emitEvent('point_scored', {
                                                    team: 1,
                                                    points: 1,
                                                    playerId: selectedPlayerId,
                                                });
                                            }
                                        }}>
                                            {sport === 'Tennis'
                                            ?
                                            <>
                                                <Text className="font-extrabold text-2xl text-black">
                                                + Point
                                                </Text>
                                            </>
                                            :
                                            <>
                                                <Text className="font-extrabold text-base text-black">
                                                {team1Name}
                                                </Text>
                                                <Text className="font-extrabold text-4xl text-black">
                                                +1
                                                </Text>
                                            </>
                                            }
                                        </TouchableOpacity>
                                    </LinearGradient>
                                <View className="items-center justify-center w-48 h-36 border rounded-xl bg-gray-200">
                                        <TouchableOpacity onPress={() => {
                                            if (sport === 'Tennis') {
                                                setVisible(true);
                                            } else {
                                                if (!selectedPlayerId) {
                                                    setTeamsVisible(true);
                                                    return;
                                                }
                                                emitEvent('point_scored', {
                                                    team: 2,
                                                    points: 1,
                                                    playerId: selectedPlayerId,
                                                });
                                            }
                                        }}>
                                            {sport === 'Tennis'
                                            ?
                                            <>
                                                <Text className="font-extrabold text-2xl text-black">
                                                + Point
                                                </Text>
                                            </>
                                            :
                                            <>
                                                <Text className="font-extrabold text-base text-black">
                                                {team2Name}
                                                </Text>
                                                <Text className="font-extrabold text-4xl text-black">
                                                +1
                                                </Text>
                                            </>
                                            }
                                        </TouchableOpacity>
                                </View>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-xl font-bold mt-6 px-4">
                                    Recent <Text className="font-bold text-3xl">Feed</Text>
                                </Text>
                                <Text className="text-[8px] underline mr-2 font-bold">View more</Text>
                            </View>
                            <View className="mt-3 px-4">
                                {feeds.map((feed: { time: string; text: string }, index: number) => (
                                <View key={index} className="border-b border-gray-200 py-3">
                                    <View className="flex-row justify-between items-start">
                                    <Text className="text-sm font-semibold text-gray-700">
                                        {feed.time}
                                    </Text>
                                    <TouchableOpacity>
                                        <Feather name="edit" size={14} color="gray" />
                                    </TouchableOpacity>
                                    </View>
                                    <Text className="text-sm text-gray-800 mt-1">{feed.text}</Text>
                                </View>
                                ))}
                            </View>

                        </>
                    )}
                    </View>
                )}
                { tabType === "Match Feed" &&(
                <View className="mt-5">
                    {(sport === "Football") &&(
                        <>
                            {/* Goals Scored */}
                            <Text className="text-2xl font-bold mt-6 px-4">
                                Goals <Text className="text-blue-600">Scored</Text>
                            </Text>
                            <View className="flex-row justify-between px-4 mt-3">
                                {/* Left team goals */}
                                <View>
                                {goals.left.map((g: { player: string; minute: string }, i: number) => (
                                    <Text key={i} className="text-base text-black">
                                    {g.player} <Text className="text-gray-600">{g.minute}</Text>
                                    </Text>
                                ))}
                                </View>
                                {/* Right team goals */}
                                <View className="items-end">
                                {goals.right.map((g: { player: string; minute: string }, i: number) => (
                                    <Text key={i} className="text-base text-black">
                                    {g.player} <Text className="text-gray-600">{g.minute}</Text>
                                    </Text>
                                ))}
                                </View>
                            </View>
                        </>
                    )}
                    {(sport === 'Basketball') && (
                        <>
                        <LinearGradient
                                colors={["#FFF201", "#FFFFFF"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="flex-row justify-between px-4 py-3 mb-1 mx-2"
                            >
                                <Text className="font-bold text-base">Quarters</Text>
                                <Text className="font-bold text-base text-green-600">Team 1</Text>
                                <Text className="font-bold text-base">Team 2</Text>
                                <Text className="font-bold text-base">Set Winner</Text>
                            </LinearGradient>

                            {/* Rows */}
                            {quarters.map((item: { set: string; teamA: number | null; teamB: number | null; winner: string | null }, index: number) => (
                                <View
                                    key={index}
                                    className="flex-row justify-between px-4 py-1 border border-gray-300 mb-1 mx-2 rounded-2xl"
                                >
                                    <Text className="text-base">{item.set}</Text>
                                    <Text
                                        className={`text-base font-bold ${
                                            (item?.teamA ?? 0) > (item?.teamB ?? 0) ? "text-green-600" : "text-black"
                                        }`}
                                        >
                                        {item?.teamA ?? ""}
                                    </Text>
                                    <Text
                                        className={`text-base font-bold ${
                                            (item?.teamB ?? 0) > (item?.teamA ?? 0) ? "text-green-600" : "text-black"
                                        }`}
                                        >
                                        {item?.teamB ?? ""}
                                    </Text>
                                    <Text className="text-base">{item.winner ?? ""}</Text>
                                </View>
                            ))}
                        </>
                    )}
                    {(sport === 'Tennis') && (
                        <>
                        <LinearGradient
                                colors={["#FFF201", "#FFFFFF"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="flex-row justify-between px-4 py-3 mb-1 mx-2"
                            >
                                <Text className="font-bold text-base">Team</Text>
                                <Text className="font-bold text-base">Set Score</Text>
                                <Text className="font-bold text-base">Game Score</Text>
                            </LinearGradient>

                            {/* Rows */}
                            {tennisSets.map((item: { team: string; score: number; gameScore: number }, index: number) => (
                                <View
                                    key={index}
                                    className="flex-row justify-between px-4 py-1 border border-gray-300 mb-1 mx-2 rounded-2xl"
                                >
                                    <Text className="text-base">{item.team}</Text>
                                    <Text className="text-base">{item.score}</Text>
                                    <Text className="text-base">{item.gameScore}</Text>
                                </View>
                            ))}
                        </>
                    )}
                    {(sport === "Badminton" || sport === "Pickleball" || sport === 'Volleyball') && (
                        <>
                        <LinearGradient
                                colors={["#FFF201", "#FFFFFF"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="flex-row justify-between px-4 py-3 mb-1 mx-2"
                            >
                                <Text className="font-bold text-base">Sets</Text>
                                <Text className="font-bold text-base text-green-600">{}</Text>
                                <Text className="font-bold text-base">S.M.C.C</Text>
                            </LinearGradient>

                            {/* Rows */}
                            {sets.map((item: { set: string; teamA: number | null; teamB: number | null }, index: number) => (
                                <View
                                    key={index}
                                    className="flex-row justify-between px-4 py-1 border border-gray-300 mb-1 mx-2 rounded-2xl"
                                >
                                <Text className="text-base">{item.set}</Text>
                                <Text
                                    className={`text-base font-bold ${
                                        (item?.teamA ?? 0) > (item?.teamB ?? 0) ? "text-green-600" : "text-black"
                                    }`}
                                    >
                                    {item?.teamA ?? ""}
                                </Text>
                                <Text
                                    className={`text-base font-bold ${
                                        (item?.teamB ?? 0) > (item?.teamA ?? 0) ? "text-green-600" : "text-black"
                                    }`}
                                    >
                                    {item?.teamB ?? ""}
                                </Text>
                                </View>
                            ))}
                        </>
                    )}
                    {/* Match Feed */}
                    <Text className="text-2xl font-bold mt-6 px-4">
                        Match <Text className="text-blue-600">Feed</Text>
                    </Text>
                    <View className="mt-3 px-4">
                        {feeds.map((feed: { time: string; text: string }, index: number) => (
                        <View key={index} className="border-b border-gray-200 py-3">
                            <View className="flex-row justify-between items-start">
                            <Text className="text-sm font-semibold text-gray-700">
                                {feed.time}
                            </Text>
                            <TouchableOpacity>
                                <Feather name="edit" size={14} color="gray" />
                            </TouchableOpacity>
                            </View>
                            <Text className="text-sm text-gray-800 mt-1">{feed.text}</Text>
                        </View>
                        ))}
                    </View>
                </View>
                )}

                {/* Bottom Sheet Modal */}
               <Modal
    isVisible={rulesVisible}
    onBackdropPress={() => setRulesVisible(false)}
    onBackButtonPress={() => setRulesVisible(false)}
    style={{ justifyContent: "flex-start", marginLeft: 160, marginTop: 95 }}
>
    <View className="bg-white rounded-2xl p-0 shadow-xl overflow-hidden">
        {/* Header with Close Button */}
        <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200 bg-gray-50">
            <Text className="text-lg font-bold text-gray-800">Match Actions</Text>
            <TouchableOpacity 
                onPress={() => setRulesVisible(false)}
                className="w-8 h-8 items-center justify-center rounded-full hover:bg-gray-200"
            >
                <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
        </View>

        {/* Rules List with Subtle Borders */}
        <TouchableOpacity className="flex-row items-center px-5 py-4 border-b border-gray-100 active:bg-gray-50">
            <Ionicons name="warning-outline" size={18} color="#6B7280" className="mr-3" />
            <Text className="text-base text-gray-700 flex-1">Match Abandoned</Text>
         
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center px-5 py-4 border-b border-gray-100 active:bg-gray-50">
            <Ionicons name="calendar-outline" size={18} color="#6B7280" className="mr-3" />
            <Text className="text-base text-gray-700 flex-1">Match Rescheduled</Text>
            
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center px-5 py-4 border-b border-gray-200 active:bg-gray-50">
            <Ionicons name="walk-outline" size={18} color="#6B7280" className="mr-3" />
            <Text className="text-base text-gray-700 flex-1">Walkover</Text>
            
        </TouchableOpacity>
        
        <TouchableOpacity 
            onPress={() => { 
                setRulesVisible(false); 
                router.push('/scoring/winnerScreen'); 
            }} 
            className="flex-row items-center px-5 py-4  active:bg-red-100"
        >
            <Ionicons name="flag-outline" size={18} color="#DC2626" className="mr-3" />
            <Text className="text-base font-semibold text-red-700 flex-1">End Match</Text>
          
        </TouchableOpacity>
    </View>
</Modal>

                <Modal
                    isVisible={teamsVisible}
                    onBackdropPress={() => setTeamsVisible(false)}
                    onBackButtonPress={() => setTeamsVisible(false)}
                    style={{ justifyContent: "flex-start", }}
                >
                {/* Overlay */}
                <Pressable
                    className="flex-1 justify-center items-center"
                    onPress={()=>setTeamsVisible(false)}
                >
                    {/* Content */}
                    <Pressable
                        className="bg-white w-[85%] rounded-2xl p-6"
                        onPress={(e) => e.stopPropagation()} // prevent closing when clicking inside
                    >
                        {(sport === 'Football'&&
                            <>
                                {/* Select Team */}
                                <Text className="text-lg font-bold mb-2">Select team</Text>
                                <TouchableOpacity 
                                    onPress={() => {
                                        // Show team selection (you can add a team picker modal here)
                                        Alert.alert('Select Team', 'Choose a team', [
                                            { text: team1Name, onPress: () => { setTeam(team1Name); setSelectedTeamId(team1?._id); } },
                                            { text: team2Name, onPress: () => { setTeam(team2Name); setSelectedTeamId(team2?._id); } },
                                        ]);
                                    }}
                                    className="flex-row justify-between items-center py-3 px-4 rounded-full mb-5" style={{backgroundColor: theme.colors.primary}}>
                                    <Text className="text-black font-medium">
                                    {team || "Select the team"}
                                    </Text>
                                    <ChevronDown size={18} color="black" />
                                </TouchableOpacity>

                                {/* Select Player */}
                                <Text className="text-lg font-bold mb-2">Select Goal scorer</Text>
                                <TouchableOpacity 
                                    onPress={() => {
                                        if (!selectedTeamId) {
                                            Alert.alert('Please select a team first');
                                            return;
                                        }
                                        const selectedTeam = selectedTeamId === team1?._id ? team1 : team2;
                                        const players = selectedTeam?.players || [];
                                        Alert.alert('Select Goal Scorer', 'Choose a player', 
                                            players.map((p: any) => ({
                                                text: p.name || p.username,
                                                onPress: () => {
                                                    setGoalScorer(p.name || p.username);
                                                    setSelectedPlayerId(p.id || p._id);
                                                }
                                            }))
                                        );
                                    }}
                                    className="flex-row justify-between items-center py-3 px-4 rounded-full mb-5" style={{backgroundColor: theme.colors.primary}}>
                                    <Text className="text-black font-medium">
                                        {goalScorer || "Select goal scorer"}
                                    </Text>
                                    <ChevronDown size={18} color="black" />
                                </TouchableOpacity>

                                {/* Select Assisting Player */}
                                <Text className="text-lg font-bold mb-2">Select Assisting player</Text>
                                <TouchableOpacity 
                                    onPress={() => {
                                        if (!selectedTeamId) {
                                            Alert.alert('Please select a team first');
                                            return;
                                        }
                                        const selectedTeam = selectedTeamId === team1?._id ? team1 : team2;
                                        const players = selectedTeam?.players || [];
                                        Alert.alert('Select Assisting Player', 'Choose a player', 
                                            players.map((p: any) => ({
                                                text: p.name || p.username,
                                                onPress: () => {
                                                    setPlayer(p.name || p.username);
                                                    setSelectedAssistId(p.id || p._id);
                                                }
                                            }))
                                        );
                                    }}
                                    className="flex-row justify-between items-center py-3 px-4 rounded-full mb-5" style={{backgroundColor: theme.colors.primary}}>
                                    <Text className="text-black font-medium">
                                        {player || "Select player"}
                                    </Text>
                                    <ChevronDown size={18} color="black" />
                                </TouchableOpacity>
                            </>
                        )}
                        {((sport === 'Badminton' || sport === 'Pickleball' || sport === 'Tennis' || sport === 'Volleyball') &&
                            <>
                                {/* Select Player */}
                                <Text className="text-lg font-bold mb-2">Select Player</Text>
                                <TouchableOpacity 
                                    onPress={() => {
                                        const allPlayers = [...(team1?.players || []), ...(team2?.players || [])];
                                        Alert.alert('Select Player', 'Choose a player', 
                                            allPlayers.map((p: any) => ({
                                                text: p.name || p.username,
                                                onPress: () => {
                                                    setGoalScorer(p.name || p.username);
                                                    setSelectedPlayerId(p.id || p._id);
                                                }
                                            }))
                                        );
                                    }}
                                    className="flex-row justify-between items-center py-3 px-4 rounded-full mb-5" style={{backgroundColor: theme.colors.primary}}>
                                    <Text className="text-black font-medium">
                                        {goalScorer || "Select player"}
                                    </Text>
                                    <ChevronDown size={18} color="black" />
                                </TouchableOpacity>
                            </>
                        )}
                        {(sport === 'Basketball'&&
                            <>
                                {/* Select Team */}
                                <Text className="text-lg font-bold mb-2">Select team</Text>
                                <TouchableOpacity 
                                    onPress={() => {
                                        Alert.alert('Select Team', 'Choose a team', [
                                            { text: team1Name, onPress: () => { setTeam(team1Name); setSelectedTeamId(team1?._id); } },
                                            { text: team2Name, onPress: () => { setTeam(team2Name); setSelectedTeamId(team2?._id); } },
                                        ]);
                                    }}
                                    className="flex-row justify-between items-center py-3 px-4 rounded-full mb-5" style={{backgroundColor: theme.colors.primary}}>
                                    <Text className="text-black font-medium">
                                        {team || "Select team"}
                                    </Text>
                                    <ChevronDown size={18} color="black" />
                                </TouchableOpacity>

                                {/* Select Player */}
                                <Text className="text-lg font-bold mb-2">Select Player</Text>
                                <TouchableOpacity 
                                    onPress={() => {
                                        if (!selectedTeamId) {
                                            Alert.alert('Please select a team first');
                                            return;
                                        }
                                        const selectedTeam = selectedTeamId === team1?._id ? team1 : team2;
                                        const players = selectedTeam?.players || [];
                                        Alert.alert('Select Player', 'Choose a player', 
                                            players.map((p: any) => ({
                                                text: p.name || p.username,
                                                onPress: () => {
                                                    setGoalScorer(p.name || p.username);
                                                    setSelectedPlayerId(p.id || p._id);
                                                }
                                            }))
                                        );
                                    }}
                                    className="flex-row justify-between items-center py-3 px-4 rounded-full mb-5" style={{backgroundColor: theme.colors.primary}}>
                                    <Text className="text-black font-medium">
                                        {goalScorer || "Select player"}
                                    </Text>
                                    <ChevronDown size={18} color="black" />
                                </TouchableOpacity>
                            </>
                        )}
                    {/* Select Action Button */}
                        <TouchableOpacity
                            className="py-3 rounded-lg items-center mt-10"
                            style={{backgroundColor: theme.colors.primary}}
                            onPress={() => {
                                if (sport === 'Football') {
                                    // Handle goal event
                                    if (selectedTeamId && selectedPlayerId) {
                                        emitEvent('goal', {
                                            teamId: selectedTeamId,
                                            playerId: selectedPlayerId,
                                            assistId: selectedAssistId,
                                            minute: Math.floor((Date.now() - new Date(matchData?.startAt || Date.now()).getTime()) / 60000),
                                        });
                                        setTeamsVisible(false);
                                        // Reset selections
                                        setTeam(null);
                                        setGoalScorer(null);
                                        setPlayer(null);
                                        setSelectedTeamId(null);
                                        setSelectedPlayerId(null);
                                        setSelectedAssistId(null);
                                    } else {
                                        Alert.alert('Please select team and goal scorer');
                                    }
                                } else {
                                    setTeamsVisible(false);
                                }
                            }}
                        >
                            <Text className="font-semibold text-black">Select action</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
                </Modal>

                <Modal isVisible={visible}>
                    <View className="flex-1 justify-center items-center">
                    <View className="bg-white rounded-2xl w-56">
                        {((sport === 'Badminton' || sport === 'Pickleball' || sport === 'Volleyball') &&
                            <>
                            {options.map((item, index) => {
                                const eventTypeMap: Record<string, string> = {
                                    'Smash': 'smash',
                                    'Drop': 'drop',
                                    'Net': 'net',
                                    'Out': 'out',
                                    'Service Fault': 'service_fault',
                                    'Body touch': 'body_touch',
                                };
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setVisible(false);
                                            if (selectedPlayerId) {
                                                emitEvent('point_scored', {
                                                    team: 1,
                                                    points: 1,
                                                    playerId: selectedPlayerId,
                                                    eventType: eventTypeMap[item.label] || item.label.toLowerCase().replace(/\s+/g, '_'),
                                                });
                                            }
                                        }}
                                        className={`py-2 items-center ${
                                        index !== options.length - 1 ? "border-b border-gray-300 mx-5" : ""
                                        }`}
                                    >
                                        <Text className={`font-semibold ${item.color}`}>
                                        {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                            </>
                        )}
                        {(sport === 'Tennis' &&
                            <>
                            {tennisOptions.map((item, index) => {
                                const eventTypeMap: Record<string, string> = {
                                    'Smash': 'smash',
                                    'Ace': 'ace',
                                    'Net': 'net',
                                    'Out': 'out',
                                    'Double Fault': 'double_fault',
                                    'Body touch': 'body_touch',
                                    'Service Fault': 'service_fault',
                                };
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setVisible(false);
                                            if (selectedPlayerId) {
                                                emitEvent('point_scored', {
                                                    playerId: selectedPlayerId,
                                                    eventType: eventTypeMap[item.label] || item.label.toLowerCase().replace(/\s+/g, '_'),
                                                    pointTo: 1, // This should be determined by which team scored
                                                });
                                            }
                                        }}
                                        className={`py-2 items-center ${
                                        index !== tennisOptions.length - 1 ? "border-b border-gray-300 mx-5" : ""
                                        }`}
                                    >
                                        <Text className={`font-semibold ${item.color}`}>
                                        {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                            </>
                        )}
                    </View>
                    </View>
                </Modal>
            </ScrollView>
        </ImageBackground>
    </SafeAreaView>
  );
};

export default ScoringScreen;