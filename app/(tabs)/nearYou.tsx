import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ImageBackground, Modal, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Search } from 'lucide-react-native';
import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Iconify from "@/components/Iconify";
import Swiper from "react-native-swiper";

const filterData: Record<
  string,
  { type: "multi" | "single"; options: string[] }
> = {
  "Sort by": {
    type: "single",
    options: [
      "Relevance",
      "Popularity",
      "Price- High to low",
      "Price- Low to high",
      "Distance- Nearest once",
    ],
  },
  Sport: {
    type: "multi",
    options: [
      "Box cricket",
      "Box football",
      "Badminton",
      "Cricket (Open)",
      "Cricket Nets",
      "Tennis",
      "Table tennis",
      "Volleyball",
      "Swimming",
      "Bowling",
    ],
  },
  Category: {
    type: "multi",
    options: ["Team sport", "Individual sport"],
  },
  "Court type": {
    type: "multi",
    options: ["Indoor", "Outdoor", "Artificial grass", "Natural turf"],
  },
  Pricing: {
    type: "single",
    options: [
      "INR 500-1000",
      "INR 1000-1500",
      "INR 1500-2000",
      "INR 2000-2500",
      "INR 2500 & above",
    ],
  },
};

export default function NearYou() {
  const theme = useTheme();
  const [isSortingOpen, setIsSortingOpen] = useState(false);
    const turfs = [
    {
        id: "1",
        name: "Nik box turf",
        images: [
                  "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg",
                  "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
                  "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg"
                ],
        rating: 3.4,
        location: "Gaziabad",
        offer: "Flat 5% Off",
        price: "INR 999 Onwards",
        tag: "Trending",
        bestFor: "Best for cricket",
        distance: "2.2km",
        sportsAvailable: [
            {name:"Cricket" ,icon: "emojione-monotone:cricket-game"},
            {name:"Badminton" ,icon: "twemoji:badminton"},
            {name:"Pickleball" ,icon: "material-symbols-light:pickleball-rounded"}

        ],

    },
    {
        id: "2",
        name: "John box turf",
        images: [
                  "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
                  "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg",
                  "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg"
                ],
        rating: 3.5,
        location: "Delhi",
        offer: "Flat 5% Off",
        price: "INR 800 Onwards",
        tag: "Trending",
        bestFor: "Best for football",
        distance: "8km",
        sportsAvailable: [
            {name:"Volley Ball" ,icon:"mingcute:volleyball-fill"},
            { name:"Football" ,icon:"uil:football"}
        ],
    },
    {
        id: "3",
        name: "Chetana turf",
        images: [
                  "https://images.pexels.com/photos/6203527/pexels-photo-6203527.jpeg",
                  "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg",
                  "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg"
                ],
        rating: 4.8,
        location: "Noida",
        offer: "Flat 20% Off",
        price: "INR 1200 Onwards",
        tag: "Premium",
        bestFor: "Best for tennis",
        distance: "15km",
        sportsAvailable: [
            {name:"Cricket" ,icon:"emojione-monotone:cricket-game"},
            {name:"Football" ,icon:"uil:football"},
            { name:"Tennis" ,icon:"fa6-solid:table-tennis-paddle-ball"}
        ],
    },
    ];
    const sortingOptions = [
                    "Relevance",
                    "Popularity",
                    "Price- High to low",
                    "Price- Low to high",
                    "Distance- Nearest once",
                  ];
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [price, setPrice] = useState([1000, 2000]);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({});
    const [activeTab, setActiveTab] = useState("Sport");
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

    const toggleOption = (tab: string, option: string, type: "multi" | "single") => {
      setSelectedFilters((prev) => {
        const prevOptions = prev[tab] || [];
        if (type === "multi") {
          if (prevOptions.includes(option)) {
            return { ...prev, [tab]: prevOptions.filter((o) => o !== option) };
          }
          return { ...prev, [tab]: [...prevOptions, option] };
        } else {
          return { ...prev, [tab]: [option] };
        }
      });
    };

    const clearAll = () => setSelectedFilters({});

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
                    {/* Menu Button */}
                    <TouchableOpacity
                      className="w-10 h-10 rounded-full items-center justify-center"
                      onPress={() => router.push("/settings/ProfileScreen")}
                    >
                      <Iconify icon="fluent-mdl2:collapse-menu" size={30} color="black" type="svg" />
                    </TouchableOpacity>
                </View>
            </View>
            <View className='flex-row mb-2 justify-center'>
                <TouchableOpacity  style={{backgroundColor: isSortingOpen? theme.colors.primary:'white'}} onPress={()=> setIsSortingOpen(!isSortingOpen)} className="px-3 py-2 border rounded-lg flex-row items-center mr-1">
                    <Text className="mr-1 font-bold">Sort by</Text>
                    <Ionicons name="swap-vertical" size={16} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor: filterVisible? theme.colors.primary:'white'}} onPress={() => setFilterVisible(true)} className="px-3 py-2 border rounded-lg flex-row items-center mr-1">
                    <Text className='mr-1 font-bold'>Filter by</Text>
                    <Ionicons name="grid" size={16} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor: isPricingOpen? theme.colors.primary:'white'}} onPress={() => setIsPricingOpen(true)} className="px-3 py-2 border rounded-lg mr-1">
                    <Text className='font-bold'>Pricing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor: isLocationOpen? theme.colors.primary:'white'}} onPress={() => setIsLocationOpen(true)} className="px-3 py-2 border rounded-lg mr-1">
                    <Text className='font-bold'>Location</Text>
                </TouchableOpacity>
            </View>
            {filterVisible
            ?(
              <View className="flex-1 bg-black/50 justify-center items-center">
                  <View className="flex-row items-center bg-white border rounded-2xl p-2 mb-4 shadow-sm">
                      <View className="flex-row flex-1">
                          {/* Left Sidebar */}
                          <View className="w-[30%] border-r border-gray-300">
                              <FlatList
                                  data={Object.keys(filterData)}
                                  keyExtractor={(item) => item}
                                  showsVerticalScrollIndicator={false}
                                  renderItem={({ item }) => (
                                      <TouchableOpacity
                                          onPress={() => setActiveTab(item)}
                                          className="py-3"
                                      >
                                      <Text
                                          className={`${
                                          activeTab === item ? "font-bold text-black" : "text-gray-500"
                                          }`}
                                      >
                                          {item}
                                      </Text>
                                      <View className="border-t border-gray-300 my-1" style={{ width: "80%" }} />
                                      </TouchableOpacity>
                                  )}
                              />
                          </View>

                          {/* Vertical Divider */}
                          <View className="w-px bg-gray-300" />

                          {/* Right Content */}
                          <View className="w-[70%] pl-3">
                              {filterData[activeTab].type === "multi" ? (
                              <FlatList
                                  data={filterData[activeTab].options}
                                  keyExtractor={(item) => item}
                                  numColumns={2} // 👈 ensures exactly 2 items per row
                                  columnWrapperStyle={{ justifyContent: "flex-start", marginBottom: 8 }}
                                  renderItem={({ item: option }) => {
                                  const selected = selectedFilters[activeTab]?.includes(option);
                                  return (
                                      <TouchableOpacity
                                          onPress={() => toggleOption(activeTab, option, "multi")}
                                          className="flex-1 px-1 py-1 rounded-md border mx-1"
                                          style={{backgroundColor: selected? theme.colors.primary: 'white'}}
                                      >
                                      <Text className={`text-xs ${selected ? "text-black font-bold" : "text-black"}`}>
                                          {option}
                                      </Text>
                                      </TouchableOpacity>
                                  );
                                  }}
                              />
                              ) : (
                              <View>
                                  {filterData[activeTab].options.map((option) => {
                                  const selected = selectedFilters[activeTab]?.includes(option);
                                  return (
                                      <TouchableOpacity
                                          key={option}
                                          onPress={() => toggleOption(activeTab, option, "single")}
                                          className="flex-row items-center py-1"
                                      >
                                          <View className="flex-1 flex-row justify-between items-center py-1">
                                              <Text className={`${selected ? "font-bold" : "text-gray-700"}`}>
                                                  {option}
                                              </Text>
                                              {
                                                  selected ?(
                                                      <FontAwesome className="w-5 h-5 rounded-full border" name="circle" size={16} color={theme.colors.primary} />
                                                  ):(
                                                      <Entypo name="circle" size={16} color='black'/>
                                                  )
                                              }
                                          </View>
                                      </TouchableOpacity>
                                  );
                                  })}
                              </View>
                              )}

                          {/* Bottom Buttons */}
                          <View className="flex-row justify-between mt-4">
                              <TouchableOpacity onPress={clearAll} className="bg-blue-700 px-4 py-2 rounded-md">
                                  <Text className="text-white font-bold">Clear all</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                  className="bg-green-600 px-4 py-2 rounded-md"
                                  onPress={()=> setFilterVisible(false)}
                                  >
                                  <Text className="text-white font-bold">Apply</Text>
                              </TouchableOpacity>
                          </View>
                          </View>
                      </View>

                  </View>
              </View>
            )
            :(
              <FlatList
                data={turfs}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 80 }}
                renderItem={({ item }) => (
                  <View className="flex-row items-center bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
                    {/* LEFT SIDE */}
                    <View className="w-[60%]">
                      <Swiper
                        showsPagination={true}
                        dotColor="#ccc"
                        activeDotColor="#16a34a"
                        style={{ height: 120 }}
                      >
                        {item.images.map((uri: string, index: number) => (
                          <Image
                            key={index}
                            source={{ uri }}
                            className="w-full h-44 rounded-md"
                            resizeMode="cover"
                          />
                        ))}
                      </Swiper>
                      <View>
                          <Text className="font-bold text-lg">{item.name}</Text>
                          <View className='flex-row justify-between items-center'>
                            <View className="flex-row items-center">
                              <Text className="text-gray-500 text-xs mr-2">{item.location}</Text>
                              <Text className="text-xs text-gray-700 bg-gray-200 px-2 py-0.5 rounded-md">
                                {item.distance}
                              </Text>
                            </View>
                            <Text
                              className="font-bold text-white text-sm rounded-full px-3"
                              style={{ backgroundColor: "#16a34a" }}
                            >
                              {item.rating}
                            </Text>
                          </View>
                      </View>
                    </View>

                    {/* RIGHT SIDE */}
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/nearYou/turfDetails",
                          params: { id: item.id },
                        })}
                      className="w-[40%] flex-col justify-between py-2 pr-2">
                      <View className="flex-1 items-end">
                        <Text className="text-white text-[10px] bg-blue-600 px-2 py-0.5 rounded-md mb-1">
                          {item.tag}
                        </Text>
                        <Text className="text-white text-[10px] bg-gray-500 px-2 py-0.5 rounded-md mb-1">
                          {item.bestFor}
                        </Text>
                        <FontAwesome
                          className="mb-2"
                          name="bookmark-o"
                          size={20}
                          color="black"
                        />
                      </View>
                      <View className="flex-row items-center justify-end mb-3">
                          {item.sportsAvailable.map((sport, index) => (
                            <View key={`${item.id}-${sport.name}-${index}`} className="mr-1">
                              <Iconify icon={sport.icon} size={24} color="black" type="svg" />
                            </View>
                          ))}
                      </View>

                      <View className="flex-1 mx-2">
                        <LinearGradient
                          colors={["#008000", "#CCF3BA"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0.7, y: 0 }}
                          className="px-1 mb-1"
                        >
                          <Text className="text-xs text-white font-bold">{item.offer}</Text>
                        </LinearGradient>
                        <View className="border-t border-gray-300 my-1" />
                      </View>

                      <Text className="text-blue-700 font-bold text-right">{item.price}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
            <Modal
              transparent
              visible={isSortingOpen}
              animationType="fade"
              onRequestClose={() => setIsSortingOpen(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                className="flex-1 bg-black/20"
              >
                <View className="absolute top-28 left-4 bg-white border border-gray-300 rounded-lg shadow-lg w-48 p-2">
                  {sortingOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        console.log("Selected:", option);
                        setIsSortingOpen(false);
                      }}
                      className="py-1"
                    >
                      <Text
                        className={`${
                          option === "Price- High to low" ? "font-bold" : ""
                        } text-gray-800`}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
            <Modal
              visible={isPricingOpen}
              transparent
              animationType="fade"
              onRequestClose={()=>setIsPricingOpen(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                className="flex-1 bg-black/20"
              >
                <View className="absolute top-28 left-4 right-4 bg-white rounded-2xl shadow-lg p-4">
                  {/* Range Slider */}
                   <MultiSlider
                      values={price}
                      min={0}
                      max={10000}
                      step={100}
                      sliderLength={280}
                      onValuesChange={(val) => setPrice(val)}
                      selectedStyle={{ backgroundColor: theme.colors.primary }}
                      unselectedStyle={{ backgroundColor: "#000" }}
                      markerStyle={{ backgroundColor: "black" }}
                  />
                  {/* Range Text */}
                  <Text className="mt-3 text-base font-bold">
                    INR {price[0].toLocaleString()} -{" "}
                    {price[1].toLocaleString()}
                  </Text>
                  {/* Bottom Buttons */}
                  <View className="flex-row justify-between mt-4">
                      <TouchableOpacity onPress={clearAll} className="bg-blue-700 px-4 py-2 rounded-md">
                          <Text className="text-white font-bold">Clear all</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          className="bg-green-600 px-4 py-2 rounded-md"
                          onPress={()=> setIsPricingOpen(false)}
                          >
                          <Text className="text-white font-bold">Apply</Text>
                      </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
            <Modal
              transparent
              visible={isLocationOpen}
              animationType="fade"
              onRequestClose={() => setIsLocationOpen(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPressOut={() => setIsLocationOpen(false)} // close if clicked outside
                className="flex-1 bg-black/20"
              >
                <View className="absolute top-28 right-4 bg-white border border-gray-300 rounded-lg shadow-lg w-80 h-60 p-2">
                  <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <TextInput
                      style={[styles.searchInput, { color: theme.colors.text }]}
                      value={localSearchQuery}
                      onChangeText={setLocalSearchQuery}
                      placeholder="Search any location"
                      placeholderTextColor={theme.colors.textSecondary}
                      // onSubmitEditing={handleSearchSubmit}
                    />
                    <TouchableOpacity style={styles.searchButton}>
                      <Search size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
        </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  searchButton: {
    padding: 4,
  },
});
