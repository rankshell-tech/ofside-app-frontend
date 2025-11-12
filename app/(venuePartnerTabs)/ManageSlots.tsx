import React, { JSX, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, TextInput, ImageBackground } from "react-native";
import { AntDesign, Entypo, FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import TimePicker from "@/components/TimePicker";
import { router } from "expo-router";

export default function ManageSlot() {
    const theme = useTheme();

    const flatListRef = useRef<FlatList<number>>(null);
    const [name, setName] = useState("Swarit Jain");
    const [email, setEmail] = useState("swaritjain@gmail.com");
    const [number, setNumber] = useState("889976737");
    const [source, setSource] = useState("Ofside");
    const [sportAndGround, setSportAndGround] = useState("Box Cricket - Turf 3");
    const [showSourcePicker, setShowSourcePicker] = useState(false);
    const [amount, setAmount] = useState("1200");

    const totalAmount = 2400; // full payment amount
    const numericAmount = parseFloat(amount) || 0;
    const progress = Math.min(numericAmount / totalAmount, 1); // 0 to 1

    // Determine color dynamically
    let progressColor = "#FF0000"; // unpaid
    if (progress > 0.33 && progress < 1) progressColor = "#FFF201"; // partial (yellow)
    if (progress === 1) progressColor = "#16a34a"; // paid



    const FloatingLabelInput = ({
        label,
        value,
        onPress,
        onChangeText,
        isPicker,
        icon,
        }: {
        label: string;
        value: string;
        onPress?: () => void;
        onChangeText?: (text: string) => void;
        isPicker?: boolean;
        icon?: JSX.Element;
        }) => (
        <View className="mt-6">
            {/* Label */}
            <View className="absolute -top-2 left-4 bg-white px-1 z-10">
            <Text className="text-xs text-gray-500 font-semibold">{label}
            </Text>
            </View>

            {/* Input / Picker style */}
            {isPicker ? (
            <TouchableOpacity
                onPress={onPress}
                className="border border-black rounded-2xl px-4 py-4 flex-row justify-between items-center"
            >
                <Text className="font-bold">{value}</Text>
                {icon}
            </TouchableOpacity>
            ) : (
            <View className="border border-black rounded-2xl px-4 py-1">
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    className="text-left font-bold"
                />
            </View>
            )}
        </View>
        );

  return (
    <SafeAreaView className="flex-1 bg-white">
        <ImageBackground
            source={require("../../assets/images/background.png")} // Put your image in assets/images
            resizeMode="cover"
            className="flex-1"
        >
            {/* Header */}
            <View className="flex-row items-center px-5">
                <Text className="ml-3 text-xl font-bold mt-5">Manage slot</Text>
            </View>
            {/* Content */}
            <ScrollView contentContainerStyle={{ padding: 10, paddingBottom: 100 }}>

                {/* Form */}
                <View className="px-2">
                    <FloatingLabelInput
                        label="Full name"
                        value={name}
                        onChangeText={setName}
                    />
                    <FloatingLabelInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <FloatingLabelInput
                        label="Number"
                        value={number}
                        onChangeText={setNumber}
                    />
                    <FloatingLabelInput
                        label="Source"
                        value={source}
                        isPicker
                        onPress={() => setShowSourcePicker(true)}
                        icon={<AntDesign name="down-circle" size={18} color="black" />}
                    />
                    <FloatingLabelInput
                        label="Select sport & ground"
                        value={sportAndGround}
                        isPicker
                        onPress={() => setShowSourcePicker(true)}
                        icon={<AntDesign name="down-circle" size={18} color="black" />}
                    />
                    {/* Payment Progress */}
                    <View className="flex-row justify-between mt-5 mx-5">
                        <Text className="text-[14px] font-semibold text-black">Unpaid</Text>
                        <Text className="text-[14px] font-semibold text-black">Partial</Text>
                        <Text className="text-[14px] font-semibold text-black">Paid</Text>
                    </View>


                    {/* Progress bar background */}
                    <View className="h-[2px] bg-[#e0e0e0] mt-5 mx-5 flex-row">
                        <View
                            style={{ width: `${progress * 100}%`, backgroundColor: progressColor }}
                            className="h-[2px]"
                        />
                    </View>

                    <FloatingLabelInput
                        label="Amount"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>

                {/* Next Button */}
                <TouchableOpacity
                    onPress={() => router.push('/manageSlot/addDateTime')}
                    className="rounded-lg border overflow-hidden absolute bottom-0 right-0 mr-2 bg-[#FFF201]"
                >
                    <View className="px-6 py-1 items-center rounded-full">
                        <Text className="font-bold text-black text-lg">Next</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    </SafeAreaView>
  );
}
