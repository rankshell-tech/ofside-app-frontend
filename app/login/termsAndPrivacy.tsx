import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TermsPrivacyScreen() {
    const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");
    const renderTerms = () => (
    <>
      <View className="mb-4">
        <Text className="font-bold">
          dsklj dsjifindsjfkja dsu sf-
          <Text className="font-normal">
            {" "}
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
          </Text>
        </Text>
      </View>

      <View>
        <Text className="font-bold">
          dsklj dsjifindsjfkja dsu sf-
          <Text className="font-normal">
            {" "}
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekj
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekjwe djensd dksdn dnaldnaee...
            hsdkljscej nasdmcackvmnsdnck dj sdc wekj
          </Text>
        </Text>
      </View>
    </>
  );

  const renderPrivacy = () => (
    <>
      <View className="mb-4">
        <Text className="font-bold">Privacy Policy Introduction -</Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
          scelerisque.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
          scelerisque.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
          scelerisque.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
          scelerisque.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
          scelerisque.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
          scelerisque.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
          scelerisque.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
          scelerisque.
        </Text>
      </View>

      <View>
        <Text className="font-bold">Data Usage -</Text>
        <Text>
          We collect data to improve your experience, including usage analytics
          and device information.We collect data to improve your experience, including usage analytics
          and device information.We collect data to improve your experience, including usage analytics
          and device information.We collect data to improve your experience, including usage analytics
          and device information.We collect data to improve your experience, including usage analytics
          and device information.We collect data to improve your experience, including usage analytics
          and device information.We collect data to improve your experience, including usage analytics
          and device information.
        </Text>
      </View>
    </>
  );

    return (
        <View className="flex-1 bg-white">
                <TouchableOpacity className="pt-10 pl-5" onPress={() => {}}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            <View className="flex-row items-center pb-2 border-b border-gray-300">
                <View className="flex-1 items-center">
                    <Image
                        source={require("../../assets/images/logo.png")} // Replace with your logo
                        style={{ width: 250, height: 60, resizeMode: "contain" }}
                    />
                </View>
            </View>

            {/* Tabs */}
            <View className="flex-row border-b border-gray-200">
                <TouchableOpacity
                    className={`flex-1 items-center py-3 ${
                        activeTab === "terms" ? "border-b-2 border-black" : ""
                    }`}
                    onPress={() => setActiveTab("terms")}
                >
                    <Text
                        className={`font-semibold ${
                        activeTab === "terms" ? "text-black" : "text-gray-500"
                        }`}
                    >
                        Terms of usage
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`flex-1 items-center py-3 ${
                        activeTab === "privacy" ? "border-b-2 border-black" : ""
                    }`}
                    onPress={() => setActiveTab("privacy")}
                >
                    <Text
                        className={`font-semibold ${
                        activeTab === "privacy" ? "text-black" : "text-gray-500"
                        }`}
                    >
                        Privacy policy
                    </Text>
                </TouchableOpacity>
            </View>
            {/* Content */}
            <ScrollView className="px-4 mt-4">
                {activeTab === "terms" ? renderTerms() : renderPrivacy()}
            </ScrollView>
        </View>
    )
}