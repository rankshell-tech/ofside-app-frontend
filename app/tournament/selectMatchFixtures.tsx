import { useTheme } from "@/hooks/useTheme";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { JSX, useState } from "react";
import {
    ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

export default function SelectMatchFixtures() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { sport, format } = useLocalSearchParams<{ sport: string; format: string }>();
  const teams = Array(8).fill("");

  return (
    <SafeAreaView className="flex-1 bg-white">
        <ImageBackground
                source={require("../../assets/images/background.png")}
                resizeMode="cover"
                className="flex-1"
              >
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 px-2">
            <Ionicons onPress={()=> navigation.goBack()} name="chevron-back-circle-outline" size={22} color="black" />
        </View>
        {/* Title */}
        <Text className="text-xl ml-2 font-bold my-5">Select Match Fixtures</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-6">
        {/* Team slots */}
        {teams.map((t, i) => (
            <View key={i} className="flex-row items-center mb-10 relative">
                {/* Yellow Slot */}
                <TouchableOpacity className="flex-1 flex-row bg-[#fff201] py-1 px-5 rounded-full justify-between items-center">
                    <Text className="text-base font-semibold">
                        {t || ""}
                    </Text>
                    <AntDesign name="downcircleo" size={18} color="black" />
                </TouchableOpacity>
                {/* Connector line */}
                <View className="w-16 border border-dashed ml-2" />
                {/* Vertical line connecting horizontal lines */}
                {i % 2 === 0 && (
                    <View
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 12, // adjust based on your row height
                            height: 65, // adjust to match spacing between rows
                            width: 0,
                            borderRightWidth: 1,
                            borderStyle: "dashed",
                        }}
                    />
                )}
            </View>
        ))}
      </ScrollView>
        {/* Next Button */}
        <View className="absolute bottom-4 left-4 right-4">
            <TouchableOpacity onPress={() => router.push({
                                                        pathname: "/tournament/matchScreen",
                                                        params: { sport, format },})}
                              className="h-12">
            <View
                className="flex-1 items-center justify-center rounded-xl bg-[#FFF201]"
            >
                <Text className="font-extrabold text-base text-black">
                Next
                </Text>
            </View>
            </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
