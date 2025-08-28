// app/screens/ScoringScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronDown, Pencil, RotateCcw, SlidersHorizontal } from "lucide-react-native";
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";

const ScoringScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [tabType, setTabType] = useState("Scoring");
    const tabTypes = ["Scoring", "Match Feed"];
    const [rulesVisible, setRulesVisible] = useState(false);
    const [teamsVisible, setTeamsVisible] = useState(false);
    const [team, setTeam] = useState<string | null>(null);
    const [player, setPlayer] = useState<string | null>(null);

    const actions = [
    { label: "Save", color: "text-green-600" },
    { label: "Foul/Free Kick", color: "text-black" },
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-3">
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-circle-outline" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRulesVisible(true)}>
                <SlidersHorizontal  size={22} color="black" />
            </TouchableOpacity>
        </View>
        <View className="items-end mr-3">
            <TouchableOpacity>
                <FontAwesome name="share-square-o" size={24} color="black" />
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
        {/* Match Info */}
        <View className="py-3 px-4 mx-3 rounded-lg" style={{backgroundColor: theme.colors.accent}}>
            <View className="flex-row justify-between">
            <View className="mt-5">
                <Text className="text-white font-bold">Stallians</Text>
                <Text className="text-xs text-gray-300">Swant Jain (C)</Text>
                <Text className="text-xs text-gray-300">Binod Jha (GK)</Text>
            </View>
            <View className="items-center">
                <Text className="text-xs text-gray-300">9:52</Text>
                <Text className="text-2xl text-white font-bold">2 - 2</Text>
                <Text className="text-xs text-gray-300">Delhi NCP ground</Text>
                <Text className="text-xs text-gray-300">Friendly Match</Text>
            </View>
            <View className="items-end mt-5">
                <Text className="text-white font-bold">S.M.C.C</Text>
                <Text className="text-xs text-gray-300">Swant Jain (C)</Text>
                <Text className="text-xs text-gray-300">Binod Jha (GK)</Text>
            </View>
            </View>
        </View>

        { tabType === "Scoring" && (
            <ScrollView
                contentContainerStyle={{ padding: 12,}} // extra space at bottom
                showsVerticalScrollIndicator={false}
            >
                {/* Undo */}
                <View className="flex-row justify-end px-4 mt-2">
                    <TouchableOpacity className="flex-row items-center space-x-1">
                        <Text className="text-black">Undo</Text>
                        <MaterialCommunityIcons name="undo-variant" size={24} color="black" />
                    </TouchableOpacity>
                </View>

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
            </ScrollView>
        )}
        { tabType === "Match Feed" &&(
        <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }} // extra space at bottom
            showsVerticalScrollIndicator={false}
        >
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
                    className="py-3 border-b border-gray-200">
                    <Text className="text-base">Match Abandoned</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-3 border-b border-gray-200">
                    <Text className="text-base">Match Rescheduled</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-3">
                    <Text className="text-base">Walkover</Text>
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
                {/* Select Team */}
                <Text className="text-lg font-bold mb-2">Select team</Text>
                <TouchableOpacity className="flex-row justify-between items-center py-3 px-4 rounded-full mb-5" style={{backgroundColor: theme.colors.primary}}>
                    <Text className="text-black font-medium">
                    {team || "Select the team"}
                    </Text>
                    <ChevronDown size={18} color="black" />
                </TouchableOpacity>

                {/* Select Player */}
                <Text className="text-lg font-bold mb-2">Select player</Text>
                <TouchableOpacity className="flex-row justify-between items-center py-3 px-4 rounded-full mb-5" style={{backgroundColor: theme.colors.primary}}>
                    <Text className="text-black font-medium">
                    {player || "Select player"}
                    </Text>
                    <ChevronDown size={18} color="black" />
                </TouchableOpacity>

                {/* Select Action Button */}
                <TouchableOpacity
                    className="py-3 rounded-lg items-center mt-10"
                    style={{backgroundColor: theme.colors.primary}}
                >
                    <Text className="font-semibold text-black">Select action</Text>
                </TouchableOpacity>
                </Pressable>
            </Pressable>
            </Modal>
        </View>
    </SafeAreaView>
  );
};

export default ScoringScreen;
