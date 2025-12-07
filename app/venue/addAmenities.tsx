import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { useNewVenue } from "@/hooks/useNewVenue";
import { Venue } from "@/types";
import Constants from "expo-constants";

const amenitiesList = [
  "Wi-fi",
  "Flood lights",
  "Parking",
  "Food and Drinks",
  "Washroom/Restroom",
  "Changing area",
  "Drinking water",
  "Artificial grass",
  "Natural grass",
  "Bike/Car parking",
  "Mobile charging",
  "Showers/Steam",
  "Match referee",
  "Warm-up track",
  "Rental equipments",
  "First aid",
  "Locker Rooms",
  "Seating areas",
  "Cafeteria",
  "Coaching",
];

// Map each amenity to a suitable icon component and name
const iconMap: Record<
  string,
  { lib: "Ionicons" | "Entypo" | "MaterialCommunityIcons" | "FontAwesome5" | "Feather"; name: string }
> = {
  "Wi-fi": { lib: "Ionicons", name: "wifi" },
  "Flood lights": { lib: "MaterialCommunityIcons", name: "lightning-bolt" },
  "Parking": { lib: "MaterialCommunityIcons", name: "parking" },
  "Washroom/Restroom": { lib: "MaterialCommunityIcons", name: "toilet" },
  "Changing area": { lib: "MaterialCommunityIcons", name: "tshirt-crew" },
  "Drinking water": { lib: "Feather", name: "coffee" },
  "Artificial grass": { lib: "MaterialCommunityIcons", name: "grass" },
  "Natural grass": { lib: "MaterialCommunityIcons", name: "leaf" },
  "Bike/Car parking": { lib: "FontAwesome5", name: "parking" },
  "Mobile charging": { lib: "Ionicons", name: "battery-charging" },
  "Showers/Steam": { lib: "MaterialCommunityIcons", name: "shower" },
  "Match referee": { lib: "MaterialCommunityIcons", name: "whistle" },
  "Warm-up track": { lib: "MaterialCommunityIcons", name: "run" },
  "Rental equipments": { lib: "Entypo", name: "briefcase" },
  "First aid": { lib: "MaterialCommunityIcons", name: "medical-bag" }, // Changed from "first-aid"
  "Locker Rooms": { lib: "MaterialCommunityIcons", name: "locker" }, // Changed to MaterialCommunityIcons
  "Seating areas": { lib: "MaterialCommunityIcons", name: "seat" },
  "Food and Drinks": { lib: "Feather", name: "coffee" },
  "Cafeteria": { lib: "Feather", name: "coffee" },
  "Coaching": { lib: "MaterialCommunityIcons", name: "whistle" }, // Changed from "teach" to "whistle"
};

function AmenityIcon({ name, lib, size = 18, color = "#333" }: any) {
  const props = { name, size, color };
  switch (lib) {
    case "Ionicons":
      return <Ionicons {...props} />;
    case "Entypo":
      return <Entypo {...props} />;
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons {...props} />;
    case "FontAwesome5":
      return <FontAwesome5 {...props} />;
    case "Feather":
      return <Feather {...props} />;
    default:
      return <Ionicons name="help" size={size} color={color} />;
  }
}

export default function VenueAmenities() {
  const navigation = useNavigation();
  const { currentNewVenue, updateNewVenue } = useNewVenue();
  const user = useSelector((state: any) => state.auth.user);
  const params = useLocalSearchParams<{ venueId?: string }>();
  const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';
  
  // Determine if we're in edit mode
  const isEditMode = !!params.venueId;
  const venueId = params.venueId;
  
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);

  // Fetch venue amenities if in edit mode
  useEffect(() => {
    if (isEditMode && venueId) {
      fetchVenueAmenities();
    } else if (currentNewVenue?.amenities) {
      // Create mode: use Redux data
      setSelected(currentNewVenue.amenities);
    }
  }, [isEditMode, venueId]);

  // Update local state when Redux data changes (only in create mode)
  useEffect(() => {
    if (!isEditMode && currentNewVenue?.amenities) {
      setSelected(currentNewVenue.amenities);
    }
  }, [currentNewVenue?.amenities, isEditMode]);

  const fetchVenueAmenities = async () => {
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
        setSelected(venue.amenities || []);
      }
    } catch (error) {
      console.error('Error fetching venue:', error);
      Alert.alert('Error', 'Failed to load venue amenities. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const toggleAmenity = (item: string) => {
    const newSelected = selected.includes(item) 
      ? selected.filter((a) => a !== item) 
      : [...selected, item];
    
    setSelected(newSelected);
  };

  const clearAll = () => {
    setSelected([]);
    // Also clear from Redux
    if (currentNewVenue) {
      updateNewVenue({ ...currentNewVenue, amenities: [] });
    }
  };

  const selectedCountLabel = useMemo(() => {
    if (selected.length === 0) return "None selected";
    if (selected.length === 1) return "1 selected";
    return `${selected.length} selected`;
  }, [selected]);

  const handleSaveAndNext = async () => {
    if (isEditMode && venueId) {
      // Update mode: Save to backend
      await handleUpdateAmenities();
    } else {
      // Create mode: Update Redux and navigate
      if (currentNewVenue) {
        updateNewVenue({ 
          ...currentNewVenue, 
          amenities: selected 
        });
      }
      // Navigate to next step
      router.push("/venue/addCourts");
    }
  };

  const handleUpdateAmenities = async () => {
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
          amenities: selected,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update amenities');
      }

      Alert.alert('Success', 'Amenities updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Error updating amenities:', error);
      Alert.alert('Error', error.message || 'Failed to update amenities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={["#FFF201", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.8 }}
        className="px-4 pt-4 pb-3"
      >
        <View className="flex-row items-center justify-between">
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

          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600 mr-3">{selectedCountLabel}</Text>
            <TouchableOpacity onPress={clearAll} className="px-3 py-1 rounded-full bg-white/90 border">
              <Text className="text-xs font-semibold">Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="mx-4 text-2xl font-bold mt-4">
          {isEditMode ? 'Update amenities at your venue' : 'Select amenities at your venue'}
        </Text>
        <Text className="mx-4 mb-2 text-sm text-gray-500 mt-1">
          Users will see these details on Ofside
        </Text>
      </LinearGradient>

      {/* Amenities Grid */}
      <ScrollView 
        className="px-4 pt-4 bottom-28"  
        style={{ position: 'absolute', height: '78%' }}  
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }} 
      >
        {isFetching ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#FFF201" />
            <Text className="text-gray-600 mt-4">Loading amenities...</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
          {amenitiesList.map((item) => {
            const isSelected = selected.includes(item);
            const mapped = iconMap[item] || { lib: "Ionicons", name: "help" };

            return (
              <TouchableOpacity
                key={item}
                onPress={() => toggleAmenity(item)}
                activeOpacity={0.85}
                className={`w-[48%] mb-4 rounded-xl border p-3 flex-row items-center justify-start ${
                  isSelected
                    ? "bg-green-600 border-green-600"
                    : "bg-white border-gray-200"
                } shadow-sm`}
              >
                <View
                  className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${
                    isSelected ? "bg-white/20" : "bg-gray-100"
                  }`}
                >
                  <AmenityIcon 
                    lib={mapped.lib} 
                    name={mapped.name} 
                    size={20} 
                    color={isSelected ? "#fff" : "#333"} 
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text 
                    className={`font-semibold ${isSelected ? "text-white" : "text-black"}`} 
                    numberOfLines={1}
                  >
                    {item}
                  </Text>
                  {!isSelected ? (
                    <Text className="text-[11px] text-gray-400">Tap to add</Text>
                  ) : (
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="checkmark-circle" size={16} color="#fff" />
                      <Text className="text-[11px] text-white ml-1">Added</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="absolute bottom-0 left-2 right-2">
        <TouchableOpacity 
          onPress={handleSaveAndNext} 
          disabled={(!isEditMode && selected.length === 0) || isLoading || isFetching}
          className={`rounded-xl border overflow-hidden absolute bottom-0 right-0 left-0 mx-4 mb-10 text-center ${(!isEditMode && selected.length === 0) || isLoading || isFetching ? 'opacity-50' : 'opacity-100'}`}
        >
          <LinearGradient
            colors={["#FFF201", "#E0E0E0"]}
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
      </View>
    </SafeAreaView>
  );
}