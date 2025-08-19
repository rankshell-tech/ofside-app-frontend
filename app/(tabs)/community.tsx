import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Users, MessageCircle, Trophy, Calendar } from 'lucide-react-native';

export default function CommunityScreen() {
  const theme = useTheme();

  const communityFeatures = [
    {
      icon: <Users size={24} color={theme.colors.primary} />,
      title: 'Find Players',
      description: 'Connect with other players in your area',
      action: 'Browse Players',
    },
    {
      icon: <MessageCircle size={24} color={theme.colors.primary} />,
      title: 'Join Groups',
      description: 'Join sport-specific groups and communities',
      action: 'Explore Groups',
    },
    {
      icon: <Trophy size={24} color={theme.colors.primary} />,
      title: 'Tournaments',
      description: 'Participate in local tournaments and competitions',
      action: 'View Tournaments',
    },
    {
      icon: <Calendar size={24} color={theme.colors.primary} />,
      title: 'Events',
      description: 'Discover upcoming sports events and meetups',
      action: 'Find Events',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText size="2xl" weight="bold">
            Community
          </ThemedText>
          <ThemedText variant="secondary" size="base">
            Connect with players and join the sports community
          </ThemedText>
        </View>

        <View style={styles.featuresContainer}>
          {communityFeatures.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureCard, { backgroundColor: theme.colors.background }]}
              activeOpacity={0.7}
            >
              <View style={styles.featureIcon}>
                {feature.icon}
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
              <View style={[styles.actionBadge, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.actionText, { color: theme.colors.primary }]}>
                  {feature.action}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.comingSoonCard, { backgroundColor: theme.colors.surface }]}>
          <ThemedText size="lg" weight="bold" style={styles.comingSoonTitle}>
            Coming Soon!
          </ThemedText>
          <ThemedText variant="secondary" size="base" style={styles.comingSoonText}>
            Community features are being developed. Stay tuned for player matching, group chats, and tournament organization tools.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  featuresContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featureIcon: {
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  actionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  comingSoonCard: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  comingSoonTitle: {
    marginBottom: 12,
  },
  comingSoonText: {
    textAlign: 'center',
    lineHeight: 20,
  },
});