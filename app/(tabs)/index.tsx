import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, Linking, Animated, TextInput, ImageBackground } from 'react-native';
import Modal from "react-native-modal";
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
import { Entypo, FontAwesome6, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Iconify from '@/components/Iconify';
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';


const { width } = Dimensions.get('window');
const NUM_COLUMNS = 3;
const VENUE_MARGIN = 8;
const VENUE_CARD_SIZE = (width - (NUM_COLUMNS + 1) * VENUE_MARGIN) / NUM_COLUMNS;

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false)

  const { user, isGuest } = useSelector((state: RootState) => state.auth);
  const { filteredVenues, searchQuery, selectedSports } = useSelector((state: RootState) => state.venues);
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const slideAnim = useState(new Animated.Value(width * 0.8))[0];

  // Enhanced sports data with better images
  const sportsWithImages = [
    { id: 'football', name: 'Football', icon: '⚽', image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg' },
    { id: 'cricket', name: 'Box Cricket', icon: '🏏', image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg' },
    { id: 'squash', name: 'Squash', icon: '🥎', image: 'https://images.pexels.com/photos/6203527/pexels-photo-6203527.jpeg' },
    { id: 'football', name: 'Box Football', icon: '⚽', image: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg' },
    { id: 'golf', name: 'Golf', icon: '⛳', image: 'https://images.pexels.com/photos/54123/pexels-photo-54123.jpeg' },
    { id: 'volleyball', name: 'Volleyball', icon: '🏐', image: 'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg' },
    { id: 'hockey', name: 'Hockey', icon: '🏒', image: 'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg' },
    { id: 'swimming', name: 'Swimming', icon: '🏊', image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg' },
    { id: 'table_tennis', name: 'Pickleball', icon: '🏓', image: 'https://images.pexels.com/photos/6203527/pexels-photo-6203527.jpeg' },
    { id: 'badminton', name: 'Badminton', icon: '🏸', image: 'https://images.pexels.com/photos/6203527/pexels-photo-6203527.jpeg' },
  ];

  // Trending venues data
  const trendingVenues = [
    {
      id: 'trending1',
      name: 'ABC Sport',
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
      location: 'Vaishali, UP',
      rating: 4.8,
      sport: 'tennis',
    },
    {
      id: 'trending2',
      name: 'XYZ Sport',
      image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
      location: 'Ghaziabad, UP',
      rating: 4.6,
      sport: 'swimming',
    },
    {
      id: 'trending3',
      name: 'ABC Club',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
      location: 'Noida, UP',
      rating: 4.9,
      sport: 'tennis',
    },
    
  ];

  // Top rated venues data
  const topRatedVenues = [
    {
      id: 'top1',
      name: 'ABC Sport',
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
      location: 'Vaishali, UP',
      rating: 4.8,
      sport: 'basketball',
    },
    {
      id: 'top2',
      name: 'XYZ Sport',
      image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
      location: 'Ghaziabad, UP',
      rating: 4.6,
      sport: 'swimming',
    },
    {
      id: 'top3',
      name: 'ABC Club',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
      location: 'Noida, UP',
      rating: 4.9,
      sport: 'tennis',
    },
  ];

  // Sport Events data
  const sportEvents = [
    {
      id: 'event1',
      name: 'Sports mela',
      image: 'https://images.pexels.com/photos/159698/basketball-court-sport-game-159698.jpeg',
      date: '2025-02-15',
      location: 'Delhi Sports Complex',
    },
    {
      id: 'event2',
      name: 'Sports mela',
      image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
      date: '2025-02-20',
      location: 'Mumbai Sports Arena',
    },
    {
      id: 'event3',
      name: 'Sports mela',
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
      date: '2025-02-25',
      location: 'Bangalore Sports Hub',
    },
  ];

  // Interest-based sports (circular design)
  const interestSports = [
    { id: 'table_tennis', name: 'Table Tennis', icon: '🏓', image: 'https://images.pexels.com/photos/6203527/pexels-photo-6203527.jpeg' },
    { id: 'football', name: 'Box Football', icon: '⚽', image: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg' },
    { id: 'cricket', name: 'Box Cricket', icon: '🏏', image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg' },
    { id: 'tennis', name: 'Tennis', icon: '🎾', image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg' },
  ];

  useEffect(() => {
    // Load mock data
    dispatch(setVenues(mockVenues));
    dispatch(setBookings(mockBookings));
  }, [dispatch]);

  const handleSearchSubmit = () => {
    if (localSearchQuery.trim()) {
      dispatch(setSearchQuery(localSearchQuery.trim()));
    }
  };

  const handleSportPress = (sportId: string) => {
    // Navigate to search results with sport filter
    dispatch(toggleSportFilter(sportId as SportType));
  };

  const handleVenuePress = (venueId: string) => {
    if (mockVenues.find(v => v.id === venueId)) {
      // router.push(`/venue/${venueId}`);
    } else {
      // For trending/top rated venues that don't exist in mock data
    }
  };

  const renderSportCard = ({ item, index }: { item: typeof sportsWithImages[0], index: number }) => (
    <TouchableOpacity
      style={styles.sportCard}
      onPress={() => handleSportPress(item.id)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.sportImage} />
      <View style={styles.sportOverlay}>
        <ThemedText size="xs" weight="bold" style={styles.sportText}>
          {item.name}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  const renderVenueCard = ({ item }: { item: typeof trendingVenues[0] }) => (
    <TouchableOpacity
      style={styles.venueCard}
      onPress={() => handleVenuePress(item.id)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.venueImage} />
      <View style={styles.venueOverlay}>
        <ThemedText size="sm" weight="bold" style={styles.venueName}>
          {item.name}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  const renderEventCard = ({ item }: { item: typeof sportEvents[0] }) => (
      <TouchableOpacity
        style={styles.venueCard}
        onPress={() => handleVenuePress(item.id)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.image }} style={styles.venueImage} />
        <View style={styles.venueOverlay}>
          <ThemedText size="sm" weight="bold" style={styles.venueName}>
            {item.name}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/background.png")} // Put your image in assets/images
        resizeMode="cover"
        className='flex-1'
      >
        {/* Enhanced Fixed Header */}
        <View style={[styles.fixedHeader, { backgroundColor: theme.colors.background }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.locationContainer}>
                <MaterialCommunityIcons name="map-marker-radius" size={24} color="blue" />
                <ThemedText size="sm" weight="bold" className='underline' style={styles.locationText}>
                  New Delhi
                </ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={()=> router.push('/settings/ruleBook')}>
                <Image
                    source={require("../../assets/images/clipboard.png")}
                    style={{ width: 30, height: 30 }}
                    resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> setIsNotificationsVisible(true)}>
                <Fontisto className='ml-2' name="bell-alt" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.menuButton, {backgroundColor: theme.colors.accent}]}
                onPress={()=> router.push('/settings/ProfileScreen')}
                className='w-10 h-10 rounded-full items-center justify-center bg-gray-200 ml-2'
              >
                <FontAwesome name="user" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Enhanced Search Bar */}
          <View style={styles.searchContainer}>
            <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <TextInput
                style={[styles.searchInput, { color: theme.colors.text }]}
                value={localSearchQuery}
                onChangeText={setLocalSearchQuery}
                placeholder="Search game, venue, trending sport..."
                placeholderTextColor={theme.colors.textSecondary}
                onSubmitEditing={handleSearchSubmit}
              />
              <TouchableOpacity onPress={handleSearchSubmit} style={styles.searchButton}>
                <Search size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          {/* Choose your Sport Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText className='underline' size="lg" weight="bold">
                Choose your Sport
              </ThemedText>
              <TouchableOpacity>
                <View style={styles.moreButton}>
                  <ThemedText size="sm" weight='bold'>
                    more
                  </ThemedText>
                  <View style={[styles.moreIcon]}>
                    <ThemedText size="xs" weight="bold">
                      <AntDesign name="right-circle" size={14} color="black" />
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <FlatList
              data={sportsWithImages}
              renderItem={renderSportCard}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              numColumns={5}
              scrollEnabled={false}
              contentContainerStyle={styles.sportsGrid}
            />
          </View>

          {/* Trending in the city */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText className='underline' size="lg" weight="bold">
                Trending in the city
              </ThemedText>
              <TouchableOpacity>
                  <View style={styles.moreButton}>
                    <ThemedText size="sm" weight='bold'>
                      more
                    </ThemedText>
                    <View style={[styles.moreIcon]}>
                      <ThemedText size="xs" weight="bold">
                      <AntDesign name="right-circle" size={14} color="black" />
                      </ThemedText>
                    </View>
                  </View>
              </TouchableOpacity>
            </View>

            <FlatList
              data={trendingVenues}
              renderItem={renderVenueCard}
              keyExtractor={(item) => item.id}
              numColumns={NUM_COLUMNS}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingHorizontal: VENUE_MARGIN }}
              scrollEnabled={false}
            />
          </View>

          {/* Top rated Venues */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText className='underline' size="lg" weight="bold">
                Top rated Venues
              </ThemedText>
              <TouchableOpacity>
                <View style={styles.moreButton}>
                    <ThemedText size="sm" weight='bold'>
                      more
                    </ThemedText>
                    <View style={[styles.moreIcon]}>
                      <ThemedText size="xs" weight="bold">
                        <AntDesign name="right-circle" size={14} color="black" />
                      </ThemedText>
                    </View>
                  </View>
              </TouchableOpacity>
            </View>

            <FlatList
              data={topRatedVenues}
              renderItem={renderVenueCard}
              keyExtractor={(item) => item.id}
              numColumns={NUM_COLUMNS}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingHorizontal: VENUE_MARGIN }}
              scrollEnabled={false}
            />
          </View>

           {/* NEW: Sport Events Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText className='underline' size="lg" weight="bold">
                Sporting Events
              </ThemedText>
              <TouchableOpacity>
                <View style={styles.moreButton}>
                  <ThemedText size="sm" weight='bold'>
                    more
                  </ThemedText>
                  <View style={[styles.moreIcon]}>
                    <ThemedText size="xs" weight="bold">
                      <AntDesign name="right-circle" size={14} color="black" />
                    </ThemedText>
                  </View>
                 </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={sportEvents}
              renderItem={renderEventCard}
              keyExtractor={(item) => item.id}
              numColumns={NUM_COLUMNS}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingHorizontal: VENUE_MARGIN }}
              scrollEnabled={false}
            />
          </View>

          {/* NEW: From your Interest Section */}
          <View className="my-4">
            {/* Section Header */}
            <View className="mb-3 px-3">
              <ThemedText className="underline" size="lg" weight="bold">
                From your Interest
              </ThemedText>
            </View>

            {/* Horizontal Scroll */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12 }}
            >
              {interestSports.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="w-28 h-28 mr-4 rounded-full overflow-hidden"
                  activeOpacity={0.8}
                  onPress={() => handleSportPress(item.id)}
                >
                  <Image source={{ uri: item.image }} className="w-full h-full rounded-full" />
                  <View className="absolute inset-0 justify-end items-center pb-2">
                    <Text className="text-white font-bold text-xs ">
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>



          {/* Enhanced CTA Section */}
          <View className="flex-1 justify-center px-4 py-10">
            <Text className="text-3xl font-bold text-black">
              India's only ultimate sports
            </Text>
            <Text className="text-3xl font-bold text-black">
              ecosystem{" "}
              <Text
                style={{
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 10,
                }}
                className='text-3xl text-blue-600 font-bold shadow-white'
              >
              Ofside
            </Text>
            </Text>
          </View>
          {/* Upcoming Bookings for logged in users */}
          {/* {!isGuest && bookings.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText size="lg" weight="bold">
                  Your Upcoming Bookings
                </ThemedText>
                <TouchableOpacity>
                  <ThemedText size="sm" style={{ color: theme.colors.primary }}>
                    View All
                  </ThemedText>
                </TouchableOpacity>
              </View>
              {bookings.slice(0, 2).map((booking) => (
                <BookingCard key={booking.id} booking={booking} showActions={false} />
              ))}
            </View>
          )} */}
        </ScrollView>

        <Modal
          isVisible={isNotificationsVisible}
          onBackdropPress={() => setIsNotificationsVisible(false)}
          onBackButtonPress={() => setIsNotificationsVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="flex-1"
          >
            <View className="absolute right-4 bg-white border border-gray-300 rounded-2xl shadow-lg w-48 py-5 px-2">
              <View>
                <View className='flex-row justify-between items-center mb-2'>
                  <Text className='font-bold text-lg'>Notifications</Text>
                  <Entypo onPress={()=> setIsNotificationsVisible(false)} name="circle-with-cross" size={20} color="black" />
                </View>
                <View>
                  <Text className='border-b border-gray-400'>Post a match</Text>
                  <Text className='border-b border-gray-400'>Post a match</Text>
                  <Text className='border-b border-gray-400'>Post a match</Text>
                  <Text className='border-b border-gray-400'>Post a match</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  locationText: {
    marginLeft: 4,
    marginRight: 2,

  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletButton: {
    width: 30,
    height: 30,
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
    borderRadius: 30,
    borderWidth: 1,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
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
    width: (width - 36 - 16) / 5, // 5 columns with padding + spacing
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
    paddingHorizontal: 18,
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
