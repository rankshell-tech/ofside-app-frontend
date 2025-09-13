// app/(tabs)/EditProfile.tsx
import { useTheme } from "@/hooks/useTheme";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { JSX, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <View className="border border-black rounded-2xl px-4 py-1">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="text-center"
        />
      </View>
    )}
  </View>
);

export default function EditProfile() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [name, setName] = useState("Swarit Jain");
  const [number, setNumber] = useState("+91 83937 23823");
  const [email, setEmail] = useState("Swarit13@gmail.com");

  const [gender, setGender] = useState("Male");
  const [sport, setSport] = useState("Volleyball");

  const [dob, setDob] = useState(new Date(1997, 4, 13));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showSportPicker, setShowSportPicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient colors={["#FFE39C", "#FFFFFF"]} className="px-4">
        <View className="flex-row items-center mt-10">
          <TouchableOpacity>
            <Ionicons onPress={()=> navigation.goBack()} name="chevron-back-circle-outline" size={22} color="black" />
          </TouchableOpacity>
          <Text className="ml-2 text-lg font-bold">Edit Profile</Text>
        </View>

        {/* Profile Icon */}
        <View className="items-center">
          <View className="w-40 h-40 bg-white rounded-full items-center justify-center border border-gray-400" style={{backgroundColor: theme.colors.accent}}>
            <FontAwesome name="user" size={90} color="white" />
          </View>
          <TouchableOpacity className="absolute bottom-0 right-[35%] bg-white p-2 rounded-full border border-gray-400">
            <FontAwesome name="pencil" size={14} color="black" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Form */}
      <ScrollView className="px-6">
        <FloatingLabelInput
          label="Full name"
          value={name}
          onChangeText={setName}
        />
        <FloatingLabelInput
          label="Number"
          value={number}
          onChangeText={setNumber}
        />
        <FloatingLabelInput
          label="Email"
          value={email}
          onChangeText={setEmail}
        />

        {/* Gender Picker */}
        <FloatingLabelInput
          label="Gender"
          value={gender}
          isPicker
          onPress={() => setShowGenderPicker(true)}
          icon={<Ionicons name="chevron-down" size={18} color="black" />}
        />

        {/* DOB Picker */}
        <FloatingLabelInput
          label="Date of birth"
          value={formatDate(dob)}
          isPicker
          onPress={() => setShowDatePicker(true)}
          icon={<Ionicons name="calendar" size={18} color="black" />}
        />

        {/* Sport Picker */}
        <FloatingLabelInput
          label="Your favorite sport"
          value={sport}
          isPicker
          onPress={() => setShowSportPicker(true)}
          icon={<Ionicons name="chevron-down" size={18} color="black" />}
        />
      </ScrollView>

        {/* Update Button */}
        <TouchableOpacity className="mt-2 bg-transparent py-6">
          <Text className="text-center font-extrabold text-xl">Update</Text>
        </TouchableOpacity>

      {/* Gender Picker Modal */}
      <Modal visible={showGenderPicker} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white">
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => {
                setGender(itemValue);
                setShowGenderPicker(false);
              }}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>
      </Modal>

      {/* Sport Picker Modal */}
      <Modal visible={showSportPicker} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white">
            <Picker
              selectedValue={sport}
              onValueChange={(itemValue) => {
                setSport(itemValue);
                setShowSportPicker(false);
              }}
            >
              <Picker.Item label="Football" value="Football" />
              <Picker.Item label="Volleyball" value="Volleyball" />
              <Picker.Item label="Cricket" value="Cricket" />
              <Picker.Item label="Tennis" value="Tennis" />
            </Picker>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDob(selectedDate);
          }}
        />
      )}
    </SafeAreaView>
  );
}
