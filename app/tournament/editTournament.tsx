import TimePicker from "@/components/TimePicker";
import { useTheme } from "@/hooks/useTheme";
import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SlidersHorizontal } from "lucide-react-native";
import React, { JSX, useState } from "react";
import {
    FlatList,
    ImageBackground,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

// Floating Label Input component
const FloatingLabelInput = ({
  label,
  value,
  onPress,
  onChangeText,
  isPicker,
  icon,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
  isPicker?: boolean;
  icon?: JSX.Element;
}) => (
  <View className="mt-6">
    {/* Label */}
    <View className="absolute -top-2 left-4 bg-white px-1 z-10">
      <Text className="text-xs font-semibold">{label}</Text>
    </View>

    {/* Input / Picker style */}
    {isPicker ? (
      <TouchableOpacity
        onPress={onPress}
        className="border border-black rounded-2xl px-4 py-4 flex-row justify-between items-center"
      >
        <Text className="flex-1 text-center">{value}</Text>
        {icon}
      </TouchableOpacity>
    ) : (
      <View className="border border-black rounded-2xl px-4 py-1 items-center">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="text-left"
        />
      </View>
    )}
  </View>
);

export default function EditTournament() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [name, setName] = useState("Swarit Jain");
  const [number, setNumber] = useState("+91 83937 23823");
  const [tournamentName, setTournamentName] = useState("Syx Tournament");
  const [venue, setVenue] = useState("Delhi");
  const [isLocationVisible, setLocationVisible] = useState(false);
  const { sport, format } = useLocalSearchParams<{ sport: string; format: string }>();

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
  const [fromDate, setFromDate] = useState("10");
  const [fromMonth, setFromMonth] = useState("January");

  const [toDate, setToDate] = useState("10");
  const [toMonth, setToMonth] = useState("January");

  const locations = [
    "Connaught Place",
    "Karol Bagh",
    "Chandni Chowk",
    "Hauz Khas",
    "Saket",
    "Dwarka",
    "Janakpuri",
    "Rohini",
    "Pitampura",
    "Lajpat Nagar",
    "Greater Kailash",
    "Vasant Kunj",
    "New Friends Colony",
    "Punjabi Bagh",
    "Shahdara",
  ];

  const categories = [
    "Open",
    "Corporate",
    "Community",
    "School",
    "Other",
    "Series",
    "College",
    "University",
  ];

  const formats = [
    "Knockout",
    "League",
    "Combination",
  ];
  const [selectedCategory, setSelectedCategory] = useState("School");
  const [selectedFormat, setSelectedFormat] = useState("Knockout");
  const [teams, setTeams] = useState("8");

  return (
    <SafeAreaView className="flex-1 bg-white">
        <ImageBackground
                source={require("../../assets/images/background.png")}
                resizeMode="cover"
                className="flex-1"
              >
        {/* Header */}
        <View className="flex-row items-center justify-between mt-2 mx-2">
          <View className="w-8 h-8 bg-white rounded-full border-4" >
            <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
          </View>
            <SlidersHorizontal onPress={() => router.push('/tournament/advanceTornamentSettings')} size={24} color="black" />
        </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-6">
        {/* Profile Icon */}
        <View className="items-center">
          <View className="w-40 h-40 bg-white rounded-full items-center justify-center border border-gray-400" style={{backgroundColor: theme.colors.accent}}>
            <FontAwesome name="user" size={90} color="white" />
          </View>
          <View className="flex-row items-center absolute bottom-0 right-[5%]">
            <TouchableOpacity className=" bg-white p-2 rounded-full border border-gray-400">
                <FontAwesome name="pencil" size={14} color="black" />
            </TouchableOpacity>
            <Text className="text-[10px] ml-1">Add Tournament Logo</Text>
          </View>
        </View>

      {/* Form */}
        <FloatingLabelInput
          label="Tornament name"
          value={tournamentName}
          onChangeText={setTournamentName}
        />
        <FloatingLabelInput
          label="Organizer name"
          value={name}
          onChangeText={setName}
        />
        <FloatingLabelInput
          label="Organizer number"
          value={number}
          onChangeText={setNumber}
        />
        <FloatingLabelInput
            label="Tournament venue location"
            value={venue}
            isPicker
            onPress={() => setLocationVisible(true)}
            icon={<AntDesign name="downcircleo" size={18} color="black" />}
        />
        <View className="flex-row justify-between my-5">
          <TimePicker
              label="From"
              value={fromDate}
              period={fromMonth}
              onChange={(val, per) => {setFromDate(val); setFromMonth(per)}}
              times={days}
              periodOptions={months}
            />
            <TimePicker
              label="To"
              value={toDate}
              period={toMonth}
              onChange={(val, per) => {setToDate(val); setToMonth(per)}}
              times={days}
              periodOptions={months}
            />
        </View>
        {/* Tournament Category */}
        <Text className="text-xl font-bold my-5">Tournament Category</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {categories.map((cat) => {
            const selected = cat === selectedCategory;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-full border ${
                  selected
                    ? "bg-[#fff201]"
                    : "bg-white"
                }`}
              >
                <Text className={`text-[12px] ${selected ? "font-bold" : ""}`}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tournament Format */}
        <Text className="text-xl font-bold my-5">Tournament Format</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {formats.map((f) => {
            const selected = f === selectedFormat;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setSelectedFormat(f)}
                className={`px-3 py-2 rounded-full border ${
                  selected
                    ? "bg-[#fff201]"
                    : "bg-white"
                }`}
              >
                <View className="flex-row items-center">
                  <Text className={`text-[12px] ${selected ? "font-bold" : ""}`}>
                    {f}
                  </Text>
                  {f === "Combination" && (
                    <Text className="text-[8px] ml-1">(mix of knockout and league)</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Number of Teams */}

        <FloatingLabelInput
            label="Number of teams/players will play in tournament"
            value={teams}
            isPicker
            icon={<AntDesign name="downcircleo" size={18} color="black" />}
        />
      </ScrollView>
        {/* Modal for Locations */}
        <Modal
            visible={isLocationVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setLocationVisible(false)}
        >
            <View className="flex-1 bg-black/40 justify-end">
            <View className="bg-white rounded-t-2xl p-4 max-h-[60%]">
                <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-bold">Select Location</Text>
                <Pressable onPress={() => setLocationVisible(false)}>
                    <Ionicons name="close" size={24} color="black" />
                </Pressable>
                </View>

                <FlatList
                data={locations}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                    className="py-3 border-b border-gray-200"
                    onPress={() => {
                        setVenue(item);
                        setLocationVisible(false);
                    }}
                    >
                    <Text className="text-base text-gray-800">{item}</Text>
                    </TouchableOpacity>
                )}
                />
            </View>
            </View>
        </Modal>

        {/* Next Button */}
        <View className="absolute bottom-4 left-4 right-4">
            <TouchableOpacity onPress={() => router.push({
                                        pathname: "/tournament/teamSelection",
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
