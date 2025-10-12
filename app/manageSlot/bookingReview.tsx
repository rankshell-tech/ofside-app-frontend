import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function BookingDetails() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState("Swarit Jain");
    const [contactNumber, setContactNumber] = useState("8826233812");
    const [email, setEmail] = useState("swarit12@gmail.com");
    const [altContactNumber, setAltContactNumber] = useState("8826233812");
    const [isBottom, setIsBottom] = useState(false);

  const fullNameRef = useRef<TextInput>(null);
  const contactRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const altContactRef = useRef<TextInput>(null);

  const validate = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      Alert.alert("Validation Error", "Full name is required");
      return false;
    }
    if (!phoneRegex.test(contactNumber)) {
      Alert.alert("Validation Error", "Enter a valid 10-digit contact number");
      return false;
    }
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Enter a valid email address");
      return false;
    }
    if (altContactNumber && !phoneRegex.test(altContactNumber)) {
      Alert.alert(
        "Validation Error",
        "Alternate contact number must be 10 digits"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      router.push('/nearYou/paymentScreen');
      // 👉 You can navigate or send data to backend here
    }
  };
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20; // adjust sensitivity
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      setIsBottom(true);
    } else {
      setIsBottom(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center mt-5">
            <View className="w-8 h-8 bg-white rounded-full border-4 mx-2" >
              <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
            </View>
            <Text className="font-bold text-lg mr-2">Mange Slot</Text>
        </View>
        <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
        >

            {/* Booking Details */}
            <View className="mt-10 px-4 py-3">
              <Text className="mb-1">Sport & Ground/Turf: <Text className="font-bold">Box Cricket, turf3</Text></Text>
              <Text className="mb-1">Source name: <Text className="font-bold">Ofside</Text></Text>
              <Text className="mb-1">Date: <Text className="font-bold">Friday, 23 May</Text></Text>
              <Text className="mb-1">Slot time: <Text className="font-bold">7am - 9am</Text></Text>
              <Text className="mb-1">
                  Venue Name & Location: <Text className="font-bold">Antitode, Saket</Text>
              </Text>
            </View>

            {/* Price Breakup */}
            <View className="px-4 py-3">
                <Text className="font-bold text-lg mb-2">Price breakup</Text>
                <View className="border-t my-1" style={{ width: "70%" }} />
                <View className="flex-row justify-between mb-1">
                    <Text>Base amount:</Text>
                    <Text>INR 900</Text>
                </View>
                <View className="flex-row justify-between mb-1">
                    <Text>Platform fee:</Text>
                    <Text>INR 12</Text>
                </View>
                <View className="flex-row justify-between mb-1">
                    <Text className="text-green-600">Coupon discount (Coupon name) :</Text>
                    <Text className="text-green-600">INR -200</Text>
                </View>
                <View className="flex-row justify-between mb-1">
                    <Text>Tax:</Text>
                    <Text>INR 128.16</Text>
                </View>
                <View className="flex-row justify-between mt-5 pt-2">
                    <Text className="font-bold">Total :</Text>
                    <Text className="font-bold">INR 840</Text>
                </View>
            </View>

            {/* Client details */}
            <View className="px-4 py-3">
                <Text className="font-bold text-lg mb-2">Client Details</Text>
                <View className="border-t my-1" style={{ width: "70%" }} />

                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                    enableOnAndroid
                    extraScrollHeight={80}
                    keyboardOpeningTime={0}
                >
                    {/* Row 1 */}
                    <View className="flex-row justify-between mb-3">
                        <View className="flex-1 mr-2">
                        <Text className="text-gray-600 mb-2">Full name</Text>
                        <TextInput
                            ref={fullNameRef}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter full name"
                            returnKeyType="next"
                            onSubmitEditing={() => contactRef.current?.focus()}
                            blurOnSubmit={false}
                            className="border-b rounded-md px-1 py-1 font-bold"
                        />
                        </View>

                        <View className="flex-1 ml-2">
                        <Text className="text-gray-600 mb-2">Contact Number</Text>
                        <TextInput
                            ref={contactRef}
                            value={contactNumber}
                            onChangeText={setContactNumber}
                            placeholder="Enter contact"
                            keyboardType="phone-pad"
                            returnKeyType="next"
                            onSubmitEditing={() => emailRef.current?.focus()}
                            blurOnSubmit={false}
                            className="border-b rounded-md px-1 py-1 font-bold"
                        />
                        </View>
                    </View>

                    {/* Row 2 */}
                    <View className="flex-row justify-between">
                        <View className="flex-1 mr-2">
                        <Text className="text-gray-600 mb-2">Email</Text>
                        <TextInput
                            ref={emailRef}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter email"
                            keyboardType="email-address"
                            returnKeyType="next"
                            onSubmitEditing={() => altContactRef.current?.focus()}
                            blurOnSubmit={false}
                            className="border-b rounded-md px-1 py-1 font-bold"
                        />
                        </View>

                        <View className="flex-1 ml-2">
                        <Text className="text-gray-600 mb-2">Alternate contact number</Text>
                        <TextInput
                            ref={altContactRef}
                            value={altContactNumber}
                            onChangeText={setAltContactNumber}
                            placeholder="Enter alternate number"
                            keyboardType="phone-pad"
                            returnKeyType="done"
                            className="border-b rounded-md px-1 py-1 font-bold"
                        />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>


            {/* Next Button */}
            <TouchableOpacity onPress={() => router.push('/nearYou/bookingDone')}  className="rounded-lg border overflow-hidden absolute bottom-0 right-0 mr-2 bg-[#FFF201]">
                <View className="px-6 py-1 items-center rounded-full">
                    <Text className="font-bold text-black text-lg">Book Slot</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
  );
}
