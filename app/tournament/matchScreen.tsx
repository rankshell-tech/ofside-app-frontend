import React, {useState} from "react";
import { View, Text, TouchableOpacity, FlatList,ImageBackground,Image } from "react-native";
import { Ionicons, FontAwesome, Entypo} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { SlidersHorizontal } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from "expo-linear-gradient";
import OutlinedText from "@/components/OutlinedText";

type MatchStatus = "won" | "upcoming" | "canceled";

interface MatchCardProps {
  teamA: string;
  teamB: string;
  date: string;
  venue: string;
  viewers: number;
  status: MatchStatus;
  result?: string; // For "won" case
}

export default function MatchesScreen() {
  const navigation = useNavigation();
    const theme = useTheme();
    const { sport, format } = useLocalSearchParams<{ sport: string; format: string }>();
  const matches: MatchCardProps[] = [
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
      status: "upcoming",
    },
    {
      teamA: "TEAM A",
      teamB: "TEAM B",
      date: "09-11-2025, 4 pm Onwards",
      venue: "Venue Name, New Delhi",
      viewers: 120,
      status: "canceled",
    },
  ];
  const [tabType, setTabType] = useState("Matches");
  const tabTypes = ["Matches", "Point Table", "Leaderboard", "Stats"];
  const [leaderTabType, setLeaderTabType] = useState("Top Assist");
  const leaderTabTypes = ["Top Scorer", "Top Assist", "Goalkeeper", "MP"];


  const MatchCard: React.FC<MatchCardProps> = ({
    teamA,
    teamB,
    date,
    venue,
    viewers,
    status,
    result,
    }) => {
    const statusStyles =
        status === "won"
        ? "bg-yellow-300 text-black"
        : status === "upcoming"
        ? "bg-green-400 text-white"
        : "bg-red-400 text-white";

    const statusText =
        status === "won"
        ? result
        : status === "upcoming"
        ? "Upcoming match"
        : "Match Canceled | Due to rain";

    return (
        <View className="border bg-gray-300 rounded-lg mb-4 p-4">
            {/* Match Info */}
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-xs font-bold">
                        Individual match | Football
                    </Text>
                    <Text className="text-[10px]">
                        {venue}, {date}
                    </Text>
                </View>
                <View className="flex-row">
                    <Entypo name="eye" size={12} color="black" />
                    <Text className="text-[8px] font-bold ml-2">
                        {viewers}
                    </Text>
                </View>
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
                status === "won"
                ? ["yellow", "transparent"] // yellow gradient
                : status === "upcoming"
                ? ["green", "transparent"] // green gradient
                : ["red", "transparent"] // red gradient
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-b-md px-2 py-1"
            >
            <Text
                className={`text-xs font-semibold ${
                status === "won"
                    ? "text-black"
                    : "text-white"
                }`}
            >
                {statusText}
            </Text>
            </LinearGradient>
        </View>
        );
    };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
        <ImageBackground
            source={require("../../assets/images/background.png")}
            resizeMode="cover"
            className="flex-1"
        >
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 mx-2 mb-5">
            <View className="w-8 h-8 bg-white rounded-full border-4" >
                <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
            </View>
            <View className="flex-row">
                <FontAwesome className="mr-2" name="share-square-o" size={24} color="black" />
                <SlidersHorizontal onPress={() => router.push({
                                                    pathname: "/tournament/matchSettings",
                                                    params: { sport, format },})}
                                    size={24} color="black" />
            </View>
        </View>
        <View className="flex-row justify-center mb-8">
            {tabTypes.map((type) => (
                <TouchableOpacity
                    key={type}
                    className="px-2 py-1 rounded-md mr-2 border items-center"
                    style={{
                        backgroundColor: tabType === type ? theme.colors.primary : "#dedede"
                    }}
                    onPress={() => setTabType(type)}
                >
                <Text
                    className={`text-[15px] ${
                    tabType === type ? "font-semibold text-black" : ""
                    }`}
                >
                    {type}
                </Text>
                </TouchableOpacity>
            ))}
        </View>
        { tabType === "Matches" && (
            <>
                <FlatList
                    data={matches}
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item }) => <MatchCard {...item} />}
                />

                {/* Start match button */}
                <TouchableOpacity className="bg-[#FFF201] rounded-full py-3 mt-4 items-center">
                    <Text className="font-bold text-black">Start a match</Text>
                </TouchableOpacity>
            </>
        )}

        { tabType === "Point Table" && (
            <View className="bg-white rounded-md shadow">
                {/* Header */}
                <View className="flex-row bg-[#fff201] border rounded-md py-3 px-3">
                    {["S.No", "Team", "Played", "Won", "Lose", "Tied", "Points"].map((col, i) => (
                        <Text key={i} className={`flex-1 text-[12px] font-bold text-center ${col === 'Team' ? "mr-10":""}`}>{col}</Text>
                    ))}
                </View>

                {/* Rows */}
                {Array(8).fill(0).map((_, i) => (
                    <View key={i} className="flex-row border-b border-gray-400 py-3 px-3">
                    <Text className="flex-1 text-xs text-center font-bold">{i + 1}.</Text>
                    <Text className="flex-1 text-xs text-center font-bold mr-10">S.M.C.C</Text>
                    <Text className="flex-1 text-xs text-center">4</Text>
                    <Text className="flex-1 text-xs text-center">2</Text>
                    <Text className="flex-1 text-xs text-center">2</Text>
                    <Text className="flex-1 text-xs text-center">0</Text>
                    <Text className="flex-1 text-xs text-center">8</Text>
                    </View>
                ))}
                </View>
        )}

        { tabType === "Leaderboard" && (
            <View>
                <View className="flex-row justify-center mb-5">
                    {leaderTabTypes.map((type) => (
                        <TouchableOpacity
                            key={type}
                            className={`px-2 py-1 mr-2 items-center ${leaderTabType === type ?"border rounded-full ":""}`}
                            style={{
                                backgroundColor: leaderTabType === type ? theme.colors.primary : "white",
                            }}
                            onPress={() => setLeaderTabType(type)}
                        >
                        <Text
                            className={`text-[12px] ${
                            leaderTabType === type ? "font-bold text-black" : ""
                            }`}
                        >
                            {type}
                        </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                { leaderTabType === 'Top Assist' && (
                    <>
                    {/* Header */}
                    <View className="flex-row bg-[#fff201] rounded-t-md py-2 px-3">
                        {["S.No", "Player", "Team", "Matches", "Goals", "GSR"].map((col, i) => (
                        <Text key={i} className={`flex-1 text-xs font-bold text-center ${col==='Player' ?"mr-10":""}`}>{col}</Text>
                        ))}
                    </View>

                    {/* Rows */}
                    {[1, 2, 3, 4, 5].map((rank) => (
                        <View key={rank} className="flex-row items-center border-t border-gray-400 py-2 px-3">
                            {rank === 1
                            ?
                                <OutlinedText text={rank} fillColor="#FFF201" strokeColor="black" fontSize={30}/>
                            :
                                <OutlinedText text={rank} fillColor="black" strokeColor="black" fontSize={30}/>
                            }
                        <View className="flex-1 items-center ml-8 mr-10">
                            <View className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center">
                                <FontAwesome name="user" size={24} color="black" />
                            </View>
                            <Text className="text-[8px] font-bold">Player name</Text>
                        </View>
                        <Text className="flex-1 text-[14px] text-center font-bold">S M</Text>
                        <Text className="flex-1 text-[14px] text-center font-bold">4</Text>
                        <Text className="flex-1 text-[14px] text-center font-bold">5</Text>
                        <Text className="flex-1 text-[14px] text-center font-bold">80%</Text>
                        </View>
                    ))}
                    </>
                )}
            </View>
        )}

        {tabType === "Stats" && (
          <View className="py-6">

            {/* Row 1 */}
            {(() => {
              const stats = [
                { label: "Goals Scored", value: 18 },
                { label: "Assists", value: 6 },
                { label: "Shots on Goal", value: 24 },
              ];
              const maxValue = Math.max(...stats.map((s) => s.value));
              const minValue = Math.min(...stats.map((s) => s.value));
              return (
                <View className="flex-row justify-between mb-4">
                  {stats.map((s, i) => (
                    <View key={i} className="flex-1 mx-1">
                      <Text className="bg-[#FFF201] text-black text-center font-bold py-1 border rounded-md mb-2 text-[12px]">
                        {s.label}
                      </Text>
                      <View className="border rounded-md py-3 items-center bg-gray-200">
                        <Text
                          className={`text-4xl font-bold italic ${
                            s.value === maxValue ? "text-green-600" : "text-black"},`}
                        >
                          {s.value}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })()}

            {/* Row 2 */}
            {(() => {
              const stats = [
                { label: "Matches Played", value: 34 },
                { label: "Man of the Match Awards", value: 2 },
              ];
              const maxValue = Math.max(...stats.map((s) => s.value));
              return (
                <View className="flex-row justify-between mb-4">
                  {stats.map((s, i) => (
                    <View key={i} className="flex-1 mx-1">
                      <Text className="bg-[#FFF201] text-black text-center font-bold py-1 border rounded-md mb-1 text-[12px]">
                        {s.label}
                      </Text>
                      <View className="border rounded-md py-3 items-center bg-gray-200">
                        <Text
                          className={`text-4xl font-bold italic ${
                            s.value === maxValue ? "text-green-600" : "text-black"
                          }`}
                        >
                          {s.value}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })()}

            {/* Row 3 */}
            {(() => {
              const stats = [
                { label: "Matches Lose", value: 20 },
                { label: "Matches Won", value: 14 },
                { label: "Mins Played", value: 222 },
              ];
              const maxValue = Math.max(...stats.map((s) => s.value));
              const minValue = Math.min(...stats.map((s) => s.value));
              return (
                <View className="flex-row justify-between mb-4">
                  {stats.map((s, i) => (
                    <View key={i} className="flex-1 mx-1">
                      <Text className="bg-[#FFF201] text-black text-center font-bold py-1 border rounded-md mb-1 text-[12px]">
                        {s.label}
                      </Text>
                      <View className="border rounded-md py-3 items-center bg-gray-200">
                        <Text
                          className={`text-4xl italic font-bold ${
                            s.value === maxValue ? "text-green-600" : "text-black"
                          },
                            ${s.value === minValue ? "text-red-600":""
                          }
                          `}
                        >
                          {s.value}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })()}

            {/* Row 4 */}
            {(() => {
              const stats = [
                { label: "Matches Lose", value: 20 },
                { label: "Matches Won", value: 14 },
                { label: "Mins Played", value: 222 },
              ];
              const maxValue = Math.max(...stats.map((s) => s.value));
              const minValue = Math.min(...stats.map((s) => s.value));
              return (
                <View className="flex-row justify-between mb-4">
                  {stats.map((s, i) => (
                    <View key={i} className="flex-1 mx-1">
                      <Text className="bg-[#FFF201] text-black text-center font-bold py-1 border rounded-md mb-1 text-[12px]">
                        {s.label}
                      </Text>
                      <View className="border rounded-md py-3 items-center bg-gray-200">
                        <Text
                          className={`text-4xl italic font-bold ${
                            s.value === maxValue ? "text-green-600" : "text-black"
                          },
                            ${s.value === minValue ? "text-red-600":""
                          }
                          `}
                        >
                          {s.value}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })()}

          </View>
        )}

      </ImageBackground>
    </SafeAreaView>
  );
}
