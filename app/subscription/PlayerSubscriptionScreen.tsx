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
import { updateProfile } from "@/store/slices/authSlice";
  import Constants from "expo-constants";

export default function PlayerSubscriptionScreen() {
  const theme = useTheme();
  const router = useRouter();
  const navigation = useNavigation();

  const dispatch = useDispatch<AppDispatch>();
  const { user ,isAuthenticated} = useSelector((state: RootState) => state.auth);
  console.log('user:', user);

    const [selectedDuration, setSelectedDuration] = React.useState<'3months' | '1year'>('1year');
    const [subscriptionData, setSubscriptionData] = React.useState<any>(null);
    const [isLoadingSubscription, setIsLoadingSubscription] = React.useState(true);
    const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

    // Fetch current subscription data
    React.useEffect(() => {
      const fetchSubscription = async () => {
        if (!user?.accessToken) {
          setIsLoadingSubscription(false);
          return;
        }

        try {
          const response = await fetch(`${API_URL}/api/subscription-plans/current`, {
            headers: {
              'Authorization': `Bearer ${user.accessToken}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setSubscriptionData(result.data);
            }
          }
        } catch (error) {
          console.error('Error fetching subscription:', error);
        } finally {
          setIsLoadingSubscription(false);
        }
      };

      fetchSubscription();
    }, [user?.accessToken, API_URL]);

    const formatDate = (date: Date | string | undefined) => {
      if (!date) return 'N/A';
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getPlanDisplayName = (plan: string) => {
      switch (plan) {
        case 'pro':
          return 'Pro';
        case 'elite':
          return 'Elite';
        case 'free':
          return 'Free';
        default:
          return plan;
    }
  };
 



  return (
      <SafeAreaView className="flex-1">
             <LinearGradient
        colors={[ '#FFFFFF','#FFF201']} 
      
          style={{ flex: 1 }}
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

          <TouchableOpacity
            onPress={() => router.push("/settings/subscription" as any)}
            activeOpacity={0.7}
            style={styles.roleButton}
          >
            <View style={styles.roleContainer}>
              {(() => {
                const role = user?.role == 0 
                  ? (user?.plan == "pro" ? "Pro" : "Elite")
                  : (user?.role == 1 ? "Venue Partner" : (user?.role == 2 ? "Superadmin" : "Guest"));
                
                // Get appropriate icon based on role
                if (user?.role == 0) {
                  // Player roles
                  if (user?.plan == "pro") {
                    return <FontAwesome5 name="crown" size={14} color="#FFF201" style={{ marginRight: 6 }} />;
                  } else {
                    return <FontAwesome5 name="medal" size={14} color="#FFF201" style={{ marginRight: 6 }} />;
                  }
                } else if (user?.role == 1) {
                  // Venue Partner
                  return <Ionicons name="business" size={14} color="#FFF201" style={{ marginRight: 6 }} />;
                } else if (user?.role == 2) {
                  // Superadmin
                  return <FontAwesome5 name="shield-alt" size={14} color="#FFF201" style={{ marginRight: 6 }} />;
                } else {
                  // Guest
                  return <FontAwesome name="user" size={14} color="#FFF201" style={{ marginRight: 6 }} />;
                }
              })()}
              <Text style={styles.role} numberOfLines={1} ellipsizeMode="tail">
                {user?.role == 0 ? (user?.plan == "pro" ? "Pro": "Elite"): (user?.role == 1 ? "Venue Partner" : (user?.role == 2 ? "Superadmin" : "Guest"))}
              </Text>
              <Ionicons name="chevron-forward" size={14} color="#FFF201" style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
        </View>

    
    
      </LinearGradient>
    </View>


          {/* Subscription Comparison Table */}
          <ScrollView 
            className="flex-1 mt-6 px-6" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            <View style={styles.tableWrapper}>
        <LinearGradient
        colors={["#004aad", "#000428"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
                style={styles.tableGradient}
              >
                {/* Header */}
                <View style={styles.tableHeader}>
                  <Text style={styles.tableTitle}>Benefits of Pro</Text>
                  <View style={styles.planHeaders}>
                    <Text style={styles.proPlanHeader}>Pro</Text>
                    <Text style={styles.elitePlanHeader}>Elite</Text>
                  </View>
                </View>

                {/* Features List */}
                <View style={styles.featuresContainer}>
                  {[
                    { name: "Create Tournament Instantly", pro: true, elite: false },
                    { name: "Live Match Scoring", pro: true, elite: true },
                    { name: "Built-In Rulebooks", pro: true, elite: true },
                    { name: "Player Performance Insights", pro: true, elite: false },
                    { name: "Team Stats Dashboard", pro: true, elite: false },
                    { name: "AI Assistant Coach", pro: true, elite: false, subtitle: "Powered by OpenAI" },
                    { name: "Social Sports Community", pro: true, elite: false },
                    { name: "Inviting Match Audience", pro: true, elite: false },
                  ].map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <View style={styles.featureNameContainer}>
                        <Text style={styles.featureName}>{feature.name}</Text>
                        {feature.subtitle && (
                          <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                        )}
                      </View>
                      <View style={styles.checkmarksContainer}>
                        {/* Pro Column */}
                        <View style={[styles.columnBox, feature.pro && styles.proColumnBox]}>
                          {feature.pro ? (
                            <View style={styles.checkmarkCircle}>
                              <AntDesign name="check" size={10} color="#FFFFFF" />
                            </View>
                          ) : (
                            <View style={styles.crossCircle}>
                              <AntDesign name="close" size={10} color="#FFFFFF" />
                            </View>
                          )}
                        </View>
                        {/* Elite Column */}
                        <View style={styles.columnBox}>
                          {feature.elite ? (
                            <View style={styles.checkmarkCircle}>
                              <AntDesign name="check" size={10} color="#FFFFFF" />
                            </View>
                          ) : (
                            <View style={styles.crossCircle}>
                              <AntDesign name="close" size={10} color="#FFFFFF" />
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </View>

            {/* Current Plan Details */}
            <View style={styles.currentPlanContainer}>
              <View style={styles.currentPlanCard}>
                <View style={styles.currentPlanHeader}>
                  <Ionicons name="information-circle" size={20} color="#004aad" />
                  <Text style={styles.currentPlanTitle}>Current Plan</Text>
                </View>
                <View style={styles.currentPlanDetails}>
                  <View style={styles.currentPlanRow}>
                    <Text style={styles.currentPlanLabel}>Plan:</Text>
                    <Text style={styles.currentPlanValue}>
                      {getPlanDisplayName(subscriptionData?.currentPlan || user?.plan || 'free')}
                    </Text>
                  </View>
                  {subscriptionData?.subscription && (
                    <View style={styles.currentPlanRow}>
                      <Text style={styles.currentPlanLabel}>Purchased On:</Text>
                      <Text style={styles.currentPlanValue}>
                        {formatDate(subscriptionData.subscription.purchasedOn)}
                      </Text>
                    </View>
                  )}
                  {subscriptionData?.subscription?.expiresOn && (
                    <View style={styles.currentPlanRow}>
                      <Text style={styles.currentPlanLabel}>Expires On:</Text>
                      <Text style={styles.currentPlanValue}>
                        {formatDate(subscriptionData.subscription.expiresOn)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Subscription Duration Selection */}
            <View style={styles.durationContainer}>
              <TouchableOpacity
                onPress={() => setSelectedDuration('3months')}
                activeOpacity={0.8}
                style={[
                  styles.durationCard,
                  selectedDuration === '3months' ? styles.durationCardSelected : styles.durationCardUnselected
                ]}
              >
                <LinearGradient
                  colors={selectedDuration === '3months' 
                    ? ['#10B981', '#059669'] 
                    : ['#E5E7EB', '#D1D5DB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.durationCardGradient}
                >
                  <View style={styles.durationContent}>
                    <Text style={[
                      styles.durationTitle,
                      selectedDuration === '3months' ? styles.durationTitleSelected : styles.durationTitleUnselected
                    ]}>
                      3 Months
                    </Text>
                    <Text style={[
                      styles.durationPrice,
                      selectedDuration === '3months' ? styles.durationPriceSelected : styles.durationPriceUnselected
                    ]}>
                      INR 59 for 3 Months
                    </Text>
                  </View>
                  <View style={[
                    styles.durationCheckmark,
                    selectedDuration === '3months' ? styles.checkmarkSelected : styles.checkmarkUnselected
                  ]}>
                    <AntDesign 
                      name="check" 
                      size={16} 
                      color={selectedDuration === '3months' ? "#FFF201" : "#6B7280"} 
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedDuration('1year')}
                activeOpacity={0.8}
                style={[
                  styles.durationCard,
                  selectedDuration === '1year' ? styles.durationCardSelected : styles.durationCardUnselected
                ]}
              >
                <LinearGradient
                  colors={selectedDuration === '1year' 
                    ? ['#10B981', '#059669'] 
                    : ['#E5E7EB', '#D1D5DB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.durationCardGradient}
                >
                  <View style={styles.durationContent}>
                    <Text style={[
                      styles.durationTitle,
                      selectedDuration === '1year' ? styles.durationTitleSelected : styles.durationTitleUnselected
                    ]}>
                      1 Year
                    </Text>
                    <Text style={[
                      styles.durationPrice,
                      selectedDuration === '1year' ? styles.durationPriceSelected : styles.durationPriceUnselected
                    ]}>
                      INR 199 for 1 Year
                    </Text>
                  </View>
                  <View style={[
                    styles.durationCheckmark,
                    selectedDuration === '1year' ? styles.checkmarkSelected : styles.checkmarkUnselected
                  ]}>
                    <AntDesign 
                      name="check" 
                      size={16} 
                      color={selectedDuration === '1year' ? "#FFF201" : "#6B7280"} 
                    />
                  </View>
      </LinearGradient>
              </TouchableOpacity>
            </View>
        </ScrollView>

          {/* Fixed Bottom Buttons */}
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity
              onPress={() => {
                router.push("/subscription/FAQ");
              }}
              style={styles.faqButton}
              activeOpacity={0.8}
            >
              <Text style={styles.faqButtonText}>FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity 
              onPress={() => {
                // Handle Continue action
                Alert.alert("Continue", `Proceeding with ${selectedDuration === '3months' ? '3 Months' : '1 Year'} plan`);
              }}
              style={styles.continueButton}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
        </LinearGradient>
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
    marginTop: 0,
    fontSize: 12,
    fontWeight: "600",
  },
  roleButton: {
    marginTop: 4,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
    tableWrapper: {
      marginBottom: 20,
      borderRadius: 14,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    tableGradient: {
      padding: 12,
      borderRadius: 14,
    },
    tableHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    tableTitle: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
      flex: 1,
    },
    planHeaders: {
      flexDirection: "row",
      gap: 16,
    },
    proPlanHeader: {
      color: "#10B981",
      fontSize: 14,
      fontWeight: "600",
      marginRight: 12,
    },
    elitePlanHeader: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
      marginRight: 10,
    },
    featuresContainer: {
      gap: 8,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 4,
    },
    featureNameContainer: {
      flex: 1,
      marginRight: 8,
    },
    featureName: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "500",
    },
    featureSubtitle: {
      color: "#9CA3AF",
      fontSize: 10,
      marginTop: 2,
      fontStyle: "italic",
    },
    checkmarksContainer: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    columnBox: {
      width: 45,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    proColumnBox: {
      backgroundColor: "#FFFFFF",
      borderRadius: 6,
    },
    checkmarkCircle: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: "#10B981",
      alignItems: "center",
      justifyContent: "center",
    },
    crossCircle: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: "#EF4444",
      alignItems: "center",
      justifyContent: "center",
    },
    currentPlanContainer: {
      marginTop: 16,
      marginBottom: 16,
    },
    currentPlanCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    currentPlanHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    currentPlanTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: "#004aad",
      marginLeft: 8,
    },
    currentPlanDetails: {
      gap: 8,
    },
    currentPlanRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    currentPlanLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: "#6B7280",
    },
    currentPlanValue: {
      fontSize: 14,
      fontWeight: "600",
      color: "#111827",
    },
    durationContainer: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 20,
    },
    durationCard: {
      flex: 1,
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    durationCardGradient: {
      padding: 16,
      minHeight: 100,
    },
    durationCardSelected: {
      // Handled by gradient
    },
    durationCardUnselected: {
      // Handled by gradient
    },
    durationContent: {
      flex: 1,
    },
    durationTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 4,
    },
    durationTitleSelected: {
      color: "#FFFFFF",
    },
    durationTitleUnselected: {
      color: "#374151",
    },
    durationPrice: {
      fontSize: 12,
      fontWeight: "500",
    },
    durationPriceSelected: {
      color: "#FFFFFF",
    },
    durationPriceUnselected: {
      color: "#6B7280",
    },
    durationCheckmark: {
      position: "absolute",
      bottom: 8,
      right: 8,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "#000000",
      alignItems: "center",
      justifyContent: "center",
    },
    checkmarkSelected: {
      backgroundColor: "#000000",
    },
    checkmarkUnselected: {
      backgroundColor: "#000000",
    },
    bottomButtonsContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      padding: 16,
      backgroundColor: "#fff201",
      gap: 12,
    
      shadowRadius: 8,
      shadowOffset: { width: 0, height: -2 },
      elevation: 5,
    },
    faqButton: {
      flex: 1,
      backgroundColor: "#000000",
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    faqButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    continueButton: {
      flex: 1,
      backgroundColor: "#10B981",
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    continueButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
  },
});
