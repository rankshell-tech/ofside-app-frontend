// screens/VenueAddress.tsx
import React, { JSX, useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Switch, ActivityIndicator, Modal, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { useNewVenue } from "@/hooks/useNewVenue";
import { Venue } from "@/types";

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
      <Text className="text-xs font-semibold ">{label}</Text>
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
          className="text-left py-2"
        />
      </View>
    )}
  </View>
);

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface PlaceDetails {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: any[];
  formatted_address: string;
  name: string;
}

export default function VenueAddress() {
  const navigation = useNavigation();
  const { currentNewVenue ,updateNewVenue,updateVenuePartial} = useNewVenue();
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [form, setForm] = useState({
    shopNo: "",
    floorTower: "",
    areaSectorLocality: "",
    city: "",
    state: "",
    landmark: "",
    pincode: "",
    fullAddress: "",
    country: "India",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonContact: "",
    ownerName: "",
    ownerEmail: "",
    ownerContact: "",
  });

  const [location, setLocation] = useState({
    latitude: 28.6139, // Default: New Delhi
    longitude: 77.2090,
  });

  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [areOwnerDetailsSame, setAreOwnerDetailsSame] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);

  // Google Places API Key - You need to add this to your app.config.js
  const GOOGLE_API_KEY = Constants.expoConfig?.extra?.GOOGLE_PLACES_API_KEY;

  // 🔹 Request location permission on component mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasLocationPermission(true);
        getCurrentLocation();
      } else {
        Alert.alert('Permission denied', 'Location permission is required for better experience');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  // 🔹 Get current location
  const getCurrentLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setLocation({ latitude, longitude });
      setRegion(prev => ({
        ...prev,
        latitude,
        longitude,
      }));
      
      fetchAddress(latitude, longitude);
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  // 🔹 Get address from coordinates
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      let [addr] = await Location.reverseGeocodeAsync({ 
        latitude: lat, 
        longitude: lng 
      });
      console.log("addr", addr);

      if (addr) {
        // Map expo-location address to our comprehensive address structure
        const addressComponents = {
          shopNo: addr.streetNumber || addr.name || "",
          
          floorTower: "", // expo-location doesn't provide this
          
          areaSectorLocality: [
            addr.street,
            addr.district,
            addr.subregion,
            addr.name,
          ]
            .filter(Boolean)
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .join(", "),
          
          city: addr.city || addr.subregion || "",
          
          state: addr.region || "",
          
          landmark: addr.street || addr.name || "",
          
          pincode: addr.postalCode || "",
        };

        // Update form with extracted components
        setForm((prev) => ({
          ...prev,
          shopNo: addressComponents.shopNo || '',
          floorTower: addressComponents.floorTower || '',
          area: addressComponents.areaSectorLocality || '',
          areaSectorLocality: addressComponents.areaSectorLocality || '',
          city: addressComponents.city || '',
          state: addressComponents.state || '',
          landmark: addressComponents.landmark || '',
          pincode: addressComponents.pincode || '',
        }));
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // 🔹 Search for places with debouncing
  const searchPlaces = async (query: string) => {
    if (!query.trim() || !GOOGLE_API_KEY) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
        `input=${encodeURIComponent(query)}` +
        `&key=${GOOGLE_API_KEY}` +
        `&components=country:in` +
        `&location=20.5937,78.9629` +
        `&radius=2000000` +
        `&types=establishment`
      );

      const data = await response.json();

      if (data.status === 'OK') {
        setPredictions(data.predictions);
        setShowPredictions(true);
      } else {
        setPredictions([]);
        setShowPredictions(false);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      setPredictions([]);
      setShowPredictions(false);
    } finally {
      setIsSearching(false);
    }
  };

  // 🔹 Handle search input with debouncing
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      searchPlaces(text);
    }, 300);
  };

  // 🔹 Get place details
  const getPlaceDetails = async (placeId: string) => {
    if (!GOOGLE_API_KEY) {
      Alert.alert('Error', 'Google Places API key not configured');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?` +
        `place_id=${placeId}` +
        `&key=${GOOGLE_API_KEY}` +
        `&fields=name,formatted_address,geometry,address_components`
      );

      const data = await response.json();

      if (data.status === 'OK') {
        const place: PlaceDetails = data.result;
        updateFormWithPlaceDetails(place);
      } else {
        Alert.alert('Error', 'Failed to get place details');
      }
    } catch (error) {
      console.error('Error getting place details:', error);
      Alert.alert('Error', 'Failed to get place details');
    } finally {
      setIsSearching(false);
      setShowPredictions(false);
      setSearchQuery("");
    }
  };

  // 🔹 Update form with place details
  const updateFormWithPlaceDetails = (place: PlaceDetails) => {
    const { address_components, geometry, formatted_address } = place;
    console.log("formatted_address", formatted_address);
    
    // Extract address components - accepts multiple type strings
    const getComponent = (...types: string[]): string => {
      const component = address_components?.find((comp: any) =>
        types.some(type => comp.types.includes(type))
      );
      return component?.long_name || '';
    };

    // Extract address components as per recommendation
    const addressComponents = {
      shopNo:
        getComponent(
          "street_number",
          "subpremise",
          "premise",
          "establishment"
        ) ||
        place.address_components?.[0]?.long_name ||
        "",

      floorTower: getComponent("floor", "tower", "room"),

      areaSectorLocality: [
        getComponent("route"),
        getComponent("neighborhood"),
        getComponent("sublocality_level_3"),
        getComponent("sublocality_level_2"),
        getComponent("sublocality_level_1"),
        getComponent("political"),
        getComponent("premise"),
      ]
        .filter(Boolean)
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .join(", "),

      city: getComponent(
        "locality",
        "administrative_area_level_2",
        "sublocality",
        "postal_town"
      ),

      state: getComponent(
        "administrative_area_level_1",
        "administrative_area_level_2"
      ),

      landmark: getComponent("landmark"),

      pincode: getComponent("postal_code", "postal_code_suffix"),
    };

    // Update form with extracted components
          setForm(prev => ({
            ...prev,
      shopNo: addressComponents.shopNo || '',
      floorTower: addressComponents.floorTower || '',
      area: addressComponents.areaSectorLocality || '',
      areaSectorLocality: addressComponents.areaSectorLocality || '',
      city: addressComponents.city || '',
      state: addressComponents.state || '',
      landmark: addressComponents.landmark || '',
      pincode: addressComponents.pincode || '',
    }));

    // Update map location
    if (geometry?.location) {
      const { lat, lng } = geometry.location;
      setLocation({ latitude: lat, longitude: lng });
      setRegion(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    }
  };

  // 🔹 When user taps map
  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    setLocation({ latitude, longitude });
    setRegion((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));

    fetchAddress(latitude, longitude);
  };

  const setOwnerDetails = () => {
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


  const handleSaveAndNext = () => {
    console.log("form", form);
    
    // Build full address string
    const fullAddressParts = [
      form.shopNo,
      form.floorTower,
      form.areaSectorLocality,
      form.city,
      form.state,
      form.pincode,
      form.country,
    ].filter(Boolean);
    const fullAddress = fullAddressParts.join(', ');

    // Update location, contact, and owner using the helper function (properly merges nested objects)
    updateVenuePartial({
      location: {
        shopNo: form.shopNo || '',
        floorTower: form.floorTower || '',
        areaSectorLocality: form.areaSectorLocality || '',
        city: form.city || '',
        state: form.state || '',
        landmark: form.landmark || '',
        country: form.country || 'India',
        pincode: form.pincode || '',
        fullAddress: fullAddress || '',
        coordinates: {
          type: "Point",
          coordinates: [location.longitude, location.latitude],
        }
      },
      contact: {
        name: form.contactPersonName || '',
        phone: form.contactPersonContact || '',
        email: form.contactPersonEmail || '',
      },
      ...(form.ownerName || form.ownerEmail || form.ownerContact ? {
        owner: {
          name: form.ownerName || '',
          phone: form.ownerContact || '',
          email: form.ownerEmail || '',
        }
      } : {})
    });
  

    router.push('/venue/addAmenities');
  };

  // 🔹 Forward geocode (convert text → lat/lng)
  const updateLocationFromForm = async () => {
    try {
      const addressParts = [
        form.shopNo,
        form.floorTower,
        form.areaSectorLocality,
        form.city,
        form.state,
        form.pincode
      ].filter(Boolean);
      
      const address = addressParts.join(" ");
      
      if (!address.trim()) return;

      let results = await Location.geocodeAsync(address);

      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        setLocation({ latitude, longitude });
        setRegion((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    }
  };

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    const addressFields = ['area', 'city', 'pincode'];
    if (addressFields.includes(field)) {
      typingTimeout.current = setTimeout(() => {
        updateLocationFromForm();
      }, 800);
    }
  };

  // 🔹 Render prediction item
  const renderPrediction = ({ item }: { item: PlacePrediction }) => (
    <TouchableOpacity
      className="p-3 border-b border-gray-200 bg-white"
      onPress={() => getPlaceDetails(item.place_id)}
    >
      <View className="flex-row items-start">
        <MaterialIcons name="place" size={20} color="#666" />
        <View className="ml-2 flex-1">
          <Text className="font-semibold text-gray-900">
            {item.structured_formatting.main_text}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">
            {item.structured_formatting.secondary_text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient
        colors={["#FFF201", "#FFFFFF"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0.3 }}
        className="flex-1 relative"
        style={{ height: '90%' }} 
      >
        <View className="w-8 h-8 rounded-full border-4 mx-2 mt-2" >
          <Entypo onPress={() => navigation.goBack()} name="chevron-left" size={20} color="black" />
        </View>
        <Text className="text-xl font-bold mt-5 px-5">Add your venue's location</Text>
        <Text className="text-[10px] text-gray-700 px-5">
          Pin your venue location to the map below
        </Text>

        {/* Search Box */}
        <View className="mt-3 px-5" style={{ zIndex: 1000, elevation: 1000 }}>
          <View className="relative">
            <View className="flex-row items-center border border-gray-300 rounded-2xl px-4 py-3 bg-white">
              <Ionicons name="search" size={20} color="gray" />
            <TextInput
                placeholder="Search for your venue (e.g., Smash2Play, Play Arena)"
              value={searchQuery}
              onChangeText={handleSearchChange}
                className="flex-1 ml-2"
              returnKeyType="search"
              />
              {isSearching && (
                <ActivityIndicator size="small" color="#666" />
              )}
          </View>

            {/* Predictions Dropdown */}
            {showPredictions && predictions.length > 0 && (
              <View 
                style={{ 
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 4,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 16,
                  maxHeight: 192,
                  zIndex: 1001,
                  elevation: 1001,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}
              >
                <FlatList
                  data={predictions}
                  renderItem={renderPrediction}
                  keyExtractor={(item) => item.place_id}
                  keyboardShouldPersistTaps="handled"
                />
            </View>
          )}
          </View>
        </View>

        {/* Current Location Button */}
        <TouchableOpacity 
          onPress={getCurrentLocation}
          className="mt-2 px-5"
        >
          <View className="flex-row items-center justify-center bg-blue-50 py-2 rounded-2xl border border-blue-200">
            <Ionicons name="locate" size={16} color="#3B82F6" />
            <Text className="text-blue-600 font-medium ml-2">Use Current Location</Text>
          </View>
        </TouchableOpacity>

        {/* Interactive Map */}
        <View className="mt-3 px-5" style={{ zIndex: 1, elevation: 1 }}>
          <MapView
            style={{ width: "100%", height: 90, borderRadius: 15 }}
            region={region}
            onRegionChangeComplete={(r) => setRegion(r)}
            onPress={handleMapPress}
          >
            <Marker
              coordinate={location}
              draggable
              onDragEnd={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                setLocation({ latitude, longitude });
                setRegion((prev) => ({
                  ...prev,
                  latitude,
                  longitude,
                }));
                fetchAddress(latitude, longitude);
              }}
            />
          </MapView>
        </View>

        {/* Address Form */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20, padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-lg font-bold mb-3">Venue address details</Text>

          <FloatingLabelInput
            label="Shop no./ building no.*"
            value={form.shopNo}
            onChangeText={(t) => setForm({ ...form, shopNo: t })}
          />
          <FloatingLabelInput
            label="Floor / tower (optional)"
            value={form.floorTower}
            onChangeText={(t) => setForm({ ...form, floorTower: t })}
          />
          <FloatingLabelInput
            label="Area / Sector / Locality*"
            value={form.areaSectorLocality}
            onChangeText={(t) => setForm({ ...form, areaSectorLocality: t })}
          />
          <FloatingLabelInput
            label="City*"
            value={form.city}
            onChangeText={(t) => handleFormChange("city", t)}
          />
          <FloatingLabelInput
            label="State (optional)"
            value={form.state}
            onChangeText={(t) => setForm({ ...form, state: t })}
          />
          <FloatingLabelInput
            label="Any landmark area (optional)"
            value={form.landmark}
            onChangeText={(t) => setForm({ ...form, landmark: t })}
          />
          <FloatingLabelInput
            label="Area pincode*"
            value={form.pincode}
            onChangeText={(t) => handleFormChange("pincode", t)}
          />

          <Text className="text-xs text-gray-600 my-5">
            Please note Users will see this address on Ofside
          </Text>

          <FloatingLabelInput
            label="Contact Person Name"
            value={form.contactPersonName}
            onChangeText={(t) => setForm({ ...form, contactPersonName: t })}
          />
          <FloatingLabelInput
            label="Contact Person Phone number*"
            value={form.contactPersonContact}
            onChangeText={(t) => setForm({ ...form, contactPersonContact: t })}
          />
          <FloatingLabelInput
            label="Contact Person Email Address*"
            value={form.contactPersonEmail}
            onChangeText={(t) => setForm({ ...form, contactPersonEmail: t })}
          />
          <Text className="text-xs text-gray-600 bg-yellow-100 my-2 mx-3 p-2 rounded">
            Booking Confirmation emails will be sent to this address
          </Text>
          
          <View className="flex-row items-center justify-between mt-4 mb-2">
            <Text className="text-base font-medium flex-1 mr-4">
              Are Owner details same as contact person?
            </Text>
            <Switch
              value={areOwnerDetailsSame}
              onValueChange={() => { 
                setAreOwnerDetailsSame(!areOwnerDetailsSame); 
                setOwnerDetails(); 
              }}
              trackColor={{ false: "#ccc", true: "#4CAF50" }}
            />
          </View>
          
          {!areOwnerDetailsSame && (
            <>
              <FloatingLabelInput
                label="Owner Name"
                value={form.ownerName}
                onChangeText={(t) => setForm({ ...form, ownerName: t })}
              />
              <FloatingLabelInput
                label="Owner Phone number*"
                value={form.ownerContact}
                onChangeText={(t) => setForm({ ...form, ownerContact: t })}
              />
              <FloatingLabelInput
                label="Owner Email Address*"
                value={form.ownerEmail}
                onChangeText={(t) => setForm({ ...form, ownerEmail: t })}
              />
            </>
          )}
        </ScrollView>
      </LinearGradient>

      {/* Sticky Next Button */}
        <TouchableOpacity 
          onPress={() => handleSaveAndNext()}
          className="rounded-lg border overflow-hidden absolute bottom-0 right-0 left-0 mx-4 mb-10 text-center"
        >
          <LinearGradient
            colors={["#FFF201", "#E0E0E0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 py-3 items-center rounded-full"
          >
            <Text className="font-bold p-4 text-center text-black text-lg">Next</Text>
          </LinearGradient>
        </TouchableOpacity>
    </SafeAreaView>
  );
}