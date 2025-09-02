import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, SafeAreaView, View } from 'react-native';
import { router } from 'expo-router';

export default function SplashScreen() {
    const navigation = useNavigation();
    useEffect(() => {
    const timer = setTimeout(() => {
       router.push("/login/loginScreen")
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
    }, [navigation]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center bg-[#FFD500]">
        {/* Logo image */}
        <Image
          source={require('../../assets/images/logo.png')} // replace with your file
          style={{ width: 250, height: 250, resizeMode: 'contain' }}
        />
      </View>
    </SafeAreaView>
  );
}
