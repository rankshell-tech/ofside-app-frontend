import React, { useEffect, useRef, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, ImageBackground, KeyboardAvoidingView, Platform } from "react-native";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function RulesOverview() {
  const navigation = useNavigation();
  const [sport, setSport] = useState<
    "Football" | "Cricket" | "Volleyball" | "Badminton" | "Basketball" | "Pickleball"
  >("Football");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // ✅ search query state
  const sports = ["Badminton", "Football", "Cricket", "Volleyball", "Basketball", "Pickleball"];
  const scrollRef = useRef<ScrollView>(null);

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
    Volleyball: {
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
    Basketball: {
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
    Pickleball: {
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

  useEffect(() => {
    if (!scrollRef.current) return;

    const index = sports.indexOf(sport);
    if (index === -1) return;

    const screenWidth = 360;
    const itemWidth = 120;
    const offset = index * itemWidth - screenWidth / 2 + itemWidth / 2;

    scrollRef.current.scrollTo({
      x: Math.max(0, offset),
      animated: true,
    });
  }, [sport]);

  // ✅ Filtered data
   const filterRules = () => {
    const data = rules[sport];
    if (!search.trim()) return data;

    const query = search.toLowerCase();

    return {
      overview: data.overview.toLowerCase().includes(query) ? data.overview : "",
      field: data.field.filter((f) => f.toLowerCase().includes(query)),
      basics: data.basics.filter((f) => f.toLowerCase().includes(query)),
      scoring: data.scoring.filter((f) => f.toLowerCase().includes(query)),
    };
  };

  const filtered = filterRules();

  const highlightText = (text: string) => {
    if (!search.trim()) return <Text className="text-gray-700">{text}</Text>;

    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);

    return (
      <Text className="text-gray-700">
        {parts.map((part, i) =>
          regex.test(part) ? (
            <Text key={i} className="font-bold bg-[#fff201] text-black">
              {part}
            </Text>
          ) : (
            <Text key={i}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/background.png")}
        resizeMode="cover"
        className="flex-1"
      >
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "white" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={40} // adjust if header overlaps
        >
        <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2" >
          <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
        </View>

        {/* Top Tabs */}
        <View className="flex-row justify-between py-3">
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
          >
            {sports.map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => {
                  setSport(s as typeof sport);
                  setSearch("");
                }}
                className={`px-8 py-2 rounded-full ${
                  sport === s ? "bg-[#FFF201]" : "bg-transparent"
                }`}
              >
                <Text className={`${sport === s ? "text-black font-bold" : "text-gray-600"}`}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {search.trim() ? (
            <>
              <Text className="text-xl font-bold mb-2">Search results</Text>
              {filtered.overview ? <Text className="mb-4">• {highlightText(filtered.overview)}</Text> : null}

              {filtered.field.map((f, i) => (
                <Text key={`field-${i}`} className="mb-1">• {highlightText(f)}</Text>
              ))}

              {filtered.basics.map((f, i) => (
                <Text key={`basics-${i}`} className="mb-1">• {highlightText(f)}</Text>
              ))}

              {filtered.scoring.map((f, i) => (
                <Text key={`scoring-${i}`} className="mb-1">• {highlightText(f)}</Text>
              ))}

              {!(filtered.overview || filtered.field.length || filtered.basics.length || filtered.scoring.length) && (
                <Text className="text-gray-500">No results found</Text>
              )}
            </>
          ) : (
            <>
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
            </>
          )}
        </ScrollView>

          {/* Bottom Search Bar */}
          <View className="flex-row justify-between items-center mx-5 bg-white border border-gray-400 rounded-full shadow px-4">
            <TextInput
              placeholder="Search rule, terms, foul..."
              value={search}
              onChangeText={setSearch}
              className="ml-2 text-gray-700"
            />
            <FontAwesome name="search" size={20} color="black" />
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

