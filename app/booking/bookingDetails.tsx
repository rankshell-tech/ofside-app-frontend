import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function CompletedBookingDetails() {
    const navigation = useNavigation();
  const [rating, setRating] = useState(0);
  const [fullName, setFullName] = useState("Swarit Jain");
    const [contactNumber, setContactNumber] = useState("8826233812");

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center mx-2 mt-2">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-white rounded-full border-4" >
              <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
          </View>
          <Text className="ml-3 text-xl font-bold">Completed</Text>
        </View>
        <Text className="text-sm font-bold">Help</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Title */}
        <Text className="text-4xl font-bold text-blue-700 mb-3">Nik box turf</Text>

        {/* Booking details */}
        <View className="py-3">
          <Text className="font-bold text-lg mb-2">Booking details</Text>
          <View className="border-t my-1" style={{ width: "70%" }} />
          <Text className="mb-1">Venue: <Text className="font-bold">Nik box turf</Text></Text>
          <Text className="mb-1">Game name: <Text className="font-bold">Football</Text></Text>
          <Text className="mb-1">Date: <Text className="font-bold">Friday, 23 May</Text></Text>
          <Text className="mb-1">Slot time: <Text className="font-bold">7am - 9am</Text></Text>
          <Text className="mb-1">
              Location: <Text className="font-bold">Guru Harkrishan Public School Ground, 32C/78, West Punjabi Bagh, New Delhi, Delhi, 110026</Text>
          </Text>
        </View>

        {/* Price Breakup */}
        <View className="py-3">
            <Text className="font-bold text-lg mb-2">Price breakup</Text>
            <View className="border-t my-1" style={{ width: "70%" }} />
            <View className="flex-row justify-between mb-1">
                <Text>Base amount:</Text>
                <Text>INR 900</Text>
            </View>
            <View className="flex-row justify-between mb-1">
                <Text>Platform fee:</Text>
                <Text>INR 12</Text>
            </View>
            <View className="flex-row justify-between mb-1">
                <Text className="text-green-600">Coupon discount (Coupon name) :</Text>
                <Text className="text-green-600">INR -200</Text>
            </View>
            <View className="flex-row justify-between mb-1">
                <Text>Tax:</Text>
                <Text>INR 128.16</Text>
            </View>
            <View className="flex-row justify-between mt-5 pt-2">
                <Text className="font-bold">Total :</Text>
                <Text className="font-bold">INR 840</Text>
            </View>
        </View>

        {/* Rating */}
        <View className="flex-row mt-6 border p-2 rounded-lg items-center justify-between">
          <Text className="mb-2 font-semibold ">Rate your experience</Text>
          <View className="flex-row space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setRating(i)}>
                <Ionicons
                  name={i <= rating ? "star" : "star-outline"}
                  size={28}
                  color="#facc15" // yellow
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* User details */}
        <View className="flex-row justify-between my-3">
            <View className="flex-1 mr-2">
              <Text className="text-gray-600 mb-2">Full name</Text>
              <Text className="border-b rounded-md border-gray-300 px-1 py-1 font-bold">{fullName}</Text>
            </View>

            <View className="flex-1 ml-2">
              <Text className="text-gray-600 mb-2">Contact Number</Text>
              <Text className="border-b rounded-md border-gray-300 px-1 py-1 font-bold">{contactNumber}</Text>
            </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View className="flex-row border-t border-gray-300">
        <TouchableOpacity className="flex-1 p-4 border-r border-gray-300">
          <Text className="text-center font-bold">Download invoice</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 p-4">
          <Text className="text-center text-green-600 font-bold">Book again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
