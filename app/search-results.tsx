import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { SearchBar } from '@/components/ui/SearchBar';
import { VenueCard } from '@/components/ui/VenueCard';
import { SportChip } from '@/components/ui/SportChip';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { setSearchQuery, toggleSportFilter, clearFilters } from '@/store/slices/venueSlice';
import { ArrowLeft, Filter, SlidersHorizontal, X } from 'lucide-react-native';
import { sports } from '@/constants/theme';
import { SportType, Venue } from '@/types';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, runOnJS } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type SortOption = 'relevance' | 'rating' | 'price_low' | 'price_high' | 'distance';
type CategoryType = 'all' | 'team' | 'individual';
type CourtType = 'all' | 'natural' | 'indoor' | 'outdoor' | 'synthetic' | 'clay' | 'hardcourt';

export default function SearchResults() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { query } = useLocalSearchParams<{ query: string }>();

  const { venues, searchQuery, selectedSports } = useSelector((state: RootState) => state.venues);
  const [localSearchQuery, setLocalSearchQuery] = useState(query || searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);
  const [minRating, setMinRating] = useState(0);
  const [category, setCategory] = useState<CategoryType>('all');
  const [courtType, setCourtType] = useState<CourtType>('all');

  // Constants for price slider
  const SLIDER_WIDTH = 280;
  const MIN_PRICE = 0;
  const MAX_PRICE = 200;

  // Price slider values
  const minPriceSlider = useSharedValue(0);
  const maxPriceSlider = useSharedValue(SLIDER_WIDTH);

  useEffect(() => {
    if (query && query !== searchQuery) {
      dispatch(setSearchQuery(query));
      setLocalSearchQuery(query);
    }
  }, [query, searchQuery, dispatch]);

  useEffect(() => {
    // Initialize slider positions based on price values
    minPriceSlider.value = (minPrice / MAX_PRICE) * SLIDER_WIDTH;
    maxPriceSlider.value = (maxPrice / MAX_PRICE) * SLIDER_WIDTH;
  }, []);

  const handleSearch = (text: string) => {
    setLocalSearchQuery(text);
    dispatch(setSearchQuery(text));
  };

  const getMinPrice = (venue: Venue): number => {
    const allCourts = venue.facilities.flatMap(f => f.courts);
    return Math.min(...allCourts.map(c => c.hourlyRate));
  };

  const getSportCategory = (sport: string): 'team' | 'individual' => {
    const teamSports = ['football', 'basketball', 'volleyball', 'cricket'];
    return teamSports.includes(sport) ? 'team' : 'individual';
  };

  const getCourtType = (venue: Venue): CourtType[] => {
    // Mock court types based on venue - in real app this would come from venue data
    const courtTypes: CourtType[] = [];

    venue.facilities.forEach(facility => {
      switch (facility.sport) {
        case 'football':
          courtTypes.push('natural', 'synthetic');
          break;
        case 'tennis':
          courtTypes.push('clay', 'hardcourt', 'indoor');
          break;
        case 'basketball':
          courtTypes.push('indoor', 'outdoor');
          break;
        case 'badminton':
        case 'squash':
        case 'table_tennis':
          courtTypes.push('indoor');
          break;
        default:
          courtTypes.push('outdoor');
      }
    });

    return [...new Set(courtTypes)]; // Remove duplicates
  };

  const filterVenues = (venues: Venue[]): Venue[] => {
    let filtered = venues.filter(venue => {
      // Text search
      const matchesSearch = !localSearchQuery ||
        venue.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        venue.address.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        venue.description.toLowerCase().includes(localSearchQuery.toLowerCase());

      // Sport filter
      const matchesSport = selectedSports.length === 0 ||
        venue.facilities.some(facility => selectedSports.includes(facility.sport));

      // Rating filter
      const matchesRating = venue.rating >= minRating;

      // Price filter
      const minPrice = getMinPrice(venue);
      const matchesPrice = minPrice >= minPrice && minPrice <= maxPrice;

      // Category filter
      const matchesCategory = category === 'all' ||
        venue.facilities.some(facility => getSportCategory(facility.sport) === category);

      // Court type filter
      const venueCourtTypes = getCourtType(venue);
      const matchesCourtType = courtType === 'all' || venueCourtTypes.includes(courtType);

      return matchesSearch && matchesSport && matchesRating && matchesPrice && matchesCategory && matchesCourtType;
    });

    // Sort venues
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_low':
        filtered.sort((a, b) => getMinPrice(a) - getMinPrice(b));
        break;
      case 'price_high':
        filtered.sort((a, b) => getMinPrice(b) - getMinPrice(a));
        break;
      case 'distance':
        // Mock distance sorting - in real app would use user location
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // relevance
        // Keep original order for relevance
        break;
    }

    return filtered;
  };

  const filteredVenues = filterVenues(venues);

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'distance', label: 'Distance' },
  ];

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 3, label: '3+ Stars' },
    { value: 4, label: '4+ Stars' },
    { value: 4.5, label: '4.5+ Stars' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'team', label: 'Team Sports' },
    { value: 'individual', label: 'Individual Sports' },
  ];

  const courtTypeOptions = [
    { value: 'all', label: 'All Court Types' },
    { value: 'natural', label: 'Natural Grass' },
    { value: 'synthetic', label: 'Synthetic Turf' },
    { value: 'indoor', label: 'Indoor Courts' },
    { value: 'outdoor', label: 'Outdoor Courts' },
    { value: 'clay', label: 'Clay Courts' },
    { value: 'hardcourt', label: 'Hard Courts' },
  ];

  const clearAllFilters = () => {
    dispatch(clearFilters());
    setSortBy('relevance');
    setMinPrice(0);
    setMaxPrice(200);
    minPriceSlider.value = 0;
    maxPriceSlider.value = SLIDER_WIDTH;
    setMinRating(0);
    setCategory('all');
    setCourtType('all');
  };

  const hasActiveFilters = selectedSports.length > 0 || sortBy !== 'relevance' || minPrice > 0 || maxPrice < 200 || minRating > 0 || category !== 'all' || courtType !== 'all';

  // Price slider gesture handlers
  const minPriceGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = minPriceSlider.value;
    },
    onActive: (event, context) => {
      const newValue = Math.max(0, Math.min(maxPriceSlider.value - 20, (context.startX || 0) + event.translationX));
      minPriceSlider.value = newValue;
      const price = Math.round((newValue / SLIDER_WIDTH) * MAX_PRICE);
      runOnJS(setMinPrice)(price);
    },
  });

  const maxPriceGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = maxPriceSlider.value;
    },
    onActive: (event, context) => {
      const newValue = Math.max(minPriceSlider.value + 20, Math.min(SLIDER_WIDTH, (context.startX || 0) + event.translationX));
      maxPriceSlider.value = newValue;
      const price = Math.round((newValue / SLIDER_WIDTH) * MAX_PRICE);
      runOnJS(setMaxPrice)(price);
    },
  });

  const minPriceAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: minPriceSlider.value }],
    };
  });

  const maxPriceAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: maxPriceSlider.value }],
    };
  });

  const sliderTrackStyle = useAnimatedStyle(() => {
    return {
      left: minPriceSlider.value,
      width: maxPriceSlider.value - minPriceSlider.value,
    };
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <ThemedText size="lg" weight="bold">
              Search Results
            </ThemedText>
            <ThemedText variant="secondary" size="sm">
              {filteredVenues.length} venues found
            </ThemedText>
          </View>
          <TouchableOpacity onPress={() => setShowFilters(true)}>
            <Filter size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={localSearchQuery}
          onChangeText={handleSearch}
          placeholder="Search venues by name or location..."
        />

        {/* Active Filters */}
        {hasActiveFilters && (
          <View style={styles.activeFiltersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeFilters}>
              {selectedSports.map((sport) => {
                const sportData = sports.find(s => s.id === sport);
                return (
                  <TouchableOpacity
                    key={sport}
                    style={[styles.activeFilterChip, { backgroundColor: theme.colors.primary }]}
                    onPress={() => dispatch(toggleSportFilter(sport))}
                  >
                    <ThemedText size="xs" style={{ color: theme.colors.accent }}>
                      {sportData?.name}
                    </ThemedText>
                    <X size={12} color={theme.colors.accent} style={styles.filterRemoveIcon} />
                  </TouchableOpacity>
                );
              })}
              {sortBy !== 'relevance' && (
                <View style={[styles.activeFilterChip, { backgroundColor: theme.colors.accent }]}>
                  <ThemedText size="xs" style={{ color: theme.colors.background }}>
                    {sortOptions.find(o => o.value === sortBy)?.label}
                  </ThemedText>
                </View>
              )}
              {(minPrice > 0 || maxPrice < 200) && (
                <View style={[styles.activeFilterChip, { backgroundColor: theme.colors.accent }]}>
                  <ThemedText size="xs" style={{ color: theme.colors.background }}>
                    ${minPrice} - ${maxPrice}
                  </ThemedText>
                </View>
              )}
              {minRating > 0 && (
                <View style={[styles.activeFilterChip, { backgroundColor: theme.colors.accent }]}>
                  <ThemedText size="xs" style={{ color: theme.colors.background }}>
                    {ratingOptions.find(o => o.value === minRating)?.label}
                  </ThemedText>
                </View>
              )}
              {category !== 'all' && (
                <View style={[styles.activeFilterChip, { backgroundColor: theme.colors.accent }]}>
                  <ThemedText size="xs" style={{ color: theme.colors.background }}>
                    {categoryOptions.find(o => o.value === category)?.label}
                  </ThemedText>
                </View>
              )}
              {courtType !== 'all' && (
                <View style={[styles.activeFilterChip, { backgroundColor: theme.colors.accent }]}>
                  <ThemedText size="xs" style={{ color: theme.colors.background }}>
                    {courtTypeOptions.find(o => o.value === courtType)?.label}
                  </ThemedText>
                </View>
              )}
            </ScrollView>
            <TouchableOpacity onPress={clearAllFilters} style={styles.clearFiltersButton}>
              <ThemedText size="xs" style={{ color: theme.colors.primary }}>
                Clear All
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* Results */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {filteredVenues.length > 0 ? (
            filteredVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onPress={() => router.push(`/venue/${venue.id}`)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <ThemedText size="lg" weight="medium" style={styles.emptyTitle}>
                No venues found
              </ThemedText>
              <ThemedText variant="secondary" size="base" style={styles.emptyDescription}>
                Try adjusting your search terms or filters to find more venues.
              </ThemedText>
              <Button
                title="Clear Filters"
                onPress={clearAllFilters}
                variant="outline"
                style={styles.clearButton}
              />
            </View>
          )}
        </ScrollView>

        {/* Filters Modal */}
        <Modal
          visible={showFilters}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowFilters(false)}
        >
          <ThemedView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <ThemedText size="lg" weight="bold">
                Filters & Sorting
              </ThemedText>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Sort By */}
              <View style={styles.filterSection}>
                <ThemedText size="base" weight="bold" style={styles.filterTitle}>
                  Sort By
                </ThemedText>
                <View style={styles.optionsContainer}>
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        {
                          backgroundColor: sortBy === option.value ? theme.colors.primary : theme.colors.surface,
                          borderColor: sortBy === option.value ? theme.colors.primary : theme.colors.border,
                        },
                      ]}
                      onPress={() => setSortBy(option.value as SortOption)}
                    >
                      <ThemedText
                        size="sm"
                        style={{
                          color: sortBy === option.value ? theme.colors.accent : theme.colors.text,
                        }}
                      >
                        {option.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Sports Filter */}
              <View style={styles.filterSection}>
                <ThemedText size="base" weight="bold" style={styles.filterTitle}>
                  Sports
                </ThemedText>
                <View style={styles.sportsContainer}>
                  {sports.map((sport) => (
                    <SportChip
                      key={sport.id}
                      sport={sport.id as SportType}
                      selected={selectedSports.includes(sport.id as SportType)}
                      onPress={() => dispatch(toggleSportFilter(sport.id as SportType))}
                    />
                  ))}
                </View>
              </View>

              {/* Price Range */}
              <View style={styles.filterSection}>
                <ThemedText size="base" weight="bold" style={styles.filterTitle}>
                  Price Range (${minPrice} - ${maxPrice})
                </ThemedText>
                <View style={styles.sliderContainer}>
                  <View style={styles.sliderLabels}>
                    <ThemedText variant="secondary" size="xs">$0</ThemedText>
                    <ThemedText variant="secondary" size="xs">$200+</ThemedText>
                  </View>
                  <View style={styles.sliderWrapper}>
                    <View style={[styles.sliderTrack, { backgroundColor: theme.colors.border }]} />
                    <Animated.View style={[styles.sliderActiveTrack, { backgroundColor: theme.colors.primary }, sliderTrackStyle]} />

                    <PanGestureHandler onGestureEvent={minPriceGestureHandler}>
                      <Animated.View style={[styles.sliderThumb, { backgroundColor: theme.colors.primary }, minPriceAnimatedStyle]}>
                        <View style={[styles.sliderThumbInner, { backgroundColor: theme.colors.background }]} />
                      </Animated.View>
                    </PanGestureHandler>

                    <PanGestureHandler onGestureEvent={maxPriceGestureHandler}>
                      <Animated.View style={[styles.sliderThumb, { backgroundColor: theme.colors.primary }, maxPriceAnimatedStyle]}>
                        <View style={[styles.sliderThumbInner, { backgroundColor: theme.colors.background }]} />
                      </Animated.View>
                    </PanGestureHandler>
                  </View>
                </View>
              </View>

              {/* Rating Filter */}
              <View style={styles.filterSection}>
                <ThemedText size="base" weight="bold" style={styles.filterTitle}>
                  Minimum Rating
                </ThemedText>
                <View style={styles.optionsContainer}>
                  {ratingOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        {
                          backgroundColor: minRating === option.value ? theme.colors.primary : theme.colors.surface,
                          borderColor: minRating === option.value ? theme.colors.primary : theme.colors.border,
                        },
                      ]}
                      onPress={() => setMinRating(option.value)}
                    >
                      <ThemedText
                        size="sm"
                        style={{
                          color: minRating === option.value ? theme.colors.accent : theme.colors.text,
                        }}
                      >
                        {option.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Category Filter */}
              <View style={styles.filterSection}>
                <ThemedText size="base" weight="bold" style={styles.filterTitle}>
                  Category
                </ThemedText>
                <View style={styles.optionsContainer}>
                  {categoryOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        {
                          backgroundColor: category === option.value ? theme.colors.primary : theme.colors.surface,
                          borderColor: category === option.value ? theme.colors.primary : theme.colors.border,
                        },
                      ]}
                      onPress={() => setCategory(option.value as CategoryType)}
                    >
                      <ThemedText
                        size="sm"
                        style={{
                          color: category === option.value ? theme.colors.accent : theme.colors.text,
                        }}
                      >
                        {option.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Court Type Filter */}
              <View style={styles.filterSection}>
                <ThemedText size="base" weight="bold" style={styles.filterTitle}>
                  Type of Court
                </ThemedText>
                <View style={styles.optionsContainer}>
                  {courtTypeOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        {
                          backgroundColor: courtType === option.value ? theme.colors.primary : theme.colors.surface,
                          borderColor: courtType === option.value ? theme.colors.primary : theme.colors.border,
                        },
                      ]}
                      onPress={() => setCourtType(option.value as CourtType)}
                    >
                      <ThemedText
                        size="sm"
                        style={{
                          color: courtType === option.value ? theme.colors.accent : theme.colors.text,
                        }}
                      >
                        {option.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <Button
                title="Clear All"
                onPress={clearAllFilters}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Apply Filters"
                onPress={() => setShowFilters(false)}
                style={styles.modalButton}
              />
            </View>
          </ThemedView>
        </Modal>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 5,
    paddingBottom: 20,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  activeFilters: {
    flex: 1,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterRemoveIcon: {
    marginLeft: 4,
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptyDescription: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  clearButton: {
    paddingHorizontal: 32,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterTitle: {
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  sliderContainer: {
    paddingVertical: 20,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sliderWrapper: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  sliderTrack: {
    height: 4,
    width: 280,
    borderRadius: 2,
  },
  sliderActiveTrack: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sliderThumbInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});