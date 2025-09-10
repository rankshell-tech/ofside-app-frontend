import { useTheme } from "@/hooks/useTheme";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
    Animated,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfile() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 4000, // 4s fake loading
      useNativeDriver: false,
    }).start();
  }, []);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient colors={["#FFE39C", "#FFFFFF"]} className="px-4">
        <View className="flex-col justify-center items-center mt-72 mb-20">
            {/* Progress Bar */}
            <View className="w-60 h-5 border-2 border-yellow-500 rounded-full overflow-hidden mt-12" style={{ backgroundColor: theme.colors.primary }}>
                <Animated.View
                style={{
                    width: widthInterpolated,
                    height: "100%",
                    backgroundColor: "black",
                }}
                />
            </View>

            {/* Loading text */}
            <Text className="mt-8 text-center text-base font-bold text-gray-800">
                Please wait while we are cooking{" "}
                <Text className="text-blue-700 font-bold">
                community engagement ecosystem
                </Text>{" "}
                for you!
            </Text>
        </View>

      </LinearGradient>
    </SafeAreaView>
  );
}
