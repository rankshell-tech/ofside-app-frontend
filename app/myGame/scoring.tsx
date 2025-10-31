// app/screens/ScoringScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Pressable,StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronDown, SlidersHorizontal } from "lucide-react-native";
import { Entypo, Feather, FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
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
                    <TouchableOpacity>
                        <Text className="text-base font-bold">Help</Text>
                    </TouchableOpacity>
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
                    <TouchableOpacity className="flex-row items-center border bg-red-500 border-red-500 rounded-full px-2 mr-3">
                        <Text className="text-white font-bold">Live</Text>
                            <Octicons className="ml-2" name="dot-fill" size={18} color="white" />
                    </TouchableOpacity>
                </View>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }} // add extra space at bottom
                showsVerticalScrollIndicator={false}
                >

                { tabType === "Scoring" && (
                   <View className="px-2">
                        {/* Match Info */}
                        <View className="py-3 px-4 mx-3 border-[2px] rounded-lg border-yellow-400" style={{backgroundColor: theme.colors.accent}}>
                            <View className="flex-row justify-between">
                            <View className="mt-5">
                                <Text className="text-white font-bold text-2xl">Stallians</Text>
                                <Text className="text-[8px] text-white">Swarit Jain <Text className="font-extrabold">C</Text></Text>
                                {sport !== 'Basketball' && (
                                    <Text className="text-[8px] text-white">Binod Jha (GK)</Text>
                                )}

                            </View>
                            <View className="items-center">
                                <Text className="text-xs text-white">9:52</Text>
                                <Text className="text-4xl text-white font-bold">2 : 2</Text>
                                <Text className="text-[8px] text-white">Delhi NCR ground</Text>
                                <Text className="text-[8px] text-white">Friendly Match</Text>
                            </View>
                            <View className="items-end mt-5">
                                <Text className="text-white font-bold text-2xl">S.M.C.C</Text>
                                <Text className="text-[8px] text-white">Swarit Jain <Text className="font-extrabold">C</Text></Text>
                                {sport !== 'Basketball' && (
                                    <Text className="text-[8px] text-white">Binod Jha (GK)</Text>
                                )}
                            </View>
                            </View>
                        </View>
                    </View>
                )}
                { tabType === "Match Feed" &&(
                    <></>
                )}

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
                                colors={["#FFF201", "#FFFFFF"]}
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
                </View>

            </ScrollView>
        </ImageBackground>
    </SafeAreaView>
  );
};

export default ScoringScreen;