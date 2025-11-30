// screens/VenueAddress.tsx
import React, { JSX, useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Switch,
  ActivityIndicator,
  FlatList,
  Keyboard
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, MapPressEvent, Region } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";
import { Entypo, Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

// Types
interface LocationState {
  latitude: number;
  longitude: number;
}

interface FormState {
  shopNo: string;
  floor: string;
  area: string;
  city: string;
  landmark: string;
  pincode: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonContact: string;
  ownerName: string;
  ownerEmail: string;
  ownerContact: string;
}

interface SearchSuggestion {
  id: string;
  description: string;
  place_id: string;
  main_text: string;
  secondary_text: string;
}

interface FloatingLabelInputProps {
  label: string;
  value: string;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
  isPicker?: boolean;
  icon?: JSX.Element;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

// Google Places API Configuration
const GOOGLE_PLACES_API_KEY = "YOUR_GOOGLE_PLACES_API_KEY"; // Replace with your actual API key
const GOOGLE_PLACES_BASE_URL = "https://maps.googleapis.com/maps/api/place";

// Floating Label Input component
const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onPress,
  onChangeText,
  isPicker = false,
  icon,
  keyboardType = "default"
}) => (
  <View className="mt-4">
    <View className="absolute -top-2 left-4 bg-white px-1 z-10">
      <Text className="text-xs font-semibold text-gray-700">{label}</Text>
    </View>

    {isPicker ? (
      <TouchableOpacity
        onPress={onPress}
        className="border border-gray-300 rounded-xl px-4 py-3 flex-row justify-between items-center bg-white"
      >
        <Text className="flex-1 text-base">{value || `Select ${label}`}</Text>
        {icon || <MaterialIcons name="arrow-drop-down" size={24} color="gray" />}
      </TouchableOpacity>
    ) : (
      <View className="border border-gray-300 rounded-xl px-4 py-2 bg-white">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="text-base"
          keyboardType={keyboardType}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    )}
  </View>
);

// Search Suggestion Item Component
const SearchSuggestionItem: React.FC<{
  suggestion: SearchSuggestion;
  onPress: (suggestion: SearchSuggestion) => void;
}> = ({ suggestion, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress(suggestion)}
    className="flex-row items-center py-3 px-4 border-b border-gray-100 bg-white active:bg-gray-50"
  >
    <FontAwesome5 name="map-marker-alt" size={16} color="#EF4444" />
    <View className="ml-3 flex-1">
      <Text className="text-base font-medium text-gray-900" numberOfLines={1}>
        {suggestion.main_text}
      </Text>
      <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
        {suggestion.secondary_text}
      </Text>
    </View>
    <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

export default function VenueAddress() {
  const navigation = useNavigation();
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<MapView>(null);
  
  const [form, setForm] = useState<FormState>({
    shopNo: "",
    floor: "",
    area: "",
    city: "",
    landmark: "",
    pincode: "",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonContact: "",
    ownerName: "",
    ownerEmail: "",
    ownerContact: "",
  });

  const [location, setLocation] = useState<LocationState>({
    latitude: 28.6139,
    longitude: 77.2090,
  });

  const [region, setRegion] = useState<Region>({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [areOwnerDetailsSame, setAreOwnerDetailsSame] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // 🔹 Auto-fetch current location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to auto-fill address');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;
      
      setLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      await fetchAddressFromCoordinates(latitude, longitude);
      
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to fetch current location');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Get address from coordinates using Google Geocoding API
  const fetchAddressFromCoordinates = async (lat: number, lng: number): Promise<void> => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_PLACES_API_KEY}`
      );

      if (response.data.results && response.data.results.length > 0) {
        const address = response.data.results[0];
        const addressComponents = address.address_components;
        
        // Extract address components
        const getComponent = (type: string) => {
          const component = addressComponents.find((comp: any) => comp.types.includes(type));
          return component ? component.long_name : '';
        };

        setForm((prev) => ({
          ...prev,
          area: getComponent('sublocality') || getComponent('locality') || prev.area,
          city: getComponent('locality') || getComponent('administrative_area_level_2') || prev.city,
          pincode: getComponent('postal_code') || prev.pincode,
          landmark: getComponent('route') || address.formatted_address.split(',')[0] || prev.landmark,
        }));
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  // 🔹 Fetch search suggestions from Google Places Autocomplete API
  const fetchSearchSuggestions = async (query: string): Promise<void> => {
    if (!query.trim() || query.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setIsSearching(true);
      
      const response = await axios.get(
        `${GOOGLE_PLACES_BASE_URL}/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}&components=country:in`
      );

      if (response.data.predictions && response.data.predictions.length > 0) {
        const suggestions: SearchSuggestion[] = response.data.predictions.map((prediction: any, index: number) => {
          // Split the description into main text and secondary text
          const parts = prediction.description.split(', ');
          const main_text = parts[0];
          const secondary_text = parts.slice(1).join(', ');

          return {
            id: prediction.id || `suggestion-${index}-${Date.now()}`,
            description: prediction.description,
            place_id: prediction.place_id,
            main_text,
            secondary_text
          };
        });

        setSearchSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
      
    } catch (error) {
      console.error('Search suggestions error:', error);
      setSearchSuggestions([]);
      setShowSuggestions(false);
      
      // Fallback to expo-location if Google API fails
      if (query.length >= 3) {
        try {
          const results = await Location.geocodeAsync(query);
          const fallbackSuggestions: SearchSuggestion[] = results.slice(0, 5).map((result, index) => ({
            id: `fallback-${index}-${Date.now()}`,
            description: result.name || query,
            place_id: `fallback-${index}`,
            main_text: result.name || 'Location',
            secondary_text: result.city || result.region || 'Unknown area'
          }));
          setSearchSuggestions(fallbackSuggestions);
          setShowSuggestions(fallbackSuggestions.length > 0);
        } catch (fallbackError) {
          console.error('Fallback search error:', fallbackError);
        }
      }
    } finally {
      setIsSearching(false);
    }
  };

  // 🔹 Handle search input changes with debouncing
  const handleSearchChange = (text: string): void => {
    setSearchQuery(text);
    setShowSuggestions(text.length > 0);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for debounced search
    searchTimeout.current = setTimeout(() => {
      if (text.length >= 2) {
        fetchSearchSuggestions(text);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  };

  // 🔹 Get place details from Google Places API
  const getPlaceDetails = async (placeId: string): Promise<any> => {
    try {
      const response = await axios.get(
        `${GOOGLE_PLACES_BASE_URL}/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}&fields=geometry,name,formatted_address,address_components`
      );
      return response.data.result;
    } catch (error) {
      console.error('Place details error:', error);
      throw error;
    }
  };

  // 🔹 When user selects a search suggestion
  const handleSuggestionSelect = async (suggestion: SearchSuggestion): Promise<void> => {
    try {
      setIsLoading(true);
      setSearchQuery(suggestion.description);
      setShowSuggestions(false);
      setSearchSuggestions([]);
      Keyboard.dismiss();

      // Get detailed place information
      const placeDetails = await getPlaceDetails(suggestion.place_id);
      
      if (placeDetails && placeDetails.geometry && placeDetails.geometry.location) {
        const { lat: latitude, lng: longitude } = placeDetails.geometry.location;
        
        setLocation({ latitude, longitude });
        setRegion(prev => ({
          ...prev,
          latitude,
          longitude,
        }));

        // Animate map to new location
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);

        // Update form with place details
        if (placeDetails.address_components) {
          const addressComponents = placeDetails.address_components;
          
          const getComponent = (type: string) => {
            const component = addressComponents.find((comp: any) => comp.types.includes(type));
            return component ? component.long_name : '';
          };

          setForm(prev => ({
            ...prev,
            area: getComponent('sublocality') || getComponent('locality') || prev.area,
            city: getComponent('locality') || getComponent('administrative_area_level_2') || prev.city,
            pincode: getComponent('postal_code') || prev.pincode,
            landmark: getComponent('route') || placeDetails.name || prev.landmark,
          }));
        }

        await fetchAddressFromCoordinates(latitude, longitude);
      }
    } catch (error) {
      console.error('Suggestion selection error:', error);
      Alert.alert("Error", "Failed to get location details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 When user taps map
  const handleMapPress = (e: MapPressEvent): void => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    setLocation({ latitude, longitude });
    setRegion(prev => ({
      ...prev,
      latitude,
      longitude,
    }));

    fetchAddressFromCoordinates(latitude, longitude);
  };

  // 🔹 Sync owner details with contact person
  const setOwnerDetails = (): void => {
    if (!areOwnerDetailsSame) {
      setForm(prev => ({
        ...prev,
        ownerName: prev.contactPersonName,
        ownerEmail: prev.contactPersonEmail,
        ownerContact: prev.contactPersonContact
      }));
    } else {
      setForm(prev => ({
        ...prev,
        ownerName: "",
        ownerEmail: "",
        ownerContact: ""
      }));
    }
  };

  const handleFormChange = (field: keyof FormState, value: string): void => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchSubmit = (): void => {
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      Keyboard.dismiss();
    }
  };

  // Clear search suggestions when clicking outside
  const handleBackdropPress = (): void => {
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient
        colors={["#FFF201", "#FFFFFF"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0.3 }}
        className="flex-1"
      >
        {/* Compact Header */}
        <View className="flex-row items-center px-4 pt-2">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-8 h-8 rounded-full border border-gray-300 items-center justify-center mr-3"
          >
            <Entypo name="chevron-left" size={20} color="black" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-lg font-bold">Add your venue's location</Text>
            <Text className="text-xs text-gray-600">
              Pin your venue location to the map below
            </Text>
          </View>
        </View>

        {/* Search Bar with Suggestions */}
        <View className="px-4 mt-3 z-50">
          <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2 bg-white shadow-sm">
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              placeholder="Search for venues, areas, or landmarks..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              onSubmitEditing={handleSearchSubmit}
              className="flex-1 ml-2 text-base"
              returnKeyType="search"
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => {
                setSearchQuery("");
                setSearchSuggestions([]);
                setShowSuggestions(false);
              }}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (
            <View className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-60 z-50">
              {isSearching ? (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color="#FFF201" />
                  <Text className="text-gray-500 mt-2">Searching venues...</Text>
                </View>
              ) : searchSuggestions.length > 0 ? (
                <FlatList
                  data={searchSuggestions}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <SearchSuggestionItem
                      suggestion={item}
                      onPress={handleSuggestionSelect}
                    />
                  )}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                />
              ) : searchQuery.length >= 2 ? (
                <View className="py-4 items-center">
                  <Ionicons name="location-outline" size={24} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-1">No venues found</Text>
                  <Text className="text-gray-400 text-xs">Try a different search term</Text>
                </View>
              ) : null}
            </View>
          )}
        </View>

        {/* Interactive Map */}
        <View className="mt-3 px-4 h-40">
          <MapView
            ref={mapRef}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
          >
            <Marker
              coordinate={location}
              draggable
              onDragEnd={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                setLocation({ latitude, longitude });
                setRegion(prev => ({ ...prev, latitude, longitude }));
                fetchAddressFromCoordinates(latitude, longitude);
              }}
            />
          </MapView>
          
          {/* Current Location Button */}
          <TouchableOpacity
            onPress={getCurrentLocation}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg border border-gray-200"
            disabled={isLoading}
          >
            <MaterialIcons 
              name="my-location" 
              size={20} 
              color={isLoading ? "#9CA3AF" : "#3B82F6"} 
            />
          </TouchableOpacity>
          
          {isLoading && (
            <View className="absolute inset-0 bg-black bg-opacity-20 rounded-xl items-center justify-center">
              <ActivityIndicator size="large" color="#FFF201" />
            </View>
          )}
        </View>

        {/* Backdrop for suggestions */}
        {showSuggestions && (
          <TouchableOpacity
            className="absolute inset-0 bg-transparent z-40"
            onPress={handleBackdropPress}
            activeOpacity={1}
          />
        )}

        {/* Rest of your form component remains the same */}
        {/* ... (form code from previous version) ... */}

      </LinearGradient>

      {/* Sticky Next Button */}
      <View className="absolute bottom-4 right-4 z-30">
        <TouchableOpacity 
          onPress={() => router.push('/venue/addAmenities')}
          className="rounded-full overflow-hidden shadow-lg"
        >
          <LinearGradient
            colors={["#FFF201", "#F59E0B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 py-3 items-center justify-center"
          >
            <Text className="font-bold text-black text-base">Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}