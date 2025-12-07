import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { setVenues } from "@/store/slices/venueSlice";
import Constants from "expo-constants";
import { Venue, Court } from "@/types";

export default function SelectVenueForUpdating() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ updateType?: 'amenities' | 'timing' | 'court' }>();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const venues = useSelector((state: any) => state.venues.venues);
  const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

  const [isLoading, setIsLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoadingCourts, setIsLoadingCourts] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  const updateType = params.updateType || 'amenities';

  // Fetch owner venues on mount
  useEffect(() => {
    fetchOwnerVenues();
  }, []);

  // Fetch courts when venue is selected
  useEffect(() => {
    if (selectedVenue?._id) {
      fetchCourts(selectedVenue._id);
    }
  }, [selectedVenue]);

  const fetchOwnerVenues = async () => {
    if (!user?.accessToken) {
      Alert.alert('Error', 'Please login to continue');
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/venues/owner`, {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }

      const result = await response.json();
      if (result.success && result.data?.venues) {
        const ownerVenues = result.data.venues;
        dispatch(setVenues(ownerVenues));
      } else {
        dispatch(setVenues([]));
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
      Alert.alert('Error', 'Failed to load your venues. Please try again.');
      dispatch(setVenues([]));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourts = async (venueId: string) => {
    if (!user?.accessToken) return;

    setIsLoadingCourts(true);
    try {
      // Fetch venue details with populated courts
      const response = await fetch(`${API_URL}/api/venues/${venueId}`, {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courts');
      }

      const result = await response.json();
      if (result.success && result.data?.venue) {
        const venue = result.data.venue;
        console.log('venue', venue);
        // Courts might be populated or just IDs
        if (venue.courts && Array.isArray(venue.courts)) {
          const courtsData = venue.courts.map((court: any) => {
            // If court is populated, use it directly, otherwise it's just an ID
            if (typeof court === 'object' && court._id) {
              return court;
            }
            return null;
          }).filter(Boolean);
          setCourts(courtsData);
        } else {
          setCourts([]);
        }
      }
    } catch (error) {
      console.error('Error fetching courts:', error);
      Alert.alert('Error', 'Failed to load courts. Please try again.');
      setCourts([]);
    } finally {
      setIsLoadingCourts(false);
    }
  };

  const handleVenueSelect = (venue: Venue) => {
    setSelectedVenue(venue);
    setSelectedCourt(null);
  };

  const handleCourtSelect = (court: Court) => {
    setSelectedCourt(court);
  };

  const handleContinue = () => {
    if (!selectedVenue) {
      Alert.alert('Error', 'Please select a venue');
      return;
    }

    if (updateType === 'court' && !selectedCourt) {
      Alert.alert('Error', 'Please select a court');
      return;
    }

    // Navigate based on update type
    switch (updateType) {
      case 'amenities':
        router.push({
          pathname: '/venue/addAmenities',
          params: { venueId: selectedVenue._id },
        });
        break;
      case 'timing':
        router.push({
          pathname: '/venue/updateTimingAndDays',
          params: { venueId: selectedVenue._id },
        });
        break;
      case 'court':
        if (selectedCourt?._id) {
          // Navigate to court update/edit screen
          // You may need to create this screen or use addCourts with edit mode
          router.push({
            pathname: '/venue/addCourts',
            params: { venueId: selectedVenue._id, courtId: selectedCourt._id },
          });
        }
        break;
      default:
        Alert.alert('Error', 'Invalid update type');
    }
  };

  const getUpdateTypeLabel = () => {
    switch (updateType) {
      case 'amenities':
        return 'Update Amenities';
      case 'timing':
        return 'Update Timing & Days';
      case 'court':
        return 'Update Court';
      default:
        return 'Update Venue';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
    <ImageBackground
      source={require("../../assets/images/background.png")}
      resizeMode="cover"
      className="flex-1"
    >
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
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
          <Text className="text-lg font-bold">{getUpdateTypeLabel()}</Text>
          <View className="w-10" />
        </View>
    

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#FFF201" />
            <Text className="text-gray-600 mt-4">Loading venues...</Text>
          </View>
        ) : venues.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20 px-4">
            <MaterialIcons name="business" size={64} color="#ccc" />
            <Text className="text-xl font-bold text-gray-700 mt-4 text-center">
              No Venues Found
            </Text>
            <Text className="text-gray-500 mt-2 text-center">
              You don't have any venues yet. Create one to get started!
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/venue/addVenue')}
              className="mt-6 bg-[#FFF201] px-6 py-3 rounded-xl"
            >
              <Text className="font-bold text-black">Create Venue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Venue Selection */}
            <View className="px-4 pt-4">
              <Text className="text-lg font-bold mb-3">Select Venue</Text>
              {venues.map((venue: Venue) => {
                const isSelected = selectedVenue?._id === venue._id;
                return (
                  <TouchableOpacity
                    key={venue._id}
                    onPress={() => handleVenueSelect(venue)}
                    className={`mb-3 p-4 rounded-xl border-2 ${
                      isSelected
                        ? 'border-[#FFF201] bg-yellow-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-900 mb-1">
                          {venue.venueName}
                        </Text>
                        <Text className="text-sm text-gray-600 mb-2">
  {[
    venue.location?.areaSectorLocality,
    venue.location?.shopNo,
    venue.location?.floorTower,
    venue.location?.city
  ]
    .filter(Boolean) // removes undefined, null, empty strings
    .join(", ")}
</Text>
                        {venue.sportsOffered && venue.sportsOffered.length > 0 && (
                          <View className="flex-row flex-wrap mt-1">
                            {venue.sportsOffered.slice(0, 3).map((sport, idx) => (
                              <View
                                key={idx}
                                className="bg-gray-100 px-2 py-1 rounded mr-2 mb-1"
                              >
                                <Text className="text-xs text-gray-700">{sport}</Text>
                              </View>
                            ))}
                            {venue.sportsOffered.length > 3 && (
                              <Text className="text-xs text-gray-500">
                                +{venue.sportsOffered.length - 3} more
                              </Text>
                            )}
                          </View>
                        )}
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={24} color="#FFF201" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Court Selection (only for court update) */}
            {updateType === 'court' && selectedVenue && (
              <View className="px-4 pt-4 mt-4">
                <Text className="text-lg font-bold mb-3">Select Court</Text>
                {isLoadingCourts ? (
                  <View className="items-center justify-center py-8">
                    <ActivityIndicator size="small" color="#FFF201" />
                    <Text className="text-gray-600 mt-2">Loading courts...</Text>
                  </View>
                ) : courts.length === 0 ? (
                  <View className="bg-gray-50 p-4 rounded-xl">
                    <Text className="text-gray-600 text-center">
                      No courts found for this venue
                    </Text>
                  </View>
                ) : (
                  courts.map((court: Court) => {
                    const isSelected = selectedCourt?._id === court._id;
                    return (
                      <TouchableOpacity
                        key={court._id}
                        onPress={() => handleCourtSelect(court)}
                        className={`mb-3 p-4 rounded-xl border-2 ${
                          isSelected
                            ? 'border-[#FFF201] bg-yellow-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <View className="flex-row items-start justify-between">
                          <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-900 mb-1">
                              {court.name}
                            </Text>
                            <Text className="text-sm text-gray-600 mb-1">
                              {court.sportType}
                            </Text>
                            {court.surfaceType && (
                              <Text className="text-xs text-gray-500">
                                Surface: {court.surfaceType}
                              </Text>
                            )}
                            <Text className="text-xs text-gray-500 mt-1">
                              ₹{court.pricePerSlot} per slot
                            </Text>
                          </View>
                          {isSelected && (
                            <Ionicons name="checkmark-circle" size={24} color="#FFF201" />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Continue Button */}
      {selectedVenue && (!updateType || updateType !== 'court' || selectedCourt) && (
        <View className="absolute bottom-0 left-0 right-0  px-4 pt-4 ">
          <TouchableOpacity
            onPress={handleContinue}
            className="rounded-xl border overflow-hidden "
          >
            <LinearGradient
              colors={["#FFF201", "#E0E0E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-4 items-center rounded-xl"
            >
              <Text className="font-bold text-black p-4 text-center text-lg">Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
        </ImageBackground>
    </SafeAreaView>
  );
}

