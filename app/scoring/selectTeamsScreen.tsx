import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, Image } from "react-native";
import { useTheme } from '@/hooks/useTheme';
import { Entypo, Ionicons } from "@expo/vector-icons";
import { router, useNavigation ,useLocalSearchParams} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from 'react-redux';
import { updateSetup } from '@/store/slices/matchScoringSlice';
export default function SelectTeamsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { sport, format } = useLocalSearchParams<{ sport: string; format: string }>();
  const dispatch = useDispatch();
  // Decide label based on sport/format
  const isSingles = ((sport === "Badminton" || sport === "Pickleball" || sport === "Tennis" || sport === 'Volleyball')) && (format === 'Singles' || format === 'Two Player');
  const label = isSingles ? "Player" : "Team";
  const handleTeamSelect = (teamSide: 'A' | 'B') => {
    // Save which team we're selecting to Redux
    dispatch(updateSetup({
      currentTeamSelecting: teamSide
    }));

    router.push({
      pathname: "/scoring/teamsScreen",
      params: { 
        sport, 
        format, 
        activatedTab: teamSide === 'A' ? "My Teams" : "Opponents" 
      },
    });
  };

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

        {/* Center content */}
        <View className="flex-1 items-center justify-center">
          {/* A */}
          <TouchableOpacity
            className="flex-row items-center mb-8"
              onPress={() => handleTeamSelect('A')}
            >
            <View
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Entypo name="plus" size={70} color="black" />
            </View>
            <Text className="ml-4 text-4xl font-bold text-black">
              Select {label} A
            </Text>
          </TouchableOpacity>

          {/* VS */}
          <Image
            source={require("../../assets/images/vsIcon.png")}
            style={{ width: 150, height: 150 }}
            resizeMode="contain"
          />

          {/* B */}
          <TouchableOpacity className="flex-row items-center mt-8"
              onPress={() => handleTeamSelect('B')}
          >
            <View
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Entypo name="plus" size={70} color="black" />
            </View>
            <Text className="ml-4 text-4xl font-bold text-black">
              Select {label} B
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
