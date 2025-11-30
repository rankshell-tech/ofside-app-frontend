import Iconify from "@/components/Iconify";
import { useTheme } from "@/hooks/useTheme";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Zocial from "@expo/vector-icons/Zocial";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { User } from "lucide-react-native";
import React from "react";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AppDispatch } from '@/store';
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function profileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const navigation = useNavigation();

  const dispatch = useDispatch<AppDispatch>();
  const { user ,isAuthenticated} = useSelector((state: RootState) => state.auth);
  console.log('user:', user);


  const openSocialLink = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open this URL");
      }
    } catch (err) {
      console.error("Failed to open URL:", err);
      Alert.alert("Error", "Failed to open URL");
    }
  };


  const getMenuItems = () => {
    const allMenuItems = [
      { 
        label: "Complete profile", 
        icon: "user", 
        onPress: () => router.push("/settings/editProfile"),
        requiresAuth: true 
      },
      { 
        label: "Your Bookings", 
        icon: "calendar", 
        onPress: () => router.push("/booking/booking"),
        requiresAuth: true 
      },
      { 
        label: "Refunds/Cancellation policy", 
        icon: "exclamationcircleo", 
        onPress: () => router.push("/staticPages/refundAndCancellation"),
        requiresAuth: false 
      },
      { 
        label: "Corporate event booking", 
        icon: "team",
        requiresAuth: false 
      },
      { 
        label: "Add/Update your Venue", 
        icon: "pluscircleo", 
        onPress: () => router.push("/venue/addVenue"),
        requiresAuth: false 
      },
      { 
        label: "Invite & Earn", 
        icon: "gift", 
        onPress: () => router.push("/staticPages/inviteAndEarn"),
        requiresAuth: false 
      },
      { 
        label: "Help & Support", 
        icon: "customerservice", 
        onPress: () => router.push("/staticPages/helpAndSupport"),
        requiresAuth: false 
      },
      { 
        label: "About Ofside", 
        icon: "infocirlceo", 
        onPress: () => router.push("/staticPages/aboutOfside"),
        requiresAuth: false 
      },
    ];

    return allMenuItems.map(item => ({
      ...item,
      disabled: item.requiresAuth && !isAuthenticated
    }));
  };

  const menuItems = getMenuItems();

  const handleMenuItemPress = (item: any) => {
    if (item.disabled) {
      // Optionally show an alert or message that login is required
      return;
    }
    if (item.onPress) {
      item.onPress();
    }
  };

  const getDisplayText = (item: any) => {
    if (item.disabled) {
      return `${item.label} - (Login to access)`;
    }
    return item.label;
  };


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

        {/* Profile Section */}
         <View style={styles.wrapper}>
      <LinearGradient
        colors={["#004aad", "#000428"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {/* Avatar */}
        <View style={styles.avatar}>
          <FontAwesome name="user" size={48} color="#004aad" />
        </View>

        {/* Text block */}
        <View style={styles.textBlock}>
          <View style={styles.row}>
            <Text style={styles.greeting} numberOfLines={1} ellipsizeMode="tail">
              Hi {user?.name ?? "there"}!
            </Text>

            {/* <View style={[styles.badge, { backgroundColor: theme?.colors?.primary ?? "#fff201" }]}>
              <FontAwesome5 name="crown" size={12} color="black" />
            </View> */}
          </View>

          <Text style={styles.role} numberOfLines={1} ellipsizeMode="tail">
           {user?.role == 0 ? "Player": (user?.role == 1 ? "Venue Partner" : (user?.role == 2 ? "Superadmin" : "Guest"))}
          </Text>
        </View>
      </LinearGradient>
    </View>

        {/* Menu List */}
                {/* Menu List */}
        <ScrollView className="flex-1 mt-6 px-6">
          <View className="space-y-3">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center p-3 bg-white rounded-xl shadow-sm border border-black justify-center mb-2"
                activeOpacity={item.disabled ? 1 : 0.7}
                onPress={() => handleMenuItemPress(item)}
                disabled={item.disabled}
                style={{ 
                  opacity: item.disabled ? 0.5 : 1,
                }}
              >
                <Text className="text-base font-bold text-center">
                  {getDisplayText(item)}
                </Text>
              </TouchableOpacity>
            ))}
            
            {/* Sign Out / Sign In Button */}
            <TouchableOpacity 
              className="mt-4 p-3 bg-gray-100 rounded-xl border border-gray-300" 
              onPress={() => {
                if (isAuthenticated) {
                  // Handle sign out logic here
                  // dispatch(logout());
                  router.replace("/login/loginScreen");
                } else {
                  router.replace("/login/loginScreen");
                }
              }}
            >
              <Text className="text-center font-bold text-xl text-gray-800">
                {isAuthenticated ? "Sign Out" : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Social Icons */}
        <View className="flex-row absoloute bottom-10 w-full justify-center">
          <TouchableOpacity onPress={() => openSocialLink("mailto:play@ofside.in")} className="w-14 h-14 border border-black rounded-lg items-center justify-center mr-8">
            <Zocial name="email" size={26} color="black" />
          </TouchableOpacity>
          <TouchableOpacity 
              onPress={() => openSocialLink("https://instagram.com/ofsideapp")} className="w-14 h-14 border border-black rounded-lg items-center justify-center mr-8"><FontAwesome5 name="instagram" size={28} color="#E1306C" />
          </TouchableOpacity>
          {/* <TouchableOpacity className="w-14 h-14 border border-black rounded-lg items-center justify-center">
            <Iconify icon="flowbite:facebook-solid" size={35} color="blue" type="svg" />
          </TouchableOpacity> */}
        </View>

      </ImageBackground>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    margin: 12,
    borderRadius: 14,
    overflow: "hidden", // important for clipping gradient on iOS
    // optional shadow to match iOS look:
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14, // keep same radius as wrapper
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 20,
    flexShrink: 1, // allow long names to truncate
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  role: {
    color: "#fff201",
    marginTop: 4,
    fontSize: 12,
  },
});
