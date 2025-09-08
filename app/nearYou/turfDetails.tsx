import React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, Linking, Animated, TextInput, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


export default function HomeScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const turfs = [
        {
            id: "1",
            name: "Nik box turf",
            image: "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg",
            rating: 4.2,
            location: "Chasiboard",
            offer: "Flat 5% Off",
            price: "INR 999 Onwards",
            tag: "Trending",
            bestFor: "Best for cricket",
            distance: "2.2km",
            address: "Guru Harkrishan Public School Ground, 32C/78, West Punjab Bagh, Punjab Bagh, New Delhi, Delhi, 110026",
            time: "6:00 AM to 12:00 AM",
            description: "sjdkds hdsfsht eihf sfsdkh uhfuhfdsksdf skf hsfad fjs fj sjdkds hdsfsht eihf sfsdkh uhfuhfdsksdf skf hsfad fjs fj",
            reviews: [
                {
                    id: "1",
                    name: "Swarti Jain",
                    rating: 4.3,
                    location: "Guru Harkrishan Public School Ground, Punjab Bagh, New Delhi, 110026"
                },
                {
                    id: "2",
                    name: "Rahul Sharma",
                    rating: 4.0,
                    location: "Guru Harkrishan Public School Ground, Punjab Bagh, New Delhi, 110026"
                },
            ],
            sportsAvailable: [
                {name:"Cricket" ,icon: "baseball-bat-ball"}
            ],
            amenties: [
                {name:"Washroom" ,icon: "restroom"},
                {name:"Parking" ,icon: "square-parking"},
                {name:"Flood lights" ,icon: "lightbulb"},
                {name:"Premium turf" ,icon: "leaf"},
                {name:"Equipments" ,icon: "dumbbell"},
                {name:"Wifi" ,icon: "wifi"},
            ]

        },
        {
            id: "2",
            name: "John box turf",
            image: "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
            rating: 4.2,
            location: "Chasiboard",
            offer: "Flat 5% Off",
            price: "INR 800 Onwards",
            tag: "Trending",
            bestFor: "Best for football",
            distance: "8km",
            address: "Guru Harkrishan Public School Ground, 32C/78, West Punjab Bagh, Punjab Bagh, New Delhi, Delhi, 110026",
            time: "6:00 AM to 12:00 AM",
            description: "sjdkds hdsfsht eihf sfsdkh uhfuhfdsksdf skf hsfad fjs fj sjdkds hdsfsht eihf sfsdkh uhfuhfdsksdf skf hsfad fjs fj",
            reviews: [
                {
                    id: "1",
                    name: "Swarti Jain",
                    rating: 4.3,
                    location: "Guru Harkrishan Public School Ground, Punjab Bagh, New Delhi, 110026"
                },
                {
                    id: "2",
                    name: "Rahul Sharma",
                    rating: 4.0,
                    location: "Guru Harkrishan Public School Ground, Punjab Bagh, New Delhi, 110026"
                },
            ],
            sportsAvailable: [
                {name:"Volley Ball" ,icon:"volleyball"},
                { name:"Football" ,icon:"basketball"}
            ],
            amenties: [
                {name:"Washroom" ,icon: "restroom"},
                {name:"Parking" ,icon: "square-parking"},
                {name:"Flood lights" ,icon: "lightbulb"},
                {name:"Premium turf" ,icon: "leaf"},
                {name:"Equipments" ,icon: "dumbbell"},
                {name:"Wifi" ,icon: "wifi"},
            ]
        },
        {
            id: "3",
            name: "Chetana turf",
            image: "https://images.pexels.com/photos/6203527/pexels-photo-6203527.jpeg",
            rating: 4.2,
            location: "Chasiboard",
            offer: "Flat 20% Off",
            price: "INR 1200 Onwards",
            tag: "Premium",
            bestFor: "Best for tennis",
            distance: "15km",
            address: "Guru Harkrishan Public School Ground, 32C/78, West Punjab Bagh, Punjab Bagh, New Delhi, Delhi, 110026",
            time: "6:00 AM to 12:00 AM",
            description: "sjdkds hdsfsht eihf sfsdkh uhfuhfdsksdf skf hsfad fjs fj sjdkds hdsfsht eihf sfsdkh uhfuhfdsksdf skf hsfad fjs fj",
            reviews: [
                {
                    id: "1",
                    name: "Swarti Jain",
                    rating: 4.3,
                    location: "Guru Harkrishan Public School Ground, Punjab Bagh, New Delhi, 110026"
                },
                {
                    id: "2",
                    name: "Rahul Sharma",
                    rating: 4.0,
                    location: "Guru Harkrishan Public School Ground, Punjab Bagh, New Delhi, 110026"
                },
            ],
            sportsAvailable: [
                {name:"Cricket" ,icon:"baseball-bat-ball"},
                {name:"Football" ,icon:"basketball"},
                { name:"Tennis" ,icon:"table-tennis-paddle-ball"}
            ],
            amenties: [
                {name:"Washroom" ,icon: "restroom"},
                {name:"Parking" ,icon: "square-parking"},
                {name:"Flood lights" ,icon: "lightbulb"},
                {name:"Premium turf" ,icon: "leaf"},
                {name:"Equipments" ,icon: "dumbbell"},
                {name:"Wifi" ,icon: "wifi"},
            ]
        },
        ];
  return (
      <SafeAreaView className="flex-1 bg-white">
        {turfs.filter(turf => turf.id === id).map(turf => (
            <ScrollView key={turf.id}>
                <View className="flex-1 px-4">
                    <Image  source={{ uri: turf.image }} className='w-full h-64'/>
                    <View className="flex-row justify-between items-center my-4">
                        <View>
                            <Text className="text-3xl font-bold text-blue-700">{turf.name}</Text>
                            <Text className="ml-1 text-xs font-bold">{turf.time}</Text>
                            <Text className="ml-1 text-xs text-gray-500 w-64">{turf.address}</Text>
                        </View>
                        <View className='flex-col items-end'>
                            <View className="flex-row items-center mb-8">
                                <FontAwesome name="share-square-o" size={18} color="black" />
                                <Text className="text-sm mx-1">{turf.reviews?.length} reviews</Text>
                                <View className="rounded-md px-2 py-1" style={{backgroundColor: '#16a34a'}}>
                                    <Text className="text-white font-bold">{turf.rating}</Text>
                                </View>
                            </View>
                            <TouchableOpacity className="mt-2 px-2 py-1 border rounded-md">
                                <Text className="text-xs text-gray-600">Show on map</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="border-t my-1" style={{ width: "70%" }} />

                    {/* Sports Available */}
                    <Text className="font-bold mb-2">Sports available</Text>
                    <View className="flex-row mb-4">
                    {turf.sportsAvailable.map((sport, index) => (
                        <View key={index} className="items-center mx-4">
                            <FontAwesome6 name={sport.icon} size={45} color="black" />
                            <Text className="text-xs mt-1">{sport.name}</Text>
                        </View>
                    ))}
                    </View>
                    <View className="border-t my-1" style={{ width: "70%" }} />

                    {/* Amenities */}
                    <Text className="font-bold mb-2">Amenities</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                    {turf.amenties.map((amenity, index) => (
                        <View
                            key={index}
                            className="items-center w-24 h-20 p-2 border rounded-lg mx-1"
                        >
                            <FontAwesome6 className='mr-1' name={amenity.icon} size={24} color="black" />
                            <Text className="text-xs text-center mt-1">{amenity.name}</Text>
                        </View>
                    ))}
                    </ScrollView>
                    <View className="border-t my-1" style={{ width: "70%" }} />

                    {/* Venue Description */}
                    <Text className="font-bold mb-2">Venue Description</Text>
                    <Text className="text-xs text-gray-600 mb-4">{turf.description}</Text>
                    <View className="border-t my-1" style={{ width: "70%" }} />

                    {/* Reviews */}
                    <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-bold">Reviews</Text>
                    <TouchableOpacity className='flex-row'>
                        <Text className="text-xs mr-2 font-bold">more</Text>
                        <AntDesign name="rightcircleo" size={12} color="black" />
                    </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {turf.reviews.map((review,id) => (
                        <View
                            key={id}
                            className="w-48 p-3 mr-3 border rounded-lg shadow-sm bg-white mb-5"
                        >
                            <View className='flex-row justify-between'>

                                <Text className="font-bold text-sm">{review.name}</Text>
                                <View className="px-1 py-1 rounded-md" style={{backgroundColor: '#16a34a'}}>
                                    <Text className="text-white font-bold text-xs">{review.rating}</Text>
                                </View>
                            </View>
                            <Text className="text-xs text-gray-500 mt-1">{review.location}</Text>
                        </View>
                    ))}
                    </ScrollView>

                </View>

                <View className="border-t my-1 w-full" />
                <View className='flex-1 items-center p-5'>
                    <Text className='text-blue-600 font-semibold'>Venue Cancellation Policy</Text>
                </View>
            </ScrollView>
        ))}
        {/* Sticky Bottom Buttons */}
        <View className="flex-row justify-between px-4 py-3 border-t bg-white">
            {/* Left Button */}
            <TouchableOpacity className="flex-1 mr-2 bg-gray-700 py-3 rounded-md">
                <Text className="text-white font-bold text-center">Event booking</Text>
            </TouchableOpacity>

            {/* Right Button */}
            <TouchableOpacity onPress={()=> router.push('/nearYou/slotBook')} className="flex-1 ml-2 rounded-xl overflow-hidden">
                <LinearGradient
                    colors={["#FFF201", "#FFFFFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="flex-1 justify-center py-3"
                >
                <Text className="text-black font-bold text-center">Book a slot</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  horizontalLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#6b7280',
  }
});
