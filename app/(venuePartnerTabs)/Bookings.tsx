import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { Entypo, FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Constants from "expo-constants";

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

export default function BookingsScreen() {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:5000';

  const [tab, setTab] = useState<"upcoming" | "completed" | "cancelled">("completed");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch bookings when tab changes
  useEffect(() => {
    fetchBookings();
  }, [tab, user?.accessToken]);

  const fetchBookings = async (isRefresh = false) => {
    if (!user?.accessToken) {
      setIsLoading(false);
      return;
    }

    if (!API_URL) {
      console.error('API_URL is not defined');
      setIsLoading(false);
      return;
    }

    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      // Map tab to status
      const statusMap: Record<string, string> = {
        "upcoming": "upcoming",
        "completed": "completed",
        "cancelled": "cancelled",
      };
      const status = statusMap[tab] || "";

      const url = `${API_URL}/api/venue-partner/bookings${status ? `?status=${status}` : ''}`;
      console.log('Fetching bookings from:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBookings(result.data.bookings || []);
        }
      } else {
        const error = await response.json();
        console.error('Bookings error:', error);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchBookings(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return `INR ${amount.toLocaleString('en-IN')}`;
  };

  const displayBookings = bookings;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center mb-5 px-5">
        <Text className="ml-3 text-xl font-bold mt-2">Bookings</Text>
      </View>

      {/* Content */}
        {isLoading && !isRefreshing ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <FlatList
            data={displayBookings}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 80 }}
            className="p-2"
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor="#000"
                colors={["#000"]}
              />
            }
            ListEmptyComponent={
              <View className="py-8 items-center">
                <Text className="text-gray-500 text-lg">No {tab} bookings found</Text>
              </View>
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
                          ${item.paymentStatus === "Completed" || item.payment === "Paid" ? "bg-green-600" : "bg-orange-400"} `}>
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

      {/* Tabs */}
      <View className="flex-row border border-gray-400 overflow-hidden rounded-md mx-5 mb-2">
        {["upcoming", "completed", "cancelled"].map((t) => (
          <TouchableOpacity
            key={t}
            className={`flex-1 p-3 ${
              tab === t ? "bg-black" : "bg-white"
            }`}
            onPress={() => {
              setTab(t as any);
              // fetchBookings will be called by useEffect when tab changes
            }}
          >
            <Text
              className={`text-center capitalize font-medium ${
                tab === t ? "text-white" : "text-black"
              }`}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
