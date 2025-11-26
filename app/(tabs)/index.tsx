import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  TextInput,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { mockBookings } from '@/data/mockData';
import { setVenues, setSearchQuery, toggleSportFilter } from '@/store/slices/venueSlice';
import { setBookings } from '@/store/slices/bookingSlice';
import { SportType } from '@/types';
import {
  Search,
  MapPin,
} from 'lucide-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Entypo, Fontisto } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 3;
const VENUE_MARGIN = 8;
const VENUE_CARD_SIZE = (width - (NUM_COLUMNS + 1) * VENUE_MARGIN) / NUM_COLUMNS;

// 🔹 Helper type: element type of filteredVenues from Redux
type VenueFromStore = RootState['venues']['filteredVenues'][number];

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [loadingVenues, setLoadingVenues] = useState<boolean>(false);
  const [venuesError, setVenuesError] = useState<string | null>(null);

  const slideAnim = useState(new Animated.Value(width * 0.8))[0];

  // If you need auth/guest later, you can still grab them from state.auth
  const { filteredVenues, searchQuery, selectedSports } = useSelector(
    (state: RootState) => state.venues
  );

  // Enhanced sports data with better images (static – used for "Choose your Sport")
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

  // Sport Events data (still static – no API given for this)
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

  // Interest-based sports (circular design – static)
  const interestSports = [
    { id: 'table_tennis', name: 'Table Tennis', icon: '🏓', image: 'https://images.pexels.com/photos/6203527/pexels-photo-6203527.jpeg' },
    { id: 'football', name: 'Box Football', icon: '⚽', image: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg' },
    { id: 'cricket', name: 'Box Cricket', icon: '🏏', image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg' },
    { id: 'tennis', name: 'Tennis', icon: '🎾', image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg' },
  ];

  // 🔹 Map venue.sportsOffered → image URL (fallback if nothing matches)
  const getVenueImage = (venue: VenueFromStore): string => {
    const firstSport = (venue.sportsOffered?.[0] || '').toLowerCase();

    if (firstSport.includes('cricket')) {
      return 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg';
    }
    if (firstSport.includes('football')) {
      return 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg';
    }
    if (firstSport.includes('tennis')) {
      return 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg';
    }
    if (firstSport.includes('swim')) {
      return 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg';
    }
    if (firstSport.includes('badminton')) {
      return 'https://images.pexels.com/photos/6203527/pexels-photo-6203527.jpeg';
    }

    // Default stadium-ish image
    return 'https://images.pexels.com/photos/159698/basketball-court-sport-game-159698.jpeg';
  };

  // 🔹 Fetch venues from backend on mount
  useEffect(() => {
    const city = 'New Delhi'; // can later come from user's chosen city

    const fetchVenues = async () => {
      try {
        setLoadingVenues(true);
        setVenuesError(null);

        const params = new URLSearchParams({
          page: '1',
          limit: '30',
          isActive: 'true',
          isVerified: 'true',
          city,
        });

        const response = await fetch(`${API_URL}/api/venues?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch venues');
        }

        const json = await response.json();
        const apiVenues = json?.data?.venues ?? [];

        // Using `as any` so we don't fight with slice types here
        dispatch(setVenues(apiVenues as any));
      } catch (error) {
        console.error('Error while fetching venues:', error);
        setVenuesError(
          (error as Error)?.message || 'Something went wrong while fetching venues.'
        );
      } finally {
        setLoadingVenues(false);
      }
    };

    fetchVenues();

    // Bookings still from mock for now – you can wire an API later
    dispatch(setBookings(mockBookings));
  }, [dispatch]);

  // 🔹 Derived lists from Redux data
  const trendingVenues: VenueFromStore[] = filteredVenues.filter(
    (venue) => venue.isTrending
  );

  const topRatedVenues: VenueFromStore[] = [...filteredVenues]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6);

  const handleSearchSubmit = () => {
    if (localSearchQuery.trim()) {
      dispatch(setSearchQuery(localSearchQuery.trim()));
    } else {
      // if user clears input and hits search, reset in store as well
      dispatch(setSearchQuery(''));
    }
  };

  const handleSportPress = (sportId: string) => {
    dispatch(toggleSportFilter(sportId as SportType));
  };

  const handleVenuePress = (venueId: string) => {
    // Using backend ID (_id) – ensure your /venue screen reads this param
    router.push({
      pathname: '/venue',
      params: { venueId },
    });
  };

  const renderSportCard = ({
    item,
  }: {
    item: (typeof sportsWithImages)[number];
    index: number;
  }) => (
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

  const renderVenueCard = ({ item }: { item: VenueFromStore }) => {
    const imageUri = getVenueImage(item);

    return (
      <TouchableOpacity
        style={styles.venueCard}
        onPress={() => handleVenuePress((item as any)._id)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: imageUri }} style={styles.venueImage} />
        <View style={styles.venueOverlay}>
          <ThemedText size="sm" weight="bold" style={styles.venueName}>
            {item.venueName}
          </ThemedText>
          <View style={styles.venueLocation}>
            <MapPin size={12} color="#fff" />
            <Text style={styles.venueLocationText}>
              {item.location?.city || 'Unknown'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEventCard = ({ item }: { item: (typeof sportEvents)[number] }) => (
    <TouchableOpacity style={styles.venueCard} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={styles.venueImage} />
      <View style={styles.venueOverlay}>
        <ThemedText size="sm" weight="bold" style={styles.venueName}>
          {item.name}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ImageBackground
        source={require('../../assets/images/background.png')}
        resizeMode="cover"
        className="flex-1"
      >
        {/* Fixed Header */}
        <View
          style={[
            styles.fixedHeader,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.locationContainer}>
                <MaterialCommunityIcons
                  name="map-marker-radius"
                  size={24}
                  color="blue"
                />
                <ThemedText
                  size="sm"
                  weight="bold"
                  className="underline"
                  style={styles.locationText}
                >
                  New Delhi
                </ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => router.push('/settings/ruleBook')}>
                <Image
                  source={require('../../assets/images/clipboard.png')}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsNotificationsVisible(true)}>
                <Fontisto
                  className="ml-2"
                  name="bell-alt"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.menuButton,
                  { backgroundColor: theme.colors.accent },
                ]}
                onPress={() => router.push('/settings/ProfileScreen')}
                className="w-10 h-10 rounded-full items-center justify-center bg-gray-200 ml-2"
              >
                <FontAwesome name="user" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <TextInput
                style={[styles.searchInput, { color: theme.colors.text }]}
                value={localSearchQuery}
                onChangeText={setLocalSearchQuery}
                placeholder="Search game, venue, trending sport..."
                placeholderTextColor={theme.colors.textSecondary}
                onSubmitEditing={handleSearchSubmit}
              />
              <TouchableOpacity
                onPress={handleSearchSubmit}
                style={styles.searchButton}
              >
                <Search size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {venuesError && (
              <View style={{ marginTop: 8 }}>
                <Text style={{ color: 'red', fontSize: 12 }}>{venuesError}</Text>
              </View>
            )}
          </View>

          {/* Loading state */}
          {loadingVenues && filteredVenues.length === 0 ? (
            <View style={{ paddingVertical: 40 }}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <>
              {/* Choose your Sport Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <ThemedText className="underline" size="lg" weight="bold">
                    Choose your Sport
                  </ThemedText>
                  <TouchableOpacity>
                    <View style={styles.moreButton}>
                      <ThemedText size="sm" weight="bold">
                        more
                      </ThemedText>
                      <View style={[styles.moreIcon]}>
                        <ThemedText size="xs" weight="bold">
                          <AntDesign
                            name="right-circle"
                            size={14}
                            color="black"
                          />
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

              {/* Trending in the city – dynamic from API */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <ThemedText className="underline" size="lg" weight="bold">
                    Trending in the city
                  </ThemedText>
                  <TouchableOpacity>
                    <View style={styles.moreButton}>
                      <ThemedText size="sm" weight="bold">
                        more
                      </ThemedText>
                      <View style={[styles.moreIcon]}>
                        <ThemedText size="xs" weight="bold">
                          <AntDesign
                            name="right-circle"
                            size={14}
                            color="black"
                          />
                        </ThemedText>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={trendingVenues}
                  renderItem={renderVenueCard}
                  keyExtractor={(item) => (item as any)._id}
                  numColumns={NUM_COLUMNS}
                  columnWrapperStyle={{ justifyContent: 'space-between' }}
                  contentContainerStyle={{ paddingHorizontal: VENUE_MARGIN }}
                  scrollEnabled={false}
                  ListEmptyComponent={
                    <View style={{ paddingHorizontal: 16 }}>
                      <Text style={{ fontSize: 12 }}>
                        No trending venues found.
                      </Text>
                    </View>
                  }
                />
              </View>

              {/* Top rated Venues – dynamic from API */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <ThemedText className="underline" size="lg" weight="bold">
                    Top rated Venues
                  </ThemedText>
                  <TouchableOpacity>
                    <View style={styles.moreButton}>
                      <ThemedText size="sm" weight="bold">
                        more
                      </ThemedText>
                      <View style={[styles.moreIcon]}>
                        <ThemedText size="xs" weight="bold">
                          <AntDesign
                            name="right-circle"
                            size={14}
                            color="black"
                          />
                        </ThemedText>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={topRatedVenues}
                  renderItem={renderVenueCard}
                  keyExtractor={(item) => (item as any)._id}
                  numColumns={NUM_COLUMNS}
                  columnWrapperStyle={{ justifyContent: 'space-between' }}
                  contentContainerStyle={{ paddingHorizontal: VENUE_MARGIN }}
                  scrollEnabled={false}
                  ListEmptyComponent={
                    <View style={{ paddingHorizontal: 16 }}>
                      <Text style={{ fontSize: 12 }}>
                        No venues found yet.
                      </Text>
                    </View>
                  }
                />
              </View>

              {/* Sporting Events – still mock */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <ThemedText className="underline" size="lg" weight="bold">
                    Sporting Events
                  </ThemedText>
                  <TouchableOpacity>
                    <View style={styles.moreButton}>
                      <ThemedText size="sm" weight="bold">
                        more
                      </ThemedText>
                      <View style={[styles.moreIcon]}>
                        <ThemedText size="xs" weight="bold">
                          <AntDesign
                            name="right-circle"
                            size={14}
                            color="black"
                          />
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
                  columnWrapperStyle={{ justifyContent: 'space-between' }}
                  contentContainerStyle={{ paddingHorizontal: VENUE_MARGIN }}
                  scrollEnabled={false}
                />
              </View>

              {/* From your Interest – static for now */}
              <View className="my-4">
                <View className="mb-3 px-3">
                  <ThemedText className="underline" size="lg" weight="bold">
                    From your Interest
                  </ThemedText>
                </View>

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
                      <Image
                        source={{ uri: item.image }}
                        className="w-full h-full rounded-full"
                      />
                      <View className="absolute inset-0 justify-end items-center pb-2">
                        <Text className="text-white font-bold text-xs">
                          {item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* CTA Section */}
              <View className="flex-1 justify-center px-4 py-10">
                <Text className="text-3xl font-bold text-black">
                  India's only ultimate sports
                </Text>
                <Text className="text-3xl font-bold text-black">
                  ecosystem{' '}
                  <Text
                    style={{
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 10,
                    }}
                    className="text-3xl text-blue-600 font-bold shadow-white"
                  >
                    Ofside
                  </Text>
                </Text>
              </View>
            </>
          )}
        </ScrollView>

        {/* Notifications Modal */}
        <Modal
          isVisible={isNotificationsVisible}
          onBackdropPress={() => setIsNotificationsVisible(false)}
          onBackButtonPress={() => setIsNotificationsVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} className="flex-1">
            <View className="absolute right-4 bg-white border border-gray-300 rounded-2xl shadow-lg w-48 py-5 px-2">
              <View>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-bold text-lg">Notifications</Text>
                  <Entypo
                    onPress={() => setIsNotificationsVisible(false)}
                    name="circle-with-cross"
                    size={20}
                    color="black"
                  />
                </View>
                <View>
                  <Text className="border-b border-gray-400">Post a match</Text>
                  <Text className="border-b border-gray-400">Post a match</Text>
                  <Text className="border-b border-gray-400">Post a match</Text>
                  <Text className="border-b border-gray-400">Post a match</Text>
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
  menuButton: {
    padding: 8,
  },
  searchContainer: {
    marginTop: 10,
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
    width: (width - 36 - 16) / 5,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    marginHorizontal: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  sportImage: {
    width: '100%',
    height: '100%',
  },
  sportOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 4,
  },
  sportText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  venueCard: {
    width: VENUE_CARD_SIZE,
    height: VENUE_CARD_SIZE,
    marginBottom: VENUE_MARGIN,
    borderRadius: 12,
    overflow: 'hidden',
  },
  venueImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  venueOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 6,
  },
  venueName: {
    color: '#fff',
  },
  venueLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
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
});
