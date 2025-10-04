import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, FlatList, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Entypo, FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";

type MatchStatus = "won" | "upcoming" | "current";

interface MatchCardProps {
  teamA: string;
  teamB: string;
  date: string;
  venue: string;
  viewers: number;
  status: MatchStatus;
  result?: string;
  onPress?: () => void;
}
export default function Leaderboard() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [sport, setSport] = useState("Basketball");
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const upcomingMatches: MatchCardProps[] = [
    {
      teamA: "TEAM A",
      teamB: "TEAM B",
      date: "09-11-2025, 4 pm Onwards",
      venue: "Venue Name, New Delhi",
      viewers: 554,
      status: "upcoming",
      result: "Team A won the match by 3-1",
    },
    {
      teamA: "TEAM A",
      teamB: "TEAM B",
      date: "09-11-2025, 4 pm Onwards",
      venue: "Venue Name, New Delhi",
      viewers: 220,
      status: "upcoming",
    },
  ];
  const playedMatches: MatchCardProps[] = [
    {
      teamA: "TEAM A",
      teamB: "TEAM B",
      date: "09-11-2025, 4 pm Onwards",
      venue: "Venue Name, New Delhi",
      viewers: 554,
      status: "won",
      result: "Team A won the match by 3-1",
    },
    {
      teamA: "TEAM A",
      teamB: "TEAM B",
      date: "09-11-2025, 4 pm Onwards",
      venue: "Venue Name, New Delhi",
      viewers: 220,
      status: "won",
      result: "Team B won the match by 3-1",
    },
    {
      teamA: "TEAM A",
      teamB: "TEAM B",
      date: "09-11-2025, 4 pm Onwards",
      venue: "Venue Name, New Delhi",
      viewers: 220,
      status: "won",
      result: "Team A won the match by 3-1",
    },
  ];
  const currentMatches: MatchCardProps[] = [
    {
      teamA: "TEAM A",
      teamB: "TEAM B",
      date: "09-11-2025, 4 pm Onwards",
      venue: "Venue Name, New Delhi",
      viewers: 554,
      status: "current",
      result: "Team A leading the round by 3-1",
    },
  ];

    const MatchCard: React.FC<MatchCardProps> = ({
    teamA,
    teamB,
    date,
    venue,
    viewers,
    status,
    result,
    onPress
    }) => {
    const statusText =
        status === "won" || status === "current"
        ? result
        : status === "upcoming"
        ? "Upcoming match"
        : "Match Canceled | Due to rain";

    return (
        <TouchableOpacity onPress={onPress}
                         className="border bg-gray-300 rounded-3xl mb-4 p-4">
            {/* Match Info */}
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-xs font-bold">
                        Individual/Tournament match | Football
                    </Text>
                    <Text className="text-[10px]">
                        {venue}, {date}
                    </Text>
                </View>
                {status === "current" && (
                    <View className="flex-row items-center border bg-red-500 border-red-500 rounded-full px-1 mr-1">
                        <Text className="text-white font-bold text-[8px]">LIVE</Text>
                        <Octicons className="ml-2" name="dot-fill" size={10} color="white" />
                    </View>
                )}
            </View>

            {/* VS Section */}
            <View className="flex-row justify-between items-center my-4">
                <View className="items-center flex-1">
                <View
                    style={{ backgroundColor: theme.colors.grey }}
                    className="w-20 h-20 rounded-full items-center justify-center shadow"
                >
                    <FontAwesome name="user" size={40} color={theme.colors.accent} />
                </View>
                <Text className="mt-1 text-sm font-bold">{teamA}</Text>
                </View>

                {/* VS Icon */}
                <View className="items-center">
                    <Image
                        source={require("../../assets/images/vsIconGray.png")}
                        style={{ width: 50, height: 50 }}
                        resizeMode="contain"
                    />
                </View>

                <View className="items-center flex-1">
                <View
                    style={{ backgroundColor: theme.colors.grey }}
                    className="w-20 h-20 rounded-full items-center justify-center shadow"
                >
                    <FontAwesome name="user" size={40} color={theme.colors.accent} />
                </View>
                <Text className="mt-1 text-sm font-bold">{teamB}</Text>
                </View>
            </View>

            {/* Status Bar */}
            <LinearGradient
                colors={
                    status === "won" || status === "upcoming" || status === "current"
                    ? ["green", "transparent"] // green gradient
                    : ["red", "transparent"] // red gradient
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-md px-2 py-1"
            >
                <Text
                    className={`text-xs font-semibold text-white `}
                >
                    {statusText}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
        );
    };

  return (
    <SafeAreaView className="flex-1 bg-white">
        <ImageBackground
            source={require("../../assets/images/background.png")} // Put your image in assets/images
            resizeMode="cover"
            className='flex-1'
        >
            {/* Header */}
            <View className="flex-row justify-between items-center px-2 mt-5">
                <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2" >
                    <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
                </View>
                <View className="flex-row items-center">
                    <FontAwesome className="mx-1" name="search" size={20} color="black" />
                    <TouchableOpacity
                        style={{backgroundColor: filterVisible? theme.colors.primary:'white'}}
                        onPress={() => setFilterVisible(true)}
                        className="px-2 py-2 border flex-row items-center mx-1"
                    >
                        <Text className='mr-1 text-[12px] font-bold'>Filter by</Text>
                        <Ionicons name="grid" size={14} color="black" />
                    </TouchableOpacity>
                    <LinearGradient
                        colors={["#FFF201", "#FFFFFF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="h-10 border rounded-full overflow-hidden mx-1 flex-row items-center"
                        style={{ width: 120 }}
                        >
                        <Picker
                            selectedValue={sport}
                            onValueChange={(val) => setSport(val)}
                            style={{ width: "100%" }}
                        >
                            <Picker.Item label="Football" value="Football" />
                            <Picker.Item label="Volleyball" value="Volleyball" />
                            <Picker.Item label="Badminton" value="Badminton" />
                            <Picker.Item label="Tennis" value="Tennis" />
                            <Picker.Item label="Pickleball" value="Pickleball" />
                            <Picker.Item label="Basketball" value="Basketball" />
                        </Picker>
                    </LinearGradient>
                </View>
            </View>

            {/* Tabs */}
            <View className="flex-row justify-around mx-5 mt-4">
                {["Current", "Played", "Upcoming"].map((tab) => (
                    <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={`flex-1 mx-1 py-2 rounded-xl border items-center ${
                        activeTab === tab ? "bg-[#FFF201]" : "bg-white"
                    }`}
                    >
                    <Text
                        className={`${
                        activeTab === tab
                            ? "font-extrabold text-lg text-black"
                            : "text-md text-gray-600"
                        }`}
                    >
                        {tab}
                    </Text>
                    </TouchableOpacity>
                ))}
            </View>


            <View className="mt-10 px-2 flex-1">
                <FlatList
                    data={
                    activeTab === "Upcoming"
                        ? upcomingMatches
                        : activeTab === "Played"
                        ? playedMatches
                        : currentMatches
                    }
                    keyExtractor={(item, i) => `${activeTab}-${i}`}
                    renderItem={({ item }) => (
                    <MatchCard
                        {...item}
                        onPress={
                        activeTab === "Played"
                            ? undefined // no action for played matches
                            : () =>
                                router.push({
                                pathname: "/scoring/scoringScreen",
                                params: { sport },
                                })
                        }
                    />
                    )}
                    ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-6">
                        No {activeTab} matches found
                    </Text>
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            </View>

      </ImageBackground>
    </SafeAreaView>
  );
}
