// app/(tabs)/EditProfile.tsx
import TimePicker from "@/components/TimePicker";
import { useTheme } from "@/hooks/useTheme";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { JSX, useState, } from "react";
import {
    ImageBackground,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Switch
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// Floating Label Input component
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
      <Text className="text-xs font-semibold">{label}</Text>
    </View>

    {/* Input / Picker style */}
    {isPicker ? (
      <TouchableOpacity
        onPress={onPress}
        className="border border-black rounded-2xl px-4 py-4 flex-row justify-between items-center"
      >
        <Text className="flex-1 text-center">{value}</Text>
        {icon}
      </TouchableOpacity>
    ) : (
      <View className="border border-black rounded-2xl px-4 py-1 items-center">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="text-left"
        />
      </View>
    )}
  </View>
);

export default function AdvanceTournamentSettings() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [teams, setTeams] = useState("8");
  const [isCategoryOn, setIsCategoryOn] = useState(true)

  return (
    <SafeAreaView className="flex-1 bg-white">
        <ImageBackground
                source={require("../../assets/images/background.png")}
                resizeMode="cover"
                className="flex-1"
              >
        {/* Header */}
        <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2" >
          <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
        </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-6">
        <Text className="text-2xl font-bold my-5">Advance Tournament Settings</Text>

        <View className="flex-row justify-between items-center mb-2">
            <Text className="w-[90%] text-lg font-bold">If you want categories teams into different groups</Text>
            <Switch
                value={isCategoryOn}
                onChange={()=>setIsCategoryOn(!isCategoryOn)}
                thumbColor={"#fff"}
                trackColor={{ false: "#ccc", true: "#22c55e" }}
            />
        </View>
        {/* Number of Teams */}
        <FloatingLabelInput
            label="Number of teams/players will play in tournament"
            value={teams}
            isPicker
            icon={<AntDesign name="downcircleo" size={18} color="black" />}
        />
        <View className="flex-row justify-between items-center my-10">
            <View className="w-[90%]">
                <Text className="text-lg font-bold">If you want team Automatic Fixtures/Match making</Text>
                <Text className="text-[10px]">(If you are ticking this ON, you'll be able to built fixtures amnually for knockout format)</Text>
            </View>
            <Switch
                value={isCategoryOn}
                onChange={()=>setIsCategoryOn(!isCategoryOn)}
                thumbColor={"#fff"}
                trackColor={{ false: "#ccc", true: "#22c55e" }}
            />
        </View>
      </ScrollView>

        {/* Next Button */}
        <View className="absolute bottom-4 left-4 right-4">
            <TouchableOpacity onPress={()=> router.push('/tournament/tournamentCreated')} className="h-12">
            <View
                className="flex-1 items-center justify-center rounded-xl bg-[#FFF201]"
            >
                <Text className="font-extrabold text-base text-black">
                Next
                </Text>
            </View>
            </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
