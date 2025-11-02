import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  ImageBackground,
  Modal,
  TextInput
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";

const matches = [
  {
    type: "Individual/Tournament match",
    sport: "Football",
    venue: "Venue Name",
    city: "New Delhi",
    hostName: "Swarit",
    hostAvatar: "https://via.placeholder.com/100",
    joined: 4,
    total: 5,
    date: "09-11-2025",
    time: "4 pm Onwards",
    tag: "Beginner",
  },
  {
    type: "Individual/Tournament match",
    sport: "Badminton",
    venue: "Venue Name",
    city: "Mumbai",
    hostName: "Host 2",
    hostAvatar: "https://via.placeholder.com/100",
    joined: 2,
    total: 4,
    date: "10-11-2025",
    time: "6 pm Onwards",
    tag: "Intermediate",
  },
];
interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
  gameName?: string;
}


export default function Community() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [progress] = useState(new Animated.Value(0));
  const [displayProgress, setDisplayProgress] = useState(0);
  const [gameName, setGameName] = useState();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 4000, // 4s fake loading
      useNativeDriver: false,
    }).start();
    const listener = progress.addListener(({ value }) => {
      setDisplayProgress(Math.round(value * 80));
    });
    return () => progress.removeListener(listener);
  }, []);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "80%"],
  });


  // 🔹 Card Component
  const GameCard = ({ match }: any) => (
    <TouchableOpacity className="border bg-gray-300 rounded-lg mb-4 p-2 mx-2">
            {/* Match Info */}
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-xs font-bold">
                        {match.type} | {match.sport}
                    </Text>
                    <Text className="text-[10px]">
                        {match.venue} | {match.city}
                    </Text>
                </View>
                <View className="flex-col items-end mt-[-4]">
                  <Image
                    source={require("../../assets/images/fire.png")}
                    className="w-6 h-8" // smaller size
                    resizeMode="contain"
                  />
                  <View className="flex-row items-center bg-blue-700 rounded-full px-1 mt-1">
                    <Text className="text-white font-bold text-[9px] p-1">{match.tag}</Text>
                  </View>
                </View>
            </View>

            <View className="flex-1">
              <View
                  style={{ backgroundColor: theme.colors.grey }}
                  className="items-center w-20 h-20 rounded-full justify-center shadow"
              >
                  <FontAwesome name="user" size={60} color={theme.colors.accent} />
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="ml-5 text-md font-bold">{match.hostName}</Text>
                <View className="flex-col">
                  <View className="flex-row ml-2">
                      <View className="w-24 h-3 border rounded-full overflow-hidden bg-white">
                          <Animated.View
                                style={{
                                    width: widthInterpolated,
                                    height: "100%",
                                    backgroundColor: theme.colors.primary,
                                }}
                              />
                      </View>

                      <Text className="text-[8px] ml-1">
                        {match.joined}/{match.total} joined
                      </Text>
                  </View>

                  <Text className="text-xs font-extrabold">
                    {match.date} | {match.time}
                  </Text>
                </View>
                <View className="items-center">
                  {/* Small 'Free' badge */}
                  <View className="bg-[#FFF201] px-3 py-0.5 rounded-md -mb-1 z-10">
                    <Text className="text-black font-semibold text-xs">Free</Text>
                  </View>

                  {/* Main button */}
                  <TouchableOpacity onPress={() => {setGameName(match.hostName); setShowModal(true)}} activeOpacity={0.8}>
                    <LinearGradient
                      colors={["#3EDB89", "#2ECC71"]}
                      className="px-2 py-2 rounded-lg items-center shadow-md"
                    >
                      <Text className="text-white font-bold text-sm">Request/Join</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
          source={require("../../assets/images/background.png")} // Put your image in assets/images
          resizeMode="cover"
          className="flex-1"
      >
        {/* Header */}
        <View className="flex-row justify-end items-center px-2 my-5">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => router.push("/community/hostGame")} className="border bg-[#FFF201] p-2 rounded-lg">
                <Text className="text-[10px] font-bold">Host a Game  + </Text>
              </TouchableOpacity>
            </View>
        </View>
        {/* 🔹 Banner */}
        <View className="px-5">
          <Image source={require("../../assets/images/welcome.png")} className="w-full h-32 rounded-3xl" />
        </View>

        {/* 🔹 Filter Row */}
        <View className="flex-row justify-around items-center mt-3 px-2">
          <TouchableOpacity >
            <LinearGradient
              colors={["#FFF201", "#FFFFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="px-3 py-2 border rounded-2xl overflow-hidden flex-row items-center"
            >
              <Text className="mr-2 text-sm font-medium">Sort By</Text>
              <Ionicons name="swap-vertical" size={16} color="black" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity>
            <LinearGradient
              colors={["#FFF201", "#FFFFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="px-3 py-2 border  rounded-2xl overflow-hidden flex-row items-center"
            >
              <Text className="mr-2 text-sm font-medium">Badminton</Text>
              <Entypo name="chevron-down" size={16} color="black" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity>
            <LinearGradient
              colors={["#FFF201", "#FFFFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="px-3 py-2 border rounded-2xl overflow-hidden flex-row items-center"
            >
              <Text className="mr-2 text-sm font-medium">Filter By</Text>
              <Ionicons name="grid" size={16} color="black" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* 🔹 Match List */}
        <FlatList
          data={matches}
          renderItem={({ item }) => <GameCard match={item} />}
          keyExtractor={(item, i) => i.toString()}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
        {/* Tabs */}
        <View className="flex-row border border-gray-300 bg-gray-300 rounded-xl overflow-hidden mx-5 my-2">
            {["Recent ", "Upcoming"].map((tab) => (
                <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={`flex-1 py-2 items-center`}
                >
                    <Text
                    className={` ${
                        activeTab === tab ? "font-extrabold text-lg" : "text-md"
                    }`}
                    >
                    {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>

        <Modal visible={showModal} transparent animationType="fade">
          <View className="flex-1 bg-black/40">
            <View className="absolute bottom-0 right-0 left-0 bg-white border border-gray-300 rounded-t-3xl shadow-lg p-8">
              <Text className="text-center text-base font-medium text-gray-800 mb-3">
                Please confirm that you are interested in Play {gameName}'s Game?
              </Text>

              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 text-[10px] text-gray-700 h-20"
                textAlignVertical="top"
                placeholder="Any Remark/Message you want to add for the Host..."
                placeholderTextColor="#888"
                value={message}
                onChangeText={setMessage}
                multiline
              />

              <View className="flex-row justify-between mt-5">
                {/* Cancel Button */}
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  className="flex-1 border border-gray-400 py-2 rounded-lg mr-2"
                >
                  <Text className="text-center font-semibold text-gray-700">Cancel</Text>
                </TouchableOpacity>

                {/* Yes, Join Button */}
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  className="flex-1 bg-[#2ECC71] py-2 rounded-lg ml-2"
                >
                  <Text className="text-center font-semibold text-white">Yes, Join</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

