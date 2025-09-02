// screens/MatchSetupScreen.tsx
import React, { JSX, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView,Image } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";
import { router } from "expo-router";
import {  SlidersHorizontal } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import RangeSelector from "./rangeSelector"

const MatchSetupScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [matchType, setMatchType] = useState("Friendly");
    const [pitchType, setPitchType] = useState("Artificial Turf");
    const [city, setCity] = useState("Delhi");
    const [ground, setGround] = useState("Delhi Cricket Turf");
    const [date, setDate] =  useState(new Date(2025, 4, 13));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [rulesVisible, setRulesVisible] = useState(false);

    const matchTypes = ["Friendly", "Friendly Cup", "Exhibition", "Practice"];
    const pitchTypes = ["All Grass", "Artificial Turf", "Indoor", "Synthetic"];
    const [matchDuration, setMatchDuration] = useState(10);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const FloatingLabelInput = ({
    label,
    value,
    onPress,
    onChangeText,
    isPicker,
    icon,
  }: {
    label: string;
    value: string;
    onPress?: () => void;
    onChangeText?: (text: string) => void;
    isPicker?: boolean;
    icon?: JSX.Element;
  }) => (
    <View className="mt-6">
      {/* Label */}
      <View className="absolute -top-2 left-4 bg-white px-1 z-10">
        <Text className="text-xs font-semibold">{label}
        </Text>
      </View>

      {/* Input / Picker style */}
      {isPicker ? (
        <TouchableOpacity
          onPress={onPress}
          className="border border-black rounded-2xl px-4 py-4 flex-row justify-between items-center"
        >
          <Text>{value}</Text>
          {icon}
        </TouchableOpacity>
      ) : (
        <View className="border border-black rounded-2xl px-4 py-1">
          <TextInput
            value={value}
            onChangeText={onChangeText}
            className="text-left"
          />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
        <LinearGradient
            colors={[theme.colors.primary, "#FFFFFF", theme.colors.background]}
            className="flex-1"
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Header */}
            <View className="flex-row items-center justify-between mt-4 px-2">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                className="absolute top-4 right-4"
                onPress={() => setRulesVisible(true)}
                >
                <SlidersHorizontal size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* VS Section */}
            <View className="items-center">
                <View className="flex-row items-center space-x-6">
                {/* Team A */}
                <View className="items-center">
                    <View
                    style={{ backgroundColor: theme.colors.accent }}
                    className="w-20 h-20 rounded-full items-center justify-center shadow"
                    >
                    <FontAwesome
                        name="user"
                        size={40}
                        color={theme.colors.primary}
                    />
                    </View>
                    <Text className="mt-2 font-bold">TEAM A</Text>
                </View>

                {/* VS Icon */}
                <View className="items-center">
                    <Image
                    source={require("../../assets/images/vsIconGray.png")}
                    style={{ width: 120, height: 120 }}
                    resizeMode="contain"
                    />
                    <Text className="text-gray-600">{date.toLocaleDateString()}</Text>
                </View>

                {/* Team B */}
                <View className="items-center">
                    <View
                    style={{ backgroundColor: theme.colors.accent }}
                    className="w-20 h-20 rounded-full items-center justify-center shadow"
                    >
                    <FontAwesome
                        name="user"
                        size={40}
                        color={theme.colors.primary}
                    />
                    </View>
                    <Text className="mt-2 font-bold">TEAM B</Text>
                </View>
                </View>
            </View>

            {/* Match Type */}
            <View className="px-4 mt-2">
                <Text className="font-bold text-lg">Select Match Type</Text>
                <View className="flex-row flex-wrap mt-3">
                {matchTypes.map((type) => (
                    <TouchableOpacity
                    key={type}
                    className="px-2 py-1 rounded-full mr-2 mb-2 border"
                    style={{
                        backgroundColor:
                        matchType === type ? theme.colors.primary : "white",
                        borderColor:
                        matchType === type ? theme.colors.primary : theme.colors.accent,
                    }}
                    onPress={() => setMatchType(type)}
                    >
                    <Text
                        className={`text-sm ${
                        matchType === type
                            ? "font-bold text-black"
                            : "text-gray-600"
                        }`}
                    >
                        {type}
                    </Text>
                    </TouchableOpacity>
                ))}
                </View>
            </View>

            {/* Pitch Type */}
            <View className="px-4 mt-2">
                <Text className="font-bold text-lg">Pitch type</Text>
                <View className="flex-row flex-wrap mt-3">
                {pitchTypes.map((type) => (
                    <TouchableOpacity
                    key={type}
                    className="px-2 py-1 rounded-full mr-2 mb-2 border"
                    style={{
                        backgroundColor:
                        pitchType === type ? theme.colors.primary : "white",
                        borderColor:
                        pitchType === type ? theme.colors.primary : theme.colors.accent,
                    }}
                    onPress={() => setPitchType(type)}
                    >
                    <Text
                        className={`text-sm ${
                        pitchType === type
                            ? "font-bold text-black"
                            : "text-gray-600"
                        }`}
                    >
                        {type}
                    </Text>
                    </TouchableOpacity>
                ))}
                </View>
            </View>

            {/* Match Duration Slider */}
            <RangeSelector
                title="Match duration"
                subtitle="Total minutes including both half's"
                options={[0, 5, 10, 15, 20, 25, 30, 35, 40]}
                selected={matchDuration}
                onSelect={setMatchDuration} // ✅ no error now
                unit="Mins"
            />

            {/* Form */}
            <View className="px-4 mt-4 space-y-4">
                <FloatingLabelInput
                label="City/Town"
                value={city}
                onChangeText={setCity}
                />
                <FloatingLabelInput
                label="Ground Name"
                value={ground}
                onChangeText={setGround}
                />
                <FloatingLabelInput
                label="Date of birth"
                value={formatDate(date)}
                isPicker
                onPress={() => setShowDatePicker(true)}
                icon={<Ionicons name="calendar" size={18} color="black" />}
                />
            </View>
            </ScrollView>

            {/* ✅ Fixed Bottom Button */}
            <View className="absolute bottom-4 left-4 right-4">
            <TouchableOpacity
                onPress={() => router.push("/scoring/scoringScreen")}
                className="rounded-lg py-3 items-center"
                style={{ backgroundColor: theme.colors.primary }}
            >
                <Text className="font-bold text-black text-lg">Next</Text>
            </TouchableOpacity>
            </View>
        </LinearGradient>

        {/* Date Picker */}
        {showDatePicker && (
            <DateTimePicker
            value={date}
            mode="date"
            onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
            }}
            />
        )}

        {/* Bottom Sheet Modal */}
        <Modal
            isVisible={rulesVisible}
            onBackdropPress={() => setRulesVisible(false)}
            onBackButtonPress={() => setRulesVisible(false)}
            style={{ justifyContent: "flex-start", marginLeft: 150 }}
        >
            <View className="bg-white rounded-2xl p-5 shadow-lg">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="font-bold text-lg">Settings</Text>
                <TouchableOpacity onPress={() => setRulesVisible(false)}>
                <Ionicons name="close" size={22} color="black" />
                </TouchableOpacity>
            </View>

            {/* Rules List */}
            <TouchableOpacity
                onPress={() => {
                setRulesVisible(false);
                router.push("/scoring/matchRulesScreen");
                }}
                className="py-3 border-b border-gray-200"
            >
                <Text className="text-base">Manage Rules</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-3 border-b border-gray-200">
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
    </SafeAreaView>
  );
};

export default MatchSetupScreen;
