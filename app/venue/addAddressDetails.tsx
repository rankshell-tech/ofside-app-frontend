// screens/VenueAddress.tsx
import React, { JSX, useState, useRef  } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


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

export default function VenueAddress() {
  const navigation = useNavigation();
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [form, setForm] = useState({
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

  // 🔹 Get address from coordinates
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      let [addr] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });

      if (addr) {
        setForm((prev) => ({
          ...prev,
          area: addr.district || addr.subregion || prev.area,
          city: addr.city || addr.region || prev.city,
          pincode: addr.postalCode || prev.pincode,
          landmark: addr.street || addr.name || prev.landmark,
        }));
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch address");
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

    fetchAddress(latitude, longitude); // auto fill inputs
  };
   const setOwnerDetails = ()=>{
    if(!areOwnerDetailsSame){
      setForm(prev => ({
        ...prev,
        ownerName: prev.contactPersonName,
        ownerEmail: prev.contactPersonEmail,
        ownerContact: prev.contactPersonContact
      }));
    }else{
      setForm(prev => ({
        ...prev,
        ownerName:"",
        ownerEmail:"",
        ownerContact:""
      }));
    }
   }

   // 🔹 Forward geocode (convert text → lat/lng)
  const updateLocationFromForm = async () => {
    try {
      // Build full address string from form fields
      const address = `${form.shopNo} ${form.floor} ${form.area} ${form.city} ${form.pincode}`;
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
      console.log("Geocoding failed", err);
    }
  };
  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      updateLocationFromForm();
    }, 800); // wait 800ms after user stops typing
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient
        colors={["#FFF201", "#FFFFFF"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0.3 }}
      >
        <View className="w-8 h-8 rounded-full border-4 mx-2 mt-2" >
          <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
        </View>
        <Text className="text-xl font-bold mt-5 px-5">Add your venue’s location</Text>
        <Text className="text-[10px] text-gray-700 px-5">
          Pin your venue location to the map below
        </Text>

        {/* Interactive Map */}
        <View className="mt-3 px-5">
            <MapView
                style={{ width: "100%", height: 180, borderRadius: 15 }}
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
            contentContainerStyle={{ paddingBottom: 400, padding:20 }}
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
              value={form.floor}
              onChangeText={(t) => setForm({ ...form, floor: t })}
            />
            <FloatingLabelInput
              label="Area / Sector / Locality*"
              value={form.area}
              onChangeText={(t) => setForm({ ...form, area: t })}
            />
            <FloatingLabelInput
              label="City*"
              value={form.city}
              onChangeText={(t) => handleFormChange("city", t)}
            />
            <FloatingLabelInput
              label="Any landmark area (optional)"
              value={form.landmark}
              onChangeText={(t) => setForm({ ...form, landmark: t })}
            />
            <FloatingLabelInput
              label="Area pincode*"
              value={form.pincode}
              onChangeText={(t) => setForm({ ...form, pincode: t })}
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
            <Text className="text-xs text-gray-600 bg-yellow-100 my-2 mx-3">
              Booking Confirmation emails will be sent to this address
            </Text>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-base font-medium">
                Are Owner details same as contact person?
              </Text>
              <Switch
                value={areOwnerDetailsSame}
                onValueChange={()=> { setAreOwnerDetailsSame(!areOwnerDetailsSame); setOwnerDetails() }}
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
      <TouchableOpacity onPress={()=> router.push('/venue/addAmenities')} className="rounded-lg border overflow-hidden absolute bottom-0 right-0 mr-2 mb-10">
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
