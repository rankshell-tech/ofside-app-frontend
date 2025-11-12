// /app/(tabs)/InviteAndEarn.tsx
import React, { JSX, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';

const { width } = Dimensions.get('window');

export default function InviteAndEarn(): JSX.Element {
  const [referralCode] = useState('OF-SIDE-2024');
  const [referralsCount] = useState(12);
  const [earnings] = useState(450);

  const handleGetLink = async () => {
    const referralLink = `https://ofside.app/invite?code=${referralCode}`;
    
    try {
      await Share.share({
        message: `Join me on Ofside! Use my referral code ${referralCode} to get started. ${referralLink}`,
        title: 'Join Ofside - Sports Community',
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(referralCode);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const referralStats = [
    { number: referralsCount, label: 'Successful Referrals' },
    { number: `$${earnings}`, label: 'Total Earnings' },
 
  ];


  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#FFF201', '#FFE033', '#FFF8DC']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🤝</Text>
            </View>
            <Text style={styles.title}>Invite & Earn</Text>
            <Text style={styles.subtitle}>
              Share the Ofside experience with friends and earn exciting rewards together!
            </Text>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Your Referral Impact</Text>
            <View style={styles.statsGrid}>
              {referralStats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <Text style={styles.statNumber}>{stat.number}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Referral Code Section */}
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Unique Referral Code</Text>
            <TouchableOpacity style={styles.codeContainer} onPress={handleCopyCode}>
              <LinearGradient
                colors={['#FFF201', '#FFD700']}
                style={styles.codeGradient}
              >
                <Text style={styles.codeText}>{referralCode}</Text>
                <Text style={styles.copyText}>Tap to Copy</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.codeDescription}>
              Share this code with friends when they sign up
            </Text>
          </View> */}



          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <LinearGradient
              colors={['#FFFBCC','#FFF']}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaTitle}>Play, Invite, Earn ₹50!</Text>
              <Text style={styles.ctaSubtitle}>
           Refer a friend, get ₹50 off — it’s that simple!
              </Text>
                  <Text style={styles.infoText  }>
               (After your friend’s first booking.)
              </Text>
              <TouchableOpacity 
                style={styles.ctaButton} 
                onPress={handleGetLink}
                activeOpacity={0.8}
              >
                <Text style={styles.ctaButtonText}>Share Invite Link</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={handleCopyCode}
              >
                <Text style={styles.secondaryButtonText}>Copy Code Instead</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* FAQ Section */}
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>Common Questions</Text>
            <View style={styles.faqList}>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>When do I receive my rewards?</Text>
                <Text style={styles.faqAnswer}>
                  Rewards are credited instantly when your friend completes signup and verifies their account.
                </Text>
              </View>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Is there a limit to referrals?</Text>
                <Text style={styles.faqAnswer}>
                  No limits! Earn rewards for every valid referral. Bonus tiers unlock at 5, 10, and 20 referrals.
                </Text>
              </View>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>How can I use my earnings?</Text>
                <Text style={styles.faqAnswer}>
                  Earnings can be used for venue bookings, premium features, or withdrawn to your bank account.
                </Text>
              </View>
            </View>
          </View> */}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Terms & Conditions apply.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF201',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsSection: {
    marginBottom: 25,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 25,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: (width - 80) / 2,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF201',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    fontWeight: '600',
  },
  codeContainer: {
    marginBottom: 12,
  },
  codeGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  codeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: 8,
    letterSpacing: 2,
  },
  copyText: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: '600',
  },
  codeDescription: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  stepsGrid: {
    gap: 16,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f7fafc',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFF201',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF201',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a202c',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    flex: 1,
  },
  rewardsList: {
    gap: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFF201',
  },
  rewardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rewardEmoji: {
    fontSize: 20,
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#718096',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  achievedBadge: {
    backgroundColor: '#10B981',
  },
  pendingBadge: {
    backgroundColor: '#6B7280',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  ctaSection: {
    marginBottom: 20,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaGradient: {
    padding: 30,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },

    infoText: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#1a202c',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF201',
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  faqList: {
    gap: 16,
  },
  faqItem: {
    backgroundColor: '#f7fafc',
    padding: 16,
    borderRadius: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },


});