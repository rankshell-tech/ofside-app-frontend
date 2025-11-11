import React, { useRef, useEffect } from "react";
import { Image, Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OfsideLoaderProps {
  text?: string;
}

const OfsideLoader: React.FC<OfsideLoaderProps> = ({ text }) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, [opacity]);

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
      <Animated.Image
        source={require("../../assets/images/splash.png")}
        style={{ opacity, width: "100%", height: "60%", position: "absolute" }}
        resizeMode="cover"
      />
      {text && (
        <View style={{ position: "absolute", bottom: 300, width: "100%", alignItems: "center" }}>
            <Text style={{ fontSize: 20, color: "#666666" }}>{text}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OfsideLoader;
