import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, Modal, Linking, Animated, TextInput, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { BookingCard } from '@/components/ui/BookingCard';
import { useTheme } from '@/hooks/useTheme';
import { mockVenues, mockBookings } from '@/data/mockData';
import { setVenues, setSearchQuery, toggleSportFilter } from '@/store/slices/venueSlice';
import { setBookings } from '@/store/slices/bookingSlice';
import { SportType } from '@/types';
import { Menu, X, User, Wallet, Calendar, Gift, Star, MessageCircle, Facebook, Twitter, Instagram, Search, MapPin, ChevronDown } from 'lucide-react-native';
import { Trophy } from 'lucide-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 3;
const VENUE_MARGIN = 8;
const VENUE_CARD_SIZE = (width - (NUM_COLUMNS + 1) * VENUE_MARGIN) / NUM_COLUMNS;

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const turfs = [
    {
        id: "1",
        name: "Nik box turf",
        image: "https://picsum.photos/400/200?1",
        rating: 4.2,
        location: "Chasiboard",
        offer: "Flat 5% Off",
        price: "INR 1200 Onwards",
        tag: "Trending",
    },
    {
        id: "2",
        name: "Nik box turf",
        image: "https://picsum.photos/400/200?2",
        rating: 4.2,
        location: "Chasiboard",
        offer: "Flat 5% Off",
        price: "INR 1200 Onwards",
        tag: "Trending",
    },
    {
        id: "3",
        name: "Nik box turf",
        image: "https://picsum.photos/400/200?3",
        rating: 4.2,
        location: "Chasiboard",
        offer: "Flat 20% Off",
        price: "INR 1200 Onwards",
        tag: "Premium",
    },
    ];

  useEffect(() => {
    // Load mock data
    dispatch(setVenues(mockVenues));
    dispatch(setBookings(mockBookings));
  }, [dispatch]);

  return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <ImageBackground
            source={require("../../assets/images/background.png")} // Put your image in assets/images
            resizeMode="contain"
            className='flex-1'
        >
            {/* Enhanced Fixed Header */}
            <View style={{ backgroundColor: theme.colors.background }} className="px-4 py-2">
                <View className="flex-row justify-end items-center space-x-3">
                    {/* Wallet Button */}
                    <TouchableOpacity
                    style={{ backgroundColor: theme.colors.primary }}
                    className="w-10 h-10 rounded-full items-center justify-center"
                    >
                    <ThemedText size="lg" weight="bold" style={{ color: theme.colors.accent }}>
                        ₹
                    </ThemedText>
                    </TouchableOpacity>

                    {/* Menu Button */}
                    <TouchableOpacity
                    className="w-10 h-10 rounded-full items-center justify-center"
                    onPress={() => router.push("/ProfileScreen")}
                    >
                    <Menu size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="px-3 py-2 flex-row mb-2"
            >
                <TouchableOpacity className="px-4 py-2 border rounded-lg flex-row items-center">
                    <Ionicons name="swap-vertical" size={16} color="black" />
                    <Text className="ml-1">Sort by</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-4 py-2 border rounded-lg">
                    <Text>Filter by</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-4 py-2 border rounded-lg">
                    <Text>Pricing</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-4 py-2 border rounded-lg">
                    <Text>Location</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Turf Cards */}
            <FlatList
                data={turfs}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 80 }}
                renderItem={({ item }) => (
                <View className="bg-white rounded-2xl shadow mb-4 overflow-hidden border">
                    {/* Image */}
                    <Image source={{ uri: item.image }} className="w-full h-40" />

                    {/* Tag + Bookmark */}
                    <View className="absolute top-2 left-2 bg-gray-900/70 px-2 py-1 rounded">
                    <Text className="text-white text-xs">{item.tag}</Text>
                    </View>
                    <TouchableOpacity className="absolute top-2 right-2 bg-white p-1 rounded">
                    <Ionicons name="bookmark-outline" size={20} color="black" />
                    </TouchableOpacity>

                    {/* Info */}
                    <View className="p-3">
                    <Text className="font-bold text-lg">{item.name}</Text>
                    <Text className="text-xs text-gray-500">{item.location}</Text>

                    <View className="flex-row items-center justify-between mt-2">
                        <Text className="text-green-600 text-xs font-semibold">{item.offer}</Text>
                        <View className="flex-row items-center">
                        <Ionicons name="star" size={14} color="green" />
                        <Text className="ml-1 text-sm">{item.rating}</Text>
                        </View>
                    </View>

                    <Text className="text-blue-700 font-bold mt-2">{item.price}</Text>
                    </View>
                </View>
                )}
            />

        </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 80,
    height: 32,
    marginRight: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 225, 0, 0.1)',
    borderRadius: 20,
  },
  locationText: {
    marginLeft: 4,
    marginRight: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  walletButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  bannerContainer: {
    marginHorizontal: 24,
    marginVertical: 20,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bannerTitle: {
    color: 'white',
    textAlign: 'center',
    lineHeight: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  searchContainer: {
    marginTop:10,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  searchButton: {
    padding: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  moreIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportsGrid: {
    paddingHorizontal: 14,
    gap: 8,
  },
  sportCard: {
    width: (width - 48 - 32) / 5, // 5 columns with padding + spacing
    height: 60,                   // little taller for box look
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
    marginHorizontal: 4,
    overflow: "hidden",

    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,

    // Elevation for Android
    elevation: 3,
  },
  sportImage: {
    width: '100%',
    height: '100%',
  },
  sportOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)", // light overlay
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 4,
  },
  sportText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "600",
    textAlign: "center",
  },
  venuesList: {
    paddingLeft: 24,
  },
  venueCard: {
  width: VENUE_CARD_SIZE,
  height: VENUE_CARD_SIZE, // square
  marginBottom: VENUE_MARGIN,
  borderRadius: 12,
  overflow: "hidden",
  },
  venueImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  venueOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    padding: 6,
  },
  venueName: {
    color: "#fff",
  },
  venueLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueLocationText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // NEW: Event Card Styles
  eventCard: {
    width: 160,
    height: 130,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  eventOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  eventName: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // NEW: Interest Section Styles
  interestContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  interestCard: {
    width: (width - 48 - 48) / 4, // 4 columns with padding and gaps
    height: (width - 48 - 48) / 4,
    borderRadius: (width - 48 - 48) / 8, // Circular
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  interestImage: {
    width: '100%',
    height: '100%',
  },
  interestOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent:'flex-end',
    padding: 8,
  },
  interestText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: 13,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // Enhanced CTA Section
  ctaSection: {
    marginHorizontal: 24,
    marginVertical: 32,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 4,
  },
  ctaButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  // Enhanced Menu Styles
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  menuContainer: {
    width: '85%',
    height: '100%',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    paddingTop: 60,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: -3, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  menuHeader: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  menuHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userInfo: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItems: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginHorizontal: 12,
    marginVertical: 3,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  menuItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemText: {
    color: undefined,
  },
  menuItemArrow: {
    marginLeft: 8,
  },
  socialSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderTopWidth: 1,
  },
  socialTitle: {
    marginBottom: 20,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 28,
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  versionText: {
    textAlign: 'center',
  },
});
