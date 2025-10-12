import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, ImageBackground } from "react-native";
import { AntDesign, Entypo, FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Iconify from "@/components/Iconify";

export default function HomeScreen() {
  const navigation = useNavigation();
    const [tab, setTab] = useState<"Recent Booking" | "Analytics">("Recent Booking");
    const [activeTab, setActiveTab] = useState<"Today" | "This week" | "This month" | "Custom">("Today");
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
    {
        id: "3",
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
        id: "4",
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
      <ImageBackground
          source={require("../../assets/images/background.png")} // Put your image in assets/images
          resizeMode="cover"
          className="flex-1"
      >
        {/* Header */}
        <TouchableOpacity onPress={()=> router.push("/venueHome/ProfileScreen")} className="flex-row justify-end items-center mb-5 px-5">
            <Iconify icon="teenyicons:menu-outline" size={30} color="black" type="svg" />
        </TouchableOpacity>

        {/* Content */}
            <View className="mx-2">
                <Text className="text-4xl font-bold mt-2">Antitode turfs</Text>
                <TouchableOpacity className="w-60 flex-row bg-[#fff201] py-1 px-5 rounded-full justify-between items-center mt-2">
                    <Text className="text-base font-semibold">
                        Antitode turfs, Saket
                    </Text>
                    <AntDesign name="down-circle" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View className="flex-row  mx-5 mt-5 mb-2">
                {["Recent Booking", "Analytics"].map((t) => (
                    <TouchableOpacity
                        key={t}
                        className={`flex-1 p-3 border mr-5 overflow-hidden rounded-md ${
                            tab === t ? "bg-[#FFF201]" : "bg-white"
                        }`}
                        onPress={() => setTab(t as any)}
                    >
                    <Text
                        className={`text-center capitalize ${
                        tab === t ? "font-bold" : ""
                        }`}
                    >
                        {t}
                    </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View className="border mx-2 my-2">
                <View className="flex-row  mx-5 mt-5 mb-2">
                    {["Today", "This week", "This month", "Custom"].map((t) => (
                        <TouchableOpacity
                            key={t}
                            className={`flex-1 px-2 py-1 border mr-2 overflow-hidden rounded-full ${
                                activeTab === t ? "bg-[#FFF201]" : "bg-gray-200"
                            }`}
                            onPress={() => setActiveTab(t as any)}
                        >
                        <Text
                            className={`text-[10px] text-center ${
                            activeTab === t ? "font-bold" : ""
                            }`}
                        >
                            {t}
                        </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className="flex-row justify-evenly items-center mx-2 my-2">
                    <View className="border border-gray-400 rounded-md px-2 py-2 bg-gray-200 items-center">
                        <Text className="text-lg">Total Bookings</Text>
                        <Text className="text-3xl font-bold">56</Text>
                    </View><View className="border border-gray-400 rounded-md px-2 py-2 bg-gray-200 items-center">
                        <View className="flex-row">
                            <Text className="text-lg mr-2">Total Revenue</Text>
                            <Image
                                source={require("../../assets/images/stat.png")}
                                style={{
                                width: 20,   // 👈 smaller width
                                height: 20,  // 👈 proportional height
                                resizeMode: "contain", // keeps aspect ratio
                                }}
                                className="mr-1"
                            />
                        </View>
                        <Text className="text-3xl font-bold">23,243</Text>
                    </View>
                </View>
                <View className="flex-row justify-evenly items-center mx-2 my-2">
                    <View className="border border-gray-400 rounded-md px-5 py-2 bg-gray-200 items-center">
                        <Text className="text-lg">Total Users</Text>
                        <Text className="text-3xl font-bold">392</Text>
                    </View>
                    <View className="border border-gray-400 rounded-md px-5 py-2 bg-gray-200 items-center">
                        <Text className="text-lg">Total Revenue</Text>
                        <Text className="text-3xl font-bold">23,243</Text>
                    </View>
                </View>

            </View>

            <Text className="text-xl font-bold mt-2 px-5">Recent Bookings</Text>
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
      </ImageBackground>
    </SafeAreaView>
  );
}
