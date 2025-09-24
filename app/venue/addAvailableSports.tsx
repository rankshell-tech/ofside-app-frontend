import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function AvailableSports() {
  const navigation = useNavigation();

  // court structure
  const initialCourt = {
    courtName: "",
    surfaceType: "Natural Grass",
    sportType: "Football",
    slotDuration: "1 hour",
    price: "",
    maxBooking: "1",
    images: [null, null, null, null, null] as (string | null)[],
    peakEnabled: false,
    peakDays: [] as string[],
    peakStart: null as Date | null,
    peakEnd: null as Date | null,
    peakPrice: "",
  };

  const [courts, setCourts] = useState([initialCourt]);

  // 🔹 time picker state
  const [showPicker, setShowPicker] = useState<{
    mode: "open" | "close" | null;
    index: number | null;
  }>({ mode: null, index: null });

  const updateCourt = (index: number, field: string, value: any) => {
    const newCourts = [...courts];
    (newCourts[index] as any)[field] = value;
    setCourts(newCourts);
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const addCourt = () => {
    setCourts([...courts, { ...initialCourt }]);
  };

  const removeCourt = (index: number) => {
    setCourts(courts.filter((_, i) => i !== index));
  }

  const pickImage = async (courtIndex: number, imgIndex: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newCourts = [...courts];
      newCourts[courtIndex].images[imgIndex] = result.assets[0].uri;
      setCourts(newCourts);
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (showPicker.index === null) return;
    if (selectedDate) {
      const newCourts = [...courts];
      if (showPicker.mode === "open") {
        newCourts[showPicker.index].peakStart = selectedDate;
      } else if (showPicker.mode === "close") {
        newCourts[showPicker.index].peakEnd = selectedDate;
      }
      setCourts(newCourts);
    }
    setShowPicker({ mode: null, index: null });
  };

  const toggleDay = (courtIndex: number, day: string) => {
    const newCourts = [...courts];
    const days = newCourts[courtIndex].peakDays;
    if (days.includes(day)) {
      newCourts[courtIndex].peakDays = days.filter((d) => d !== day);
    } else {
      newCourts[courtIndex].peakDays = [...days, day];
    }
    setCourts(newCourts);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient
        colors={["#FFF201", "#FFFFFF"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View className="w-8 h-8 rounded-full border-4 mx-2 mt-2">
          <Entypo
            onPress={() => navigation.goBack()}
            name="chevron-left"
            size={20}
            color="black"
          />
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {courts.map((court, index) => (
            <View key={index} className="mb-8 border rounded-lg p-4 bg-gray-50">
              <View className="flex-row justify-between items-center">
                <Text className="font-bold text-lg mb-2">Court {index + 1}</Text>
                {index > 0 && <FontAwesome onPress={()=>removeCourt(index)} name="trash" size={24} color="red" />}
              </View>

              {/* Court Name */}
              <Text className="font-semibold text-gray-700">Court Name *</Text>
              <TextInput
                className="border p-2 rounded-lg bg-white mb-4"
                value={court.courtName}
                onChangeText={(text) => updateCourt(index, "courtName", text)}
                placeholder="Enter court name"
              />

              {/* Surface Type */}
              <Text className="font-semibold text-gray-700">Surface Type</Text>
              <View className="border rounded-lg bg-white mb-4">
                <Picker
                  selectedValue={court.surfaceType}
                  onValueChange={(val) => updateCourt(index, "surfaceType", val)}
                >
                  <Picker.Item label="Natural Grass" value="Natural Grass" />
                  <Picker.Item label="Artificial Turf" value="Artificial Turf" />
                  <Picker.Item label="Concrete" value="Concrete" />
                  <Picker.Item label="Wooden" value="Wooden" />
                  <Picker.Item label="Synthetic" value="Synthetic" />
                  <Picker.Item label="Clay" value="Clay" />
                </Picker>
              </View>

              {/* Images */}
              <View className="flex-row flex-wrap justify-between">
                {["Cover", "Logo", "3rd", "4th", "5th"].map((label, imgIndex) => (
                  <TouchableOpacity
                    key={imgIndex}
                    onPress={() => pickImage(index, imgIndex)}
                    className={`w-[48%] h-36 border-2 rounded-lg mb-4 justify-center items-center ${
                      court.images[imgIndex]
                        ? "border-green-500"
                        : imgIndex < 2
                        ? "border-red-400"
                        : "border-gray-400"
                    }`}
                  >
                    {court.images[imgIndex] ? (
                      <Image
                        source={{ uri: court.images[imgIndex]! }}
                        className="w-full h-full rounded-lg"
                      />
                    ) : (
                      <Text className="text-gray-500 text-xs">{label} Image</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Sport Type */}
              <Text className="font-semibold text-gray-700">Sport Type *</Text>
              <View className="border rounded-lg bg-white mb-4">
                <Picker
                  selectedValue={court.sportType}
                  onValueChange={(val) => updateCourt(index, "sportType", val)}
                >
                  <Picker.Item label="Football" value="Football" />
                  <Picker.Item label="Tennis" value="Tennis" />
                  <Picker.Item label="Badminton" value="Badminton" />
                  <Picker.Item label="Pickle Ball" value="Pickle Ball" />
                  <Picker.Item label="Basketball" value="Basketball" />
                  <Picker.Item label="Volleyball" value="Volleyball" />
                </Picker>
              </View>

              {/* Slot Duration */}
              <Text className="font-semibold text-gray-700">Slot Duration *</Text>
              <View className="border rounded-lg bg-white mb-4">
                <Picker
                  selectedValue={court.slotDuration}
                  onValueChange={(val) => updateCourt(index, "slotDuration", val)}
                >
                  <Picker.Item label="30 min" value="30 min" />
                  <Picker.Item label="1 hour" value="1 hour" />
                  <Picker.Item label="2 hours" value="2 hours" />
                  <Picker.Item label="3 hours" value="3 hours" />
                  <Picker.Item label="4 hours" value="4 hours" />
                  <Picker.Item label="5 hours" value="5 hours" />
                </Picker>
              </View>

              {/* Max Booking */}
              <Text className="font-semibold text-gray-700">
                Max Booking Per Slot *
              </Text>
              <TextInput
                className="border p-2 rounded-lg bg-white mb-4"
                value={court.maxBooking}
                onChangeText={(text) => updateCourt(index, "maxBooking", text)}
                keyboardType="numeric"
              />

              {/* Price */}
              <Text className="font-semibold text-gray-700">Price Per Slot (₹)</Text>
              <TextInput
                className="border p-2 rounded-lg bg-white mb-4"
                value={court.price}
                onChangeText={(text) => updateCourt(index, "price", text)}
                keyboardType="numeric"
              />

              {/* Peak Hour Settings */}
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-semibold text-gray-700">
                  Set different price for peak hours?
                </Text>
                <Switch
                  value={court.peakEnabled}
                  onValueChange={() =>
                    updateCourt(index, "peakEnabled", !court.peakEnabled)
                  }
                />
              </View>

              {/* Peak Settings */}
              {court.peakEnabled && (
                <View className="bg-white p-3 rounded-lg mb-4 border">
                  {/* Peak Days */}
                  <Text className="font-semibold text-gray-700 mb-2">
                    Peak Days
                  </Text>
                  <View className="flex-row flex-wrap gap-2 mb-4">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <TouchableOpacity
                          key={day}
                          onPress={() => toggleDay(index, day)}
                          className={`px-3 py-1 rounded-lg border ${
                            court.peakDays.includes(day)
                              ? "bg-blue-500 border-blue-500"
                              : "bg-gray-100 border-gray-300"
                          }`}
                        >
                          <Text
                            className={
                              court.peakDays.includes(day)
                                ? "text-white"
                                : "text-gray-700"
                            }
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>

                  {/* Peak Hours */}
                  <Text className="font-semibold text-gray-700 mb-1">
                    Peak Hours
                  </Text>
                  <View className="flex-row justify-between items-center mb-5">
                    <TouchableOpacity
                      onPress={() =>
                        setShowPicker({ mode: "open", index })
                      }
                      className={`flex-1 py-3 border border-gray-400 rounded-lg mx-5 bg-white`}
                    >
                      <Text className="text-center font-semibold">
                        {court.peakStart
                          ? formatTime(court.peakStart)
                          : "Start"}
                      </Text>
                    </TouchableOpacity>
                    <Text>to</Text>

                    <TouchableOpacity
                      onPress={() =>
                        setShowPicker({ mode: "close", index })
                      }
                      className={`flex-1 py-3 border border-gray-400 rounded-lg mx-5 bg-white`}
                    >
                      <Text className="text-center font-semibold">
                        {court.peakEnd ? formatTime(court.peakEnd) : "End"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {showPicker.mode && showPicker.index === index && (
                    <DateTimePicker
                      value={
                        showPicker.mode === "open"
                          ? court.peakStart || new Date()
                          : court.peakEnd || new Date()
                      }
                      mode="time"
                      is24Hour={false}
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={handleTimeChange}
                    />
                  )}

                  {/* Peak Price */}
                  <Text className="font-semibold text-gray-700 mt-2">
                    Peak Hours Price Per Slot (₹)
                  </Text>
                  <TextInput
                    className="border p-2 rounded-lg bg-white mb-4"
                    value={court.peakPrice}
                    onChangeText={(text) =>
                      updateCourt(index, "peakPrice", text)
                    }
                    keyboardType="numeric"
                  />
                </View>
              )}
            </View>
          ))}

          {/* Add More Courts Button */}
          <TouchableOpacity
            onPress={addCourt}
            className="bg-orange-500 py-3 rounded-lg items-center mb-10"
          >
            <Text className="text-white font-semibold">+ Add More Courts</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>

      {/* Sticky Bottom Button */}
      <TouchableOpacity
        onPress={() => router.push("/venue/declaration")}
        className="rounded-lg border overflow-hidden absolute bottom-0 right-0 mr-2 mb-10"
      >
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
