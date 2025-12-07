import React, { JSX, useRef, useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, TextInput, ImageBackground, Modal, ActivityIndicator, Alert } from "react-native";
import { AntDesign, Entypo, FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import TimePicker from "@/components/TimePicker";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Constants from "expo-constants";

interface Venue {
  id: string;
  name: string;
}

interface Court {
  id: string;
  name: string;
  sportType: string;
  pricePerSlot: number;
  slotDuration?: number;
  openTime?: string;
  closeTime?: string;
}

interface VenueDetails {
  openTime?: string;
  closeTime?: string;
  is24HoursOpen?: boolean;
}

export default function ManageSlot() {
    const theme = useTheme();
    const { user } = useSelector((state: RootState) => state.auth);
    const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:5000';

    const flatListRef = useRef<FlatList<number>>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [source, setSource] = useState("Ofside");
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
    const [selectedVenueDetails, setSelectedVenueDetails] = useState<VenueDetails | null>(null);
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
    const [showSourcePicker, setShowSourcePicker] = useState(false);
    const [showVenuePicker, setShowVenuePicker] = useState(false);
    const [showCourtPicker, setShowCourtPicker] = useState(false);
    const [showPaymentPicker, setShowPaymentPicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"unpaid" | "partial" | "paid">("unpaid");
    const [selectedStartTime, setSelectedStartTime] = useState("");
    const [selectedEndTime, setSelectedEndTime] = useState("");
    const [amount, setAmount] = useState("");
    const [venues, setVenues] = useState<Venue[]>([]);
    const [courts, setCourts] = useState<Court[]>([]);
    const [isLoadingVenues, setIsLoadingVenues] = useState(true);
    const [isLoadingCourts, setIsLoadingCourts] = useState(false);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

    const sources = ["Ofside", "Walk-in", "Phone", "Other"];

    // Fetch venues on mount
    useEffect(() => {
      fetchVenues();
    }, [user?.accessToken]);

    // Fetch courts and venue details when venue is selected
    useEffect(() => {
      if (selectedVenue) {
        fetchVenueDetails(selectedVenue.id);
        fetchCourts(selectedVenue.id);
      } else {
        setCourts([]);
        setSelectedCourt(null);
        setSelectedVenueDetails(null);
      }
    }, [selectedVenue]);

    // Generate time slots when court is selected
    useEffect(() => {
      if (selectedCourt && selectedVenueDetails) {
        generateTimeSlots();
      }
    }, [selectedCourt, selectedVenueDetails]);

    const fetchVenues = async () => {
      if (!user?.accessToken || !API_URL) {
        setIsLoadingVenues(false);
        return;
      }

      try {
        setIsLoadingVenues(true);
        const response = await fetch(`${API_URL}/api/venues/owner`, {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const formattedVenues = result.data.venues.map((v: any) => ({
              id: v._id.toString(),
              name: v.venueName,
            }));
            setVenues(formattedVenues);
            if (formattedVenues.length > 0 && !selectedVenue) {
              setSelectedVenue(formattedVenues[0]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setIsLoadingVenues(false);
      }
    };

    const fetchVenueDetails = async (venueId: string) => {
      if (!user?.accessToken || !API_URL) {
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/venues/${venueId}`, {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const venue = result.data.venue;
            setSelectedVenueDetails({
              openTime: venue.openTime,
              closeTime: venue.closeTime,
              is24HoursOpen: venue.is24HoursOpen,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching venue details:', error);
      }
    };

    const fetchCourts = async (venueId: string) => {
      if (!user?.accessToken || !API_URL) {
        return;
      }

      try {
        setIsLoadingCourts(true);
        const response = await fetch(`${API_URL}/api/courts?venue=${venueId}`, {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const formattedCourts = result.data.courts.map((c: any) => ({
              id: c._id.toString(),
              name: c.name || c.courtName,
              sportType: c.sportType,
              pricePerSlot: c.pricePerSlot || 0,
              slotDuration: c.slotDuration || 60,
            }));
            setCourts(formattedCourts);
            if (formattedCourts.length > 0 && !selectedCourt) {
              setSelectedCourt(formattedCourts[0]);
              setAmount(String(formattedCourts[0].pricePerSlot));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching courts:', error);
      } finally {
        setIsLoadingCourts(false);
      }
    };

    const generateTimeSlots = () => {
      if (!selectedCourt || !selectedVenueDetails) return;

      const slots: string[] = [];
      const slotDuration = selectedCourt.slotDuration || 60; // in minutes
      
      // Get venue operating hours
      let startHour = 6; // default 6 AM
      let startMinute = 0;
      let endHour = 22; // default 10 PM
      let endMinute = 0;

      if (!selectedVenueDetails.is24HoursOpen) {
        if (selectedVenueDetails.openTime) {
          const [hour, minute] = selectedVenueDetails.openTime.split(':').map(Number);
          startHour = hour;
          startMinute = minute;
        }
        if (selectedVenueDetails.closeTime) {
          const [hour, minute] = selectedVenueDetails.closeTime.split(':').map(Number);
          endHour = hour;
          endMinute = minute;
        }
      } else {
        startHour = 0;
        endHour = 23;
        endMinute = 59;
      }

      // Generate slots
      let currentHour = startHour;
      let currentMinute = startMinute;

      while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        slots.push(timeStr);

        // Add slot duration
        currentMinute += slotDuration;
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60);
          currentMinute = currentMinute % 60;
        }

        // Check if we've exceeded end time
        if (currentHour > endHour || (currentHour === endHour && currentMinute > endMinute)) {
          break;
        }
      }

      setAvailableTimeSlots(slots);
    };

    // Calculate total amount based on court price (default to 1 slot)
    const courtPrice = selectedCourt?.pricePerSlot || 0;
    const totalAmount = courtPrice || parseFloat(amount) || 0;
    const numericAmount = parseFloat(amount) || 0;
    const progress = totalAmount > 0 ? Math.min(numericAmount / totalAmount, 1) : 0; // 0 to 1

    // Determine color dynamically
    let progressColor = "#FF0000"; // unpaid
    if (progress > 0.33 && progress < 1) progressColor = "#FFF201"; // partial (yellow)
    if (progress === 1) progressColor = "#16a34a"; // paid

    const handleNext = () => {
      if (!name || !number) {
        Alert.alert("Error", "Please fill in customer name and number");
        return;
      }
      if (!selectedCourt) {
        Alert.alert("Error", "Please select a court");
        return;
      }
      if (!amount || parseFloat(amount) <= 0) {
        Alert.alert("Error", "Please enter a valid amount");
        return;
      }
      if (!selectedStartTime || !selectedEndTime) {
        Alert.alert("Error", "Please select start and end time");
        return;
      }

      // Navigate to date selection with booking data
      router.push({
        pathname: '/manageSlot/addDateTime',
        params: {
          customerName: name,
          customerEmail: email,
          customerMobile: number,
          source: source,
          courtId: selectedCourt.id,
          courtName: selectedCourt.name,
          sportType: selectedCourt.sportType,
          amount: amount,
          paymentStatus: paymentStatus,
          startTime: selectedStartTime,
          endTime: selectedEndTime,
          venueId: selectedVenue?.id || '',
          venueName: selectedVenue?.name || '',
        },
      });
    };



    const FloatingLabelInput = React.memo(({
        label,
        value,
        onPress,
        onChangeText,
        isPicker,
        icon,
        keyboardType,
        }: {
        label: string;
        value: string;
        onPress?: () => void;
        onChangeText?: (text: string) => void;
        isPicker?: boolean;
        icon?: JSX.Element;
        keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
        }) => (
        <View className="mt-6">
            {/* Label */}
            <View className="absolute -top-2 left-4 bg-white px-1 z-10">
            <Text className="text-xs text-gray-500 font-semibold">{label}
            </Text>
            </View>

            {/* Input / Picker style */}
            {isPicker ? (
            <TouchableOpacity
                onPress={onPress}
                className="border border-black rounded-2xl px-4 py-4 flex-row justify-between items-center"
            >
                <Text className="font-bold">{value || "Select"}</Text>
                {icon}
            </TouchableOpacity>
            ) : (
            <View className="border border-black rounded-2xl px-4 py-1">
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    className="text-left font-bold"
                    keyboardType={keyboardType || "default"}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>
            )}
        </View>
        ));

  return (
    <SafeAreaView className="flex-1 bg-white">
        <ImageBackground
            source={require("../../assets/images/background.png")} // Put your image in assets/images
            resizeMode="cover"
            className="flex-1"
        >
            {/* Header */}
            <View className="flex-row items-center px-5">
                <Text className="ml-3 text-xl font-bold mt-5">Manage slot</Text>
            </View>
            {/* Content */}
            <ScrollView contentContainerStyle={{ padding: 10, paddingBottom: 100 }}>

                {/* Form */}
                <View className="px-2">
                    <FloatingLabelInput
                        label="Full name"
                        value={name}
                        onChangeText={setName}
                    />
                    <FloatingLabelInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <FloatingLabelInput
                        label="Number"
                        value={number}
                        onChangeText={setNumber}
                        keyboardType="phone-pad"
                    />
                    <FloatingLabelInput
                        label="Source"
                        value={source}
                        isPicker
                        onPress={() => setShowSourcePicker(true)}
                        icon={<AntDesign name="down-circle" size={18} color="black" />}
                    />
                    {isLoadingVenues ? (
                      <View className="mt-6 border border-black rounded-2xl px-4 py-4 items-center">
                        <ActivityIndicator size="small" color="#000" />
                        <Text className="mt-2 text-sm">Loading venues...</Text>
                      </View>
                    ) : (
                      <FloatingLabelInput
                          label="Select Venue"
                          value={selectedVenue?.name || "Select Venue"}
                          isPicker
                          onPress={() => setShowVenuePicker(true)}
                          icon={<AntDesign name="down-circle" size={18} color="black" />}
                      />
                    )}
                    {selectedVenue && (
                      isLoadingCourts ? (
                        <View className="mt-6 border border-black rounded-2xl px-4 py-4 items-center">
                          <ActivityIndicator size="small" color="#000" />
                          <Text className="mt-2 text-sm">Loading courts...</Text>
                        </View>
                      ) : (
                        <FloatingLabelInput
                            label="Select Court"
                            value={selectedCourt ? `${selectedCourt.sportType} - ${selectedCourt.name}` : "Select Court"}
                            isPicker
                            onPress={() => setShowCourtPicker(true)}
                            icon={<AntDesign name="down-circle" size={18} color="black" />}
                        />
                      )
                    )}
                    <FloatingLabelInput
                        label="Payment Status"
                        value={paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                        isPicker
                        onPress={() => setShowPaymentPicker(true)}
                        icon={<AntDesign name="down-circle" size={18} color="black" />}
                    />

                    <FloatingLabelInput
                        label="Amount"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />

                    {selectedCourt && availableTimeSlots.length > 0 && (
                      <>
                        <FloatingLabelInput
                            label="Start Time"
                            value={selectedStartTime || "Select Start Time"}
                            isPicker
                            onPress={() => setShowTimePicker(true)}
                            icon={<AntDesign name="down-circle" size={18} color="black" />}
                        />
                        {selectedStartTime && (
                          <FloatingLabelInput
                              label="End Time"
                              value={selectedEndTime || "Select End Time"}
                              isPicker
                              onPress={() => {
                                // Filter end times to be after start time
                                const startIndex = availableTimeSlots.indexOf(selectedStartTime);
                                if (startIndex >= 0) {
                                  setShowTimePicker(true);
                                }
                              }}
                              icon={<AntDesign name="down-circle" size={18} color="black" />}
                          />
                        )}
                      </>
                    )}
                </View>

                {/* Next Button */}
                <TouchableOpacity
                    onPress={handleNext}
                    className="rounded-lg border overflow-hidden absolute bottom-0 right-0 mr-2 bg-[#FFF201]"
                >
                    <View className="px-6 py-1 items-center rounded-full">
                        <Text className="font-bold text-black text-lg">Next</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>

            {/* Source Picker Modal */}
            <Modal
                visible={showSourcePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowSourcePicker(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-5 max-h-[50%]">
                        <Text className="text-xl font-bold mb-4">Select Source</Text>
                        <FlatList
                            data={sources}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="py-4 border-b border-gray-200"
                                    onPress={() => {
                                        setSource(item);
                                        setShowSourcePicker(false);
                                    }}
                                >
                                    <Text className="text-lg">{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* Venue Picker Modal */}
            <Modal
                visible={showVenuePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowVenuePicker(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-5 max-h-[50%]">
                        <Text className="text-xl font-bold mb-4">Select Venue</Text>
                        {venues.length === 0 ? (
                            <Text className="py-4 text-gray-500">No venues found</Text>
                        ) : (
                            <FlatList
                                data={venues}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        className="py-4 border-b border-gray-200"
                                        onPress={() => {
                                            setSelectedVenue(item);
                                            setShowVenuePicker(false);
                                        }}
                                    >
                                        <Text className="text-lg">{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                </View>
            </Modal>

            {/* Court Picker Modal */}
            <Modal
                visible={showCourtPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCourtPicker(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-5 max-h-[50%]">
                        <Text className="text-xl font-bold mb-4">Select Court</Text>
                        {courts.length === 0 ? (
                            <Text className="py-4 text-gray-500">No courts found</Text>
                        ) : (
                            <FlatList
                                data={courts}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        className="py-4 border-b border-gray-200"
                                        onPress={() => {
                                            setSelectedCourt(item);
                                            setAmount(String(item.pricePerSlot));
                                            setSelectedStartTime("");
                                            setSelectedEndTime("");
                                            setShowCourtPicker(false);
                                        }}
                                    >
                                        <Text className="text-lg">{item.sportType} - {item.name}</Text>
                                        <Text className="text-sm text-gray-500">INR {item.pricePerSlot} per slot</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                </View>
            </Modal>

            {/* Payment Status Picker Modal */}
            <Modal
                visible={showPaymentPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPaymentPicker(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-5 max-h-[50%]">
                        <Text className="text-xl font-bold mb-4">Select Payment Status</Text>
                        <FlatList
                            data={["unpaid", "partial", "paid"]}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="py-4 border-b border-gray-200"
                                    onPress={() => {
                                        setPaymentStatus(item as "unpaid" | "partial" | "paid");
                                        setShowPaymentPicker(false);
                                    }}
                                >
                                    <Text className="text-lg capitalize">{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* Time Picker Modal */}
            <Modal
                visible={showTimePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowTimePicker(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-5 max-h-[70%]">
                        <Text className="text-xl font-bold mb-4">
                          {selectedStartTime ? "Select End Time" : "Select Start Time"}
                        </Text>
                        {availableTimeSlots.length === 0 ? (
                            <Text className="py-4 text-gray-500">No time slots available</Text>
                        ) : (
                            <FlatList
                                data={selectedStartTime 
                                  ? availableTimeSlots.filter(time => {
                                      const startIndex = availableTimeSlots.indexOf(selectedStartTime);
                                      const currentIndex = availableTimeSlots.indexOf(time);
                                      return currentIndex > startIndex;
                                    })
                                  : availableTimeSlots}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => {
                                  const [hours, minutes] = item.split(':');
                                  const hour = parseInt(hours);
                                  const period = hour >= 12 ? 'PM' : 'AM';
                                  const displayHour = hour % 12 || 12;
                                  const displayTime = `${displayHour}:${minutes} ${period}`;
                                  
                                  return (
                                    <TouchableOpacity
                                        className="py-4 border-b border-gray-200"
                                        onPress={() => {
                                          if (!selectedStartTime) {
                                            setSelectedStartTime(item);
                                            setShowTimePicker(false);
                                            // Auto-select end time (next slot)
                                            const currentIndex = availableTimeSlots.indexOf(item);
                                            if (currentIndex >= 0 && currentIndex < availableTimeSlots.length - 1) {
                                              setSelectedEndTime(availableTimeSlots[currentIndex + 1]);
                                            }
                                          } else {
                                            setSelectedEndTime(item);
                                            setShowTimePicker(false);
                                          }
                                        }}
                                    >
                                        <Text className="text-lg">{displayTime}</Text>
                                    </TouchableOpacity>
                                  );
                                }}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    </SafeAreaView>
  );
}
