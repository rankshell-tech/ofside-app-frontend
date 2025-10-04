// import { useTheme } from "@/hooks/useTheme";
// import { FontAwesome, Ionicons } from "@expo/vector-icons";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Picker } from "@react-native-picker/picker";
// import { useNavigation } from "@react-navigation/native";
// import { LinearGradient } from "expo-linear-gradient";
// import React, { useEffect, useState } from "react";
// import {
//     Animated,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function Community() {
//   const theme = useTheme();
//   const navigation = useNavigation();
//   const [progress] = useState(new Animated.Value(0));
//   const [displayProgress, setDisplayProgress] = useState(0);

//   useEffect(() => {
//     Animated.timing(progress, {
//       toValue: 1,
//       duration: 4000, // 4s fake loading
//       useNativeDriver: false,
//     }).start();
//     const listener = progress.addListener(({ value }) => {
//       setDisplayProgress(Math.round(value * 80));
//     });
//     return () => progress.removeListener(listener);
//   }, []);

//   const widthInterpolated = progress.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0%", "80%"],
//   });

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       {/* Header */}
//       <LinearGradient colors={["#FFF201", "#FFFFFF"]} className="px-4">
//         <View className="flex-col justify-center items-center mt-72 mb-20">
//             {/* Progress Bar */}
//             <View className="w-60 h-5 border-2 rounded-full overflow-hidden mt-12" style={{ backgroundColor: theme.colors.primary }}>
//                 <Animated.View
//                   style={{
//                       width: widthInterpolated,
//                       height: "100%",
//                       backgroundColor: "black",
//                   }}
//                 />
//             </View>
//             <Text className="mt-2 text-2xl italic">
//               {displayProgress}%
//             </Text>

//             {/* Loading text */}
//             <Text className="mt-8 text-center text-base font-bold text-gray-800">
//                 Please wait while we are cooking{" "}
//                 <Text className="text-blue-700 font-bold">
//                 community engagement ecosystem
//                 </Text>{" "}
//                 for you!
//             </Text>
//         </View>

//       </LinearGradient>
//     </SafeAreaView>
//   );
// }

// screens/UpcomingMatches.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Animated
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import OutlinedText from "@/components/OutlinedText";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useTheme } from "@/hooks/useTheme";

const matches = [
  {
    type: "Individual/Tournament match",
    sport: "Football",
    venue: "Venue Name",
    city: "New Delhi",
    hostName: "Host Name",
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


export default function UpcomingMatches() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [progress] = useState(new Animated.Value(0));
  const [displayProgress, setDisplayProgress] = useState(0);

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
  <TouchableOpacity className="border bg-gray-300 rounded-lg mb-4 p-4 mx-2">
          {/* Match Info */}
          <View className="flex-row justify-between items-center">
              <View>
                  <Text className="text-xs font-bold">
                      Individual/Tournament match | Football
                  </Text>
                  <Text className="text-[10px]">
                      {match.venue} | {match.city}
                  </Text>
              </View>
                  <View className="flex-row items-center border bg-blue-700 border-blue-700 rounded-full px-1 mr-1">
                      <Text className="text-white font-bold text-[10px] p-1">{match.tag}</Text>
                  </View>
          </View>

          <View className="flex-1 mt-2">
            <View
                style={{ backgroundColor: theme.colors.grey }}
                className="items-center w-20 h-20 rounded-full justify-center shadow"
            >
                <FontAwesome name="user" size={40} color={theme.colors.accent} />
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-bold mt-4">{match.hostName}</Text>
              <View className="flex-col">
                <View className="flex-row">
                    <View className="w-24 h-3 border rounded-full overflow-hidden bg-white">
                        <Animated.View
                              style={{
                                  width: widthInterpolated,
                                  height: "100%",
                                  backgroundColor: theme.colors.primary,
                              }}
                            />
                    </View>

                    <Text className="text-xs ml-1">
                      {match.joined}/{match.total} joined
                    </Text>
                </View>

                <Text className="text-xs font-bold">
                  {match.date} | {match.time}
                </Text>
              </View>
              <TouchableOpacity>
                <LinearGradient
                  colors={["#3EDB89", "#2ECC71"]}
                  className="px-4 py-1 rounded-full"
                >
                  <Text className="text-white font-bold text-xs">Request/Join</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
  </TouchableOpacity>
);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-2 my-5">
          <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2" >
              <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity className="border bg-[#FFF201] p-2 rounded-lg">
              <Text className="text-sm font-bold">Host a Game  + </Text>
            </TouchableOpacity>
          </View>
      </View>
      {/* 🔹 Banner */}
      <LinearGradient
        colors={["#5AA5F0", "#9C5AF0"]}
        className="rounded-3xl m-2 p-5 flex-row items-center"
      >
        <OutlinedText text="Welcome!" fillColor="white" strokeColor="red"></OutlinedText>
        {/* <Text className="text-lg text-white">TO OFSIDE COMMUNITY</Text> */}
      </LinearGradient>

      {/* 🔹 Filter Row */}
      <View className="flex-row justify-around items-center mt-3 px-2">
        <TouchableOpacity className="bg-[#FFF201] px-3 py-2 border rounded-full flex-row items-center">
          <Text className="mr-2 text-sm font-medium">Sort By</Text>
          <Ionicons name="swap-vertical" size={16} color="black" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-[#FFF201] px-3 py-2 border rounded-full flex-row items-center">
          <Text className="mr-2 text-sm font-medium">Badminton</Text>
          <Entypo name="chevron-down" size={16} color="black" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-[#FFF201] px-3 py-2 border rounded-full flex-row items-center">
          <Text className="mr-2 text-sm font-medium">Filter By</Text>
          <Ionicons name="grid" size={16} color="black" />
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
      <View className="flex-row border border-gray-300 bg-gray-300 rounded-xl overflow-hidden mx-5 my-4">
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
    </SafeAreaView>
  );
}

