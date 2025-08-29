import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function MatchRulesScreen() {
    const theme = useTheme();
    const navigation = useNavigation();
  const [rules, setRules] = useState({
    extraTime: true,
    penalty: true,
    substitution: true,
    offside: true,
    cards: true,
    freeKicks: true,
    cornerKicks: true,
  });
  const rulesArray=[{ key: "extraTime", label: "Extra time" },
          { key: "penalty", label: "Penalty shootout" },
          { key: "substitution", label: "Player Substitution" },
          { key: "offside", label: "Offside rule" },
          { key: "cards", label: "Cards enforcement" },
          { key: "freeKicks", label: "Free kicks" },
          { key: "cornerKicks", label: "Corner Kicks" },]

  const [goalSize, setGoalSize] = useState<"Futsal" | "Standard">("Standard");
  const [breakDuration, setBreakDuration] = useState(10);

  const toggleRule = (key: keyof typeof rules) => {
    setRules({ ...rules, [key]: !rules[key] });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
        <LinearGradient
            colors={[theme.colors.primary, '#FFFFFF', theme.colors.background]}
            className="flex-1"
        >
            <View className="flex-1 p-5 mt-5">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="flex-row items-baseline mb-5">
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="text-3xl font-bold ml-6">Match rules</Text>
                    </View>

                    {/* Rules with Switch */}
                    <View className="px-5">
                        {rulesArray.map((rule) => (
                        <View
                            key={rule.key}
                            className="flex-row justify-between items-center"
                        >
                            <View className="flex-row items-baseline">
                                <Text className="text-lg font-bold">{rule.label.split(" ")[0]} </Text>
                                <Text className="text-sm">{rule.label.split(" ")[1]}</Text>
                            </View>
                            <Switch
                                value={rules[rule.key as keyof typeof rules]}
                                onValueChange={() => toggleRule(rule.key as keyof typeof rules)}
                                thumbColor={"#fff"}
                                trackColor={{ false: "#ccc", true: "#22c55e" }}
                            />
                        </View>
                        ))}
                    </View>

                    {/* Goal size selection */}
                    <View className="mt-3 flex-row justify-between">
                    <View className="flex-row items-baseline">
                        <Text className="text-lg font-bold">Goal </Text>
                        <Text className="text-sm">size</Text>
                    </View>
                    <View className="flex-row space-x-3">
                    {["Futsal", "Standard"].map((size) => (
                        <TouchableOpacity
                            key={size}
                            onPress={() => setGoalSize(size as "Futsal" | "Standard")}
                            className="px-4 py-2 rounded-full border"
                            style={{
                                backgroundColor: goalSize === size ? theme.colors.primary:"white",
                                borderColor: goalSize === size ? theme.colors.primary : theme.colors.accent}}
                        >
                        <Text
                            className={`font-medium ${
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
                    <Text className="text-lg font-semibold mt-6">
                    Match Break duration
                    </Text>
                    <Text className="text-gray-500">(Between two halfs)</Text>
                    <View className="flex-row space-x-4">
                        <Slider
                            style={{ width: "100%", height: 40 }}
                            minimumValue={5}
                            maximumValue={30}
                            step={5} // ✅ 5-min intervals
                            value={breakDuration}
                            minimumTrackTintColor="#FFD700"
                            maximumTrackTintColor="#ccc"
                            thumbTintColor="#FFD700"
                            onValueChange={(val) => setBreakDuration(val)}
                        />
                    </View>
                    <Text className="text-lg font-bold text-center text-black">
                        {breakDuration} mins
                    </Text>
                </ScrollView>

                {/* Bottom Buttons */}
                <View className="flex-row justify-between">
                    <TouchableOpacity className="flex-1 bg-blue-800 py-3 rounded-lg mr-3">
                    <Text className="text-white text-center font-semibold">
                        Reset rules
                    </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/scoring/matchRulesSaved')}
                        className="flex-1 py-3 rounded-lg ml-3"
                        style={{backgroundColor: theme.colors.primary}}
                    >
                    <Text className="text-black text-center font-semibold">Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    </SafeAreaView>
  );
}
