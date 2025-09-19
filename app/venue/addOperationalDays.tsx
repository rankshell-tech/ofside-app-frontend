import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Iconify from "@/components/Iconify";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function OperationalDays() {
  const navigation = useNavigation();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [is24Hours, setIs24Hours] = useState(false);
  const [openTime, setOpenTime] = useState<Date | null>(null);
  const [closeTime, setCloseTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<{
    mode: "open" | "close" | null;
  }>({ mode: null });

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleTimeChange = (event: any, selected?: Date) => {
    if (showPicker.mode === "open" && selected) {
      setOpenTime(selected);
    } else if (showPicker.mode === "close" && selected) {
      setCloseTime(selected);
    }
    setShowPicker({ mode: null });
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const resetTime = () =>{
    setOpenTime(null);
    setCloseTime(null)
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient
        colors={["#FFF201", "#FFFFFF"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0.4 }}
        className="p-5"
      >
        <View className="flex-row items-center justify-between">
            <Ionicons onPress={()=> navigation.goBack()} name="chevron-back-circle-outline" size={26} color="black" />
        </View>
        <Text className="text-2xl font-bold">Operational days & timings</Text>

      <ScrollView
        className="px-5 mt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Open / Close time */}
        <View className="flex-row justify-between items-center mb-5">
          <TouchableOpacity
            onPress={() => setShowPicker({ mode: "open" })}
            className={`flex-1 py-3 border border-gray-400 rounded-lg mx-5 bg-white ${is24Hours ? 'opacity-50': 'opacity-100'}`}
            disabled={is24Hours}
          >
            <Text className="text-center font-semibold">
             {openTime ? formatTime(openTime) : "Open time"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetTime}>
            <Iconify icon="subway:refresh-time" size={20} type="svg"/>
            </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowPicker({ mode: "close" })}
            className={`flex-1 py-3 border border-gray-400 rounded-lg mx-5 bg-white ${is24Hours ? 'opacity-50': 'opacity-100'}`}
            disabled={is24Hours}
          >
            <Text className="text-center font-semibold">
              {closeTime ? formatTime(closeTime) : "Close time"}
            </Text>
          </TouchableOpacity>
        </View>

        {showPicker.mode && (
          <DateTimePicker
            value={
              (showPicker.mode === "open" ? openTime : closeTime) ?? new Date()
            }
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
          />
        )}

        {/* 24 hours toggle */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-base font-medium">
            In case the venue is 24 hours open
          </Text>
          <Switch
            value={is24Hours}
            onValueChange={()=> { setIs24Hours(!is24Hours); resetTime() }}
            trackColor={{ false: "#ccc", true: "#4CAF50" }}
          />
        </View>

        {/* Days */}
        <Text className="text-lg font-bold mb-3">
          Select the operational days
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {days.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                onPress={() => toggleDay(day)}
                className={`w-[48%] py-3 px-2 rounded-lg mb-3 border ${
                  isSelected
                    ? "bg-green-500 border-green-500"
                    : "bg-white border-gray-400"
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    isSelected ? "text-white" : "text-black"
                  }`}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Note */}
        <Text className="text-xs text-gray-600 mt-6">
          <Text className="font-bold">Note: </Text>
          Your Venue profile details will help attract users to your Venue.
          Please fill correct details of your venue/turf/ground.
        </Text>
      </ScrollView>
      </LinearGradient>

      {/* Sticky Bottom Button */}
      <TouchableOpacity onPress={()=> router.push('/venue/addAvailableSports')} className="rounded-lg border overflow-hidden absolute bottom-0 right-0 mr-2 mb-10">
          <LinearGradient
              colors={["#FFF201", "#E0E0E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="px-6 py-1 items-center rounded-full"
          >
              <Text className="font-bold text-black text-lg">Next</Text>
          </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
