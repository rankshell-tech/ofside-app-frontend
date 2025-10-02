import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import OutlinedText from "@/components/OutlinedText"
import { LinearGradient } from "expo-linear-gradient";

export default function Leaderboard() {
  const navigation = useNavigation();
  const [city, setCity] = useState("");
  const [sport, setSport] = useState("Football");
  const [footballTab, setFootballTab] = useState("Striker");
  const [volleyballTab, setVolleyballTab] = useState("Top Spiker");

  const data = [
    { rank: 1, name: "Vikas", city: "Delhi", matches: 22, goals: 10, gsr: "45%" },
    { rank: 2, name: "Rahul", city: "Mumbai", matches: 18, goals: 8, gsr: "40%" },
    { rank: 3, name: "Amit", city: "Pune", matches: 15, goals: 6, gsr: "38%" },
     { rank: 1, name: "Vikas", city: "Delhi", matches: 22, goals: 10, gsr: "45%" },
    { rank: 2, name: "Rahul", city: "Mumbai", matches: 18, goals: 8, gsr: "40%" },
    { rank: 3, name: "Amit", city: "Pune", matches: 15, goals: 6, gsr: "38%" },
     { rank: 1, name: "Vikas", city: "Delhi", matches: 22, goals: 10, gsr: "45%" },
    { rank: 2, name: "Rahul", city: "Mumbai", matches: 18, goals: 8, gsr: "40%" },
    { rank: 3, name: "Amit", city: "Pune", matches: 15, goals: 6, gsr: "38%" },
    // add more
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
        <ImageBackground
            source={require("../../assets/images/background.png")} // Put your image in assets/images
            resizeMode="cover"
            className='flex-1'
        >
            {/* Header */}
            <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2" >
            <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
            </View>
            {/* Back Button + Title */}
            <View className="flex-row justify-center items-center px-4">
                <OutlinedText text="LEADER " fillColor="black" strokeColor="#FFF201"></OutlinedText>
                <OutlinedText text="BOARD"></OutlinedText>
            </View>

            {/* Filters */}
            <View className="flex-row justify-end mt-4">
                {(sport === "Badminton" || sport === "Tennis"|| sport === "Pickleball" )&& (
                    <LinearGradient
                        colors={["#FFF201", "#FFFFFF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="border rounded-xl overflow-hidden px-1 mx-1 flex-1"
                        >
                        <Picker
                            selectedValue={city}
                            dropdownIconColor="black"
                            className="h-10 text-black font-bold"
                            onValueChange={(itemValue) => setCity(itemValue)}
                        >
                            <Picker.Item label="Singles" value="Singles" />
                            <Picker.Item label="Doubles" value="Doubles" />
                        </Picker>
                    </LinearGradient>
                )}
                <LinearGradient
                    colors={["#FFF201", "#FFFFFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="border rounded-xl overflow-hidden px-1 mx-1 flex-1"
                    >
                    <Picker
                        selectedValue={city}
                        dropdownIconColor="black"
                        className="h-10 text-black font-bold"
                        onValueChange={(itemValue) => setCity(itemValue)}
                    >
                        <Picker.Item label="Select City" value="" />
                        <Picker.Item label="Delhi" value="Delhi" />
                        <Picker.Item label="Mumbai" value="Mumbai" />
                    </Picker>
                </LinearGradient>
                <LinearGradient
                    colors={["#FFF201", "#FFFFFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="border rounded-xl overflow-hidden px-1 mx-1 flex-1"
                    >
                    <Picker selectedValue={sport} onValueChange={(val) => setSport(val)}>
                        <Picker.Item label="Football" value="Football" />
                        <Picker.Item label="Volleyball" value="Volleyball" />
                        <Picker.Item label="Badminton" value="Badminton" />
                        <Picker.Item label="Tennis" value="Tennis" />
                        <Picker.Item label="Pickleball" value="Pickleball" />
                        <Picker.Item label="Basketball" value="Basketball" />
                    </Picker>
                </LinearGradient>
            </View>

            {/* Tabs */}
            {sport === "Football" &&(
                <View className="flex-row border border-gray-300 rounded-xl overflow-hidden mx-5 mt-4">
                    {["Striker", "Goalkeeper", "Midfielder"].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setFootballTab(tab)}
                            className={`flex-1 py-2 items-center ${
                                footballTab === tab ? "bg-black" : ""
                            }`}
                        >
                            <Text
                            className={`${
                                footballTab === tab ? "text-white font-bold" : "text-black"
                            }`}
                            >
                            {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            {sport === "Volleyball" &&(
                <View className="flex-row border border-gray-300 rounded-xl overflow-hidden mx-5 mt-4">
                    {["Top Spiker", "Service Master"].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setVolleyballTab(tab)}
                            className={`flex-1 py-2 items-center ${
                                volleyballTab === tab ? "bg-black" : ""
                            }`}
                        >
                            <Text
                            className={`${
                                volleyballTab === tab ? "text-white font-bold" : "text-black"
                            }`}
                            >
                            {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Leaderboard Table */}
            <ScrollView className="mt-4 p-2">
                <View>
                    {/* Table Header */}
                    <View className="flex-row bg-gray-200 py-2 px-2 border-b">
                        <Text className="flex-[0.5] font-bold text-[10px] text-center mr-1">RANK</Text>
                        <Text className="flex-[1.5] font-bold text-[10px]">NAME</Text>
                        <Text className="flex-[1.2] font-bold text-[10px]">CITY</Text>
                        <Text className="flex-[1] font-bold text-[10px] text-center">MATCHES</Text>
                        <Text className="flex-[1] font-bold text-[10px] text-center">
                            {
                                (sport === "Football" && "GOALS") ||
                                (sport === "Volleyball" && "SPIKES") ||
                                ((sport === "Badminton" || sport === "Tennis" || sport === "Pickleball") && "POINTS") ||
                                ( sport === "Basketball" && "BASKETS")
                            }
                        </Text>
                        <Text className="flex-[1] font-bold text-[10px] text-center">GSR</Text>
                    </View>

                    {/* Table Rows */}
                    {data.map((item, index) => (
                    <View key={index} className="flex-row py-3 px-2 border-b bg-blue-800">
                        <Text
                        className={`flex-[0.5] text-[12px] text-center font-bold mr-1 ${
                            index < 3 ? "text-[#FFF201]" : "text-white"
                        }`}
                        >
                        {item.rank}
                        </Text>
                        <Text
                        className={`flex-[1.5] text-[12px] font-bold ${
                            index < 3 ? "text-[#FFF201]" : "text-white"
                        }`}
                        >
                        {item.name}
                        </Text>
                        <Text
                        className={`flex-[1.2] text-[12px] font-bold ${
                            index < 3 ? "text-[#FFF201]" : "text-white"
                        }`}
                        >
                        {item.city}
                        </Text>
                        <Text
                        className={`flex-[1] text-[12px] text-center font-bold ${
                            index < 3 ? "text-[#FFF201]" : "text-white"
                        }`}
                        >
                        {item.matches}
                        </Text>
                        <Text
                        className={`flex-[1] text-[12px] text-center font-bold ${
                            index < 3 ? "text-[#FFF201]" : "text-white"
                        }`}
                        >
                        {item.goals}
                        </Text>
                        <Text
                        className={`flex-[1] text-[12px] text-center font-bold ${
                            index < 3 ? "text-[#FFF201]" : "text-white"
                        }`}
                        >
                        {item.gsr}
                        </Text>
                    </View>
                    ))}
                </View>
            </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
