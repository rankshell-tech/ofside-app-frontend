// screens/VenueOnboarding.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Iconify from "@/components/Iconify";

// Reusable Input Component
type InputFieldProps = {
  label: string;
  sublabel: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({ label,sublabel, placeholder, value, onChangeText, error }) => (
  <View className="mb-5">
    <View className="flex-row items-center">
        <Text className="font-bold text-lg mb-1">{label} </Text>
        <Text className="text-[10px] text-gray-400"> {sublabel}</Text>
    </View>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#888"
      className={`rounded-xl px-4 py-3 border ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
  </View>
);

export default function VenueOnboarding() {
  const navigation = useNavigation();

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [form, setForm] = useState({
    brandName: "Xyz turfs",
    description: ""
  });
  const [is24Hours, setIs24Hours] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
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
        >

            <View className="w-8 h-8 rounded-full border-4 mx-2 mt-2" >
              <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
            </View>
            <Text className="py-2 text-3xl font-bold px-5">Ofside Venue onboarding</Text>

            {/* Form */}
            <ScrollView
                   style={{ position: 'relative', height: '80%' }} 
                contentContainerStyle={{ paddingBottom: 50, padding:20 }} // 👈 leaves space for button
                showsVerticalScrollIndicator={false}
            >
                <InputField
                    label="Venue name"
                    sublabel="Users will see this name on Ofside"
                    placeholder="Xyz turfs"
                    value={form.brandName}
                    onChangeText={(text) => setForm({ ...form, brandName: text })}
                />

                <View className="mb-5">
                    <Text className="font-bold text-lg mb-1">Description</Text>
                    <TextInput
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={form.description}
                        onChangeText={(text) => setForm({ ...form, description: text })}
                        placeholder=""
                        placeholderTextColor="#888"
                        className={`rounded-xl px-4 py-3 border h-32 ${
                            !form.description ? "border-red-500" : "border-gray-300"
                        }`}
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

                {/* 24 hours toggle */}
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-base font-medium">
                    Is your venue open 24 hours?
                  </Text>
                  <Switch
                    value={is24Hours}
                    onValueChange={()=> { setIs24Hours(!is24Hours); resetTime() }}
                    trackColor={{ false: "#ccc", true: "#4CAF50" }}
                  />
                </View>

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
                {/* Note */}
                <Text className="text-xs text-gray-600 mt-6">
                  <Text className="font-bold">Note: </Text>
                  Your Venue profile details will help attract users to your Venue.
                  Please fill correct details of your venue/turf/ground.
                </Text>
            </ScrollView>
           
        </LinearGradient>
        <TouchableOpacity onPress={()=> router.push('/venue/addAddressDetails')} className="rounded-xl border overflow-hidden absolute bottom-0 right-0 left-0 mx-4 mb-10 text-center">
            <LinearGradient
                colors={["#FFF201", "#E0E0E0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-4 items-center rounded-xl"
            >
                <Text className="font-bold text-black text-lg text-center p-4">Next</Text>
            </LinearGradient>
        </TouchableOpacity>
        {/* Sticky Bottom Button */}
    
    </SafeAreaView>
  );
}
