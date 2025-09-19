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
        name: "Chetana turf",
        image: "https://images.pexels.com/photos/6203527/pexels-photo-6203527.jpeg",
        rating: 4.8,
        location: "Noida",
        offer: "Flat 20% Off",
        price: "INR 1200 Onwards",
        tag: "Premium",
        bestFor: "Best for tennis",
        distance: "15km"
    },
    ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center mb-5">
        <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2" >
            <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
        </View>
        <Text className="ml-3 text-xl font-bold mt-2">Your Bookings</Text>
      </View>

      {/* Content */}
        {tab === "completed" && (
          <FlatList
                data={completedBookings}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 80 }}
                renderItem={({ item }) => (
                <TouchableOpacity onPress={() => router.push({
                                                    pathname: '/booking/bookingDetails',
                                                    params: { id: item.id },
                                                    })}
                                     className="flex-row items-center bg-gray-200 border border-gray-300 rounded-2xl p-1 mb-4 shadow-sm"
                >
                <View className="w-[40%]">
                    <Image source={{ uri: item.image }} className="w-full h-32" />
                    <View className='flex-row justify-between mt-2 mx-2'>
                        <Text className="font-bold text-lg">{item.name}</Text>
                    </View>
                </View>
                <View className="w-[60%]">
                    <View className="flex-row justify-between">
                        <View className="px-1">
                            <Text className="font-bold">#SLT87654</Text>
                            <Text className="font-bold">Box Cricket</Text>
                        </View>
                        <View className="flex-row items-center justify-end">
                            <FontAwesome name="bookmark-o" size={20} color="black" />
                            <Entypo className="ml-1" name="chevron-with-circle-right" size={20} color="black" />
                        </View>
                    </View>
                    <View className="flex-1 justify-end items-end">
                        <Text className="text-sm">17 Jun, 2025</Text>
                        <Text className="text-sm">Rohini, Delhi</Text>
                    </View>

                    <View className="border-t border-gray-300" />
                    {/* Actions */}
                    <View className="flex-row">
                        <TouchableOpacity className="flex-1 p-3 border-r border-gray-200">
                            <Text className="text-center text-blue-600 font-semibold">Rate venue</Text>
                        </TouchableOpacity>
                        <View className="border-r border-gray-300" />
                        <TouchableOpacity className="flex-1 p-3">
                            <Text className="text-center text-green-600 font-semibold">Play again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </TouchableOpacity>
                )}
            />
        )}
        {tab === "upcoming" && (
          <FlatList
                data={completedBookings}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 80 }}
                renderItem={({ item }) => (
                <TouchableOpacity onPress={() => router.push({
                                                    pathname: '/booking/bookingDetails',
                                                    params: { id: item.id },
                                                    })}
                                     className="flex-row items-center bg-gray-200 border border-gray-300 rounded-2xl p-1 mb-4 shadow-sm"
                >
                <View className="w-[40%]">
                    <Image source={{ uri: item.image }} className="w-full h-32" />
                    <View className='flex-row justify-between mt-2 mx-2'>
                        <Text className="font-bold text-lg">{item.name}</Text>
                    </View>
                </View>
                <View className="w-[60%]">
                    <View className="flex-row justify-between">
                        <View className="px-1">
                            <Text className="font-bold">#SLT87654</Text>
                            <Text className="font-bold">Box Cricket</Text>
                        </View>
                        <View className="flex-row items-center justify-end">
                            <FontAwesome name="bookmark-o" size={20} color="black" />
                            <Entypo className="ml-1" name="chevron-with-circle-right" size={20} color="black" />
                        </View>
                    </View>
                    <View className="flex-1 justify-end items-end">
                        <Text className="text-sm">17 Jun, 2025</Text>
                        <Text className="text-sm">Rohini, Delhi</Text>
                    </View>

                    <View className="border-t border-gray-300" />
                    {/* Actions */}
                    <View className="flex-row">
                        <TouchableOpacity className="flex-1 p-3 border-r border-gray-200">
                            <Text className="text-center text-blue-600 font-semibold">Rate venue</Text>
                        </TouchableOpacity>
                        <View className="border-r border-gray-300" />
                        <TouchableOpacity className="flex-1 p-3">
                            <Text className="text-center text-green-600 font-semibold">Play again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </TouchableOpacity>
                )}
            />
        )}
        {tab === "cancelled" && (
          <FlatList
                data={completedBookings}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 80 }}
                renderItem={({ item }) => (
                <TouchableOpacity onPress={() => router.push({
                                                    pathname: '/booking/bookingDetails',
                                                    params: { id: item.id },
                                                    })}
                                     className="flex-row items-center bg-gray-200 border border-gray-300 rounded-2xl p-1 mb-4 shadow-sm"
                >
                <View className="w-[40%]">
                    <Image source={{ uri: item.image }} className="w-full h-32" />
                    <View className='flex-row justify-between mt-2 mx-2'>
                        <Text className="font-bold text-lg">{item.name}</Text>
                    </View>
                </View>
                <View className="w-[60%]">
                    <View className="flex-row justify-between">
                        <View className="px-1">
                            <Text className="font-bold">#SLT87654</Text>
                            <Text className="font-bold">Box Cricket</Text>
                        </View>
                        <View className="flex-row items-center justify-end">
                            <FontAwesome name="bookmark-o" size={20} color="black" />
                            <Entypo className="ml-1" name="chevron-with-circle-right" size={20} color="black" />
                        </View>
                    </View>
                    <View className="flex-1 justify-end items-end">
                        <Text className="text-sm">17 Jun, 2025</Text>
                        <Text className="text-sm">Rohini, Delhi</Text>
                    </View>

                    <View className="border-t border-gray-300" />
                    {/* Actions */}
                    <View className="flex-row">
                        <TouchableOpacity className="flex-1 p-3 border-r border-gray-200">
                            <Text className="text-center text-blue-600 font-semibold">Rate venue</Text>
                        </TouchableOpacity>
                        <View className="border-r border-gray-300" />
                        <TouchableOpacity className="flex-1 p-3">
                            <Text className="text-center text-green-600 font-semibold">Play again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </TouchableOpacity>
                )}
            />
        )}

      {/* Tabs */}
      <View className="flex-row border border-gray-400 rounded-md mx-5">
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
