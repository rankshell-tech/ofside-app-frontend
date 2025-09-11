import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import RangeSelector from "./rangeSelector"

export default function MatchRulesScreen() {
    const theme = useTheme();
    const navigation = useNavigation();
    const { sport, format } = useLocalSearchParams<{ sport: string; format: string }>();
    const [rules, setRules] = useState({
        extraTime: true,
        penalty: true,
        substitution: true,
        offside: true,
        cards: true,
        freeKicks: true,
        cornerKicks: true,
    });
    const [basketballRules, setBasketballRules] = useState({
        rule1: true,
        rule2: true,
        rule3: true,
        rule4: true,
        rule5: true,
    });
    const footballRulesArray=[
        { key: "extraTime", label: "Extra time" },
        { key: "penalty", label: "Penalty shootout" },
        { key: "substitution", label: "Player Substitution" },
        { key: "offside", label: "Offside rule" },
        { key: "cards", label: "Cards enforcement" },
        { key: "freeKicks", label: "Free kicks" },
        { key: "cornerKicks", label: "Corner Kicks" }
    ]

  const basketballRulesArray=[
            { key: "rule1", label: "24 second rule" },
            { key: "rule2", label: "8 second rule" },
            { key: "rule3", label: "5 second rule" },
            { key: "rule4", label: "3 second rule" },
            { key: "rule5", label: "3 pointer throw" },
        ]

    const [goalSize, setGoalSize] = useState<"Futsal" | "Standard">("Standard");
    const [matchDuration, setMatchDuration] = useState(5);
    const [courtSize, setCourtSize] = useState<"Half" | "Full">("Full");
    const [tennisRules, setTennisRules] = useState({
        advantage: true,
        finalSetTiebreak: true,
        matchTiebreak: true,
        superTiebreakPoints: 10, // default: 10 points
        });
    const [volleyballRules, setVolleyballRules] = useState({
        substitution: true,
        libero: true,
        cards: true,
        expulsion: true,
        disqualification: true,
        });

    const volleyballRulesArray = [
    { key: "substitution", label: "Player Substitution" },
    { key: "libero", label: "Libero player rule" },
    { key: "cards", label: "Cards enforcement" },
    { key: "expulsion", label: "Expulsion", subtitle: "(Player out for set)" },
    { key: "disqualification", label: "Disqualification", subtitle: "(Player out for match)" },
    ];

    const toggleVolleyballRule = (key: keyof typeof volleyballRules) => {
    setVolleyballRules({ ...volleyballRules, [key]: !volleyballRules[key] });
    };

    const toggleTennisRule = (key: keyof typeof tennisRules) => {
        setTennisRules({ ...tennisRules, [key]: !tennisRules[key] });
    };

  const toggleRule = (key: keyof typeof rules) => {
    setRules({ ...rules, [key]: !rules[key] });
  };
  const toggleBasketballRule = (key: keyof typeof basketballRules) => {
    setBasketballRules({ ...basketballRules, [key]: !basketballRules[key] });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
    <LinearGradient
        colors={[theme.colors.primary, "#FFFFFF", theme.colors.background]}
        className="flex-1"
    >
        <View className="flex-1 justify-between">
            {/* Scrollable Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 20 }}
            >
                <View className="mt-5">
                <View className="flex-row items-baseline mb-5">
                    <Ionicons onPress={()=> navigation.goBack()} name="chevron-back-circle-outline" size={22} color="black" />
                    <Text className="text-3xl font-bold ml-6">Match rules</Text>
                </View>
                {sport === "Basketball" && (
                    <>
                    {/* Rules with Switch */}
                    <View className="px-2">
                        {basketballRulesArray.map((rule) => (
                        <View
                            key={rule.key}
                            className="flex-row justify-between items-center"
                        >
                            <View className="flex-row items-baseline">
                                <Text className="text-xl font-bold">
                                    {rule.label.split(" ")[0]}{" "}{rule.label.split(" ")[1]}{" "}
                                </Text>
                                <Text className="text-md">{rule.label.split(" ")[2]}</Text>
                            </View>
                            <Switch
                                value={basketballRules[rule.key as keyof typeof basketballRules]}
                                onValueChange={() =>
                                    toggleBasketballRule(rule.key as keyof typeof basketballRules)
                                }
                                thumbColor={"#fff"}
                                trackColor={{ false: "#ccc", true: "#22c55e" }}
                            />
                        </View>
                        ))}
                    </View>
                    <View className="mt-3 flex-row justify-between px-2">
                        <View className="flex-row items-baseline">
                        <Text className="text-lg font-bold">Basketball court </Text>
                        <Text className="text-sm">size</Text>
                        </View>
                        <View className="flex-row space-x-3">
                        {["Half", "Full"].map((size) => (
                            <TouchableOpacity
                            key={size}
                            onPress={() => setCourtSize(size as "Half" | "Full")}
                            className="px-4 py-1 rounded-full border m-1"
                            style={{
                                backgroundColor:
                                courtSize === size ? theme.colors.primary : "white",
                                borderColor:
                                courtSize === size
                                    ? theme.colors.primary
                                    : theme.colors.accent,
                            }}
                            >
                            <Text
                                className={`text-sm font-medium ${
                                courtSize === size ? "text-black" : "text-gray-600"
                                }`}
                            >
                                {size}
                            </Text>
                            </TouchableOpacity>
                        ))}
                        </View>
                    </View>
                    </>
                )}
                {sport === "Football" && (
                    <>
                    {/* Rules with Switch */}
                    <View className="px-2">
                        {footballRulesArray.map((rule) => (
                        <View
                            key={rule.key}
                            className="flex-row justify-between items-center"
                        >
                            <View className="flex-row items-baseline">
                                <Text className="text-xl font-extrabold">
                                    {rule.label.split(" ")[0]}{" "}
                                </Text>
                                <Text className="text-sm">{rule.label.split(" ")[1]}</Text>
                            </View>
                            <Switch
                                value={rules[rule.key as keyof typeof rules]}
                                onValueChange={() =>
                                    toggleRule(rule.key as keyof typeof rules)
                                }
                                thumbColor={"#fff"}
                                trackColor={{ false: "#ccc", true: "#22c55e" }}
                            />
                        </View>
                        ))}
                    </View>

                    {/* Goal size selection */}
                    <View className="mt-3 flex-row justify-between px-2">
                        <View className="flex-row items-baseline">
                        <Text className="text-lg font-bold">Goal </Text>
                        <Text className="text-sm">size</Text>
                        </View>
                        <View className="flex-row space-x-3">
                        {["Futsal", "Standard"].map((size) => (
                            <TouchableOpacity
                            key={size}
                            onPress={() => setGoalSize(size as "Futsal" | "Standard")}
                            className="px-2 py-1 rounded-full border m-1"
                            style={{
                                backgroundColor:
                                goalSize === size ? theme.colors.primary : "white",
                                borderColor:
                                goalSize === size
                                    ? theme.colors.primary
                                    : theme.colors.accent,
                            }}
                            >
                            <Text
                                className={`text-sm font-medium ${
                                goalSize === size ? "text-black" : "text-gray-600"
                                }`}
                            >
                                {size}
                            </Text>
                            </TouchableOpacity>
                        ))}
                        </View>
                    </View>

                    {/* Match Break Duration */}
                    <View className="px-2 mt-3">
                        <RangeSelector
                            title="Match Break Duration"
                            subtitle="Between two half's"
                            options={[0, 5, 10, 15, 20]}
                            selected={matchDuration}
                            onSelect={setMatchDuration} // ✅ no error now
                            unit="mins"
                        />
                    </View>

                    </>
                )}
                {sport === "Tennis" && (
                    <>
                        {/* Advantage Rule */}
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="w-[70%]">
                                <Text className="text-lg font-bold">Advantage rule</Text>
                                <Text className="text-[8px]">
                                    <Text className="font-extrabold">If turned On: </Text>At deuce, player must win by 2 points.{"\n"}
                                    <Text className="font-extrabold">If turned Off: </Text>At deuce (40-40), next point wins the game.
                                </Text>
                            </View>
                            <Switch
                                value={tennisRules.advantage}
                                onValueChange={() => toggleTennisRule("advantage")}
                                thumbColor="#fff"
                                trackColor={{ false: "#ccc", true: "#22c55e" }}
                            />
                        </View>

                        {/* Final Set Tie-break */}
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="w-[70%]">
                                <Text className="text-lg font-bold">Final Set Tie-break</Text>
                                <Text className="text-[8px] mt-1">
                                <Text className="font-extrabold">If turned On: </Text>If sets are tied(eg., 1-1 in beast of 3), final set is decided by a tie-break(7 or 10 points).{"\n"}
                                <Text className="font-extrabold">If turned Off: </Text>Final sets must be won by 2 clear games(eg., 10-8).
                                </Text>
                            </View>
                            <Switch
                                value={tennisRules.finalSetTiebreak}
                                onValueChange={() => toggleTennisRule("finalSetTiebreak")}
                                thumbColor="#fff"
                                trackColor={{ false: "#ccc", true: "#22c55e" }}
                            />
                        </View>

                        {/* Match Tie-break */}
                        <View className="flex-row justify-between items-start mb-4">
                        <View className="w-[70%]">
                            <Text className="text-lg font-bold">Match Tie-break</Text>
                            <Text className="text-[8px] mt-1">
                            <Text className="font-extrabold">If turned On: </Text>Instead of playing full 3rd set, a single tie-break(usually 10 points) decides the match.{"\n"}
                            <Text className="font-extrabold">If turned Off: </Text>Players must play full 3rd set.
                            </Text>
                        </View>
                        <Switch
                            value={tennisRules.matchTiebreak}
                            onValueChange={() => toggleTennisRule("matchTiebreak")}
                            thumbColor="#fff"
                            trackColor={{ false: "#ccc", true: "#22c55e" }}
                        />
                        </View>

                        {/* Super Tie-break Points */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold mr-5">Super Tie-break Points</Text>
                            <View className="flex-row">
                                {[7, 10].map((points) => (
                                <TouchableOpacity
                                    key={points}
                                    onPress={() =>
                                    setTennisRules({ ...tennisRules, superTiebreakPoints: points })
                                    }
                                    className={`px-2 py-1 mx-1 rounded-full border ${
                                    tennisRules.superTiebreakPoints === points
                                        ? "bg-yellow-300 border-yellow-400"
                                        : "border-gray-400"
                                    }`}
                                >
                                    <Text
                                    className={`font-semibold ${
                                        tennisRules.superTiebreakPoints === points
                                        ? "text-black"
                                        : "text-gray-600"
                                    }`}
                                    >
                                    {points} Points
                                    </Text>
                                </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </>
                )}
                {sport === "Volleyball" && (
                    <View className="px-2">
                        {volleyballRulesArray.map((rule) => (
                        <View
                            key={rule.key}
                            className="flex-row justify-between items-center mb-4"
                        >
                            <View>
                                <View className="flex-row items-center">
                                    <Text className="text-lg font-bold">{rule.label.split(" ")[0]} </Text>
                                    <Text className="text-base">
                                        {rule.label.split(" ").slice(1).join(" ")}
                                    </Text>
                                </View>
                                {rule.subtitle && (
                                    <Text className="text-xs text-gray-600">{rule.subtitle}</Text>
                                )}
                            </View>
                            <Switch
                                value={volleyballRules[rule.key as keyof typeof volleyballRules]}
                                onValueChange={() =>
                                    toggleVolleyballRule(rule.key as keyof typeof volleyballRules)
                                }
                                thumbColor="#fff"
                                trackColor={{ false: "#ccc", true: "#22c55e" }}
                            />
                        </View>
                        ))}
                    </View>
                )}


                </View>
            </ScrollView>

            {/* Sticky Bottom Buttons */}
            <View className="flex-row justify-between p-5 bg-white">
                <TouchableOpacity className="flex-1 bg-blue-800 py-3 rounded-lg mr-3">
                <Text className="text-white text-center font-semibold">
                    Reset rules
                </Text>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={() => router.push("/xplore/matchRulesSaved")}
                className="flex-1 py-3 rounded-lg ml-3"
                style={{ backgroundColor: theme.colors.primary }}
                >
                <Text className="text-black text-center font-semibold">Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    </LinearGradient>
</SafeAreaView>

  );
}
