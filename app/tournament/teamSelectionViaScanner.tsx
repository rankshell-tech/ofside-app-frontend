import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Plus, Share2 } from "lucide-react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router,useLocalSearchParams } from "expo-router";

export default function InviteTeamsScreen() {
  const navigation = useNavigation();
  const tournamentLink = "https://yourapp.com/join/tournament/123";
  const { sport, format } = useLocalSearchParams<{ sport: string; format: string }>();

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-5">
            <Ionicons onPress={()=> navigation.goBack()} name="chevron-back-circle-outline" size={22} color="black" />
            <TouchableOpacity>
                <Text className="font-bold">Skip</Text>
            </TouchableOpacity>
        </View>
      {/* Title */}
      <Text className="text-xl ml-2 font-bold mb-5">Select teams for the Tournament</Text>

      {/* Invite Link */}
      <View className="flex-row justify-between items-center border rounded-lg p-4 mb-5">
        <View className="w-[80%]">
            <Text className="font-semibold text-base mb-1">Invite link</Text>
            <Text className="text-xs text-gray-500 mb-3">
            Share this link with captains and let them add their playing teams directly to your tournament
            </Text>
        </View>

        <View className="flex-col space-x-4">
          <TouchableOpacity className="p-2 rounded-full">
            <FontAwesome name="whatsapp" size={20} color="green" />
          </TouchableOpacity>
          <View className="border-b"/>
          <TouchableOpacity className="p-2 rounded-full">
            <FontAwesome name="share-square-o" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Team Manually */}
      <TouchableOpacity onPress={()=> router.push('/tournament/addNewTeam')} className="border rounded-lg p-4 mb-5 flex-row items-center justify-center">
        <Text className="font-extrabold text-[16px] mr-2">Add team manually</Text>
        <MaterialIcons name="add" size={24} color="black" />
      </TouchableOpacity>

      {/* QR Code */}
      <View className="border rounded-lg p-4 items-center mb-4">
        <View className="border-[10px]">
            <QRCode
            value={tournamentLink}
            size={220}
            color="black"
            backgroundColor="#FFF201"
            />
        </View>
        <TouchableOpacity className="flex-row items-center mt-3">
          <Text className="text-xs underline mr-2">
            Share scanner with the captains
          </Text>
          <FontAwesome name="share-square-o" size={14} color="black" />
        </TouchableOpacity>
      </View>

      {/* Next button */}
      <TouchableOpacity onPress={() => router.push({
                                            pathname: "/tournament/selectMatchFixtures",
                                            params: { sport, format },})}
                        className="bg-[#FFF201] py-3 rounded-lg items-center mt-6">
        <Text className="font-bold text-lg">Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
