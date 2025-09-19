import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function PaymentModeScreen() {
  const navigation = useNavigation();
  const renderOption = (title: string, subtitle?: string, icon?: any, icon2?: any) => (
    <TouchableOpacity className="p-1 pl-5">
      <View className="flex-row justify-between items-center border p-1 w-[90%] rounded-lg bg-gray-100">
        <View className="flex-row items-center">
            <Text className="text-bold font-medium text-blue-600">{title}</Text>
            <Text className="text-sm text-blue-600 ml-1">{subtitle}</Text>
            {icon && <Image source={icon} className="w-12 h-6 mx-2" resizeMode="contain" />}
            {icon2 && <Image source={icon2} className="w-12 h-6" resizeMode="contain" />}
        </View>
        <Entypo name="chevron-with-circle-right" size={20} color="blue" />
      </View>
    </TouchableOpacity>
  );

  const renderSection = (label: string) => (
    <View className="mx-5 mt-8">
        <Text className="text-lg font-bold mt-2">{label}</Text>
        <View className="border-t my-1" style={{ width: "70%" }} />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
         <LinearGradient
                colors={["#FFF201", "#FFFFFF"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 0.8 }}
                className="p-1"
              >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3">
            <Ionicons onPress={()=> navigation.goBack()} name="chevron-back-circle-outline" size={22} color="black" />
            <Text className="font-bold text-xl ml-2">Payment mode</Text>
        </View>
        <ScrollView>
            {/* Suggested */}
            {renderSection("Suggested")}
            {renderOption("Paytm UPI", "", require("@/assets/images/paytm.png"))}
            {renderOption("Google Pay UPI", "", require("@/assets/images/gpay.png"))}
            {renderOption("PhonePe UPI", "", require("@/assets/images/phonepe.png"))}

            {/* Cards */}
            {renderSection("Cards")}
            {renderOption("Add credit/debit card", "", require("@/assets/images/mastercard.png"), require("@/assets/images/rupay.png"))}

            {/* Pay by any UPI app */}
            {renderSection("Pay by any UPI app")}
            {renderOption("Add new UPI ID", "", require("@/assets/images/upi.png"))}

            {/* Offside Wallet */}
            {renderSection("Offside wallet")}
            {renderOption("Offside wallet", "(add money)")}

            {/* Net banking */}
            {renderSection("Net banking")}
            {renderOption("Through net banking", "", require("@/assets/images/bank.png"))}
        </ScrollView>
        </LinearGradient>
    </SafeAreaView>
  );
}
