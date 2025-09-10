// app/screens/ScoringScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Pressable,StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronDown, SlidersHorizontal } from "lucide-react-native";
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const ScoringScreen = () => {
    const theme = useTheme();
    const { sport, format } = useLocalSearchParams<{ sport: string; format: string }>();
    const navigation = useNavigation();
    const [tabType, setTabType] = useState("Scoring");
    const tabTypes = ["Scoring", "Match Feed"];
    const [rulesVisible, setRulesVisible] = useState(false);
    const [teamsVisible, setTeamsVisible] = useState(false);
    const [team, setTeam] = useState<string | null>(null);
    const [goalScorer, setGoalScorer] = useState<string | null>(null);
    const [player, setPlayer] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);

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
        { label: "Foul", color: "text-red-600" },
        { label: "Free Kick", color: "text-black" },
        { label: "Penalty scored/missed", color: "text-black" },
        { label: "Corner Kick", color: "text-black" },
        { label: "Yellow Card", color: "text-yellow-500" },
        { label: "Player substitute/Short", color: "text-black" },
        { label: "Red Card", color: "text-red-600" },
        { label: "Drinks break/ Resume", color: "text-black" },
    ];
    const goals = {
        left: [
        { player: "Swant Jain", minute: "25’" },
        { player: "Binod Jha", minute: "43’" },
        ],
        right: [
        { player: "Swant Jain", minute: "15’" },
        { player: "Binod Jha", minute: "55’" },
        { player: "Shekhar Das", minute: "61’" },
        ],
    };
    const feeds = [
        {
        time: "9:32",
        text: "Sdfesdsdjh dfjjwehd fgs hfthwjdbjshjgjdhsdb cjkqw bghcjhdbhbbsayjk jsklsbdaui iesfhvw bhuhbfbd fhsadj b jkasdhdsdbks fererfc",
        },
        {
        time: "9:32",
        text: "Sdfesdsdjh dfjjwehd fgs hfthwjdbjshjgjdhsdb cjkqw bghcjhdbhbbsayjk jsklsbdaui iesfhvw bhuhbfbd fhsadj b jkasdhdsdbks fererfc",
        },
        {
        time: "9:32",
        text: "Sdfesdsdjh dfjjwehd fgs hfthwjdbjshjgjdhsdb cjkqw bghcjhdbhbbsayjk jsklsbdaui iesfhvw bhuhbfbd fhsadj b jkasdhdsdbks fererfc",
        },
        {
        time: "9:32",
        text: "Sdfesdsdjh dfjjwehd fgs hfthwjdbjshjgjdhsdb cjkqw bghcjhdbhbbsayjk jsklsbdaui iesfhvw bhuhbfbd fhsadj b jkasdhdsdbks fererfc",
        },
    ];
    const basketballActions = [
        { label: "Shooting Foul", color: "text-red-600" },
        { label: "2 Pointer", color: "text-green-600" },
        { label: "Free throw missed", color: "text-black" },
        { label: "1 Pointer/ Free throw", color: "text-green-600" },
    ];
    const sets = [
        { set: "Set 1", teamA: 17, teamB: 15 },
        { set: "Set 2", teamA: 15, teamB: 12 },
        { set: "Set 3", teamA: null, teamB: null },
    ];
    const quarters = [
        { set: "1 Quarter", teamA: 12, teamB: 17, winner: 'S.M.C.C' },
        { set: "2 Quarter", teamA: 18, teamB: 11, winner: 'Stallians' },
        { set: "3 Quarter", teamA: null, teamB: null, winner: null },
        { set: "4 Quarter", teamA: null, teamB: null, winner: null },
    ];
    const tennisSets = [
        { team: "Stallions", score: 0, gameScore: 0 },
        { team: "S.M.C.C", score: 1, gameScore: 15 },
    ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-3">
            <Ionicons onPress={() => navigation.goBack()} name="chevron-back-circle-outline" size={22} color="black" />
            <TouchableOpacity onPress={() => setRulesVisible(true)}>
                <SlidersHorizontal  size={22} color="black" />
            </TouchableOpacity>
        </View>


        {/* Tabs */}
        <View className="flex-row justify-center mb-2">
            {tabTypes.map((type) => (
                <TouchableOpacity
                    key={type}
                    className="px-3 py-3 rounded-full mr-2 border"
                    style={{
                        backgroundColor: tabType === type ? theme.colors.primary : "white",
                        borderColor: tabType === type ? theme.colors.primary : theme.colors.accent
                    }}
                    onPress={() => setTabType(type)}
                >
                <Text
                    className={`text-xl ${
                    tabType === type ? "font-semibold text-black" : "text-gray-600"
                    }`}
                >
                    {type}
                </Text>
                </TouchableOpacity>
            ))}
        </View>

        <View className="flex-row justify-end items-center mb-2">
            <TouchableOpacity className="mr-2">
                <FontAwesome name="share-square-o" size={18} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center border bg-red-500 border-red-500 rounded-md px-1 mr-3">
                <Text className="text-white">Live</Text>

                    <Octicons className="ml-2" name="dot-fill" size={14} color="white" />
            </TouchableOpacity>
        </View>

        {/* Match Info */}
        <View className="py-3 px-4 mx-3 rounded-lg" style={{backgroundColor: theme.colors.accent}}>
            <View className="flex-row justify-between">
            <View className="mt-5">
                <Text className="text-white font-bold">Stallians</Text>
                <Text className="text-[8px] text-white">Swarit Jain <Text className="font-extrabold">C</Text></Text>
                {sport !== 'Basketball' && (
                    <Text className="text-[8px] text-white">Binod Jha (GK)</Text>
                )}

            </View>
            <View className="items-center">
                <Text className="text-xs text-white">9:52</Text>
                <Text className="text-2xl text-white font-bold">2 - 2</Text>
                <Text className="text-[8px] text-white">Delhi NCR ground</Text>
                <Text className="text-[8px] text-white">Friendly Match</Text>
            </View>
            <View className="items-end mt-5">
                <Text className="text-white font-bold">S.M.C.C</Text>
                <Text className="text-[8px] text-white">Swarit Jain <Text className="font-extrabold">C</Text></Text>
                {sport !== 'Basketball' && (
                    <Text className="text-[8px] text-white">Binod Jha (GK)</Text>
                )}
            </View>
            </View>
        </View>

        {/* Undo */}
        <View className="flex-row justify-end px-4 mt-2">
            <TouchableOpacity className="flex-row items-center space-x-1">
                <Text className="text-black">Undo</Text>
                <MaterialCommunityIcons name="undo-variant" size={24} color="black" />
            </TouchableOpacity>
        </View>

        { tabType === "Scoring" && (
            <ScrollView
                contentContainerStyle={{ padding: 12,}} // extra space at bottom
                showsVerticalScrollIndicator={false}
            >

                {(sport === "Football") &&(
                <>
                        {/* Actions */}
                        <View className="flex-row flex-wrap justify-between mb-5">
                            <View className="w-[48%]">
                                <TouchableOpacity className="h-16 mb-3 border border-black rounded-lg bg-gray-100 items-center justify-center">
                                <Text className="text-red-600 font-semibold">Self Goal</Text>
                                </TouchableOpacity>

                                <TouchableOpacity className="h-16 border border-black rounded-lg bg-gray-100 items-center justify-center">
                                <Text className="text-green-600 font-semibold">Goal Saved</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Right column (1 big Goal button spanning both rows) */}
                            <View className="w-[48%] mb-4">
                                <TouchableOpacity className="h-[120px] border border-black rounded-lg bg-gray-100 items-center justify-center">
                                <Text className="text-green-600 font-bold text-3xl">Goal</Text>
                                </TouchableOpacity>
                            </View>

                            {actions.map((action, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="w-[48%] h-16 border border-gray-400 rounded-lg mb-3 items-center justify-center bg-gray-50"
                                >
                                    <Text className={`text-center font-bold ${action.color}`}>{action.label}</Text>
                                </TouchableOpacity>
                                ))}
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
                                <Text className="text-red-600 font-semibold">Flagrant Foul</Text>
                                </TouchableOpacity>

                                <TouchableOpacity className="h-16 border border-black rounded-lg bg-gray-100 items-center justify-center">
                                <Text className="text-red-600 font-semibold">Technical Foul</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Right column (1 big Goal button spanning both rows) */}
                            <View className="w-[48%] mb-4">
                                <TouchableOpacity className="h-[120px] border border-black rounded-lg bg-gray-100 items-center justify-center">
                                <Text className="text-green-600 font-bold text-3xl">3 Pointer</Text>
                                </TouchableOpacity>
                            </View>

                            {basketballActions.map((action, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="w-[48%] h-16 border border-gray-400 rounded-lg mb-3 items-center justify-center bg-gray-50"
                                >
                                    <Text className={`text-center font-bold ${action.color}`}>{action.label}</Text>
                                </TouchableOpacity>
                            ))}
                            <View className="w-[48%]">
                                <TouchableOpacity className="h-[120px] border border-black rounded-lg bg-gray-100 items-center justify-center">
                                    <Text className="text-red-600 font-bold text-xl">Player disqualified</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Right column (1 big Goal button spanning both rows) */}
                            <View className="w-[48%] mb-4">
                                <TouchableOpacity className="h-16 mb-3 border border-black rounded-lg bg-gray-100 items-center justify-center">
                                    <Text className="font-semibold">Player substitute</Text>
                                </TouchableOpacity>

                                <TouchableOpacity className="h-16 border border-black rounded-lg bg-gray-100 items-center justify-center">
                                    <Text className="font-semibold">Drinks break/ Resume</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Select Action Button */}
                        <TouchableOpacity onPress={()=> router.push('/xplore/winnerScreen')} className="py-3 mx-5 mb-5 rounded-lg items-center" style={{backgroundColor: theme.colors.primary}}>
                            <Text className="font-semibold text-black">Select action</Text>
                        </TouchableOpacity>
                    </>
                )}

                {(sport === "Badminton" || sport === "Pickleball" || sport === 'Tennis' || sport === 'Volleyball') && (
                    <>
                        <View className="flex-row justify-between items-center ">
                                <LinearGradient
                                    colors={["#FFE600", "#EDEDED"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="items-center justify-center w-48 h-36 mr-2"
                                >
                                    <TouchableOpacity onPress={() => setVisible(true)}>
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
                                            Stallions
                                            </Text>
                                            <Text className="font-extrabold text-4xl text-black">
                                            +1
                                            </Text>
                                        </>
                                        }
                                    </TouchableOpacity>
                                </LinearGradient>
                            <View className="items-center justify-center w-48 h-36 border rounded-xl bg-gray-200">
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
                                        S.M.C.C
                                        </Text>
                                        <Text className="font-extrabold text-4xl text-black">
                                        +1
                                        </Text>
                                    </>
                                    }
                            </View>
                        </View>
                        <View className="flex-row justify-between items-center">
                            <Text className="text-xl font-bold mt-6 px-4">
                                Recent <Text className="font-bold text-3xl">Feed</Text>
                            </Text>
                            <Text className="text-[10px] underline mr-2">View</Text>
                        </View>
                        <View className="mt-3 px-4">
                            {feeds.map((feed, index) => (
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
            </ScrollView>
        )}
        { tabType === "Match Feed" &&(
        <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }} // extra space at bottom
            showsVerticalScrollIndicator={false}
        >
            {(sport === "Football") &&(
                <>
                    {/* Goals Scored */}
                    <Text className="text-2xl font-bold mt-6 px-4">
                        Goals <Text className="text-blue-600">Scored</Text>
                    </Text>
                    <View className="flex-row justify-between px-4 mt-3">
                        {/* Left team goals */}
                        <View>
                        {goals.left.map((g, i) => (
                            <Text key={i} className="text-base text-black">
                            {g.player} <Text className="text-gray-600">{g.minute}</Text>
                            </Text>
                        ))}
                        </View>
                        {/* Right team goals */}
                        <View className="items-end">
                        {goals.right.map((g, i) => (
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
                        colors={["#FFF201", "#FFFDE7"]}
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
                    {quarters.map((item, index) => (
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
                        colors={["#FFF201", "#FFFDE7"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="flex-row justify-between px-4 py-3 mb-1 mx-2"
                    >
                        <Text className="font-bold text-base">Team</Text>
                        <Text className="font-bold text-base">Set Score</Text>
                        <Text className="font-bold text-base">Game Score</Text>
                    </LinearGradient>

                    {/* Rows */}
                    {tennisSets.map((item, index) => (
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
                        colors={["#FFF201", "#FFFDE7"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="flex-row justify-between px-4 py-3 mb-1 mx-2"
                    >
                        <Text className="font-bold text-base">Sets</Text>
                        <Text className="font-bold text-base text-green-600">Stallians</Text>
                        <Text className="font-bold text-base">S.M.C.C</Text>
                    </LinearGradient>

                    {/* Rows */}
                    {sets.map((item, index) => (
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
                {feeds.map((feed, index) => (
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
        </ScrollView>
        )}

            {/* Bottom Sheet Modal */}
            <Modal
                isVisible={rulesVisible}
                onBackdropPress={() => setRulesVisible(false)}
                onBackButtonPress={() => setRulesVisible(false)}
                style={{ justifyContent: "flex-start", marginLeft: 150 }}
            >
                <View className="bg-white rounded-2xl p-5 shadow-lg">

                {/* Rules List */}
                <TouchableOpacity
                    onPress={() => {
                                    setTeamsVisible(true);
                                    setRulesVisible(false);
                                }}
                    className="py-2">
                    <Text className="text-base">Match Abandoned</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-2">
                    <Text className="text-base">Match Rescheduled</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-2">
                    <Text className="text-base">Walkover</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> {setRulesVisible(false); router.push('/xplore/winnerScreen')}} className="py-2">
                    <Text className="text-base">End Match</Text>
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
                            <TouchableOpacity className="flex-row justify-between items-center py-3 px-4 rounded-full mb-5" style={{backgroundColor: theme.colors.primary}}>
                                <Text className="text-black font-medium">
                                {team || "Select the team"}
                                </Text>
                                <ChevronDown size={18} color="black" />
                            </TouchableOpacity>

                            {/* Select Player */}
                            <Text className="text-lg font-bold mb-2">Select Goal scorer</Text>
                            <TouchableOpacity className="flex-row justify-between items-center py-3 px-4 rounded-full mb-5" style={{backgroundColor: theme.colors.primary}}>
                                <Text className="text-black font-medium">
                                    {goalScorer || "Select goal scorer"}
                                </Text>
                                <ChevronDown size={18} color="black" />
                            </TouchableOpacity>

                            {/* Select Assisting Player */}
                            <Text className="text-lg font-bold mb-2">Select Assisting player</Text>
                            <TouchableOpacity className="flex-row justify-between items-center py-3 px-4 rounded-full mb-5" style={{backgroundColor: theme.colors.primary}}>
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
                            <TouchableOpacity className="flex-row justify-between items-center py-3 px-4 rounded-full mb-5" style={{backgroundColor: theme.colors.primary}}>
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
                            <TouchableOpacity className="flex-row justify-between items-center py-3 px-4 rounded-full mb-5" style={{backgroundColor: theme.colors.primary}}>
                                <Text className="text-black font-medium">
                                    {team || "Select team"}
                                </Text>
                                <ChevronDown size={18} color="black" />
                            </TouchableOpacity>

                            {/* Select Player */}
                            <Text className="text-lg font-bold mb-2">Select Player</Text>
                            <TouchableOpacity className="flex-row justify-between items-center py-3 px-4 rounded-full mb-5" style={{backgroundColor: theme.colors.primary}}>
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
                        onPress={() => setTeamsVisible(false)}
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
                        {options.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setVisible(false)}
                            className={`py-2 items-center ${
                            index !== options.length - 1 ? "border-b border-gray-300 mx-5" : ""
                            }`}
                        >
                            <Text className={`font-semibold ${item.color}`}>
                            {item.label}
                            </Text>
                        </TouchableOpacity>
                        ))}
                        </>
                    )}
                    {(sport === 'Tennis' &&
                        <>
                        {tennisOptions.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setVisible(false)}
                            className={`py-2 items-center ${
                            index !== tennisOptions.length - 1 ? "border-b border-gray-300 mx-5" : ""
                            }`}
                        >
                            <Text className={`font-semibold ${item.color}`}>
                            {item.label}
                            </Text>
                        </TouchableOpacity>
                        ))}
                        </>
                    )}
                </View>
                </View>
            </Modal>
        </View>
    </SafeAreaView>
  );
};

export default ScoringScreen;