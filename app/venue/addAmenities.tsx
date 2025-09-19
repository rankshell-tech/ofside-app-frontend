// screens/VenueAmenities.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

const amenitiesList = [
  "Wi-fi",
  "Flood lights",
  "Washroom/Restroom",
  "Changing area",
  "Drinking water",
  "Artificial grass",
  "Natural grass",
  "Bike/Car parking",
  "Mobile charging",
  "Showers/Steam",
  "Match referee",
  "Warm-up track",
  "Rental equipments",
  "First aid",
  "Locker Rooms",
  "Seating areas",
  "Cafeteria",
  "Coaching",
];

export default function VenueAmenities() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleAmenity = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient
        colors={["#FFF201", "#FFFFFF"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0.8 }}
      >
        <View className="w-8 h-8 rounded-full border-4 mx-2 mt-2" >
          <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
        </View>

        <Text className="text-2xl font-bold mt-5 px-5">Select amenities at your venue</Text>
        <Text className="text-[10px] text-gray-500 mt-1 px-5">
          Users will see these details on Ofside
        </Text>

      {/* Amenities Grid */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100, padding:20 }}
      >
        <View className="flex-row flex-wrap justify-between">
          {amenitiesList.map((item) => {
            const isSelected = selected.includes(item);
            return (
              <TouchableOpacity
                key={item}
                onPress={() => toggleAmenity(item)}
                className={`w-[48%] py-3 px-2 rounded-lg mb-5 border ${
                  isSelected ? "bg-green-500 border-green-500" : "bg-white border-gray-400"
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    isSelected ? "text-white" : "text-black"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      </LinearGradient>
      {/* Sticky Bottom Button */}
      <TouchableOpacity onPress={()=> router.push('/venue/addOperationalDays')} className="rounded-lg border overflow-hidden absolute bottom-0 right-0 mr-2 mb-10">
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
