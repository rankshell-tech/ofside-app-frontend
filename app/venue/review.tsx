import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useNewVenue } from "@/hooks/useNewVenue";
import { Court } from "@/types";

// Day mapping for display
const DAY_FULL_NAMES: { [key: string]: string } = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

// Day number to name mapping (as stored in Court.peakDays)
const DAY_NUMBER_TO_NAME: { [key: number]: string } = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  7: "Sun",
};

export default function Review() {
  const navigation = useNavigation();
  const { currentNewVenue, updateVenuePartial } = useNewVenue();

  const [selectedPlan, setSelectedPlan] = useState<"revenue" | "introductory" | null>(
    (currentNewVenue as any)?.selectedPlan || "revenue"
  );
  const [acknowledged, setAcknowledged] = useState(
    currentNewVenue?.declarationAgreed || false
  );

  // Extract data from Redux
  const venueName = currentNewVenue?.venueName || "Not specified";
  const description = currentNewVenue?.description || "Not specified";
  const venueType = currentNewVenue?.venueType || "Not specified";
  const sportsOffered = currentNewVenue?.sportsOffered || [];
  const amenities = currentNewVenue?.amenities || [];
  const is24Hours = currentNewVenue?.is24HoursOpen || false;
  const days = (currentNewVenue as any)?.days || [];
  const openTime = (currentNewVenue as any)?.openTime || "";
  const closeTime = (currentNewVenue as any)?.closeTime || "";
  
  const location = currentNewVenue?.location;
  const contact = currentNewVenue?.contact;
  const owner = currentNewVenue?.owner;
  
  // Get courts from rawVenueData
  const courts = (currentNewVenue?.rawVenueData?.courts as Court[]) || [];

  // Format operational days
  const formattedDays = useMemo(() => {
    if (days.length === 0) return "Not specified";
    return days.map((day: string) => DAY_FULL_NAMES[day] || day).join(", ");
  }, [days]);

  // Format timings
  const formattedTimings = useMemo(() => {
    if (is24Hours) return "24 hours";
    if (openTime && closeTime) return `${openTime} - ${closeTime}`;
    return "Not specified";
  }, [is24Hours, openTime, closeTime]);

  // Format full address
  const fullAddress = useMemo(() => {
    if (!location) return "Not specified";
    const parts = [
      location.shopNo,
      location.floorTower,
      location.areaSectorLocality,
      location.city,
      location.state,
      location.pincode,
      location.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : location.fullAddress || "Not specified";
  }, [location]);

  // Calculate total based on selected plan
  const total = useMemo(() => {
    if (selectedPlan === "revenue") {
      const fee = 499;
      const tax = fee * 0.18;
      return fee + tax;
    } else if (selectedPlan === "introductory") {
      const fee = 2990;
      const tax = fee * 0.18;
      return fee + tax;
    }
    return 0;
  }, [selectedPlan]);

  const handleSelectPlan = (plan: "revenue" | "introductory") => {
    const newPlan = plan === selectedPlan ? null : plan;
    setSelectedPlan(newPlan);
    updateVenuePartial({ selectedPlan: newPlan } as any);
  };

  const handleAcknowledge = (value: boolean) => {
    setAcknowledged(value);
    updateVenuePartial({ declarationAgreed: value });
  };

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
            <Text className="font-normal">{venueName}</Text>
          </Text>
          <Text className="font-bold">
            Description:{" "}
            <Text className="font-normal">{description}</Text>
          </Text>
          {venueType && venueType !== "Not specified" && (
            <Text className="font-bold">
              Venue Type:{" "}
              <Text className="font-normal">{venueType}</Text>
            </Text>
          )}
          <Text className="font-bold">
            Sports Offered:{" "}
            <Text className="font-normal">
              {sportsOffered.length > 0 ? sportsOffered.join(", ") : "Not specified"}
            </Text>
          </Text>
          <Text className="font-bold">
            Operational days:{" "}
            <Text className="font-normal">{formattedDays}</Text>
          </Text>
          <Text className="font-bold">
            Timings:{" "}
            <Text className="font-normal">{formattedTimings}</Text>
          </Text>
        </View>

        <View className="bg-blue-100 p-4 rounded-xl shadow-md mt-4">
          <Text className="text-lg font-bold mb-3">Contact & Address</Text>

        <Text className="font-bold">
          Contact Person:{" "}
          <Text className="font-normal">{contact?.name || "Not specified"}</Text>
        </Text>
        <Text className="font-bold">
          Contact Number:{" "}
          <Text className="font-normal">{contact?.phone || "Not specified"}</Text>
        </Text>
        <Text className="font-bold">
          Contact Email:{" "}
          <Text className="font-normal">{contact?.email || "Not specified"}</Text>
        </Text>

        {owner && (owner.name || owner.phone || owner.email) && (
          <>
            <Text className="font-bold mt-3">
              Owner's Name: <Text className="font-normal">{owner.name || "Not specified"}</Text>
            </Text>
            <Text className="font-bold">
              Owner's Number: <Text className="font-normal">{owner.phone || "Not specified"}</Text>
            </Text>
            <Text className="font-bold">
              Owner's Email: <Text className="font-normal">{owner.email || "Not specified"}</Text>
            </Text>
          </>
        )}

        <Text className="font-bold mt-3">
          Address: <Text className="font-normal">{fullAddress}</Text>
        </Text>
        {location?.landmark && (
          <Text className="font-bold">
            Landmark:{" "}
            <Text className="font-normal">{location.landmark}</Text>
          </Text>
        )}
        </View>
        <View className="bg-yellow-100 p-4 rounded-xl shadow-md mt-4">
          <Text className="text-lg font-bold mb-3">Amenities</Text>
          {amenities.length > 0 ? (
            <View className="flex-row flex-wrap gap-2">
              {amenities.map((amenity, index) => (
                <View key={index} className="bg-white px-3 py-1 rounded-full border border-gray-300">
                  <Text className="text-sm text-gray-700">{amenity}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-gray-600">No amenities specified</Text>
          )}
        </View>
        <View className="bg-white p-4 rounded-xl shadow-md mt-4">
          <Text className="text-lg font-bold mb-3">Courts ({courts.length})</Text>
          {courts.length > 0 ? (
            courts.map((court, index) => (
              <View key={index} className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Text className="font-bold text-base mb-2">
                  Court {index + 1}: {court.name || `Court ${index + 1}`}
                </Text>
                <Text className="font-bold">
                  Sport:{" "}
                  <Text className="font-normal">{court.sportType || "Not specified"}</Text>
                </Text>
                {court.surfaceType && (
                  <Text className="font-bold">
                    Surface:{" "}
                    <Text className="font-normal">{court.surfaceType}</Text>
                  </Text>
                )}
                <Text className="font-bold">
                  Slot Duration:{" "}
                  <Text className="font-normal">
                    {court.slotDuration 
                      ? court.slotDuration >= 60 
                        ? `${Math.floor(court.slotDuration / 60)} hour${Math.floor(court.slotDuration / 60) > 1 ? 's' : ''}${court.slotDuration % 60 > 0 ? ` ${court.slotDuration % 60} min${court.slotDuration % 60 > 1 ? 's' : ''}` : ''}`
                        : `${court.slotDuration} minute${court.slotDuration > 1 ? 's' : ''}`
                      : "Not specified"}
                  </Text>
                </Text>
                <Text className="font-bold">
                  Max bookings/slot:{" "}
                  <Text className="font-normal">{court.maxPeople || "Not specified"}</Text>
                </Text>
                <Text className="font-bold">
                  Price/slot:{" "}
                  <Text className="font-normal">₹{court.pricePerSlot || "Not specified"}</Text>
                </Text>
                {court.peakEnabled && (
                  <View className="mt-2 pt-2 border-t border-gray-300">
                    <Text className="font-bold text-sm text-orange-600">Peak Hours Pricing:</Text>
                    {court.peakDays && court.peakDays.length > 0 && (
                      <Text className="font-bold text-xs">
                        Peak Days:{" "}
                        <Text className="font-normal">
                          {court.peakDays
                            .map((d: number) => {
                              const dayName = DAY_NUMBER_TO_NAME[d];
                              return dayName ? DAY_FULL_NAMES[dayName] || dayName : `Day ${d}`;
                            })
                            .join(", ")}
                        </Text>
                      </Text>
                    )}
                    {court.peakStart && court.peakEnd && (
                      <Text className="font-bold text-xs">
                        Peak Hours:{" "}
                        <Text className="font-normal">{court.peakStart} - {court.peakEnd}</Text>
                      </Text>
                    )}
                    {court.peakPricePerSlot && (
                      <Text className="font-bold text-xs">
                        Peak Price/slot:{" "}
                        <Text className="font-normal">₹{court.peakPricePerSlot}</Text>
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text className="text-gray-600">No courts added</Text>
          )}
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
            I hereby confirm that I am an authorized representative of <Text className="font-bold">{venueName}</Text>, and that all details provided in the official Ofside mobile app/website onboarding form are true, complete, and accurate. I understand that Ofside (powered by Rankshell – India's ultimate sports ecosystem) will rely on this information to list, manage, and promote my venue on the platform.
          </Text>
          <Text className="text-sm mb-5">
            <Text className="font-bold">Consent & Compliance:</Text>
            I provide my formal consent to onboard and activate my venue under the selected commercial model, and I accept all applicable terms and revenue share conditions. I acknowledge that any false or misleading information may lead to suspension or removal of my venue listing at Ofside’s discretion.
          </Text>
            {/* Checkbox */}
            <View className="flex-row justify-between items-start mt-5 mx-1">
                <TouchableOpacity
                    onPress={() => handleAcknowledge(!acknowledged)}
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
            <View>
              <Text className="text-xs text-gray-600">Total Amount</Text>
              <Text className="text-3xl font-bold">₹{total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              disabled={!acknowledged || !selectedPlan}
              onPress={() => {
                // Save plan and declaration before navigating
                updateVenuePartial({ 
                  selectedPlan,
                  declarationAgreed: acknowledged 
                } as any);
                router.push('/venue/paymentScreen');
              }}
              className={`px-8 py-3 rounded-lg ${!acknowledged || !selectedPlan ? "bg-gray-400" : "bg-green-600"}`}>
                <Text className="font-bold text-white text-lg">Pay & Submit</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}
