
import React from "react";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WinnerScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
        <Image
          source={require("../../assets/images/splash.png")}
          className="absolute w-full h-full"
          resizeMode="cover"
        />
    </SafeAreaView>
  );
};

export default WinnerScreen;
