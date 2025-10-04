// app/(tabs)/EditProfile.tsx
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
import { router } from "expo-router";

// Floating Label Input component
const FloatingLabelInput = ({
  label,
  subLabel,
  value,
  onPress,
  onChangeText,
  isPicker,
  icon,
}: {
  label: string;
  subLabel: string;
  value: string;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
  isPicker?: boolean;
  icon?: JSX.Element;
}) => (
  <View className="mt-6">
    {/* Label */}
    <View className="flex-row absolute -top-2 left-4 bg-white px-1 z-10">
      <Text className="text-xs font-semibold">{label}</Text>
      <Text className="text-[10px] text-gray-400 italic">{subLabel}</Text>
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

export default function AddNewTeam() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [teamName, setTeamName] = useState("XYZ");
  const [number, setNumber] = useState("8393723823");
  const [captainName, setCaptainName] = useState("Swarit Jain");
  const [venue, setVenue] = useState("Delhi");
  const [email, setEmail] = useState("Swarit13@gmail.com")
  const [isLocationVisible, setLocationVisible] = useState(false);

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

  return (
    <SafeAreaView className="flex-1 bg-white">
        <ImageBackground
                source={require("../../assets/images/background.png")}
                resizeMode="cover"
                className="flex-1"
              >
        {/* Header */}
        <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2" >
          <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
        </View>
        {/* Title */}
        <Text className="text-xl ml-2 font-bold my-5">Add new team to the Tournament</Text>

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
            <Text className="text-[10px] ml-1">Add Team Logo</Text>
          </View>
        </View>

      {/* Form */}
        <FloatingLabelInput
          label="Team name"
          value={teamName}
          onChangeText={setTeamName}
          subLabel={""}
        />
        <FloatingLabelInput
          label="Team's captain"
          value={captainName}
          onChangeText={setCaptainName}
          subLabel={""}
        />
        <FloatingLabelInput
            label="Team location"
            value={venue}
            isPicker
            onPress={() => setLocationVisible(true)}
            icon={<AntDesign name="down-circle" size={18} color="black" />}
            subLabel={""}
        />
        <FloatingLabelInput
          label="Captain's number"
          value={number}
          onChangeText={setNumber}
          subLabel={"(optional)"}
        />
        <FloatingLabelInput
          label="Captain's email"
          value={email}
          onChangeText={setEmail}
          subLabel={"(optional)"}
        />
      </ScrollView>

        {/* Next Button */}
        <View className="absolute bottom-4 left-4 right-4">
            <TouchableOpacity onPress={()=> router.push('/tournament/teamAdded')} className="h-12">
                <View className="flex-1 items-center justify-center rounded-xl bg-[#FFF201]">
                    <Text className="font-extrabold text-base text-black">
                    Add Team
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
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
      </ImageBackground>
    </SafeAreaView>
  );
}
