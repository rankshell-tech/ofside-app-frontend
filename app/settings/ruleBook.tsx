import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RulesOverview() {
  const [sport, setSport] = useState<"Badminton" | "Football" | "Cricket">("Football");

  const rules = {
    Football: {
      overview:
        "Football (soccer) is played between two teams of 11 players. The aim is simple: score more goals than the other team by getting the ball into their net. Play is controlled by a referee and two assistants.",
      field: [
        "Rectangular pitch with two goalposts and a crossbar.",
        "Ball: round, standard size.",
        "Players wear jersey, shorts, socks, shin guards and boots.",
        "Goalkeeper wears a different colored shirt.",
      ],
      basics: [
        "Match length: two halves of 45 minutes each + stoppage time added by the referee.",
        "Half-time: usually 15 minutes.",
        "Teams: 11 players on field (1 goalkeeper).",
        "Substitutes: match-specific limit(show's your app's number); substitues happens with referee permission.",
        "Kick-off starts each half and restarts after a goal.",
      ],
      scoring: [
        "A goal counts when the ball crosses the goal line, between posts and under the crossbar.",
        "Team with more goals wins. If tied, competition rules decide (draw, extra time, penalties).",
      ],
    },
    Badminton: {
      overview:
        "Badminton is played with a shuttlecock and rackets. The goal is to score points by landing the shuttle in the opponent’s court.",
      field: [
        "Court dimensions: 13.4m x 6.1m (doubles).",
        "Net at 1.55m height.",
        "Shuttlecock made of feathers or synthetic.",
      ],
      basics: [
        "Match best of 3 games, each to 21 points.",
        "Rally scoring system.",
        "Serve alternates after each point.",
      ],
      scoring: [
        "Point scored when shuttle lands inside opponent’s court.",
        "First to 21 wins the game (win by 2 points, cap at 30).",
      ],
    },
    Cricket: {
      overview:
        "Cricket is a bat-and-ball game played between two teams of 11 players each. One team bats, the other bowls/fields.",
      field: [
        "Played on a circular field with a 22-yard pitch.",
        "Ball: hard leather, bat: wooden.",
        "Protective gear worn by batsmen and wicketkeeper.",
      ],
      basics: [
        "Match formats: Test, ODI (50 overs), T20 (20 overs).",
        "Teams alternate batting and bowling.",
        "Bowler delivers 6 balls per over.",
      ],
      scoring: [
        "Runs scored by batsmen running between wickets or hitting boundaries.",
        "Wickets: batsman dismissed via bowled, caught, LBW, etc.",
        "Team with more runs wins.",
      ],
    },
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
        <ImageBackground
            source={require("../../assets/images/background.png")}
            resizeMode="cover"
            className="flex-1"
            >
            {/* Top Tabs */}
            <View className="flex-row justify-between py-3">
                {["Badminton", "Football", "Cricket"].map((s) => (
                <TouchableOpacity
                    key={s}
                    onPress={() => setSport(s as typeof sport)}
                    className={`px-8 py-2 rounded-full ${
                    sport === s ? "bg-yellow-300" : "bg-transparent"
                    }`}
                >
                    <Text
                    className={`${
                        sport === s ? "text-black font-bold" : "text-gray-600"
                    }`}
                    >
                    {s}
                    </Text>
                </TouchableOpacity>
                ))}
            </View>

            {/* Scrollable Content */}
            <ScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Text className="text-xl font-bold mb-2">Quick overview</Text>
                <Text className="text-gray-700 mb-4">{rules[sport].overview}</Text>

                <Text className="text-xl font-bold mb-2">Field & equipment</Text>
                {rules[sport].field.map((f, i) => (
                <Text key={i} className="text-gray-700 mb-1">• {f}</Text>
                ))}

                <Text className="text-xl font-bold mt-4 mb-2">Match basics</Text>
                {rules[sport].basics.map((f, i) => (
                <Text key={i} className="text-gray-700 mb-1">• {f}</Text>
                ))}

                <Text className="text-xl font-bold mt-4 mb-2">How scoring works</Text>
                {rules[sport].scoring.map((f, i) => (
                <Text key={i} className="text-gray-700 mb-1">• {f}</Text>
                ))}
            </ScrollView>

            {/* Bottom Search Bar */}
            <View className="flex-row items-center mx-5 bg-white rounded-full shadow px-4 py-2">
                <Ionicons name="search" size={20} color="black" />
                <TextInput
                placeholder="Search rule, terms, foul..."
                className="flex-1 ml-2 text-gray-700"
                />
            </View>
        </ImageBackground>
    </SafeAreaView>
  );
}
