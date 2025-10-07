import React, {useState} from "react";
import { View, Text, TouchableOpacity, ScrollView,ImageBackground,Image, Dimensions } from "react-native";
import { FontAwesome, Entypo, AntDesign} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@/hooks/useTheme';
import { Picker } from "@react-native-picker/picker";
import { BarChart, LineChart, PieChart  } from 'react-native-gifted-charts';
import { LinearGradient } from "expo-linear-gradient";
import { AnimatedCircularProgress } from "react-native-circular-progress";


export default function MatchesScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [tabType, setTabType] = useState("Game Stats");
  const tabTypes = ["Game Stats", "Performance"];
  const [sport, setSport] = useState("Football");
  const [activeTab, setActiveTab] = useState("Tournament");
  const { width } = Dimensions.get("window");
  const [selectedSlice, setSelectedSlice] = useState<any>(null);

   const lineData = [
    { value: 18, label: "Match 1" },
    { value: 26, label: "Match 2" },
    { value: 23, label: "Match 3" },
    { value: 35, label: "Match 4" },
    { value: 36, label: "Match 5" },
    { value: 12, label: "Match 6" },
    { value: 34, label: "Match 7" },
    { value: 56, label: "Match 8" },
    { value: 26, label: "Match 9" },
    { value: 48, label: "Match 10" },
    ];

  const pieData = [
    { value: 58.8, color: "#6BCB77", text: "Matches Won" },
    { value: 35.3, color: "#FF6B6B", text: "Matches Lose" },
    { value: 5.9, color: "#828181", text: "Matches Tied" },
  ];

  const barData = [
      {value: 5, label: 'Vs ASNds'},
      {value: 4, label: 'Vs ASNds'},
      {value: 2, label: 'Vs ASNds'},
  ];

  return (
    <SafeAreaView className="flex-1 bg-white p-1">
        <ImageBackground
            source={require("../../assets/images/background.png")}
            resizeMode="cover"
            className="flex-1"
        >
        {/* Header */}
        <View className="flex-row items-center justify-between mx-2 my-5">
            <View className="w-8 h-8 bg-white rounded-full border-4" >
                <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
            </View>
            <View className="flex-row">
                <TouchableOpacity  className="bg-gray-300 border-gray-700 rounded-lg px-2 py-1">
                    <View className="flex-row items-center">
                        <Text className="font-bold text-[10px] mr-2">Last 7 days</Text>
                        <AntDesign name="down-circle" size={10} color="black" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>

        {/* Profile Section */}
        <View className="flex-row justify-between items-center mx-1">
            <View className="flex-row items-center">
                {/* Avatar */}
                <View className="w-20 h-20 rounded-full items-center justify-center shadow bg-black">
                    <FontAwesome name="user" size={50} color="white" />
                </View>

                <View>
                    {/* Text + Icon */}
                    <View>
                        <View className="flex-row items-center ml-2">
                        <Text className="font-bold text-3xl mr-1">
                            Hi Swarit!
                        </Text>
                        </View>
                    </View>
                    {tabType === "Game Stats"
                    ?
                        <View
                            className="h-10 border bg-[#FFF201] rounded-full overflow-hidden mx-1 flex-row items-center"
                            style={{width: 150}}
                            >
                            <Picker
                                selectedValue={sport}
                                onValueChange={(val) => setSport(val)}
                                style={{ width: "100%" }}
                            >
                                <Picker.Item label="Football" value="Football" />
                                <Picker.Item label="Volleyball" value="Volleyball" />
                                <Picker.Item label="Badminton" value="Badminton" />
                                <Picker.Item label="Tennis" value="Tennis" />
                                <Picker.Item label="Pickleball" value="Pickleball" />
                                <Picker.Item label="Basketball" value="Basketball" />
                            </Picker>
                        </View>
                    :
                        <View className="flex-row ml-2">
                            <Text className="font-bold">Goal: 22 | </Text>
                            <Text className="font-bold">Assist: 6</Text>
                        </View>
                    }

                </View>
            </View>
            <Image
                source={require("../../assets/images/stat.png")}
                style={{
                width: 50,   // 👈 smaller width
                height: 50,  // 👈 proportional height
                resizeMode: "contain", // keeps aspect ratio
                }}
                className="mr-1"
            />
        </View>

        <View className="flex-row justify-center mt-10">
            {tabTypes.map((type) => (
                <TouchableOpacity
                    key={type}
                    className="px-5 py-1 rounded-full mr-2 border items-center"
                    style={{
                        backgroundColor: tabType === type ? theme.colors.primary : "#dedede"
                    }}
                    onPress={() => setTabType(type)}
                >
                <Text
                    className={`text-[15px] ${
                    tabType === type ? "font-bold text-black" : ""
                    }`}
                >
                    {type}
                </Text>
                </TouchableOpacity>
            ))}
        </View>

        {tabType === "Game Stats" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}>

            {/* Row 1 */}
            {(() => {
              const stats =
                    sport === "Football"
                        ?   [
                                { label: "Goals Scored", value: 18, color: "text-green-600" },
                                { label: "Assists", value: 6 },
                                { label: "Shots on Goal", value: 24 },
                            ]
                        : sport === "Badminton"
                        ? [
                                { label: "Net Winners", value: 18, },
                                { label: "Smash Winners", value: 6 },
                                { label: "Drop Shot Winners", value: 24 },
                            ]
                        : sport === "Tennis"
                        ? [
                                { label: "Net Points Won", value: 18, },
                                { label: "Smash Winners", value: 6 },
                                { label: "Service Faults", value: 24 },
                            ]
                        : sport === "Volleyball"
                        ? [
                                { label: "Drop Points Won", value: 18, },
                                { label: "Smash Winners", value: 6 },
                                { label: "Smash Success Rate", value: 24 },
                            ]
                        : (sport === "Basketball" || sport === "Pickleball")
                        ? [
                                { label: "3 Pointers", value: 18, },
                                { label: "2 Pointers", value: 6 },
                                { label: "Free Throws", value: 24 },
                            ]
                        :[]
              return (
                <View className="flex-row justify-between mb-4">
                  {stats.map((s, i) => (
                    <View key={i} className="flex-1 mx-1">
                      <Text className="bg-[#FFF201] text-black text-center font-bold py-1 border rounded-md mb-2 text-[12px]">
                        {s.label}
                      </Text>
                      <View className="border rounded-md py-5 items-center bg-gray-200">
                        <Text
                          className={`text-4xl font-bold italic ${s.color}`}
                        >
                          {s.value}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })()}

            {/* Row 2 */}
            {(() => {
              const stats =
                    sport === "Football"
                        ?   [
                                { label: "Matches Played", value: 34 },
                                { label: "Man of the Match Awards", value: 2 },
                            ]
                        :( sport === "Badminton" || sport === "Tennis" || sport === "Volleyball")
                        ? [
                                { label: "Net Winners", value: 34, },
                                { label: "Consistency Score", value: 2 },
                            ]
                        : (sport === "Basketball" || sport === "Pickleball")
                        ? [
                                { label: "Matches Played", value: 34 },
                                { label: "Scoring Distribution", value: "3P-2P-FT" },
                            ]
                        :[];
              return (
                <View className="flex-row justify-between mb-4">
                  {stats.map((s, i) => (
                    <View key={i} className="flex-1 mx-1">
                      <Text className="bg-[#FFF201] text-black text-center font-bold py-1 border rounded-md mb-1 text-[12px]">
                        {s.label}
                      </Text>
                      <View className="border rounded-md py-5 items-center bg-gray-200">
                        <Text
                          className={`text-4xl font-bold italic`}
                        >
                          {s.value}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })()}

            {/* Row 3 */}
            {(() => {
              const stats =
                    sport === "Football"
                        ?   [
                                { label: "Matches Won", value: 20, color: "text-green-600" },
                                { label: "Matches Lose", value: 14, color: "text-red-600" },
                                { label: "Matches Drawn", value: 222 },
                            ]
                        :( sport === "Badminton" || sport === "Tennis" || sport === "Volleyball")
                        ? [
                                { label: "Matches Won", value: 20, color: "text-green-600" },
                                { label: "Matches Lose", value: 14, color: "text-red-600" },
                                { label: "Unforced Errors", value: 34, color: "text-red-600" },
                            ]
                        : (sport === "Basketball" || sport === "Pickleball")
                        ? [
                                { label: "Matches Won", value: 20, color: "text-green-600" },
                                { label: "Matches Lose", value: 14, color: "text-red-600" },
                                { label: "Fouls Committed", value: 34, color: "text-red-600" },
                            ]
                        :[];
              return (
                <View className="flex-row justify-between mb-4">
                  {stats.map((s, i) => (
                    <View key={i} className="flex-1 mx-1">
                      <Text className="bg-[#FFF201] text-black text-center font-bold py-1 border rounded-md mb-1 text-[12px]">
                        {s.label}
                      </Text>
                      <View className="border rounded-md py-5 items-center bg-gray-200">
                        <Text
                          className={`text-4xl italic font-bold ${s.color}`}
                        >
                          {s.value}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })()}

            {/* Row 4 */}
            {(() => {
                const stats =
                    sport === "Football"
                        ?   [
                                { label: "Fouls Committed", value: 20, color: "text-red-600" },
                                { label: "Free/Corner kick", value: 14 },
                                { label: "Mins Played", value: 222 },
                            ]
                        :( sport === "Badminton")
                        ? [
                                { label: "Total Points Won", value: 222, color: "text-green-600" },
                                { label: "Mins Played", value: 222, color: "text-green-600" },
                            ]
                        :( sport === "Tennis")
                        ? [
                                { label: "Total Aces", value: 222, color: "text-green-600" },
                                { label: "Double Faults", value: 222, color: "text-green-600" },
                            ]
                        :( sport === "Volleyball" || sport === "Basketball" || sport === "Pickleball")
                        ? [
                                { label: "Total Points Scored", value: 222, color: "text-green-600" },
                                { label: "Team Contribution", value: 222, color: "text-green-600" },
                            ]
                        : [];
              return (
                <View className="flex-row justify-between mb-4">
                  {stats.map((s, i) => (
                    <View key={i} className="flex-1 mx-1">
                      <Text className="bg-[#FFF201] text-black text-center font-bold py-1 border rounded-md mb-1 text-[12px]">
                        {s.label}
                      </Text>
                      <View className="border rounded-md py-5 items-center bg-gray-200">
                        <Text
                          className={`text-4xl italic font-bold ${s.color}
                          `}
                        >
                          {s.value}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })()}
          </ScrollView>
        )}

        {tabType === "Performance" && (
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
            >
                <View className="flex-row px-2">
                    {/* Jersey */}
                    <View className="items-center mt-4">
                        <Image
                            source={require("../../assets/images/jersey.png")} // change path to your jersey image
                            style={{ width: 120, height: 140, resizeMode: "contain" }}
                        />
                        <Text className="text-[50px] font-extrabold text-[#FFF201] absolute top-[30px]">2</Text>
                    </View>
                    <LinearGradient
                        colors={["#FFF201", "#FFFFFF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        className="flex-1 border rounded-2xl overflow-hidden mx-2 mt-10"
                      >

                    </LinearGradient>
                </View>
                <LinearGradient
                    colors={["#FFF201", "#FFFFFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    className="flex-1 border rounded-2xl overflow-hidden mx-2 mt-5"
                  >
                    <Text className="font-bold text-[12px] mx-3 my-2">Assist/Goal saved/Mins played trend across last matches</Text>
                    <LineChart
                        data={lineData}
                        width={width - 32}
                        height={200}
                        hideDataPoints={false}
                        dataPointsRadius={3}
                        color="black"
                        spacing={28}
                        hideRules={false}
                        xAxisThickness={0}
                        yAxisThickness={0}
                        xAxisLabelTextStyle={{ fontSize: 6, fontWeight: 'bold' }}
                    />
                </LinearGradient>
                <LinearGradient
                    colors={["#FFF201", "#FFFFFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    className="flex-1 border rounded-2xl overflow-hidden mx-2 mt-5"
                  >
                    <Text className="font-bold text-[12px] mx-3 my-2">Past Match Status</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                      }}
                    >
                      {[1, 2, 3].map((_, i) => (
                        <View key={i} style={{ alignItems: 'center' }}>
                          <AnimatedCircularProgress
                            size={70}
                            width={8}
                            fill={70} // % filled
                            tintColor="#FFF201"
                            backgroundColor="#000"
                            rotation={0}
                            lineCap="round"
                          >
                            {() => (
                              <View
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 25,
                                  backgroundColor: '#000',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Text style={{ color: '#FFF201', fontWeight: 'bold', fontSize: 16 }}>
                                  222
                                </Text>
                              </View>
                            )}
                          </AnimatedCircularProgress>
                          <Text className="font-bold text-[12px] mb-5">
                            % increased
                          </Text>
                        </View>
                      ))}
                    </View>

                </LinearGradient>
                <LinearGradient
                  colors={["#FFF201", "#FFFFFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="items-center border rounded-2xl overflow-hidden mx-2 mt-5 p-3"
                >
                  {/* Title + Legend row */}
                  <View className="w-full flex-row justify-between items-start mb-2 px-1">
                    {/* Title */}
                    <Text className="font-bold text-[13px] text-gray-900">
                      Match Status Pie Chart
                    </Text>

                    {/* Legend */}
                    <View className="flex-col">
                      {pieData.map((item, index) => (
                        <View key={index} className="flex-row items-center mb-1">
                          <View
                            style={{
                              width: 10,
                              height: 10,
                              backgroundColor: item.color,
                              borderRadius: 5,
                              marginRight: 6,
                            }}
                          />
                          <Text className="text-[11px] text-gray-800">{item.text}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Pie Chart */}
                  <PieChart
                    data={pieData}
                    donut
                    textColor="black"
                    textSize={12}
                    radius={width / 4.5}
                    innerRadius={width / 9}
                    innerCircleColor="#FFF201"
                    focusOnPress
                    onPress={(item: { value: number; color: string; text: string }) => setSelectedSlice(item)} // ✅ store tapped slice
                    centerLabelComponent={() =>
                      selectedSlice ? (
                        <View className="items-center">
                          <Text className="text-[13px] font-semibold text-gray-800">
                            {selectedSlice.text}
                          </Text>
                          <Text className="text-[12px] text-gray-600">
                            {selectedSlice.value}%
                          </Text>
                        </View>
                      ) : (
                        <Text className="text-[12px] text-gray-500">Tap a slice</Text>
                      )
                    }
                  />
                </LinearGradient>
                <LinearGradient
                  colors={["#FFF201", "#FFFFFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="items-center border rounded-2xl overflow-hidden mx-2 mt-5 p-3"
                >
                  {/* Title + Legend row */}
                  <View className="w-full flex-row justify-between items-start mb-2 px-1">
                    {/* Title */}
                    <Text className="font-bold text-[13px] text-gray-900">
                      Top 3 performances in a single match
                    </Text>

                    {/* Legend */}
                    <View>
                        <Image
                            source={require("../../assets/images/player.png")} // change path to your jersey image
                            style={{ width: 80, height: 80, resizeMode: "contain" }}
                        />
                    </View>
                  </View>
                  <BarChart
                      barWidth={40}
                      barBorderRadius={3}
                      showValuesAsTopLabel
                      showGradient
                      frontColor={'#FFF201'}
                      gradientColor={'#000000'}
                      data={barData}
                      yAxisThickness={0}
                      xAxisThickness={0}
                      // isThreeD
                      hideRules
                      xAxisLabelTextStyle={{
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                  />
                </LinearGradient>

            </ScrollView>
        )}

          {/* Tabs */}
          <View className="flex-row border border-gray-300 bg-gray-300 rounded-xl overflow-hidden mx-5 my-2">
              {["Individual ", "Tournament"].map((tab) => (
                  <TouchableOpacity
                      key={tab}
                      onPress={() => setActiveTab(tab)}
                      className={`flex-1 py-2 items-center`}
                  >
                      <Text
                      className={` ${
                          activeTab === tab ? "font-extrabold text-lg" : "text-md"
                      }`}
                      >
                      {tab}
                      </Text>
                  </TouchableOpacity>
              ))}
          </View>

      </ImageBackground>
    </SafeAreaView>
  );
}
