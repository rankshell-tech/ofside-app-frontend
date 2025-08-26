import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, Modal, Linking, Animated, TextInput, ImageBackground } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { SearchBar } from '@/components/ui/SearchBar';
import { VenueCard } from '@/components/ui/VenueCard';
import { SportChip } from '@/components/ui/SportChip';
import { BookingCard } from '@/components/ui/BookingCard';
import { useTheme } from '@/hooks/useTheme';
import { sports } from '@/constants/theme';
import { mockVenues, mockBookings } from '@/data/mockData';
import { setVenues, setSearchQuery, toggleSportFilter } from '@/store/slices/venueSlice';
import { setBookings } from '@/store/slices/bookingSlice';
import { SportType } from '@/types';
import { Menu, X, User, Wallet, Calendar, Gift, Star, MessageCircle, Facebook, Twitter, Instagram, Search, MapPin, ChevronDown } from 'lucide-react-native';
import { Trophy } from 'lucide-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();

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
      image: 'https://images.pexels.com/photos/159698/basketball-court-sport-game-159698.jpeg',
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
      image: 'https://images.pexels.com/photos/159698/basketball-court-sport-game-159698.jpeg',
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

  const menuItems = [
    { icon: <User size={20} color={theme.colors.textSecondary} />, title: 'My Profile', onPress: () => router.push('/(tabs)/profile') },
    { icon: <Wallet size={20} color={theme.colors.textSecondary} />, title: 'My Wallet', onPress: () => {} },
    { icon: <MaterialIcons name="scoreboard" size={24} color={theme.colors.textSecondary} />, title: 'Sports Scoring', onPress: () => router.push('/scoring/sportsScoring') },
    { icon: <Calendar size={20} color={theme.colors.textSecondary} />, title: 'My Bookings', onPress: () => router.push('/(tabs)/bookings') },
    { icon: <Trophy size={20} color={theme.colors.textSecondary} />, title: 'Live Scoring', onPress: () => { closeMenu(); router.push('/scoring'); } },
    { icon: <Gift size={20} color={theme.colors.textSecondary} />, title: 'Refer and Earn', onPress: () => {} },
    { icon: <Star size={20} color={theme.colors.textSecondary} />, title: 'Rate App', onPress: () => {} },
    { icon: <MessageCircle size={20} color={theme.colors.textSecondary} />, title: 'Contact Ofside', onPress: () => router.push('/profile/help') },
  ];

  const socialIcons = [
    { icon: <Facebook size={24} color={theme.colors.textSecondary} />, url: 'https://facebook.com' },
    { icon: <Twitter size={24} color={theme.colors.textSecondary} />, url: 'https://twitter.com' },
    { icon: <Instagram size={24} color={theme.colors.textSecondary} />, url: 'https://instagram.com' },
  ];

  useEffect(() => {
    // Load mock data
    dispatch(setVenues(mockVenues));
    dispatch(setBookings(mockBookings));
  }, [dispatch]);

  const handleSearchSubmit = () => {
    if (localSearchQuery.trim()) {
      dispatch(setSearchQuery(localSearchQuery.trim()));
      router.push(`/search-results?query=${encodeURIComponent(localSearchQuery.trim())}`);
    }
  };

  const handleSportPress = (sportId: string) => {
    // Navigate to search results with sport filter
    dispatch(toggleSportFilter(sportId as SportType));
    router.push(`/search-results?sport=${sportId}`);
  };

  const handleVenuePress = (venueId: string) => {
    if (mockVenues.find(v => v.id === venueId)) {
      router.push(`/venue/${venueId}`);
    } else {
      // For trending/top rated venues that don't exist in mock data
      router.push('/search-results');
    }
  };

  const handleEventPress = (eventId: string) => {
    // Navigate to event details or events listing
    router.push('/search-results?category=events');
  };

  const handleSocialPress = (url: string) => {
    Linking.openURL(url);
  };

  const openMenu = () => {
    setIsMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: width * 0.8,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuOpen(false);
    });
  };

  const renderSportCard = ({ item, index }: { item: typeof sportsWithImages[0], index: number }) => (
    <TouchableOpacity
      style={[styles.sportCard, { marginRight: (index + 1) % 5 === 0 ? 0 : 8 }]}
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
        <View style={styles.venueLocation}>
          <MapPin size={12} color="white" />
          <ThemedText size="xs" style={styles.venueLocationText}>
            {item.location}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEventCard = ({ item }: { item: typeof sportEvents[0] }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => handleEventPress(item.id)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventOverlay}>
        <ThemedText size="sm" weight="bold" style={styles.eventName}>
          {item.name}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  const renderInterestCard = ({ item }: { item: typeof interestSports[0] }) => (
    <TouchableOpacity
      style={styles.interestCard}
      onPress={() => handleSportPress(item.id)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.interestImage} />
      <View style={styles.interestOverlay}>
        <ThemedText size="sm" weight="bold" style={styles.interestText}>
          {item.name}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/background.png")} // Put your image in assets/images
        resizeMode="contain"
        className="flex-1"
      >
        {/* Enhanced Fixed Header */}
        <View style={[styles.fixedHeader, { backgroundColor: theme.colors.background }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Image
                source={{ uri: 'https://ofside.in/assets/ofside-logo.png' }}
                style={styles.logo}
                resizeMode="contain"
              />
              <TouchableOpacity style={styles.locationContainer}>
                <MapPin size={16} color={theme.colors.primary} />
                <ThemedText size="sm" weight="medium" style={styles.locationText}>
                  Vaishali, UP
                </ThemedText>
                <ChevronDown size={14} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={[styles.walletButton, { backgroundColor: theme.colors.primary }]}>
                <ThemedText size="lg" weight="bold" style={{ color: theme.colors.accent }}>
                  ₹
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={openMenu}
              >
                <Menu size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Hero Banner */}
          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg' }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlay}>
              <ThemedText size="2xl" weight="bold" style={styles.bannerTitle}>
                Find Your Perfect
              </ThemedText>
              <ThemedText size="2xl" weight="bold" style={styles.bannerTitle}>
                Sports Venue
              </ThemedText>
              <ThemedText size="base" style={styles.bannerSubtitle}>
                Book premium sports facilities in your area
              </ThemedText>
            </View>
          </View>

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
              <ThemedText size="lg" weight="bold">
                Choose your Sport
              </ThemedText>
              <TouchableOpacity onPress={() => router.push('/search-results')}>
                <View style={styles.moreButton}>
                  <ThemedText size="sm" style={{ color: theme.colors.primary }}>
                    more
                  </ThemedText>
                  <View style={[styles.moreIcon, { backgroundColor: theme.colors.primary }]}>
                    <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background }}>
                      <AntDesign name="right" size={10}/>
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
              <ThemedText size="lg" weight="bold">
                Trending in the city
              </ThemedText>
              <TouchableOpacity onPress={() => router.push('/search-results?trending=true')}>
                <View style={styles.moreButton}>
                  <ThemedText size="sm" style={{ color: theme.colors.primary }}>
                    more
                  </ThemedText>
                  <View style={[styles.moreIcon, { backgroundColor: theme.colors.primary }]}>
                    <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background }}>
                      <AntDesign name="right" size={10}/>
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={trendingVenues}
              renderItem={renderVenueCard}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.venuesList}
            />
          </View>

          {/* Top rated Venues */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText size="lg" weight="bold">
                Top rated Venues
              </ThemedText>
              <TouchableOpacity onPress={() => router.push('/search-results?sort=rating')}>
                <View style={styles.moreButton}>
                  <ThemedText size="sm" style={{ color: theme.colors.primary }}>
                    more
                  </ThemedText>
                  <View style={[styles.moreIcon, { backgroundColor: theme.colors.primary }]}>
                    <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background }}>
                      <AntDesign name="right" size={10}/>
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={topRatedVenues}
              renderItem={renderVenueCard}
              keyExtractor={(item) => `top-${item.id}`}
              contentContainerStyle={styles.venuesList}
            />
          </View>

          {/* NEW: Sport Events Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText size="lg" weight="bold">
                Sporting Events
              </ThemedText>
              <TouchableOpacity onPress={() => router.push('/search-results?category=events')}>
                <View style={styles.moreButton}>
                  <ThemedText size="sm" style={{ color: theme.colors.primary }}>
                    more
                  </ThemedText>
                  <View style={[styles.moreIcon, { backgroundColor: theme.colors.primary }]}>
                    <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background }}>
                      <AntDesign name="right" size={10}/>
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={sportEvents}
              renderItem={renderEventCard}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.venuesList}
            />
          </View>

          {/* NEW: From your Interest Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText size="lg" weight="bold">
                From your Interest
              </ThemedText>
            </View>

            <View style={styles.interestContainer}>
              {interestSports.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.interestCard}
                  onPress={() => handleSportPress(item.id)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: item.image }} style={styles.interestImage} />
                  <View style={styles.interestOverlay}>
                    <ThemedText size="sm" weight="bold" style={styles.interestText}>
                      {item.name}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Enhanced CTA Section */}
          <View className="flex-1 justify-center px-6 py-10">
            <Text className="text-3xl font-bold text-black">
              Book your play space in
            </Text>
            <Text className="text-3xl font-bold text-black">
              seconds with{" "}
              <Text className="text-3xl font-bold text-blue-600">Ofside</Text>
            </Text>
          </View>

          {/* Upcoming Bookings for logged in users */}
          {!isGuest && bookings.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText size="lg" weight="bold">
                  Your Upcoming Bookings
                </ThemedText>
                <TouchableOpacity onPress={() => router.push('/(tabs)/bookings')}>
                  <ThemedText size="sm" style={{ color: theme.colors.primary }}>
                    View All
                  </ThemedText>
                </TouchableOpacity>
              </View>
              {bookings.slice(0, 2).map((booking) => (
                <BookingCard key={booking.id} booking={booking} showActions={false} />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Enhanced Hamburger Menu Modal */}
        <Modal
          visible={isMenuOpen}
          animationType="none"
          transparent={true}
          onRequestClose={closeMenu}
        >
            <TouchableOpacity
              style={styles.menuOverlay}
              activeOpacity={1}
              onPress={closeMenu}
            >
              <Animated.View
                style={[
                  styles.menuContainer,
                  {
                    backgroundColor: theme.colors.background,
                    transform: [{ translateX: slideAnim }]
                  }
                ]}
              >
                {/* Enhanced Menu Header */}
                <View style={[styles.menuHeader, { borderBottomColor: theme.colors.border }]}>
                  <View style={styles.menuHeaderContent}>
                    <View style={[styles.userAvatar, { backgroundColor: theme.colors.primary }]}>
                      <FontAwesome name="user" size={40} color={theme.colors.accent} />
                    </View>
                    <View style={styles.userInfo}>
                      <ThemedText size="lg" weight="bold">
                        {isGuest ? 'Guest User' : user?.name || 'Guest User'}
                      </ThemedText>
                      <ThemedText variant="secondary" size="sm">
                        {isGuest ? 'Browsing as Guest' : user?.email || 'Welcome to Ofside'}
                      </ThemedText>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: theme.colors.surface }]}
                    onPress={closeMenu}
                  >
                    <X size={20} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>
              <ScrollView>
                {/* Enhanced Menu Items */}
                <View style={styles.menuItems}>
                  {menuItems.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.menuItem, { backgroundColor: theme.colors.background }]}
                      onPress={() => {
                        closeMenu();
                        item.onPress();
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.surface }]}>
                        {item.icon}
                      </View>
                      <View style={styles.menuItemContent}>
                        <ThemedText size="base" weight="medium" style={styles.menuItemText}>
                          {item.title}
                        </ThemedText>
                      </View>
                      <View style={styles.menuItemArrow}>
                        <ThemedText variant="secondary" size="lg">›</ThemedText>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Enhanced Social Section */}
                <View style={[styles.socialSection, { borderTopColor: theme.colors.border }]}>
                  <ThemedText size="sm" weight="medium" style={styles.socialTitle}>
                    Follow Us
                  </ThemedText>
                  <View style={styles.socialIcons}>
                    {socialIcons.map((social, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.socialIcon, { backgroundColor: theme.colors.surface }]}
                        onPress={() => handleSocialPress(social.url)}
                        activeOpacity={0.7}
                      >
                        {social.icon}
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Legal Links */}
                  <View style={styles.legalLinks}>
                    <TouchableOpacity>
                      <ThemedText size="sm" style={{ color: theme.colors.primary }}>
                        Terms of Use
                      </ThemedText>
                    </TouchableOpacity>
                    <ThemedText size="sm" variant="secondary"> • </ThemedText>
                    <TouchableOpacity>
                      <ThemedText size="sm" style={{ color: theme.colors.primary }}>
                        Privacy Policy
                      </ThemedText>
                    </TouchableOpacity>
                  </View>

                  <ThemedText variant="secondary" size="xs" style={styles.versionText}>
                    Ofside v1.0.0
                  </ThemedText>
                </View>
              </ScrollView>
              </Animated.View>
            </TouchableOpacity>
        </Modal>
      </ImageBackground>
    </ThemedView>
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
    alignItems: 'center',
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
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moreIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportsGrid: {
    paddingHorizontal: 24,
    gap: 8,
  },
  sportCard: {
    width: (width - 48 - 32) / 5, // 5 columns with padding and gaps
    height: 85,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  sportImage: {
    width: '100%',
    height: '100%',
  },
  sportOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  sportText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    lineHeight: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  venuesList: {
    paddingLeft: 24,
  },
  venueCard: {
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
  venueImage: {
    width: '100%',
    height: '100%',
  },
  venueOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  venueName: {
    color: 'white',
    marginBottom: 4,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    justifyContent: 'center',
    padding: 8,
  },
  interestText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
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
