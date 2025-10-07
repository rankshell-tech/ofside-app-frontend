import { LinearGradient } from "expo-linear-gradient";
import React, { JSX, useState } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from '@/hooks/useTheme';
import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import TimePicker from "@/components/TimePicker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function HostGameScreen() {
    const theme = useTheme();
    const navigation = useNavigation();
    const matchTypes = ["Competitive", "Friendly Cup", "Exhibition", "Practice"];
    const [matchType, setMatchType] = useState("Competitive");
    const [sport, setSport] = useState("Football");
    const times = ["9:00","9:30","10:00","10:30","11:00","11:30","12:00"];
    const [fromTime, setFromTime] = useState("9:00");
    const [fromPeriod, setFromPeriod] = useState<"AM" | "PM">("AM");

    const [toTime, setToTime] = useState("9:00");
    const [toPeriod, setToPeriod] = useState<"AM" | "PM">("AM");
    const [city, setCity] = useState("Delhi");
    const [ground, setGround] = useState("Delhi Cricket Turf");
    const [numberOfPlayers, setNumberOfPlayers] = useState("2");
    const [date, setDate] =  useState(new Date(2025, 4, 13));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isGameFree, setIsGameFree] = useState(true);
    const [playerFees, setPlayerFees] = useState("");
    const [gamePrivacy, setGamePrivacy] = useState<"Private" | "Public">("Private");
    const [gameAccess, setGameAccess] = useState<"Auto" | "On request">("Auto");
    const [advanceOptions, setAdvanceOptions] = useState("BYOE");
    const [remark, setRemark] = useState("");

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
        <Text className="text-xs text-gray-500 font-semibold">{label}
        </Text>
        </View>

        {/* Input / Picker style */}
        {isPicker ? (
        <TouchableOpacity
            onPress={onPress}
            className="border border-black rounded-2xl px-4 py-4 flex-row justify-between items-center"
        >
            <Text className="font-bold">{value}</Text>
            {icon}
        </TouchableOpacity>
        ) : (
        <View className="border border-black rounded-2xl px-4 py-1">
            <TextInput
                value={value}
                onChangeText={onChangeText}
                className="text-left font-bold"
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

        <View className="flex-row justify-between items-center mt-2 mx-2">
            <View className="flex-row items-baseline">
                <View className="w-8 h-8 rounded-full border-4 mx-2 mt-2" >
                    <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
                </View>
                <Text className="text-xl font-bold ml-6">Host your Game</Text>
            </View>
            <View className="mx-2">
                <Text className="text-sm font-bold">Help</Text>
            </View>
        </View>
        {/* Scrollable Content */}
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20 }}
        >
            <View className="items-center mt-2">
                <View
                    style={{ backgroundColor: theme.colors.accent }}
                    className="w-28 h-28 rounded-full items-center justify-center shadow"
                >
                    <FontAwesome
                        name="user"
                        size={60}
                        color={theme.colors.primary}
                    />
                </View>
            </View>

            {/* Match Type */}
            <View className="px-2 mt-5">
                <Text className="font-bold text-xl mb-2">Select Match Type <Text className="text-red-600">*</Text></Text>
                    <View className="flex-row flex-wrap mt-3">
                        {matchTypes.map((type) => (
                        <TouchableOpacity
                            key={type}
                            className="px-2 py-1 rounded-full mr-1 mb-2 border"
                            style={{
                            backgroundColor: matchType === type ? theme.colors.primary : "white",
                            borderColor: matchType === type ? theme.colors.primary : theme.colors.accent,
                            }}
                            onPress={() => setMatchType(type)}
                        >
                            <Text className={matchType === type ? "font-bold text-black text-[12px]" : "text-gray-600 text-[10px]"}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                        ))}
                    </View>
            </View>

            {/* Select Sport */}
            <View className="px-2 mt-5">
                <Text className="font-bold text-xl mb-2">Select your sport <Text className="text-red-600">*</Text></Text>
                    <View
                        className="h-10 border bg-white rounded-full overflow-hidden mx-1 flex-row items-center"
                        style={{width: 150}}
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
                    </View>
            </View>

            {/* Slot time selection */}
            <View className="px-2 mt-5">
                <Text className="font-bold text-xl mb-2">Slot time selection <Text className="text-red-600">*</Text></Text>
                <View className="flex-row justify-between my-5">
                    {/* From Time Picker */}
                    <TimePicker
                        label="From"
                        value={fromTime}
                        period={fromPeriod}
                        times={times}
                        onChange={(val, p) => {
                            setFromTime(val);
                            setFromPeriod(p as "AM" | "PM"); // 👈 force cast
                        }}
                        periodOptions={["AM", "PM"]}
                    />
                    {/* To Time Picker */}
                    <TimePicker
                        label="To"
                        value={toTime}
                        period={toPeriod}
                        times={times}
                        onChange={(val, p) => {
                            setToTime(val);
                            setToPeriod(p as "AM" | "PM"); // 👈 force cast
                        }}
                        periodOptions={["AM", "PM"]}
                    />
                </View>
            </View>

            {/* Form */}
            <View className="px-2 mt-5">
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
                    label="Date & Time"
                    value={formatDate(date)}
                    isPicker
                    onPress={() => setShowDatePicker(true)}
                    icon={<Ionicons name="calendar" size={18} color="black" />}
                />
                <FloatingLabelInput
                    label="Number Of Players (Including you)"
                    value={numberOfPlayers}
                    isPicker
                    onChangeText={setNumberOfPlayers}
                    icon={<AntDesign name="down-circle" size={18} color="black" />}
                />
            </View>

            <View className="px-2 mt-5">
                <View className="flex-row justify-between items-center">
                    <Text>Please check this if the game is free</Text>
                    <Switch
                        value={isGameFree}
                        onValueChange={() => setIsGameFree(!isGameFree)}
                        thumbColor={"#fff"}
                        trackColor={{ false: "#ccc", true: "#22c55e" }}
                    />
                </View>
            </View>

            <View className="px-2 mt-5">
                <View className="flex-row justify-between items-center">
                    <Text className="font-bold">Per Player Fees</Text>

                    <View className="flex-row items-center border border-gray-300 bg-white rounded-md px-2 py-1 w-28">
                    <Text className="text-gray-600 font-semibold mr-1">INR</Text>
                    <TextInput
                        value={playerFees}
                        onChangeText={setPlayerFees}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#999"
                        className="flex-1 text-right font-semibold text-gray-800"
                    />
                    </View>
                </View>
            </View>

            <View className="px-2 mt-5">
                <View className="flex-row justify-between items-center">
                    <Text className="font-bold">Game Privacy</Text>
                    <View className="flex-row space-x-3">
                    {["Private", "Public"].map((size) => (
                    <TouchableOpacity
                        key={size}
                        onPress={() => setGamePrivacy(size as "Private" | "Public")}
                        className="px-2 py-1 rounded-full border m-1"
                        style={{
                            backgroundColor:
                            gamePrivacy === size ? theme.colors.primary : "white",
                            borderColor:
                            gamePrivacy === size
                                ? theme.colors.primary
                                : theme.colors.accent,
                        }}
                        >
                        <Text
                            className={`text-sm font-medium ${
                            gamePrivacy === size ? "text-black" : "text-gray-600"
                            }`}
                        >
                            {size}
                        </Text>
                        </TouchableOpacity>
                    ))}
                    </View>
                </View>
            </View>

            <View className="px-2 mt-5">
                <View className="flex-row justify-between items-center">
                    <Text className="font-bold">Game Access</Text>
                    <View className="flex-row space-x-3">
                    {["Auto", "On request"].map((size) => (
                    <TouchableOpacity
                        key={size}
                        onPress={() => setGameAccess(size as "Auto" | "On request")}
                        className="px-2 py-1 rounded-full border m-1"
                        style={{
                            backgroundColor:
                            gameAccess === size ? theme.colors.primary : "white",
                            borderColor:
                            gameAccess === size
                                ? theme.colors.primary
                                : theme.colors.accent,
                        }}
                        >
                        <Text
                            className={`text-sm font-medium ${
                            gameAccess === size ? "text-black" : "text-gray-600"
                            }`}
                        >
                            {size}
                        </Text>
                        </TouchableOpacity>
                    ))}
                    </View>
                </View>
            </View>


            <View className="px-2 mt-5">
                    <Text className="font-bold">Advance Options</Text>
                    <View className="flex-row">
                    {["Venue Booked", "BYOE", "Female only", "Mixed Gender"].map((size) => (
                    <TouchableOpacity
                        key={size}
                        onPress={() => setAdvanceOptions(size)}
                        className="px-1 py-1 rounded-full border m-1"
                        style={{
                            backgroundColor:
                            advanceOptions === size ? theme.colors.primary : "white",
                            borderColor:
                            advanceOptions === size
                                ? theme.colors.primary
                                : theme.colors.accent,
                        }}
                        >
                        <Text
                            className={`text-sm font-medium ${
                            advanceOptions === size ? "text-black" : "text-gray-600"
                            }`}
                        >
                            {size}
                        </Text>
                        </TouchableOpacity>
                    ))}
                    </View>
            </View>

            <View className="px-2 mt-5">
                <Text className="font-bold mb-2">Any Remark</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2 text-[10px] text-gray-700 h-20"
                    textAlignVertical="top"
                    value={remark}
                    onChangeText={setRemark}
                    multiline
                />
            </View>

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
        </ScrollView>

        {/* Sticky Bottom Buttons */}
        <View className="flex-row justify-between p-5 bg-white">

            <TouchableOpacity
                className="flex-1 py-3 rounded-lg ml-3 bg-[#10B981]"
            >
            <Text className="text-white text-center font-bold">Host a game</Text>
            </TouchableOpacity>
        </View>
    </LinearGradient>
</SafeAreaView>

  );
}
