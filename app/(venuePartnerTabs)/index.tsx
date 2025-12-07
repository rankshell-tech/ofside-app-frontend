import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, ImageBackground, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { AntDesign, Entypo, FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Iconify from "@/components/Iconify";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Constants from "expo-constants";

interface Venue {
  id: string;
  name: string;
}

interface Booking {
  id: string;
  bookingId: string;
  name: string;
  number: string;
  courtName: string;
  sportType: string;
  venueName: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  payment: string;
  paymentStatus: string;
  status: string;
}

interface Analytics {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:5000';

  const [tab, setTab] = useState<"Recent Booking" | "Analytics">("Recent Booking");
  const [activeTab, setActiveTab] = useState<"Today" | "This week" | "This month" | "Custom">("Today");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({ totalBookings: 0, totalRevenue: 0, totalUsers: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showVenueDropdown, setShowVenueDropdown] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, [activeTab, user?.accessToken]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (showVenueDropdown) {
      const timer = setTimeout(() => {
        // Auto-close after 5 seconds or handle outside click
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showVenueDropdown]);

  const fetchDashboardData = async (isRefresh = false) => {
    if (!user?.accessToken) {
      setIsLoading(false);
      return;
    }

    if (!API_URL) {
      console.error('API_URL is not defined');
      Alert.alert("Error", "API URL is not configured. Please check your environment variables.");
      setIsLoading(false);
      return;
    }

    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      // Map activeTab to period
      const periodMap: Record<string, string> = {
        "Today": "today",
        "This week": "week",
        "This month": "month",
        "Custom": "",
      };
      const period = periodMap[activeTab] || "";

      const url = `${API_URL}/api/venue-partner/dashboard${period ? `?period=${period}` : ''}`;
      console.log('Fetching dashboard from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Dashboard response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Dashboard data received:', result);
        if (result.success) {
          setVenues(result.data.venues || []);
          setBookings(result.data.recentBookings || []);
          setAnalytics(result.data.analytics || { totalBookings: 0, totalRevenue: 0, totalUsers: 0 });
          
          // Set first venue as selected if available
          if (result.data.venues && result.data.venues.length > 0 && !selectedVenue) {
            setSelectedVenue(result.data.venues[0]);
          }
        } else {
          throw new Error(result.message || 'Failed to fetch dashboard data');
        }
      } else {
        let errorMessage = "Failed to fetch dashboard data";
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
          console.error('Dashboard error response:', error);
        } catch (e) {
          console.error('Failed to parse error response:', e);
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error fetching dashboard:', error);
      const errorMessage = error?.message || error?.toString() || "Failed to load dashboard data";
      if (!isRefresh) {
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchDashboardData(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return `INR ${amount.toLocaleString('en-IN')}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
          source={require("../../assets/images/background.png")} // Put your image in assets/images
          resizeMode="cover"
          className="flex-1"
      >
        {/* Header */}
        <TouchableOpacity onPress={()=> router.push("/settings/ProfileScreen")} className="flex-row justify-end items-center mb-5 px-5">
            <Iconify icon="teenyicons:menu-outline" size={30} color="black" type="svg" />
        </TouchableOpacity>

        {/* Content */}
            <View className="mx-2">
                <Text className="text-4xl font-bold mt-2">
                  {selectedVenue?.name || venues[0]?.name || "My Venues"}
                </Text>
                {venues.length > 0 ? (
                  <View className="relative">
                    <TouchableOpacity 
                      className="w-60 flex-row bg-[#fff201] py-1 px-5 rounded-full justify-between items-center mt-2"
                      onPress={() => setShowVenueDropdown(!showVenueDropdown)}
                    >
                      <Text className="text-base font-semibold" numberOfLines={1}>
                        {selectedVenue?.name || venues[0]?.name || "Select Venue"}
                      </Text>
                      <AntDesign name="down-circle" size={24} color="black" />
                    </TouchableOpacity>
                    {showVenueDropdown && (
                      <View className="absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48">
                        <FlatList
                          data={venues}
                          keyExtractor={(item) => item.id}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              className="px-4 py-3 border-b border-gray-200"
                              onPress={() => {
                                setSelectedVenue(item);
                                setShowVenueDropdown(false);
                                // Optionally filter bookings by venue
                              }}
                            >
                              <Text className="text-base font-semibold">{item.name}</Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    )}
                  </View>
                ) : !isLoading && (
                  <TouchableOpacity 
                    className="w-60 flex-row bg-[#fff201] py-1 px-5 rounded-full justify-between items-center mt-2"
                    onPress={() => router.push("/venue/addVenue")}
                  >
                    <Text className="text-base font-semibold">Add Your First Venue</Text>
                    <AntDesign name="plus-circle" size={24} color="black" />
                  </TouchableOpacity>
                )}
            </View>
            <View className="flex-row  mx-5 mt-5 mb-2">
                {["Recent Booking", "Analytics"].map((t) => (
                    <TouchableOpacity
                        key={t}
                        className={`flex-1 p-3 border mr-5 overflow-hidden rounded-md ${
                            tab === t ? "bg-[#FFF201]" : "bg-white"
                        }`}
                        onPress={() => setTab(t as any)}
                    >
                    <Text
                        className={`text-center capitalize ${
                        tab === t ? "font-bold" : ""
                        }`}
                    >
                        {t}
                    </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {tab === "Analytics" && (
              <View className="border mx-2 my-2">
                <View className="flex-row  mx-5 mt-5 mb-2">
                    {["Today", "This week", "This month", "Custom"].map((t) => (
                        <TouchableOpacity
                            key={t}
                            className={`flex-1 px-2 py-1 border mr-2 overflow-hidden rounded-full ${
                                activeTab === t ? "bg-[#FFF201]" : "bg-gray-200"
                            }`}
                            onPress={() => {
                              setActiveTab(t as any);
                            }}
                        >
                        <Text
                            className={`text-[10px] text-center ${
                            activeTab === t ? "font-bold" : ""
                            }`}
                        >
                            {t}
                        </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {isLoading ? (
                  <View className="py-8 items-center">
                    <ActivityIndicator size="large" color="#FFF201" />
                  </View>
                ) : (
                  <>
                    <View className="flex-row justify-evenly items-center mx-2 my-2">
                        <View className="border border-gray-400 rounded-md px-2 py-2 bg-gray-200 items-center flex-1 mx-1">
                            <Text className="text-lg">Total Bookings</Text>
                            <Text className="text-3xl font-bold">{analytics.totalBookings}</Text>
                        </View>
                        <View className="border border-gray-400 rounded-md px-2 py-2 bg-gray-200 items-center flex-1 mx-1">
                            <View className="flex-row items-center justify-center">
                                <Text className="text-lg mr-2">Total Revenue</Text>
                                <Image
                                    source={require("../../assets/images/stat.png")}
                                    style={{
                                    width: 20,
                                    height: 20,
                                    resizeMode: "contain",
                                    }}
                                />
                            </View>
                            <Text className="text-2xl font-bold">{analytics.totalRevenue.toLocaleString('en-IN')}</Text>
                            <Text className="text-xs text-gray-600">INR</Text>
                        </View>
                    </View>
                    <View className="flex-row justify-evenly items-center mx-2 my-2 mb-4">
                        <View className="border border-gray-400 rounded-md px-5 py-2 bg-gray-200 items-center flex-1 mx-1">
                            <Text className="text-lg">Total Users</Text>
                            <Text className="text-3xl font-bold">{analytics.totalUsers}</Text>
                        </View>
                    </View>
                  </>
                )}
              </View>
            )}

            {tab === "Recent Booking" && (
              <>
                <Text className="text-xl font-bold mt-2 px-5">Recent Bookings</Text>
                {isLoading ? (
                  <View className="py-8 items-center">
                    <ActivityIndicator size="large" color="#FFF201" />
                  </View>
                ) : bookings.length === 0 ? (
                  <View className="py-8 items-center">
                    <Text className="text-gray-500 text-lg">No bookings found</Text>
                  </View>
                ) : (
                  <FlatList
                      data={bookings}
                      keyExtractor={(item) => item.id}
                      contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 80 }}
                      className="p-2"
                      refreshControl={
                        <RefreshControl
                          refreshing={isRefreshing}
                          onRefresh={onRefresh}
                          tintColor="#FFF201"
                          colors={["#FFF201"]}
                        />
                      }
                      renderItem={({ item }) => (
                      <TouchableOpacity className="flex-row items-center bg-gray-200 border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm" >
                          <View className="w-[60%]">
                              <View className="mb-20">
                                  <Text className="font-bold">#{item.bookingId}</Text>
                                  <View className="flex-row items-center">
                                      <Text className="font-bold">{item.sportType}</Text>
                                      <Text className="text-[10px] ml-3 mt-1">{item.courtName}</Text>
                                  </View>
                              </View>
                              <View className="">
                                  <Text className="font-bold">By {item.name}</Text>
                                  <Text className="text-sm">{item.number}</Text>
                              </View>
                          </View>
                          <View className="w-[40%]">
                                  <View className="flex-row items-center justify-end mb-5">
                                      <TouchableOpacity>
                                          <Text className="border border-gray-400 rounded-full text-center text-[10px] px-3 py-1">Aggregator</Text>
                                      </TouchableOpacity>
                                      <Entypo className="ml-1" name="chevron-with-circle-right" size={20} color="black" />
                                  </View>
                              <View className="flex-1 justify-end items-end mb-10">
                                  <Text className="text-sm">{formatDate(item.date)}</Text>
                                  <Text className="text-sm">{item.location}</Text>
                              </View>

                              {/* Actions */}
                              <View className="flex-row">
                                  <TouchableOpacity className="flex-1">
                                      <Text
                                          className={`border border-gray-500 rounded-full text-center text-white px-2 py-1
                                              ${item.paymentStatus === "Completed" ? "bg-green-600" : item.payment === "Paid" ? "bg-green-600" : "bg-orange-400"} `}>
                                              {item.payment}
                                      </Text>
                                  </TouchableOpacity>
                                  <View className="w-2" />
                                  <TouchableOpacity className="flex-1">
                                      <Text className="text-center text-green-600 font-bold">{formatCurrency(item.price)}</Text>
                                  </TouchableOpacity>
                              </View>
                          </View>
                      </TouchableOpacity>
                      )}
                  />
                )}
              </>
            )}
      </ImageBackground>
    </SafeAreaView>
  );
}
