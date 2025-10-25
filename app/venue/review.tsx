import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, Ionicons } from "@expo/vector-icons";
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

  const venueDetails = {
    brandName: "Chetana Turf",
    description: "fghjkl;kjh hgfddhgjk kjhgf hgfhjkj jiuhgvfcgggggggggggggggggggggg ghjkjlkjlkjk hjggggggggggggggggggggggg hhkjwkedhgjgfuiqwhdiowjckschhscvas kahdjabgdjagdiuhaiudhq dihwawjdgjadbjabdjq dihaudhaqh",
    venueType: "Not Specified",
    sportsOfferred: "Not Specified",
    operationDays: "Monday, Tuesday, Saturday, Sunday",
    timings: "24 hours",
  };

  const contactDetails = {
    contactPerson: "Xyz",
    contactNumber: "xxxx xxxxxx",
    contactEmail: "xya@gmail.com",
    ownerName: "Owner Name",
    ownerNumber: "xxxx xxxxxx",
    ownerEmail: "Owner Email",
    address: "Full Address",
    landmark: "None"
  };

  const courts = [
    {
      sport:"Football",
      surface:"Wooden",
      slotDuration:"5",
      maxDuration:"3",
      price:"500"
    }
  ]

  const [selectedPlan, setSelectedPlan] = useState<"revenue" | "introductory" | null>("revenue");
    const [acknowledged, setAcknowledged] = useState(false);

  const handleSelectPlan = (plan: "revenue" | "introductory") => {
    setSelectedPlan(plan === selectedPlan ? null : plan);
  };

  const total = details.fee + details.tax;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient
        colors={["#FFF201", "#FFFFFF"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0.8 }}
      >
        <View className="flex-row items-center justify-between my-2">
          <View className="w-8 h-8 rounded-full border-4 mx-2" >
            <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
          </View>
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
        <ScrollView
            contentContainerStyle={{ paddingBottom: 200, padding:20 }} // 👈 leaves space for button
            showsVerticalScrollIndicator={false}
        >
            {/* Title */}
        <Text className="text-lg font-bold">Review venue details</Text>
        <View className="border-b w-[80%] mb-3" />

        <View className="bg-yellow-100 p-4 rounded-xl shadow-md mt-4">
          {/* Venue Info */}
          <Text className="text-lg font-bold mb-3">Venue Details</Text>

          <Text className="font-bold">
            Venue Name:{" "}
            <Text className="font-normal">{venueDetails.brandName}</Text>
          </Text>
          <Text className="font-bold">
            Description:{" "}
            <Text className="font-normal">{venueDetails.description}</Text>
          </Text>
          {/* <Text className="font-bold">
            Venue Type:{" "}
            <Text className="font-normal">{venueDetails.venueType}</Text>
          </Text> */}
          <Text className="font-bold">
            Sports Offered:{" "}
            <Text className="font-normal">{venueDetails.sportsOfferred}</Text>
          </Text>
          <Text className="font-bold">
            Operational days:{" "}
            <Text className="font-normal">{venueDetails.operationDays}</Text>
          </Text>
          <Text className="font-bold">
            Timings:{" "}
            <Text className="font-normal">{venueDetails.timings}</Text>
          </Text>
        </View>

        <View className="bg-blue-100 p-4 rounded-xl shadow-md mt-4">
          <Text className="text-lg font-bold mb-3">Contact & Address</Text>

        <Text className="font-bold">
          Contact Person:{" "}
          <Text className="font-normal">{contactDetails.contactPerson}</Text>
        </Text>
        <Text className="font-bold">
          Contact Number:{" "}
          <Text className="font-normal">{contactDetails.contactNumber}</Text>
        </Text>
        <Text className="font-bold">
          Contact Email:{" "}
          <Text className="font-normal">{contactDetails.contactEmail}</Text>
        </Text>

        <Text className="font-bold mt-3">
          Owner’s Name: <Text className="font-normal">{contactDetails.ownerName}</Text>
        </Text>
        <Text className="font-bold">
          Owner’s Number: <Text className="font-normal">{contactDetails.ownerEmail}</Text>
        </Text>
        <Text className="font-bold">
          Owner’s Email: <Text className="font-normal">{contactDetails.ownerEmail}</Text>
        </Text>

        <Text className="font-bold mt-3">
          Address: <Text className="font-normal">{contactDetails.address}</Text>
        </Text>
        <Text className="font-bold">
          Landmark:{" "}
          <Text className="font-normal">{contactDetails.landmark}</Text>
        </Text>
        </View>
        <View className="bg-yellow-100 p-4 rounded-xl shadow-md mt-4">
          {/* Venue Info */}
          <Text className="text-lg font-bold mb-3">Amenities</Text>

        </View>
        <View className="bg-white p-4 rounded-xl shadow-md mt-4">
          {/* Venue Info */}
          <Text className="text-lg font-bold mb-3">Courts</Text>
          {courts.map((court, index) => (
            <View key={index} className="mb-4">
              <Text className="font-bold">
                Court {index + 1}{" "}
                <Text className="font-normal"></Text>
              </Text>
               <Text className="font-bold">
                Sport {" "}
                <Text className="font-normal">{court.sport}</Text>
              </Text>
              <Text className="font-bold">
                Surface:{" "}
                <Text className="font-normal">{court.surface}</Text>
              </Text>
              <Text className="font-bold">
                Slot:{" "}
                <Text className="font-normal">{court.slotDuration}</Text>
              </Text>
              <Text className="font-bold">
                Max bookings/slot:{" "}
                <Text className="font-normal">{court.maxDuration}</Text>
              </Text>
              <Text className="font-bold">
                Price/slot:{" "}
                <Text className="font-normal">{court.price}</Text>
              </Text>
            </View>
          ))}
        </View>
        <View className="bg-yellow-50 p-4 rounded-xl shadow-md mt-4">
          {/* Venue Info */}
          <Text className="text-lg font-bold mb-3">Select your preferred Venue Listing revenue model:</Text>
          <Text className="text-sm mb-3">Please select the best monetization model for your sports venue. You can choose to continue with the same listing revenue model for all your venues.</Text>
          <View className="flex-row">
            {/* Revenue Share Plan */}
            <TouchableOpacity
              onPress={() => handleSelectPlan("revenue")}
              className={`w-[50%] shadow-md p-4 rounded-2xl border border-gray-300 mt-4 mr-1
                ${selectedPlan === "revenue" ? "border-green-200 bg-green-200" : "bg-white"}`}
            >
              <View>
                <Text className="text-lg font-bold mb-2">Revenue Share</Text>
                <Text className="text-[10px] text-green-700 font-bold">6% per booking + GST</Text>
                <Text className="text-[10px]">commission on every confirmed booking.</Text>
                <Text className="text-[10px] text-gray-400">
                  ₹499 + 18% GST one-time onboarding fee
                </Text>
              </View>
            </TouchableOpacity>

            {/* Introductory Plan */}
            <TouchableOpacity
              onPress={() => handleSelectPlan("introductory")}
              className={`w-[50%] bg-white shadow-md p-4 rounded-2xl border border-gray-300 mt-4
                ${selectedPlan === "introductory" ? "border-yellow-100 bg-yellow-100" : ""}`}
            >
              <View>
                <Text className="text-md font-bold mb-3">Introductory Plan</Text>
                <Text className="text-[10px] font-bold text-yellow-600">INR 2,990 + 18% GST</Text>
                <Text className="text-[10px]">one-time setup fee (first 3 months).</Text>
                <Text className="text-[10px] font-bold text-yellow-600">No commission</Text>
                <Text className="text-[10px]">in months 1–3.</Text>
                <Text className="text-[10px] font-bold text-yellow-600">6% per booking + GST</Text>
                <Text className="text-[10px]">from month 4 onward</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-white p-4 rounded-xl shadow-md mt-4">
          <Text className="text-xl font-bold text-center mb-5">Venue Partner Declaration</Text>
          <Text className="text-sm mb-5">
            <Text className="font-bold">Authorization & Accuracy:</Text>
            I hereby confirm that I am an authorized representative of <Text className="font-bold">venue test</Text>, and that all details provided in the official Ofside mobile app/website onboarding form are true, complete, and accurate. I understand that Ofside (powered by Rankshell – India’s ultimate sports ecosystem) will rely on this information to list, manage, and promote my venue on the platform.
          </Text>
          <Text className="text-sm mb-5">
            <Text className="font-bold">Consent & Compliance:</Text>
            I provide my formal consent to onboard and activate my venue under the selected commercial model, and I accept all applicable terms and revenue share conditions. I acknowledge that any false or misleading information may lead to suspension or removal of my venue listing at Ofside’s discretion.
          </Text>
            {/* Checkbox */}
            <View className="flex-row justify-between items-start mt-5 mx-1">
                <TouchableOpacity
                    onPress={() => setAcknowledged(!acknowledged)}
                >
                    <Ionicons
                        name={acknowledged ? "checkbox" : "square-outline"}
                        size={18}
                        color="black"
                    />
                </TouchableOpacity>
                <Text className="text-[10px] font-semibold ml-2">
                    I agree and confirm the accuracy of the above information and accept the terms of listing on Ofside.
                </Text>
            </View>
        </View>


        {/* Amount Payable */}
        {/* <Text className="text-lg font-bold mt-6">Amount payable</Text>
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
        </View> */}

        {/* Info */}
        {/* <Text className="text-[10px] text-gray-600 mt-10">
          Thank you for submitting your venue details. This is a preliminary onboarding step.
          Our onboarding team will now review your details and connect with you shortly
          for the next steps, as per the declaration agreed upon in the previous section.
        </Text> */}
        </ScrollView>
      </LinearGradient>

        {/* Sticky Bottom Bar */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex-row justify-between items-center px-4 pt-3 pb-10">
            <Text className="text-3xl font-bold">INR {total.toFixed(2)}</Text>
            <TouchableOpacity
              disabled={!acknowledged}
              onPress={()=>router.push('/venue/paymentScreen')}
              className={`bg-green-600 px-8 py-1 rounded-lg ${!acknowledged ? "opacity-50" : "opacity-100"}`}>
                <Text className="font-bold text-white text-lg">Pay</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}
