// screens/VenueOnboarding.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// Reusable Input Component
type InputFieldProps = {
  label: string;
  sublabel: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({ label,sublabel, placeholder, value, onChangeText, error }) => (
  <View className="mb-5">
    <View className="flex-row items-center">
        <Text className="font-bold text-lg mb-1">{label} </Text>
        <Text className="text-[10px] text-gray-400"> {sublabel}</Text>
    </View>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#888"
      className={`rounded-xl px-4 py-3 border ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
  </View>
);

export default function VenueOnboarding() {
  const navigation = useNavigation();

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [form, setForm] = useState({
    brandName: "Xyz turfs",
    contactNumber: "Xyz turfs",
    email: "Xyz turfs",
    ownerName: "",
    ownerEmail: "Xyz turfs",
    ownerContact: "Xyz turfs",
    description: ""
  });
  const [open24, setOpen24] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);


  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <LinearGradient
            colors={["#FFF201", "#FFFFFF"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 0.4 }}
        >

            <View className="w-8 h-8 rounded-full border-4 mx-2 mt-2" >
              <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
            </View>
            <Text className="py-2 text-3xl font-bold px-5">Ofside Venue onboarding</Text>

            {/* Form */}
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100, padding:20 }} // 👈 leaves space for button
                showsVerticalScrollIndicator={false}
            >
                <InputField
                    label="Brand/Venue name"
                    sublabel="Users will see this name on Ofside"
                    placeholder="Xyz turfs"
                    value={form.brandName}
                    onChangeText={(text) => setForm({ ...form, brandName: text })}
                />

                <InputField
                    label="Venue primary contact number"
                    sublabel=""
                    placeholder="Xyz turfs"
                    value={form.contactNumber}
                    onChangeText={(text) => setForm({ ...form, contactNumber: text })}
                />

                <InputField
                    label="Venue communication email"
                    sublabel=""
                    placeholder="Xyz turfs"
                    value={form.email}
                    onChangeText={(text) => setForm({ ...form, email: text })}
                />

                <InputField
                    label="Owner’s Name"
                    sublabel=""
                    placeholder="Xyz turfs"
                    value={form.ownerName}
                    onChangeText={(text) => setForm({ ...form, ownerName: text })}
                    error={!form.ownerName} // red border if empty
                />

                <InputField
                    label="Owner’s email"
                    sublabel=""
                    placeholder="Xyz turfs"
                    value={form.ownerEmail}
                    onChangeText={(text) => setForm({ ...form, ownerEmail: text })}
                />

                <InputField
                    label="Owner’s contact number"
                    sublabel=""
                    placeholder="Xyz turfs"
                    value={form.ownerContact}
                    onChangeText={(text) => setForm({ ...form, ownerContact: text })}
                />

                <View className="mb-5">
                    <Text className="font-bold text-lg mb-1">Description</Text>
                    <TextInput
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={form.description}
                        onChangeText={(text) => setForm({ ...form, description: text })}
                        placeholder=""
                        placeholderTextColor="#888"
                        className={`rounded-xl px-4 py-3 border h-32 ${
                            !form.description ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                </View>
            </ScrollView>
        </LinearGradient>
        {/* Sticky Bottom Button */}
        <TouchableOpacity onPress={()=> router.push('/venue/addAddressDetails')} className="rounded-lg border overflow-hidden absolute bottom-0 right-0 mr-2 mb-10">
            <LinearGradient
                colors={["#FFF201", "#E0E0E0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-6 py-1 items-center rounded-full"
            >
                <Text className="font-bold text-black text-lg">Next</Text>
            </LinearGradient>
        </TouchableOpacity>
    </SafeAreaView>
  );
}
