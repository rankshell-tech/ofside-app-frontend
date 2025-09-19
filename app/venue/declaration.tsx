import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

export default function Declaration() {
  const navigation = useNavigation();
  const [acknowledged, setAcknowledged] = useState(false);
  const details = [
    "Brand / Venue Name, Contact Number & Email",
    "Owner’s Name & Contact Details",
    "Venue Location & Full Address",
    "Amenities Available",
    "Operational Days & Timings",
    "Sports Offered",
    "Facility Images for Each Sport",
    ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient
        colors={["#FFF201", "#FFFFFF"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0.8 }}
        className="p-1"
      >
        <View className="flex-row items-center justify-between my-5">
          <Ionicons
            onPress={() => navigation.goBack()}
            name="chevron-back-circle-outline"
            size={26}
            color="black"
          />
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: 250, height: 50, resizeMode: 'contain' }}
            />
          <View />
        </View>

      {/* Title */}
      <View className="border-t"/>
        <Text className="text-center text-lg font-bold my-1">
            Declaration
        </Text>
      <View className="border-t w-full"/>

      {/* Content */}
      <ScrollView className="px-4 my-5">
        <Text className="mb-3 text-justify">
            I hereby certify that I am an authorized representative of ss, and that all information provided in the Ofside onboarding form is true, complete, and accurate to the best of my knowledge. I understand that Ofside (powered by Rankshell – India’s ultimate sports ecosystem) will rely on these details to list and promote my venue.
        </Text>

        <View className="mb-3 text-justify">
          <Text className="font-bold mb-2">Details Provided:</Text>
            {details.map((item, index) => (
            <View key={index} className="flex-row items-start mb-3">
                <Ionicons
                    name="ellipse"
                    size={8}
                    color="black"
                    style={{ marginTop: 6, marginRight: 8 }}
                />
                <Text className="text-base flex-1">{item}</Text>
            </View>
            ))}
        </View>

        <Text className="mb-5 text-justify">
          I understand that this declaration constitutes my formal consent and will be used to activate and manage my venue listing on the Ofside platform. I acknowledge that any false or misleading information may result in removal from the platform or other remedial action by Ofside.
        </Text>

        {/* Checkbox */}
        <View className="flex-row justify-between items-center mt-5">
            <Text className="text-lg font-semibold">
                You acknowledge the above declaration
            </Text>
            <TouchableOpacity
                onPress={() => setAcknowledged(!acknowledged)}
            >
                <Ionicons
                    name={acknowledged ? "checkbox" : "square-outline"}
                    size={18}
                    color="black"
                />
            </TouchableOpacity>
        </View>
        </ScrollView>
      </LinearGradient>

        {/* Sticky Bottom Button */}
        <TouchableOpacity onPress={()=> router.push('/venue/review')} disabled={!acknowledged} className="rounded-lg border overflow-hidden absolute bottom-0 right-0 mr-2 mb-10">
            <LinearGradient
                colors={["#FFF201", "#E0E0E0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className={`px-6 py-1 items-center rounded-full ${
                    !acknowledged ? "opacity-50" : "opacity-100"
                }`}
            >
                <Text className="font-bold text-black text-lg">Next</Text>
            </LinearGradient>
        </TouchableOpacity>
    </SafeAreaView>
  );
}
