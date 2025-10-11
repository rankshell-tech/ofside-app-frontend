import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { Entypo, FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function BookingsScreen() {
    const navigation = useNavigation();
  const [tab, setTab] = useState<"upcoming" | "completed" | "cancelled">("completed");
   const completedBookings = [
    {
        id: "1",
        name: "Swarit Jain",
        number:"88997526",
        image: "https://images.pexels.com/photos/6203527/pexels-photo-6203527.jpeg",
        rating: 4.8,
        location: "Noida",
        offer: "Flat 20% Off",
        price: "INR 1200 Onwards",
        tag: "Premium",
        bestFor: "Best for tennis",
        distance: "15km",
        payment:"Paid",
        paymentStatus:"Completed"
    },
    {
        id: "2",
        name: "Chetana Jain",
        number:"88997526",
        image: "https://images.pexels.com/photos/6203527/pexels-photo-6203527.jpeg",
        rating: 4.8,
        location: "Rohini, Delhi",
        offer: "Flat 20% Off",
        price: "INR 1200 Onwards",
        tag: "Premium",
        bestFor: "Best for tennis",
        distance: "15km",
        payment:"Partial",
        paymentStatus:"Due"
    },
    ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center mb-5 px-5">
        <Text className="ml-3 text-xl font-bold mt-2">Bookings</Text>
      </View>

      {/* Content */}
        {tab === "completed" && (
          <FlatList
                data={completedBookings}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 80 }}
                className="p-2"
                renderItem={({ item }) => (
                <TouchableOpacity className="flex-row items-center bg-gray-200 border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm" >
                    <View className="w-[60%]">
                        <View className="mb-20">
                            <Text className="font-bold">#SLT87654</Text>
                            <View className="flex-row items-center">
                                <Text className="font-bold">Box Cricket</Text>
                                <Text className="text-[10px] ml-3 mt-1">Turf 3</Text>
                            </View>
                        </View>
                        <View className="">
                            <Text className="font-bold">By {item.name}</Text>
                            <Text className="text-sm">{item.number}</Text>
                        </View>
                    </View>
                    <View className="w-[40%]">
                            <View className="flex-row items-center justify-end mb-5">
                                <TouchableOpacity>
                                    <Text className="border border-gray-400 rounded-full text-center text-[10px] px-3 py-1">Aggregator</Text>
                                </TouchableOpacity>
                                <Entypo className="ml-1" name="chevron-with-circle-right" size={20} color="black" />
                            </View>
                        <View className="flex-1 justify-end items-end mb-10">
                            <Text className="text-sm">17 Jun, 2025</Text>
                            <Text className="text-sm">{item.location}</Text>
                        </View>

                        {/* Actions */}
                        <View className="flex-row">
                            <TouchableOpacity className="flex-1">
                                <Text
                                    className={`border border-gray-500 rounded-full text-center text-white
                                        ${item.paymentStatus === "Completed" ? "bg-green-600" : "bg-orange-400"} `}>
                                        {item.payment}
                                </Text>
                            </TouchableOpacity>
                            <View className="" />
                            <TouchableOpacity className="flex-1">
                                <Text className="text-center text-green-600 font-bold">INR 800</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
                )}
            />
        )}

      {/* Tabs */}
      <View className="flex-row border border-gray-400 overflow-hidden rounded-md mx-5 mb-2">
        {["upcoming", "completed", "cancelled"].map((t) => (
          <TouchableOpacity
            key={t}
            className={`flex-1 p-3 ${
              tab === t ? "bg-black" : "bg-white"
            }`}
            onPress={() => setTab(t as any)}
          >
            <Text
              className={`text-center capitalize font-medium ${
                tab === t ? "text-white" : "text-black"
              }`}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
