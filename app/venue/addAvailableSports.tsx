import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const sportsOptions = [
  "Box cricket",
  "Box football",
  "Batminton",
  "Pickleball",
  "Tennis",
  "Basketball",
  "Volleyball",
  "Swimming",
  "Table Tennis",
  "Hockey",
  "Squash",
];

export default function AvailableSports() {
  const navigation = useNavigation();
  const [selectedSports, setSelectedSports] = useState<string[]>([
    "Box cricket",
    "Box football",
    "Batminton",
    "",
    "Pickleball",
  ]);

  const updateSport = (index: number, value: string) => {
    const newSports = [...selectedSports];
    newSports[index] = value;
    setSelectedSports(newSports);
  };

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
        <Text className="text-2xl font-bold px-5">Available sports at your venue</Text>
        <Text className="text-[12px] text-gray-600 mt-1 px-5">
          Users will see these details on Ofside
        </Text>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120, padding:20 }}
      >
        {selectedSports.map((sport, index) => (
          <View key={index} className="mb-5">
            <Text className="font-extrabold mb-2">
              Sports name {index + 1}
            </Text>
            <View
              className={`border rounded-lg ${
                !sport ? "border-red-500" : "border-gray-400"
              }`}
            >
              <Picker
                selectedValue={sport}
                onValueChange={(itemValue) =>
                  updateSport(index, itemValue)
                }
              >
                <Picker.Item label="Select a sport" value="" />
                {sportsOptions.map((option, i) => (
                  <Picker.Item key={i} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>
        ))}
      </ScrollView>
      </LinearGradient>

    {/* Sticky Bottom Button */}
    <TouchableOpacity onPress={()=> router.push('/venue/addFacilityImages')} className="rounded-lg border overflow-hidden absolute bottom-0 right-0 mr-2 mb-10">
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
