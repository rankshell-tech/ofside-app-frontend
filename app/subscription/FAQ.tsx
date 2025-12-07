import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Entypo, Ionicons, AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is the difference between Elite and Pro plans?",
    answer: "Elite plan includes Live Match Scoring and Built-In Rulebooks. Pro plan includes all Elite features plus Create Tournament Instantly, Player Performance Insights, Team Stats Dashboard, AI Assistant Coach, Social Sports Community, and Inviting Match Audience features.",
  },
  {
    question: "How do I upgrade my subscription plan?",
    answer: "You can upgrade your subscription plan at any time by selecting your desired plan (3 Months or 1 Year) and clicking the Continue button. Your new plan will be activated immediately after payment confirmation.",
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time. However, cancellation will take effect at the end of your current billing period. You will continue to have access to all Pro features until your subscription expires.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major payment methods including credit cards, debit cards, UPI, and digital wallets through our secure payment gateway powered by Razorpay.",
  },
  {
    question: "Will I be charged automatically for renewal?",
    answer: "Yes, if you have selected a recurring subscription plan, you will be automatically charged at the end of each billing period (3 months or 1 year) unless you cancel your subscription before the renewal date.",
  },
  {
    question: "What happens if my payment fails?",
    answer: "If your payment fails, we will notify you via email and in-app notifications. Your subscription will remain active for a grace period. Please update your payment method to continue enjoying Pro features.",
  },
  {
    question: "Can I switch between 3 Months and 1 Year plans?",
    answer: "Yes, you can switch between plans at any time. When you upgrade or change your plan duration, the new subscription will start immediately, and you'll be charged the prorated amount based on your remaining subscription period.",
  },
  {
    question: "Do I get a refund if I cancel?",
    answer: "Refunds are processed according to our refund policy. If you cancel within the first 7 days of your subscription, you may be eligible for a full refund. After that, refunds are prorated based on the remaining subscription period.",
  },
  {
    question: "What is the AI Assistant Coach feature?",
    answer: "The AI Assistant Coach is powered by OpenAI and provides personalized coaching tips, match analysis, and performance recommendations based on your playing history and statistics. This feature is exclusive to Pro plan subscribers.",
  },
  {
    question: "How do I access my subscription details?",
    answer: "You can view your current subscription details, purchase date, and expiration date in the subscription screen. Navigate to Profile > Subscription to see all your subscription information.",
  },
  {
    question: "What happens when my subscription expires?",
    answer: "When your subscription expires, you will automatically be downgraded to the Elite plan (free tier). You will lose access to Pro-only features but can upgrade again at any time to regain full access.",
  },
  {
    question: "Can I share my Pro subscription with others?",
    answer: "No, subscriptions are tied to individual accounts and cannot be shared. Each user needs their own subscription to access Pro features.",
  },
];

export default function FAQ() {
  const navigation = useNavigation();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={['#FFFFFF', '#FFF201']}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 pt-2 pb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-md mr-3"
            activeOpacity={0.7}
          >
            <Entypo name="chevron-left" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">FAQ</Text>
            <Text className="text-sm text-gray-600">Frequently Asked Questions</Text>
          </View>
        </View>

        {/* FAQ Content */}
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View style={styles.faqContainer}>
            {faqData.map((item, index) => {
              const isExpanded = expandedItems.has(index);
              return (
                <View key={index} style={styles.faqItem}>
                  <TouchableOpacity
                    onPress={() => toggleItem(index)}
                    activeOpacity={0.7}
                    style={styles.faqQuestionContainer}
                  >
                    <View style={styles.faqQuestionContent}>
                      <Text style={styles.faqQuestion}>{item.question}</Text>
                    </View>
                    <View style={styles.faqIconContainer}>
                      <AntDesign
                        name={isExpanded ? "up" : "down"}
                        size={18}
                        color="#004aad"
                      />
                    </View>
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View style={styles.faqAnswerContainer}>
                      <Text style={styles.faqAnswer}>{item.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <View style={styles.helpCard}>
              <Ionicons name="help-circle" size={32} color="#fff201" />
              <Text style={styles.helpTitle}>Still have questions?</Text>
              <Text style={styles.helpText}>
                Contact our support team for assistance
              </Text>
              <TouchableOpacity
                style={styles.helpButton}
                activeOpacity={0.8}
                onPress={() => {
                  // Handle contact support
               router.push("/staticPages/helpAndSupport") }}
              >
                <Text style={styles.helpButtonText}>Contact Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  faqContainer: {
    gap: 12,
    marginTop: 8,
  },
  faqItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  faqQuestionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  faqQuestionContent: {
    flex: 1,
    marginRight: 12,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 22,
  },
  faqIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  faqAnswer: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 20,
  },
  helpSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  helpCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  helpButton: {
    backgroundColor: "#fff201",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 160,
  },
  helpButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
