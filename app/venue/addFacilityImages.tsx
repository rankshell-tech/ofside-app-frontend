import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function FacilityImages() {
  const navigation = useNavigation();
  const [images, setImages] = useState<(string | null)[]>([
    null, null, null, null, null, null,
  ]);

  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  const labels = [
    "Add Cover image of your Venue",
    "Add 2nd image of your Venue",
    "Add 3rd image of your Venue",
    "Add 4th image of your Venue",
    "Add 5th image of your Venue",
    "Add 6th image of your Venue",
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient
        colors={["#FFF201", "#FFFFFF"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0.4 }}
      >
        <View className="w-8 h-8 rounded-full border-4 mx-2 mt-2" >
          <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
        </View>
        <Text className="text-2xl font-bold px-5">
          Add your [Sports Name] facility Images
        </Text>
        <Text className="text-sm text-gray-600 mt-1 px-5">
          Please upload images in landscape angle
        </Text>

        {/* Upload Boxes */}
        <ScrollView
            contentContainerStyle={{ paddingBottom: 120, padding:20 }}
        >
            <View className="flex-row flex-wrap justify-between">
            {labels.map((label, index) => (
                <TouchableOpacity
                key={index}
                onPress={() => pickImage(index)}
                className={`w-[48%] h-36 border-2 rounded-lg mb-4 justify-center items-center ${
                    index === 0 || index === 1 || index === 2 || index === 3
                    ? images[index]
                        ? "border-green-500"
                        : "border-red-400"
                    : "border-gray-400"
                }`}
                >
                {images[index] ? (
                    <Image
                    source={{ uri: images[index]! }}
                    className="w-full h-full rounded-lg"
                    />
                ) : (
                    <View className="items-center">
                    <Ionicons name="image-outline" size={28} color="gray" />
                    <Text className="text-center text-xs text-gray-700 mt-2 px-1">
                        {label}
                    </Text>
                    <Text className="text-[10px] text-gray-500">
                        jpeg, png, jpg up to 5MB
                    </Text>
                    </View>
                )}
                </TouchableOpacity>
            ))}
            </View>

            {/* Note */}
            <Text className="text-xs text-gray-600 mt-3">
            <Text className="font-bold">Note: </Text>
            Your Venue profile image will help attract users to your Venue.
            Please upload a clear and high-quality picture showcasing your
            venue/turf/ground.
            </Text>
        </ScrollView>
      </LinearGradient>

    {/* Sticky Bottom Button */}
    <TouchableOpacity onPress={()=> router.push('/venue/declaration')} className="rounded-lg border overflow-hidden absolute bottom-0 right-0 mr-2 mb-10">
        <LinearGradient
            colors={["#FFF201", "#E0E0E0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 py-1 items-center rounded-full"
        >
            <Text className="font-bold text-black text-lg">Next</Text>
        </LinearGradient>
    </TouchableOpacity>
    </SafeAreaView>
  );
}
