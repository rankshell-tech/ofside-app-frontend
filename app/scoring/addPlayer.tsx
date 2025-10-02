// AddPlayerScreen.tsx
import React, { JSX, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, } from "react-native";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const FloatingLabelInput = ({
  label,
  subLabel,
  value,
  onPress,
  onChangeText,
  isPicker,
  icon,
}: {
  label: string;
  subLabel:string;
  value: string;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
  isPicker?: boolean;
  icon?: JSX.Element;
}) => (
  <View className="mt-6">
    {/* Label */}
    <View className="absolute -top-2 left-4 bg-white px-1 z-10">
      <Text className="text-xs font-semibold">{label}
        <Text className="text-gray-400 italic">{subLabel}</Text>
      </Text>
    </View>

    {/* Input / Picker style */}
    {isPicker ? (
      <TouchableOpacity
        onPress={onPress}
        className="border border-black rounded-2xl px-4 py-4 flex-row justify-between items-center"
      >
        <Text>{value}</Text>
        {icon}
      </TouchableOpacity>
    ) : (
      <View className="border border-black rounded-2xl px-4 py-1">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="text-left"
        />
      </View>
    )}
  </View>
);

export default function AddPlayerScreen() {
  const theme = useTheme();
      const navigation = useNavigation();
  const [fullName, setFullName] = useState("Swarit Jain");
  const [number, setNumber] = useState("+91 83937 23823");
  const [email, setEmail] = useState("Swarit13@gmail.com");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/background.png")}
        resizeMode="contain"
        className="flex-1 bg-white"
      >
          <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2" >
            <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
          </View>

        <View className="flex-1 px-5">
          {/* Profile image */}
          <View className="items-center mb-8">
            <View style={{ backgroundColor: theme.colors.primary }} className="w-40 h-40 rounded-full items-center justify-center mr-4 shadow">
              <FontAwesome name="user" size={80} color={theme.colors.accent} />
            </View>
          </View>

          {/* Input fields */}
          <View className="space-y-5">
            <FloatingLabelInput
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              subLabel={""}
            />

            <FloatingLabelInput
              label="Number"
              value={number}
              onChangeText={setNumber}
              subLabel={""}
            />

            <FloatingLabelInput
              label="Email"
              subLabel="(optional)"
              value={email}
              onChangeText={setEmail}
            />

          </View>

          {/* Add Player button at bottom-right */}
          <View className="flex-1 justify-end items-end mb-8">
            <TouchableOpacity onPress={() => router.push('/scoring/playerAddedScreen')} className="px-6 py-3 rounded-md border" style={{ backgroundColor: theme.colors.primary }} >
              <Text className="text-black font-bold text-base">Add player</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
