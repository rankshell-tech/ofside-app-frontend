// screens/MatchSetupScreen.tsx
import React, { JSX, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";
import { router } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import RangeSelector from "../../components/rangeSelector"
import { useLocalSearchParams } from "expo-router";
import { useDispatch } from 'react-redux';
import { createMatchFromCurrentSetup, FormatType, SportType, Team, updateSetup } from '@/store/slices/matchScoringSlice';

const MatchSetupScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const { sport, format, teams: teamsParam } = useLocalSearchParams<{ 
        sport: string; 
        format: string; 
        teams?: string; // Teams passed as JSON string
    }>();

    const [matchType, setMatchType] = useState("Friendly");
    const [pitchType, setPitchType] = useState("Artificial Turf");
    const [city, setCity] = useState("Delhi");
    const [ground, setGround] = useState("Delhi Cricket Turf");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [rulesVisible, setRulesVisible] = useState(false);
    const [numberofSet, setNumberOfSet] = useState("3 Sets");
    const [pointsPerSet, setPointsPerSet] = useState("15 points");
    const [numberOfQuarter, setNumberOfQuarter] = useState("4 Quarters");
    const [surfaceType, setSurfaceType] = useState("Clay");
    const [numberofMatch, setNumberOfMatch] = useState("2 Matches");
    const [isNowSelected, setIsNowSelected] = useState(true); // Default to "Now"
    

    const matchTypes = ["Friendly", "Friendly Cup", "Exhibition", "Practice"];
    const pitchTypes = ["All Grass", "Artificial Turf", "Indoor", "Synthetic"];
    const numberofSets = sport === 'Tennis' ? ["1 Set", "3 Sets", "6 Sets"] : ["1 Set", "3 Sets", "5 Sets"];
    const pointsPerSets = sport === 'Volleyball' ? ["15 points", "21 points", "25 points"] : ["11 points", "15 points", "21 points"];
    const numberOfQuarters = ["1 Quarter", "2 Quarters", "3 Quarters", "4 Quarters"];
    const surfaceTypes = ["Synthetic", "Clay", "Grass", "Indoor"];
    const numberOfMatches = ["1 Match", "2 Matches"];
    const [matchDuration, setMatchDuration] = useState(10);
    const [quarterDuration, setQuarterDuration] = useState(6);
    const dispatch = useDispatch();
  const teamsFromParams: [Team, Team] | null = teamsParam 
        ? JSON.parse(teamsParam) 
        : null;

  // Debug: Log parsed teams
  useEffect(() => {
    if (teamsFromParams) {
      console.log('Parsed teams in matchSetupScreen:');
      console.log('Team 1:', {
        name: teamsFromParams[0]?.name,
        playersCount: teamsFromParams[0]?.players?.length || 0,
        players: teamsFromParams[0]?.players
      });
      console.log('Team 2 (Opponent):', {
        name: teamsFromParams[1]?.name,
        playersCount: teamsFromParams[1]?.players?.length || 0,
        players: teamsFromParams[1]?.players
      });
    }
  }, [teamsFromParams]);


            // Debug: Check what we're receiving
    useEffect(() => {
        if (teamsFromParams) {
            console.log('=== Teams Received in MatchSetupScreen ===');
            console.log('Team A (My Team):', {
                name: teamsFromParams[0]?.name,
                _id: teamsFromParams[0]?._id,
                playersCount: teamsFromParams[0]?.players?.length || 0,
                players: teamsFromParams[0]?.players?.map((p: any) => ({ id: p.id, name: p.name }))
            });
            console.log('Team B (Opponent):', {
                name: teamsFromParams[1]?.name,
                _id: teamsFromParams[1]?._id,
                playersCount: teamsFromParams[1]?.players?.length || 0,
                players: teamsFromParams[1]?.players?.map((p: any) => ({ id: p.id, name: p.name }))
            });
        }
    }, [teamsFromParams]);



    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const handleNowSelection = () => {
        setIsNowSelected(true);
        setDate(new Date()); // Set to current date and time
    };

    const handleScheduleSelection = () => {
        setIsNowSelected(false);
        // Keep the current date but show pickers when user wants to change
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            // Combine selected date with current time
            const newDate = new Date(selectedDate);
            newDate.setHours(date.getHours());
            newDate.setMinutes(date.getMinutes());
            setDate(newDate);
        }
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            // Combine selected time with current date
            const newDate = new Date(date);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setDate(newDate);
        }
    };

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

 const handleSaveConfig = async () => {
  // Check if we have teams data
  if (!teamsFromParams || !teamsFromParams[0] || !teamsFromParams[1]) {
    alert('Teams data is missing or incomplete. Please go back and select both teams.');
    return;
  }

  // 1. Prepare the complete setup data WITH TEAMS ARRAY
  const dateToStore = isNowSelected ? new Date().toISOString() : date.toISOString();
  
  const completeSetupData = {
    configuration: {
      pitchType,
      matchDuration,
      numberofSet,
      pointsPerSet,
      numberOfQuarter,
      quarterDuration,
      surfaceType,
      numberofMatch
    },
    matchType,
    location: { city, ground },
    date: dateToStore,
    isScheduled: !isNowSelected,
    sport: sport as SportType,
    format: format as FormatType,
    teams: teamsFromParams,
    tournamentMode: false,
     rules: {  
       
     }
  };

  console.log('=== Complete Setup Data ===');
  console.log('Team 1:', {
    name: teamsFromParams?.[0]?.name,
    _id: teamsFromParams?.[0]?._id,
    playersCount: teamsFromParams?.[0]?.players?.length || 0,
    players: teamsFromParams?.[0]?.players
  });
  console.log('Team 2 (Opponent):', {
    name: teamsFromParams?.[1]?.name,
    _id: teamsFromParams?.[1]?._id,
    playersCount: teamsFromParams?.[1]?.players?.length || 0,
    players: teamsFromParams?.[1]?.players
  });
  console.log('Full setup data:', JSON.stringify(completeSetupData, null, 2));

  // 2. Save to Redux first
  dispatch(updateSetup(completeSetupData));

  // 3. Auto-create the match with the complete data
 try {
    const result = await dispatch(createMatchFromCurrentSetup(completeSetupData) as any);
    
    if (createMatchFromCurrentSetup.fulfilled.match(result)) {
      // ✅ Use the correct response structure
      const matchId = result.payload.data._id;
      console.log('✅ Match created successfully with ID:', matchId);
      
      if (!matchId) {
        console.error('❌ Match ID is undefined:', result.payload);
        alert('Match created but ID not found. Please try again.');
        return;
      }

      if(!isNowSelected) {
        router.push({
          pathname: "/scoring/matchScheduledSuccess",
        });
        return;
      } else {
              
      if (sport === "Basketball") {
        router.push({
          pathname: "/scoring/scoringScreen",
          params: { sport, format, matchId }
        });
      } else {
        router.push({
          pathname: "/scoring/matchTossScreen", 
          params: { sport, format, matchId }
        });
      }
      }




    } else {
      console.error('❌ Failed to create match:', result.payload);
      alert('Failed to create match: ' + result.payload);
    }
  } catch (error) {
    console.error('❌ Error in match creation process:', error);
    alert('Error creating match. Please try again.');
  }
};

    // Get actual team names for display
    const teamAName = teamsFromParams?.[0]?.name || "TEAM A";
    const teamBName = teamsFromParams?.[1]?.name || "TEAM B";

    const getButtonText = () => {
        return isNowSelected ? "Start Match Scoring" : "Schedule Match";
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <LinearGradient
                colors={[theme.colors.primary, "#FFFFFF", theme.colors.background]}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Header */}
                    <View className="flex-row items-center justify-between mt-2 mx-2">
                        <View className="w-8 h-8 rounded-full border-4">
                            <Entypo onPress={() => navigation.goBack()} name="chevron-left" size={20} color="black" />
                        </View>
                        <SlidersHorizontal onPress={() => setRulesVisible(true)} size={24} color="black" />
                    </View>

                    {/* VS Section */}
                    <View className="flex-row justify-between items-center mx-5">
                        {/* Team A */}
                        <View className="items-center">
                            <View
                                style={{ backgroundColor: theme.colors.accent }}
                                className="w-28 h-28 rounded-full items-center justify-center shadow"
                            >
                                <FontAwesome
                                    name="user"
                                    size={40}
                                    color={theme.colors.primary}
                                />
                            </View>
                            <Text className="mt-2 font-bold">{teamAName}</Text>
                        </View>

                        {/* VS Icon */}
                        <View className="items-center">
                            <Image
                                source={require("../../assets/images/vsIconGray.png")}
                                style={{ width: 100, height: 100 }}
                                resizeMode="contain"
                            />
                            <Text className="text-gray-600 text-[12px]">
                                {isNowSelected ? "Now" : formatDate(date)}
                            </Text>
                        </View>

                        {/* Team B */}
                        <View className="items-center">
                            <View
                                style={{ backgroundColor: theme.colors.accent }}
                                className="w-28 h-28 rounded-full items-center justify-center shadow"
                            >
                                <FontAwesome
                                    name="user"
                                    size={40}
                                    color={theme.colors.primary}
                                />
                            </View>
                            <Text className="mt-2 font-bold">{teamBName}</Text>
                        </View>
                    </View>

                    {/* Time Selection */}
                    <View className="px-4 mt-2">
                        <Text className="font-bold text-lg">Match Time</Text>
                        <View className="flex-row mt-3">
                            <TouchableOpacity
                                onPress={handleNowSelection}
                                className="px-4 py-2 border rounded-full mr-2"
                                style={{
                                    backgroundColor: isNowSelected ? theme.colors.primary : "white",
                                    borderColor: isNowSelected ? theme.colors.primary : theme.colors.accent,
                                }}
                            >
                                <Text className={`text-sm ${isNowSelected ? "font-bold text-black" : "text-gray-600"}`}>
                                    Now
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleScheduleSelection}
                                className="px-4 py-2 border rounded-full"
                                style={{
                                    backgroundColor: !isNowSelected ? theme.colors.primary : "white",
                                    borderColor: !isNowSelected ? theme.colors.primary : theme.colors.accent,
                                }}
                            >
                                <Text className={`text-sm ${!isNowSelected ? "font-bold text-black" : "text-gray-600"}`}>
                                    Schedule
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Date & Time Selection (Only show when Schedule is selected) */}
                    {!isNowSelected && (
                        <View className="px-4 mt-4 space-y-4">
                            <FloatingLabelInput
                                label="Date"
                                value={formatDate(date)}
                                isPicker
                                onPress={() => setShowDatePicker(true)}
                                icon={<Ionicons name="calendar" size={18} color="black" />}
                            />
                            <FloatingLabelInput
                                label="Time"
                                value={formatTime(date)}
                                isPicker
                                onPress={() => setShowTimePicker(true)}
                                icon={<Ionicons name="time" size={18} color="black" />}
                            />
                        </View>
                    )}

                    {/* Rest of your existing sport-specific sections */}
                    {/* Match Type */}
                    <View className="px-4 mt-2">
                        <Text className="font-bold text-lg">Select Match Type</Text>
                        <View className="flex-row flex-wrap mt-3">
                            {matchTypes.map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    className="px-2 py-1 rounded-full mr-2 mb-2 border"
                                    style={{
                                        backgroundColor: matchType === type ? theme.colors.primary : "white",
                                        borderColor: matchType === type ? theme.colors.primary : theme.colors.accent,
                                    }}
                                    onPress={() => setMatchType(type)}
                                >
                                    <Text className={matchType === type ? "font-bold text-black" : "text-gray-600"}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Conditional Sport Sections (keep all your existing sport-specific code here) */}
                    {(sport === "Badminton" || sport === "Pickleball" || sport === "Volleyball") && (
                        <>
                            {/* Number of Sets */}
                            <View className="px-4 mt-2">
                                <Text className="font-bold text-lg">Number of Sets</Text>
                                <View className="flex-row mt-3">
                                    {numberofSets.map((set) => (
                                        <TouchableOpacity
                                            key={set}
                                            onPress={() => setNumberOfSet(set)}
                                            className="px-4 py-2 border rounded-full mr-2"
                                            style={{
                                                backgroundColor: numberofSet === set ? theme.colors.primary : "white",
                                                borderColor: numberofSet === set ? theme.colors.primary : theme.colors.accent,
                                            }}
                                        >
                                            <Text className={`text-sm ${numberofSet === set
                                                ? "font-bold text-black"
                                                : "text-gray-600"
                                                }`}>{set}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Points per Set */}
                            <View className="px-4 mt-2">
                                <Text className="font-bold text-lg">Points per set</Text>
                                <View className="flex-row mt-3">
                                    {pointsPerSets.map((point) => (
                                        <TouchableOpacity
                                            key={point}
                                            onPress={() => setPointsPerSet(point)}
                                            className="px-4 py-2 border rounded-full mr-2"
                                            style={{
                                                backgroundColor: pointsPerSet === point ? theme.colors.primary : "white",
                                                borderColor: pointsPerSet === point ? theme.colors.primary : theme.colors.accent,
                                            }}
                                        >
                                            <Text className={`text-sm ${pointsPerSet === point
                                                ? "font-bold text-black"
                                                : "text-gray-600"
                                                }`}>{point}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </>
                    )}

                    {(sport === "Football") && (
                        <>
                            {/* Pitch Type */}
                            <View className="px-4 mt-2">
                                <Text className="font-bold text-lg">Pitch type</Text>
                                <View className="flex-row flex-wrap mt-3">
                                    {pitchTypes.map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            className="px-2 py-1 rounded-full mr-2 mb-2 border"
                                            style={{
                                                backgroundColor: pitchType === type ? theme.colors.primary : "white",
                                                borderColor: pitchType === type ? theme.colors.primary : theme.colors.accent,
                                            }}
                                            onPress={() => setPitchType(type)}
                                        >
                                            <Text
                                                className={`text-sm ${pitchType === type
                                                    ? "font-bold text-black"
                                                    : "text-gray-600"
                                                    }`}
                                            >
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Match Duration Slider */}
                            <View className="px-4 mt-2">
                                <RangeSelector
                                    title="Match duration"
                                    subtitle="Total minutes including both half's"
                                    options={[0, 5, 10, 15, 20, 25, 30, 35, 40]}
                                    selected={matchDuration}
                                    onSelect={setMatchDuration}
                                    unit="Mins"
                                />
                            </View>
                        </>
                    )}

                    {sport === "Basketball" && (
                        <>
                            <View className="px-4 mt-2">
                                <Text className="font-bold text-lg">Choose Number of Quarters</Text>
                                <View className="flex-row flex-wrap mt-3">
                                    {numberOfQuarters.map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            className="px-2 py-1 rounded-full mr-2 mb-2 border"
                                            style={{
                                                backgroundColor: numberOfQuarter === type ? theme.colors.primary : "white",
                                                borderColor: numberOfQuarter === type ? theme.colors.primary : theme.colors.accent,
                                            }}
                                            onPress={() => setNumberOfQuarter(type)}
                                        >
                                            <Text
                                                className={`text-sm ${numberOfQuarter === type
                                                    ? "font-bold text-black"
                                                    : "text-gray-600"
                                                    }`}
                                            >
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Match Duration Slider */}
                            <View className="px-4 mt-2">
                                <RangeSelector
                                    title="Each Quarter Duration"
                                    options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                                    selected={quarterDuration}
                                    onSelect={setQuarterDuration}
                                    unit="Mins"
                                />
                            </View>
                        </>
                    )}

                    {(sport === "Tennis") && (
                        <>
                            {/* Surface Type */}
                            <View className="px-4 mt-2">
                                <Text className="font-bold text-lg">Select Surface Type</Text>
                                <View className="flex-row flex-wrap mt-3">
                                    {surfaceTypes.map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            className="px-2 py-1 rounded-full mr-2 mb-2 border"
                                            style={{
                                                backgroundColor: surfaceType === type ? theme.colors.primary : "white",
                                                borderColor: surfaceType === type ? theme.colors.primary : theme.colors.accent,
                                            }}
                                            onPress={() => setSurfaceType(type)}
                                        >
                                            <Text
                                                className={`text-sm ${surfaceType === type
                                                    ? "font-bold text-black"
                                                    : "text-gray-600"
                                                    }`}
                                            >
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            {/* Number of Sets */}
                            <View className="px-4 mt-2">
                                <Text className="font-bold text-lg">Number of Sets</Text>
                                <View className="flex-row mt-3">
                                    {numberofSets.map((set) => (
                                        <TouchableOpacity
                                            key={set}
                                            onPress={() => setNumberOfSet(set)}
                                            className="px-4 py-2 border rounded-full mr-2"
                                            style={{
                                                backgroundColor: numberofSet === set ? theme.colors.primary : "white",
                                                borderColor: numberofSet === set ? theme.colors.primary : theme.colors.accent,
                                            }}
                                        >
                                            <Text className={`text-sm ${numberofSet === set
                                                ? "font-bold text-black"
                                                : "text-gray-600"
                                                }`}>{set}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Points per Set */}
                            <View className="px-4 mt-2">
                                <Text className="font-bold text-lg">Number of matches to decide winner</Text>
                                <View className="flex-row mt-3">
                                    {numberOfMatches.map((match) => (
                                        <TouchableOpacity
                                            key={match}
                                            onPress={() => setNumberOfMatch(match)}
                                            className="px-4 py-2 border rounded-full mr-2"
                                            style={{
                                                backgroundColor: numberofMatch === match ? theme.colors.primary : "white",
                                                borderColor: numberofMatch === match ? theme.colors.primary : theme.colors.accent,
                                            }}
                                        >
                                            <Text className={`text-sm ${numberofMatch === match
                                                ? "font-bold text-black"
                                                : "text-gray-600"
                                                }`}>{match}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </>
                    )}

                    {/* Location Form */}
                    <View className="px-4 mt-4 space-y-4">
                        <FloatingLabelInput
                            label="City/Town"
                            value={city}
                            onChangeText={setCity}
                        />
                        <FloatingLabelInput
                            label="Ground Name"
                            value={ground}
                            onChangeText={setGround}
                        />
                    </View>

                    {/* Date & Time Pickers */}
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            onChange={handleDateChange}
                        />
                    )}
                    {showTimePicker && (
                        <DateTimePicker
                            value={date}
                            mode="time"
                            onChange={handleTimeChange}
                        />
                    )}
                </ScrollView>

                {/* ✅ Fixed Bottom Button */}
                <View className="absolute bottom-4 left-4 right-4">
                    <TouchableOpacity
                        onPress={handleSaveConfig}
                        className="rounded-lg py-3 items-center"
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        <Text className="font-bold text-black text-lg">{getButtonText()}</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Bottom Sheet Modal (keep your existing modal code) */}
            <Modal
                isVisible={rulesVisible}
                onBackdropPress={() => setRulesVisible(false)}
                onBackButtonPress={() => setRulesVisible(false)}
                style={{ justifyContent: "flex-start", marginLeft: 150 }}
            >
                <View className="bg-white rounded-2xl p-5 shadow-lg">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="font-bold text-lg">Settings</Text>
                        <TouchableOpacity onPress={() => setRulesVisible(false)}>
                            <Ionicons name="close" size={22} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Rules List */}
                    <TouchableOpacity
                        disabled={(sport === "Badminton" || sport === 'Pickleball')}
                        onPress={() => {
                            setRulesVisible(false);
                            router.push({
                                pathname: "/scoring/matchRulesScreen",
                                params: { sport, format }
                            })
                        }}
                        className="py-3 border-b border-gray-200"
                    >
                        <Text className="text-base">Manage Rules</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-3 border-b border-gray-200">
                        <Text className="text-base">Match Abandoned</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-3 border-b border-gray-200">
                        <Text className="text-base">Match Rescheduled</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-3">
                        <Text className="text-base">Walkover</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default MatchSetupScreen;