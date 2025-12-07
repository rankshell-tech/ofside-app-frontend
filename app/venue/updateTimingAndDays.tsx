import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { useNewVenue } from "@/hooks/useNewVenue";
import Constants from "expo-constants";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Helper function to parse time string to Date
const parseTimeString = (timeStr: string): Date | null => {
  if (!timeStr) return null;
  
  // If in "HH:mm AM/PM" format
  if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(timeStr)) {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    
    if (isNaN(hours) || isNaN(minutes)) return null;
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  
  // If in "HH:mm" format (24-hour)
  if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  
  return null;
};

export default function UpdateTimingAndDays() {
  const navigation = useNavigation();
  const { currentNewVenue, updateNewVenue } = useNewVenue();
  const user = useSelector((state: any) => state.auth.user);
  const params = useLocalSearchParams<{ venueId?: string }>();
  const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';
  
  // Determine if we're in edit mode
  const isEditMode = !!params.venueId;
  const venueId = params.venueId;
  
  const [is24Hours, setIs24Hours] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [openTime, setOpenTime] = useState<Date | null>(null);
  const [closeTime, setCloseTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<{
    mode: "open" | "close" | null;
  }>({ mode: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);

  // Fetch venue timing and days if in edit mode
  useEffect(() => {
    if (isEditMode && venueId) {
      fetchVenueTimingAndDays();
    } else if (currentNewVenue) {
      // Create mode: use Redux data
      setIs24Hours(currentNewVenue.is24HoursOpen || false);
      setSelectedDays((currentNewVenue as any)?.days || []);
      const openTimeStr = (currentNewVenue as any)?.openTime || "";
      const closeTimeStr = (currentNewVenue as any)?.closeTime || "";
      if (openTimeStr) {
        const parsed = parseTimeString(openTimeStr);
        if (parsed) setOpenTime(parsed);
      }
      if (closeTimeStr) {
        const parsed = parseTimeString(closeTimeStr);
        if (parsed) setCloseTime(parsed);
      }
    }
  }, [isEditMode, venueId]);

  const fetchVenueTimingAndDays = async () => {
    if (!venueId || !user?.accessToken) return;
    
    setIsFetching(true);
    try {
      const response = await fetch(`${API_URL}/api/venues/${venueId}`, {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch venue');
      }

      const result = await response.json();
      if (result.success && result.data?.venue) {
        const venue = result.data.venue;
        setIs24Hours(venue.is24HoursOpen || false);
        
        // Convert days from backend format if needed
        // Backend might store as array of strings or numbers
        let days: string[] = [];
        if (venue.days && Array.isArray(venue.days)) {
          days = venue.days.map((d: any) => {
            if (typeof d === 'number') {
              // Convert day number to day name (1=Mon, 2=Tue, etc.)
              const dayMap: { [key: number]: string } = {
                0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'
              };
              return dayMap[d] || String(d);
            }
            return String(d);
          });
        }
        setSelectedDays(days);
        
        // Parse times if they exist
        // Backend might store in different formats
        if (venue.openTime) {
          const parsed = parseTimeString(venue.openTime);
          if (parsed) setOpenTime(parsed);
        }
        if (venue.closeTime) {
          const parsed = parseTimeString(venue.closeTime);
          if (parsed) setCloseTime(parsed);
        }
      }
    } catch (error) {
      console.error('Error fetching venue:', error);
      Alert.alert('Error', 'Failed to load venue timing and days. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleTimeChange = (event: any, selected?: Date) => {
    if (showPicker.mode === "open" && selected) {
      setOpenTime(selected);
    } else if (showPicker.mode === "close" && selected) {
      setCloseTime(selected);
    }
    setShowPicker({ mode: null });
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const resetTime = () => {
    setOpenTime(null);
    setCloseTime(null);
  };

  const handleSaveAndNext = async () => {
    // Validation
    if (selectedDays.length === 0) {
      Alert.alert("Validation Error", "Please select at least one operational day");
      return;
    }

    if (!is24Hours && (!openTime || !closeTime)) {
      Alert.alert("Validation Error", "Please set both open and close times");
      return;
    }

    if (isEditMode && venueId) {
      // Update mode: Save to backend
      await handleUpdateTimingAndDays();
    } else {
      // Create mode: Update Redux and navigate
      if (currentNewVenue) {
        updateNewVenue({
          ...currentNewVenue,
          is24HoursOpen: is24Hours,
          days: selectedDays,
          openTime: openTime ? formatTime(openTime) : "",
          closeTime: closeTime ? formatTime(closeTime) : "",
        } as any);
      }
      // Navigate to next step
      router.push("/venue/addAddressDetails");
    }
  };

  const handleUpdateTimingAndDays = async () => {
    if (!venueId || !user?.accessToken) {
      Alert.alert('Error', 'Missing venue ID or authentication');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/venues/${venueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          is24HoursOpen: is24Hours,
          days: selectedDays,
          openTime: openTime ? formatTime(openTime) : "",
          closeTime: closeTime ? formatTime(closeTime) : "",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update timing and days');
      }

      Alert.alert('Success', 'Timing and days updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Error updating timing and days:', error);
      Alert.alert('Error', error.message || 'Failed to update timing and days. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const allFieldsFilled = selectedDays.length > 0 && (is24Hours || (openTime && closeTime));

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient
        colors={["#FFF201", "#FFFFFF"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0.4 }}
      >
        <View className="flex-row items-center justify-between px-4 pt-2">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-white/80 items-center justify-center shadow"
            android_ripple={{ color: "#00000010" }}
            style={{
              ...Platform.select({
                ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
              }),
            }}
          >
            <Entypo name="chevron-left" size={20} color="#111" />
          </Pressable>
          <Text className="text-lg font-bold">
            {isEditMode ? 'Update Timing & Days' : 'Set Timing & Days'}
          </Text>
          <View className="w-10" />
        </View>

        {/* Form */}
        <ScrollView
          style={{ position: 'relative', height: '80%' }}
          contentContainerStyle={{ paddingBottom: 50, padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {isFetching ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#FFF201" />
              <Text className="text-gray-600 mt-4">Loading timing and days...</Text>
            </View>
          ) : (
            <>
              {/* Days Selection */}
              <Text className="text-lg font-bold mb-3">
                Select the operational days
              </Text>
              <View className="flex-row flex-wrap justify-between mb-6">
                {DAYS.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      onPress={() => toggleDay(day)}
                      className={`w-[48%] py-3 px-2 rounded-lg mb-3 border ${
                        isSelected
                          ? "bg-green-500 border-green-500"
                          : "bg-white border-gray-400"
                      }`}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          isSelected ? "text-white" : "text-black"
                        }`}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* 24 hours toggle */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-base font-medium">
                  Is your venue open 24 hours?
                </Text>
                <Switch
                  value={is24Hours}
                  onValueChange={() => {
                    setIs24Hours(!is24Hours);
                    if (!is24Hours) {
                      resetTime();
                    }
                  }}
                  trackColor={{ false: "#ccc", true: "#4CAF50" }}
                />
              </View>

              {/* Open / Close time */}
              <View className="flex-row justify-between items-center mb-5">
                <TouchableOpacity
                  onPress={() => setShowPicker({ mode: "open" })}
                  className={`flex-1 py-3 border border-gray-400 rounded-lg mr-2 bg-white ${
                    is24Hours ? 'opacity-50' : 'opacity-100'
                  }`}
                  disabled={is24Hours}
                >
                  <Text className="text-center font-semibold">
                    {openTime ? formatTime(openTime) : "Open time"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={resetTime}
                  className="p-2"
                  disabled={is24Hours}
                >
                  <Ionicons
                    name="refresh"
                    size={20}
                    color={is24Hours ? "#ccc" : "#333"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowPicker({ mode: "close" })}
                  className={`flex-1 py-3 border border-gray-400 rounded-lg ml-2 bg-white ${
                    is24Hours ? 'opacity-50' : 'opacity-100'
                  }`}
                  disabled={is24Hours}
                >
                  <Text className="text-center font-semibold">
                    {closeTime ? formatTime(closeTime) : "Close time"}
                  </Text>
                </TouchableOpacity>
              </View>

              {showPicker.mode && (
                <DateTimePicker
                  value={
                    (showPicker.mode === "open" ? openTime : closeTime) ?? new Date()
                  }
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleTimeChange}
                />
              )}

              {/* Note */}
              <Text className="text-xs text-gray-600 mt-6">
                <Text className="font-bold">Note: </Text>
                Your venue timing and operational days help users know when they can book your venue.
                Please ensure the information is accurate.
              </Text>
            </>
          )}
        </ScrollView>
      </LinearGradient>

      {/* Sticky Bottom Button */}
      <TouchableOpacity
        onPress={handleSaveAndNext}
        disabled={!allFieldsFilled || isLoading || isFetching}
        className={`rounded-xl border overflow-hidden absolute bottom-0 right-0 left-0 mx-4 mb-10 text-center ${
          !allFieldsFilled || isLoading || isFetching ? 'opacity-50' : 'opacity-100'
        }`}
      >
        <LinearGradient
          colors={
            !allFieldsFilled || isLoading || isFetching
              ? ["#E0E0E0", "#E0E0E0"]
              : ["#FFF201", "#E0E0E0"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-4 items-center rounded-xl"
        >
          {isLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#000" style={{ marginRight: 8 }} />
              <Text className="font-bold text-black text-lg text-center p-4">Saving...</Text>
            </View>
          ) : (
            <Text className="font-bold text-black text-lg text-center p-4">
              {isEditMode ? 'Save' : 'Next'}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
