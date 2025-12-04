import React, { useState, useEffect, JSX } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Image,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Court, Venue } from "@/types";
import { useNewVenue } from "@/hooks/useNewVenue";

// Day mapping: Mon=1, Tue=2, ..., Sun=7
const DAY_MAP: { [key: string]: number } = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

const DAY_REVERSE_MAP: { [key: number]: string } = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  7: "Sun",
};

// Initial court structure matching the form
interface CourtFormData {
  courtName: string;
  surfaceType: string;
  sportType: string;
  slotDuration: string;
  maxBooking: string;
  price: string;
  peakEnabled: boolean;
  peakDays: string[];
  peakStart: Date | null;
  peakEnd: Date | null;
  peakPrice: string;
  images: (string | undefined)[];
}

const initialCourt: CourtFormData = {
  courtName: "",
  surfaceType: "",
  sportType: "",
  slotDuration: "",
  maxBooking: "",
  price: "",
  peakEnabled: false,
  peakDays: [],
  peakStart: null,
  peakEnd: null,
  peakPrice: "",
  images: [undefined, undefined, undefined, undefined, undefined],
};

// Floating Label Input Components
const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = "#9CA3AF",
  keyboardType = "default",
  required = false,
  className = "",
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  required?: boolean;
  className?: string;
}) => (
  <View className={`mt-6 ${className}`}>
    <View className="absolute -top-2 left-4 bg-white px-2 z-10">
      <Text className="text-xs font-semibold text-gray-700">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
    </View>
    <View className="border-2 border-gray-300 rounded-2xl px-4 py-1 bg-white">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        className="text-gray-900 py-3 text-base"
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

const FloatingLabelPicker = ({
  label,
  value,
  onPress,
  items,
  required = false,
  className = "",
}: {
  label: string;
  value: string;
  onPress: () => void;
  items: { label: string; value: string }[];
  required?: boolean;
  className?: string;
}) => (
  <View className={`mt-6 ${className}`}>
    <View className="absolute -top-2 left-4 bg-white px-2 z-10">
      <Text className="text-xs font-semibold text-gray-700">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
    </View>
    <TouchableOpacity
      onPress={onPress}
      className="border-2 border-gray-300 rounded-2xl px-4 py-4 flex-row justify-between items-center bg-white"
    >
      <Text className={`flex-1 text-base ${value ? 'text-gray-900' : 'text-gray-500'}`}>
        {value || `Select ${label}`}
      </Text>
      <Entypo name="chevron-down" size={20} color="#6B7280" />
    </TouchableOpacity>
  </View>
);


// Picker Modal Component
const PickerModal = ({
  visible,
  value,
  items,
  onValueChange,
  onClose,
  title,
}: {
  visible: boolean;
  value: string;
  items: { label: string; value: string }[];
  onValueChange: (value: string) => void;
  onClose: () => void;
  title: string;
}) => {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-black/40 bg-opacity-50 justify-center items-center z-50">
      <View className="bg-white rounded-2xl w-11/12 max-w-sm">
        <View className="p-4 border-b border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 text-center">{title}</Text>
        </View>
        <ScrollView className="max-h-80">
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                onValueChange(item.value);
                onClose();
              }}
              className={`px-4 py-3 border-b border-gray-100 ${
                value === item.value ? 'bg-yellow-50' : 'bg-white'
              }`}
            >
              <Text className={`text-base ${
                value === item.value ? 'text-gray-900 font-semibold' : 'text-gray-700'
              }`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          onPress={onClose}
          className="p-4 border-t border-gray-200"
        >
          <Text className="text-red-500 font-semibold text-center">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FloatingLabelTimePicker = ({
  label,
  value,
  onPress,
  placeholder = "Select Time",
  required = false,
  className = "",
}: {
  label: string;
  value: string;
  onPress: () => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) => (
  <View className={`mt-6 ${className}`}>
    <View className="absolute -top-2 left-4 bg-white px-2 z-10">
      <Text className="text-xs font-semibold text-gray-700">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
    </View>
    <TouchableOpacity
      onPress={onPress}
      className="border-2 border-gray-300 rounded-2xl px-4 py-4 bg-white"
    >
      <Text className={`text-base text-center ${value ? 'text-gray-900' : 'text-gray-500'}`}>
        {value || placeholder}
      </Text>
    </TouchableOpacity>
  </View>
);

const FloatingLabelImageUpload = ({
  label,
  images,
  onImagePick,
  required = false,
  className = "",
}: {
  label: string;
  images: (string | undefined)[];
  onImagePick: (imgIndex: number) => void;
  required?: boolean;
  className?: string;
}) => (
  <View className={`mt-6 ${className}`}>
    <View className="absolute -top-2 left-4 bg-white px-2 z-10">
      <Text className="text-xs font-semibold text-gray-700">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
    </View>
    <View className="border-2 border-gray-300 rounded-2xl p-4 bg-white">
      <View className="flex-row flex-wrap justify-between">
        {["Cover", "Logo", "Image 3", "Image 4", "Image 5"].map((imgLabel, imgIndex) => (
          <TouchableOpacity
            key={imgIndex}
            onPress={() => onImagePick(imgIndex)}
            className={`w-[48%] h-28 border-2 rounded-xl mb-3 justify-center items-center ${
              images && images[imgIndex]
                ? "border-green-500 bg-green-50"
                : imgIndex < 2
                ? "border-red-300 bg-red-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            {images && images[imgIndex] ? (
              <Image
                source={{ uri: images[imgIndex]! }}
                className="w-full h-full rounded-xl"
                resizeMode="cover"
              />
            ) : (
              <View className="items-center">
                <MaterialIcons 
                  name="photo-camera" 
                  size={24} 
                  color={imgIndex < 2 ? "#EF4444" : "#6B7280"} 
                />
                <Text className={`text-xs mt-2 font-medium ${imgIndex < 2 ? "text-red-500" : "text-gray-500"}`}>
                  {imgLabel} {imgIndex < 2 ? "*" : ""}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </View>
);



export default function AddCourts() {
  const navigation = useNavigation();
  const { currentNewVenue, updateVenuePartial } = useNewVenue();

  const [courts, setCourts] = useState<CourtFormData[]>([]);
  const [activeCourtIndex, setActiveCourtIndex] = useState(0);
  const [showPickerModal, setShowPickerModal] = useState<{
    type: 'surface' | 'sport' | 'duration' | null;
    index: number;
  }>({ type: null, index: 0 });

  // 🔹 time picker state
  const [showPicker, setShowPicker] = useState<{
    mode: "open" | "close" | null;
    index: number | null;
  }>({ mode: null, index: null });




  // Picker options
  const surfaceTypes = [
    { label: "Select Surface Type", value: "" },
    { label: "Natural Grass", value: "Natural Grass" },
    { label: "Artificial Turf", value: "Artificial Turf" },
    { label: "Concrete", value: "Concrete" },
    { label: "Wooden", value: "Wooden" },
    { label: "Synthetic", value: "Synthetic" },
    { label: "Clay", value: "Clay" },
  ];

  const sportTypes = [
    { label: "Select Sport Type", value: "" },
    { label: "Football", value: "Football" },
    { label: "Tennis", value: "Tennis" },
    { label: "Badminton", value: "Badminton" },
    { label: "Pickle Ball", value: "Pickle Ball" },
    { label: "Basketball", value: "Basketball" },
    { label: "Volleyball", value: "Volleyball" },
  ];

const slotDurations = [
  { label: "Select Duration", value: "" },
  { label: "30 minutes", value: "30 minutes" },
  { label: "1 hour", value: "1 hour" },
  { label: "2 hours", value: "2 hours" },
  { label: "3 hours", value: "3 hours" },
  { label: "4 hours", value: "4 hours" },
  { label: "5 hours", value: "5 hours" },
];

  // Load courts from Redux on mount
useEffect(() => {
  const storedCourts = currentNewVenue?.rawVenueData?.courts;
  if (storedCourts && storedCourts.length > 0) {
    const formCourts: CourtFormData[] = storedCourts.map((court: any) => ({
      courtName: court.name || "",
      surfaceType: court.surfaceType || "",
      sportType: court.sportType || "",
      slotDuration: court.slotDuration ? 
        (court.slotDuration === 0.5 ? "30 minutes" : `${court.slotDuration} hour${court.slotDuration !== 1 ? 's' : ''}`) : 
        "",
      maxBooking: court.maxPeople?.toString() || "",
      price: court.pricePerSlot?.toString() || "",
      peakEnabled: court.peakEnabled || false,
      peakDays: court.peakDays ? court.peakDays.map((d: number) => DAY_REVERSE_MAP[d] || "") : [],
      peakStart: court.peakStart ? new Date(`2000-01-01T${court.peakStart}`) : null,
      peakEnd: court.peakEnd ? new Date(`2000-01-01T${court.peakEnd}`) : null,
      peakPrice: court.peakPricePerSlot?.toString() || "",
      images: [
        court.images?.cover,
        court.images?.logo,
        ...(court.images?.others || []),
      ].slice(0, 5),
    }));
    setCourts(formCourts);
  } else {
    const initialCourts = [{ ...initialCourt }];
    setCourts(initialCourts);
  }
}, [currentNewVenue?.rawVenueData?.courts]);

  // Safe getter for current court
  const getCurrentCourt = () => {
    return courts[activeCourtIndex] || courts[0] || initialCourt;
  };

  const updateCourt = (index: number, field: string, value: any) => {
    const newCourts = [...courts];
    // Ensure the court exists at the index
    if (!newCourts[index]) {
      newCourts[index] = { ...initialCourt };
    }

      // If updating slotDuration, parse it
    (newCourts[index] as any)[field] = value;
   
    setCourts(newCourts);
    saveCourtsToRedux(newCourts);
  };
// Helper function to format slot duration for display
const formatSlotDurationForDisplay = (value:  number | string): string => {
  console.log(value)
  if (!value) return "";
  if (value == 0.5 || value == .5) return "30 min";
  if (typeof value === "string" && value.includes("hour")) return value; // Already formatted
  return `${value} hour${value === "1" ? "" : "s"}`;
};


  const formatTime = (date: Date) => {
    if (!date) return "";
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  // Convert CourtFormData[] to Court[] for Redux
const convertToCourtArray = (formCourts: CourtFormData[]): Court[] => {
  return formCourts.map((formCourt) => {
    
    // Parse slot duration from display text to number
    let slotDuration = 0;
    if (formCourt.slotDuration) {
      if (formCourt.slotDuration.includes("30")) {
        slotDuration = 0.5;
      } else {
        // Extract the number from the string (e.g., "1 hour" -> 1)
        const match = formCourt.slotDuration.match(/(\d+)/);
        if (match) {
          slotDuration = parseFloat(match[1]);
        }
      }
    }

    const images = {
      cover: formCourt.images[0],
      logo: formCourt.images[1],
      others: formCourt.images.slice(2).filter(Boolean) as string[],
    };

    return {
      name: formCourt.courtName,
      venue: "",
      sportType: formCourt.sportType,
      surfaceType: formCourt.surfaceType || undefined,
      slotDuration: slotDuration, // Store as number (0.5, 1, 2, etc.)
      maxPeople: parseInt(formCourt.maxBooking) || 0,
      pricePerSlot: parseFloat(formCourt.price) || 0,
      peakEnabled: formCourt.peakEnabled || false,
      peakDays: formCourt.peakDays.map((d) => DAY_MAP[d]).filter(Boolean),
      peakStart: formCourt.peakStart ? formatTime(formCourt.peakStart) : undefined,
      peakEnd: formCourt.peakEnd ? formatTime(formCourt.peakEnd) : undefined,
      peakPricePerSlot: formCourt.peakEnabled ? parseFloat(formCourt.peakPrice) || 0 : undefined,
      images: Object.keys(images).length > 0 ? images : undefined,
      isActive: true,
    } as Court;
  });
};

  const saveCourtsToRedux = (formCourts: CourtFormData[]) => {
    if (!updateVenuePartial) {
      console.error('updateVenuePartial is not available');
      return;
    }
    const courtArray = convertToCourtArray(formCourts);
    updateVenuePartial({ 
      rawVenueData: {
        ...(currentNewVenue?.rawVenueData || {}),
        courts: courtArray
      }
    } as Partial<Venue>);
  };

  const addCourt = () => {
    const newCourts = [...courts, { ...initialCourt }];
    setCourts(newCourts);
    setActiveCourtIndex(newCourts.length - 1);
    saveCourtsToRedux(newCourts);
  };

  const removeCourt = (index: number) => {
    if (courts.length <= 1) {
      Alert.alert("Cannot Remove", "At least one court is required");
      return;
    }

    Alert.alert(
      "Remove Court",
      "Are you sure you want to remove this court?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const newCourts = courts.filter((_, i) => i !== index);
            setCourts(newCourts);
            setActiveCourtIndex(Math.max(0, index - 1));
            saveCourtsToRedux(newCourts);
          },
        },
      ]
    );
  };

  const pickImage = async (courtIndex: number, imgIndex: number) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newCourts = [...courts];
      // Ensure the court exists
      if (!newCourts[courtIndex]) {
        newCourts[courtIndex] = { ...initialCourt };
      }
      newCourts[courtIndex].images[imgIndex] = result.assets[0].uri;
      setCourts(newCourts);
      saveCourtsToRedux(newCourts);
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (showPicker.index === null) return;
    if (selectedDate) {
      const newCourts = [...courts];
      // Ensure the court exists
      if (!newCourts[showPicker.index!]) {
        newCourts[showPicker.index!] = { ...initialCourt };
      }
      if (showPicker.mode === "open") {
        newCourts[showPicker.index!].peakStart = selectedDate;
      } else if (showPicker.mode === "close") {
        newCourts[showPicker.index!].peakEnd = selectedDate;
      }
      setCourts(newCourts);
      saveCourtsToRedux(newCourts);
    }
    setShowPicker({ mode: null, index: null });
  };

  const toggleDay = (courtIndex: number, day: string) => {
    const newCourts = [...courts];
    // Ensure the court exists
    if (!newCourts[courtIndex]) {
      newCourts[courtIndex] = { ...initialCourt };
    }
    const days = newCourts[courtIndex].peakDays;
    if (days.includes(day)) {
      newCourts[courtIndex].peakDays = days.filter((d) => d !== day);
    } else {
      newCourts[courtIndex].peakDays = [...days, day];
    }
    setCourts(newCourts);
    saveCourtsToRedux(newCourts);
  };

  const validateCourt = (court: CourtFormData): boolean => {
    if (!court?.courtName?.trim()) return false;
    if (!court?.sportType) return false;
    if (!court?.slotDuration) return false;
    if (!court?.maxBooking) return false;
    if (!court?.price) return false;
    if (!court?.images?.[0] || !court?.images?.[1]) return false;
    return true;
  };

  const handleNext = () => {
    const invalidCourts = courts.filter(court => !validateCourt(court));
    if (invalidCourts.length > 0) {
      Alert.alert(
        "Incomplete Courts",
        "Please fill all required fields for each court (marked with *)",
        [{ text: "OK" }]
      );
      return;
    }
    
    saveCourtsToRedux(courts);
    router.push("/venue/review");
  };

  // Get current court safely
  const currentCourt = getCurrentCourt();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}

      <View className="">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full border-2 border-gray-200 items-center justify-center mr-3"
          >
            <Entypo name="chevron-left" size={20} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">Add Courts</Text>
            <Text className="text-sm text-gray-600 mt-1">
              Add details for each court in your venue
            </Text>
          </View>
        </View>

        {/* Court Tabs */}
        {courts.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
            <View className="flex-row space-x-2">
              {courts.map((court, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setActiveCourtIndex(index)}
                  className={`px-4 py-2 rounded-full border-2 ${
                    activeCourtIndex === index
                      ? "bg-[#FFF201] border-[#F59E0B]"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-medium text-sm ${
                      activeCourtIndex === index ? "text-gray-900" : "text-gray-600"
                    }`}
                  >
                    Court {index + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <LinearGradient
          colors={["#FFFDF6", "#FFFFFF"]}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Current Court Form */}
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <View className="flex-row justify-between items-center mb-6">
                <View>
                  <Text className="font-bold text-xl text-gray-900">
                    Court {activeCourtIndex + 1}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {validateCourt(currentCourt) ? "✓ All required fields completed" : "Fill all required fields (*)"}
                  </Text>
                </View>
                {courts.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeCourt(activeCourtIndex)}
                    className="w-10 h-10 rounded-full bg-red-50 items-center justify-center border border-red-200"
                  >
                    <FontAwesome name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Court Name */}
              <FloatingLabelInput
                label="Court Name"
                value={currentCourt.courtName}
                onChangeText={(text) => updateCourt(activeCourtIndex, "courtName", text)}
                placeholder="Enter court name"
                required={true}
              />

              {/* Surface Type */}
              <FloatingLabelPicker
                label="Surface Type"
                value={currentCourt.surfaceType}
                onPress={() => setShowPickerModal({ type: 'surface', index: activeCourtIndex })}
                items={surfaceTypes}
              />

              {/* Court Images */}
              <FloatingLabelImageUpload
                label="Court Images"
                images={currentCourt.images}
                onImagePick={(imgIndex) => pickImage(activeCourtIndex, imgIndex)}
                required={true}
              />

              {/* Sport Type */}
              <FloatingLabelPicker
                label="Sport Type"
                value={currentCourt.sportType}
                onPress={() => setShowPickerModal({ type: 'sport', index: activeCourtIndex })}
                items={sportTypes}
                required={true}
              />

              {/* Slot Duration */}
<FloatingLabelPicker
  label="Slot Duration"
  value={currentCourt.slotDuration} // Now this is the display text like "30 minutes"
  onPress={() => setShowPickerModal({ type: 'duration', index: activeCourtIndex })}
  items={slotDurations}
  required={true}
/>
              {/* Max Booking */}
              <FloatingLabelInput
                label="Max Booking Per Slot"
                value={currentCourt.maxBooking}
                onChangeText={(text) => updateCourt(activeCourtIndex, "maxBooking", text)}
                placeholder="Enter max number of people"
                keyboardType="numeric"
                required={true}
              />

              {/* Price */}
              <FloatingLabelInput
                label="Price Per Slot (₹)"
                value={currentCourt.price}
                onChangeText={(text) => updateCourt(activeCourtIndex, "price", text)}
                placeholder="Enter price per slot"
                keyboardType="numeric"
                required={true}
              />

              {/* Peak Hour Settings */}
              <View className="mt-6">
                <View className="flex-row justify-between items-center p-4 bg-orange-50 rounded-xl border-2 border-orange-100">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800 text-base">
                      Peak Hour Pricing
                    </Text>
                    <Text className="text-xs text-gray-600 mt-1">
                      Set different prices for peak hours
                    </Text>
                  </View>
                  <Switch
                    value={currentCourt.peakEnabled}
                    onValueChange={() =>
                      updateCourt(activeCourtIndex, "peakEnabled", !currentCourt.peakEnabled)
                    }
                    trackColor={{ false: "#D1D5DB", true: "#FFF201" }}
                    thumbColor={currentCourt.peakEnabled ? "#F59E0B" : "#F9FAFB"}
                  />
                </View>
              </View>

              {/* Peak Settings */}
              {currentCourt.peakEnabled && (
                <View className="bg-orange-50 p-5 rounded-xl mt-4 border-2 border-orange-100">
                  <Text className="font-bold text-gray-800 text-lg mb-4">Peak Hour Settings</Text>
                  
                  {/* Peak Days */}
                  <View className="mb-6">
                    <Text className="font-semibold text-gray-800 mb-3">Peak Days</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <TouchableOpacity
                            key={day}
                            onPress={() => toggleDay(activeCourtIndex, day)}
                            className={`px-3 py-2 rounded-lg border-2 ${
                              currentCourt.peakDays.includes(day)
                                ? "bg-[#FFF201] border-[#F59E0B]"
                                : "bg-white border-gray-300"
                            }`}
                          >
                            <Text
                              className={`font-medium text-sm ${
                                currentCourt.peakDays.includes(day)
                                  ? "text-gray-900"
                                  : "text-gray-600"
                              }`}
                            >
                              {day}
                            </Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  </View>

                  {/* Peak Hours */}
                  <View className="mb-6">
                    <Text className="font-semibold text-gray-800 mb-3">Peak Hours</Text>
                    <View className="flex-row justify-between items-center space-x-3">
                      <View className="flex-1">
                        <FloatingLabelTimePicker
                          label="Start Time"
                          value={currentCourt.peakStart ? formatTime(currentCourt.peakStart) : ""}
                          onPress={() => setShowPicker({ mode: "open", index: activeCourtIndex })}
                          placeholder="Start Time"
                          required={true}
                        />
                      </View>
                      <Text className="text-gray-600 font-medium mx-2">to</Text>
                      <View className="flex-1">
                        <FloatingLabelTimePicker
                          label="End Time"
                          value={currentCourt.peakEnd ? formatTime(currentCourt.peakEnd) : ""}
                          onPress={() => setShowPicker({ mode: "close", index: activeCourtIndex })}
                          placeholder="End Time"
                          required={true}
                        />
                      </View>
                    </View>
                  </View>

                  {showPicker.mode && showPicker.index === activeCourtIndex && (
                    <DateTimePicker
                      value={
                        showPicker.mode === "open"
                          ? currentCourt.peakStart || new Date()
                          : currentCourt.peakEnd || new Date()
                      }
                      mode="time"
                      is24Hour={false}
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={handleTimeChange}
                    />
                  )}

                  {/* Peak Price */}
                  <FloatingLabelInput
                    label="Peak Hours Price (₹)"
                    value={currentCourt.peakPrice}
                    onChangeText={(text) => updateCourt(activeCourtIndex, "peakPrice", text)}
                    placeholder="Enter peak hours price"
                    keyboardType="numeric"
                    required={true}
                  />
                </View>
              )}
            </View>

            {/* Add More Courts Button */}
            <TouchableOpacity
              onPress={addCourt}
              className="bg-white py-4 rounded-xl items-center mb-6 border-2 border-dashed border-gray-300"
            >
              <View className="flex-row items-center">
                <View className="w-6 h-6 rounded-full bg-[#FFF201] items-center justify-center mr-2">
                  <Text className="text-gray-900 font-bold">+</Text>
                </View>
                <Text className="text-gray-700 font-semibold text-base">Add Another Court</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>

      {/* Picker Modals */}
      <PickerModal
        visible={showPickerModal.type === 'surface' && showPickerModal.index === activeCourtIndex}
        value={currentCourt?.surfaceType || ''}
        items={surfaceTypes}
        onValueChange={(value) => updateCourt(activeCourtIndex, "surfaceType", value)}
        onClose={() => setShowPickerModal({ type: null, index: 0 })}
        title="Select Surface Type"
      />

      <PickerModal
        visible={showPickerModal.type === 'sport' && showPickerModal.index === activeCourtIndex}
        value={currentCourt?.sportType || ''}
        items={sportTypes}
        onValueChange={(value) => updateCourt(activeCourtIndex, "sportType", value)}
        onClose={() => setShowPickerModal({ type: null, index: 0 })}
        title="Select Sport Type"
      />
<PickerModal
  visible={showPickerModal.type === 'duration' && showPickerModal.index === activeCourtIndex}
  value={currentCourt?.slotDuration || ''}
  items={slotDurations}
  onValueChange={(value) => updateCourt(activeCourtIndex, "slotDuration", value)}
  onClose={() => setShowPickerModal({ type: null, index: 0 })}
  title="Select Slot Duration"
/>
      {/* Sticky Bottom Button */}
      <TouchableOpacity
          onPress={handleNext}
          className="absolute bottom-10 left-4 right-4 rounded-xl overflow-hidden shadow-lg"
          disabled={courts.filter(validateCourt).length === 0}
        >
          <LinearGradient
            colors={courts.filter(validateCourt).length > 0 ? ["#FFF201", "#F59E0B"] : ["#E5E7EB", "#9CA3AF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 m-4 py-4 items-center justify-center"
          >
            <Text className="font-bold text-black text-center text-lg p-4">
              Review Venue ({courts.filter(validateCourt).length}/{courts.length})
            </Text>
          </LinearGradient>
        </TouchableOpacity>
    </SafeAreaView>
  );
}