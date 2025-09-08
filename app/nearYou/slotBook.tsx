import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import TimePicker from "@/components/TimePicker";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";


export default function SlotBookingScreen() {
    const navigation = useNavigation();
  const [selectedSport, setSelectedSport] = useState("2");
  const times = ["9:00","9:30","10:00","10:30","11:00","11:30","12:00"];
  const [fromTime, setFromTime] = useState("09:00");
  const [fromPeriod, setFromPeriod] = useState<"AM" | "PM">("AM");

  const [toTime, setToTime] = useState("10:00");
  const [toPeriod, setToPeriod] = useState<"AM" | "PM">("AM");
  const sports = [
                {id:1, name:"Cricket" ,icon:"baseball-bat-ball"},
                {id:2, name:"Football" ,icon:"basketball"},
                {id:3, name:"Tennis" ,icon:"table-tennis-paddle-ball"}
            ]
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const flatListRef = useRef<FlatList<number>>(null);
  const [monthIndex, setMonthIndex] = useState(today.getMonth());

  const goPrevMonth = () => {
    setMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const goNextMonth = () => {
    setMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
  };
  const handleSelect = (day: number) => {
    setSelectedDate(day);
    const index = days.indexOf(day);

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5, // 👈 ensures item is centered
    });
  };


  return (
    <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row justify-between items-center px-4 py-3">
          <Ionicons onPress={()=> navigation.goBack()} name="chevron-back-circle-outline" size={22} color="black" />
        </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>

        {/* Select Sport */}
        <Text className="font-bold mt-5 mb-2">Select any sport</Text>
        <View className="border-t my-1" style={{ width: "70%" }} />

        <View className="flex-row justify-between my-4">
          {sports.map((sport,index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedSport((sport.id).toString())}
              className={`w-[30%] h-28 border rounded-md justify-center items-center ${
                selectedSport === (sport.id).toString() ? "border-black border-2" : "border-gray-300"
              }`}
            >
              {/* Replace with images */}
              <View key={index} className="items-center mx-4">
                <FontAwesome6 name={sport.icon} size={45} color="black" />
                <Text className="text-xs mt-1">{sport.name}</Text>
            </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Selection */}
        <Text className="font-bold mb-2">Date selection</Text>
        <View className="border-t my-4" style={{ width: "70%" }} />
        <View className="flex-row justify-center items-center my-4">
          {/* Left Arrow */}
          <TouchableOpacity disabled={monthIndex === 0} onPress={goPrevMonth} className="px-4">
            <Ionicons name="chevron-back" size={20} color={monthIndex === 0 ? "gray" : "black"} />
          </TouchableOpacity>

          {/* Current Month */}
          <Text className="text-2xl font-bold">{months[monthIndex]}</Text>

          {/* Right Arrow */}
          <TouchableOpacity disabled={monthIndex === 11} onPress={goNextMonth} className="px-4">
            <Ionicons name="chevron-forward" size={20} color={monthIndex === 11 ? "gray" : "black"} />
          </TouchableOpacity>
        </View>
        <View className="my-4">
          <FlatList
            ref={flatListRef}
            data={days}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                className={`px-3 py-2 rounded-md mx-1 ${
                  selectedDate === item ? "bg-black" : "bg-transparent"
                }`}
              >
                <Text
                  className={`${
                    selectedDate === item ? "text-white font-bold text-2xl" : "text-black"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Slot Selection */}
        <Text className="font-bold mt-4 mb-2">Slot selection</Text>
        <View className="border-t my-4" style={{ width: "70%" }} />

         <View className="flex-row justify-between my-5">
          {/* From Time Picker */}
          <TimePicker
            label="From"
            value={fromTime}
            period={fromPeriod}
            times={times}
            onChange={(val, p) => {
              setFromTime(val);
              setFromPeriod(p);
            }}
          />
          {/* To Time Picker */}
          <TimePicker
            label="To"
            value={toTime}
            period={toPeriod}
            times={times}
            onChange={(val, p) => {
              setToTime(val);
              setToPeriod(p);
            }}
          />
        </View>
      </ScrollView>

      {/* Bottom Button */}
        <View className="absolute bottom-10 left-0 right-0 items-center">
        <TouchableOpacity className="flex-1 rounded-lg overflow-hidden mx-4" onPress={() => router.push('/nearYou/bookingConfirmation')} >
            <LinearGradient
                colors={["#FFF201", "#e6e6e6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.9, y: 0 }}
                className="px-8 py-4 w-48"
            >
            <Text className="text-center font-bold text-black">Confirm slot</Text>
            </LinearGradient>
        </TouchableOpacity>
        </View>

    </SafeAreaView>
  );
}
