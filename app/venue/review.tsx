import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

export default function Declaration() {
  const navigation = useNavigation();
  const details = {
    brandName: "XYZ",
    contactPerson: "Xyz",
    contactNumber: "xxxx xxxxxx",
    email: "xya@gmail.com",
    ownerName: "Owner Name",
    ownerEmail: "Owner Email",
    address: "Full Address",
    sports: ["Name1", "Name2", "Name3"],
    fee: 449,
    tax: 80.82,
  };

  const total = details.fee + details.tax;

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
            Venue Onboarding Review Summary
        </Text>
      <View className="border-t w-full"/>

        {/* Content */}
        <ScrollView className="px-2 my-5">
            {/* Title */}
        <Text className="text-lg font-bold">Review venue details</Text>
        <View className="border-b w-[80%] mb-3" />

        {/* Venue Info */}
        <Text className="font-bold">Brand/Venue Name: <Text className="font-normal">{details.brandName}</Text></Text>
        <Text className="font-bold">Primary Contact person: <Text className="font-normal">{details.contactPerson}</Text></Text>
        <Text className="font-bold">Primary Contact Number: <Text className="font-normal">{details.contactNumber}</Text></Text>
        <Text className="font-bold">Communication Email: <Text className="font-normal">{details.email}</Text></Text>

        <Text className="font-bold mt-3">Owner’s Name: <Text className="font-normal">{details.ownerName}</Text></Text>
        <Text className="font-bold">Owner’s Email: <Text className="font-normal">{details.ownerEmail}</Text></Text>

        <Text className="font-bold mt-3">Venue Address: <Text className="font-normal">{details.address}</Text></Text>
        <Text className="font-bold">Sports Available: <Text className="font-normal">{details.sports.join(", ")}</Text></Text>

        {/* Amount Payable */}
        <Text className="text-lg font-bold mt-6">Amount payable</Text>
        <View className="border-b w-[80%] mb-3" />
        <View className="flex-row justify-between mb-1">
          <Text className="text-[12px]">One-Time onboarding Fee (per sport):</Text>
          <Text className="text-[12px]">INR {details.fee}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-[12px]">Tax:</Text>
          <Text className="text-[12px]">INR {details.tax}</Text>
        </View>
        <View className="flex-row justify-between mt-2 pt-2">
          <Text className="font-bold">Total :</Text>
          <Text className="font-bold">INR {total.toFixed(2)}</Text>
        </View>

        {/* Info */}
        <Text className="text-[10px] text-gray-600 mt-10">
          Thank you for submitting your venue details. This is a preliminary onboarding step.
          Our onboarding team will now review your details and connect with you shortly
          for the next steps, as per the declaration agreed upon in the previous section.
        </Text>
        </ScrollView>
      </LinearGradient>

        {/* Sticky Bottom Bar */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex-row justify-between items-center px-4 pt-3 pb-10">
            <Text className="text-3xl font-bold">INR {total.toFixed(2)}</Text>
            <TouchableOpacity onPress={()=>router.push('/venue/paymentScreen')} className="bg-green-600 px-8 py-1 rounded-lg">
                <Text className="font-bold text-white text-lg">Pay</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}
