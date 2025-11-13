// AddPlayerScreen.tsx
import React, { JSX, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, ScrollViewComponent, ScrollView, Alert, } from "react-native";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants';
import { ScrollableComponent } from "react-native-keyboard-aware-scroll-view";


const FloatingLabelInput = ({
  label,
  subLabel,
  value,
  onPress,
  onChangeText,
  isPicker,
  icon,
  style
}: {
  label: string;
  subLabel:string;
  value: string;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
  isPicker?: boolean;
  icon?: JSX.Element;
  style?: object;
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
          style={[style, { height: 24 }]}
        />
      </View>
    )}
  </View>
);

export default function AddPlayerScreen() {
  const theme = useTheme();
      const navigation = useNavigation();
  const [fullName, setFullName] = useState("Rishi Jain");
  const [number, setNumber] = useState("8393723829");
  const [email, setEmail] = useState("rishi@gmail.com");
   const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

  const handleQuickAddPlayer = async () => {

    console.log('Adding player with details:', { fullName, number, email });
     try {
   
       const payload = {
        name:fullName,
        mobile:number.trim(),
        email,
      };

      const response = await fetch(`${API_URL}/api/users/quick`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        
        },
        body: JSON.stringify(payload),
      });
    
 
    
    const data = await response.json();
    console.log('Quick Add Player response data:', data);
    
    if (data.success) {
          // Logic to add player goes here
        router.push('/scoring/playerAddedScreen');
      
    } else {
     
      Alert.alert('Error', data.message);
    }
    
 
  } catch (error) {
    console.error('Fetch player suggestions error:', error);
    // You might want to show a toast message here
    return [];
  }
   
  }

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


      <ScrollView>
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

          <View className=" relative">
  {/* Floating input field */}
  <FloatingLabelInput
    label="Number"
    value={number}
    onChangeText={(text) => {
      // Remove any non-digit characters
      const cleaned = text.replace(/\D/g, '');
      // Limit to 10 digits
      setNumber(cleaned.slice(0, 10));
    }}
    isPicker={false}
    subLabel=""
    style={{ paddingLeft: 24 }}
  />

  {/* +91 absolute text */}
  <Text
    style={{
      position: "absolute",
      left: 10,
      top: 29, // adjust vertically based on your UI
      fontWeight: "600",
      color: "grey",
    }}
  >
    +91
  </Text>
</View>


            <FloatingLabelInput
              label="Email"
              subLabel=""
              value={email}
              onChangeText={setEmail}
            />

          </View>

          {/* Add Player button at bottom-right */}
          <View className="flex-1 justify-start items-center mb-8 mt-8">
            <TouchableOpacity onPress={() => handleQuickAddPlayer()} className="px-6 py-3 rounded-md border" style={{ backgroundColor: theme.colors.primary }} >
              <Text className="text-black font-bold text-base">Add player</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
