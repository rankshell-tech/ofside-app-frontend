import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, NativeSyntheticEvent, NativeScrollEvent, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import TimePicker from "@/components/TimePicker";

export default function BookingDetails() {
    const navigation = useNavigation();
    const flatListRef = useRef<FlatList<number>>(null);
    const today = new Date();
    const [monthIndex, setMonthIndex] = useState(today.getMonth());
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const [selectedDate, setSelectedDate] = useState(5);
    const times = ["9:00","9:30","10:00","10:30","11:00","11:30","12:00"];
    const [fromTime, setFromTime] = useState("9:00");
    const [fromPeriod, setFromPeriod] = useState<"AM" | "PM">("AM");

    const [toTime, setToTime] = useState("10:00");
    const [toPeriod, setToPeriod] = useState<"AM" | "PM">("AM");


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
        {/* Header */}
        <View className="flex-row items-center mt-5">
            <View className="w-8 h-8 bg-white rounded-full border-4 mx-2" >
              <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
            </View>
            <Text className="font-bold text-lg mr-2">Mange Slot</Text>
        </View>
        <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
        >

                {/* Date Selection */}
                <Text className="font-bold mb-2 px-4 mt-10">Date selection</Text>
                <View className="border-t  ml-4 my-1" style={{ width: "70%" }} />
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
                        className={`rounded-md mx-1 ${
                            selectedDate === item ? "bg-black px-3 py-1" : "bg-transparent px-3 py-3 "
                        }`}
                        >
                        <Text
                            className={`${
                            selectedDate === item ? "text-white font-bold text-3xl" : "text-md"
                            }`}
                        >
                            {item}
                        </Text>
                        </TouchableOpacity>
                    )}
                    />
                </View>


                {/* Slot Selection */}
                <Text className="font-bold mt-10 px-4 mb-2">Slot selection</Text>
                <View className="border-t my-1 ml-4" style={{ width: "70%" }} />

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
        </ScrollView>


        {/* Next Button */}
        <TouchableOpacity
            onPress={() => router.push('/manageSlot/bookingReview')}
            className="rounded-lg border overflow-hidden absolute bottom-0 right-0 mr-2 mb-10 bg-[#FFF201]">
            <View className="px-6 py-1 items-center rounded-full">
                <Text className="font-bold text-black text-lg">Next</Text>
            </View>
        </TouchableOpacity>
    </SafeAreaView>
  );
}
