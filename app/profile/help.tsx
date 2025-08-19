import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, CircleHelp as HelpCircle, MessageCircle, Phone, Mail, ChevronRight, Send } from 'lucide-react-native';

export default function HelpSupport() {
  const router = useRouter();
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const faqItems = [
    {
      question: 'How do I book a venue?',
      answer: 'Browse venues on the home screen, select your preferred venue, choose date and time, then confirm your booking.',
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel bookings up to 24 hours before the scheduled time from the My Bookings section.',
    },
    {
      question: 'How do I add payment methods?',
      answer: 'Go to Profile > Payment Methods to add and manage your payment options.',
    },
    {
      question: 'What sports are available?',
      answer: 'We support Football, Tennis, Basketball, Badminton, Cricket, Volleyball, Squash, and Table Tennis.',
    },
    {
      question: 'How do I become a venue owner?',
      answer: 'Sign up as a venue owner during registration or contact support to upgrade your account.',
    },
  ];

  const contactOptions = [
    {
      icon: <MessageCircle size={20} color={theme.colors.primary} />,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: () => Alert.alert('Live Chat', 'Live chat feature coming soon!'),
    },
    {
      icon: <Mail size={20} color={theme.colors.primary} />,
      title: 'Email Support',
      description: 'support@sportbook.com',
      action: () => Alert.alert('Email', 'Opening email client...'),
    },
    {
      icon: <Phone size={20} color={theme.colors.primary} />,
      title: 'Phone Support',
      description: '+1 (555) 123-4567',
      action: () => Alert.alert('Phone', 'Calling support...'),
    },
  ];

  const categories = [
    'Booking Issues',
    'Payment Problems',
    'Account Settings',
    'Technical Issues',
    'Feature Request',
    'Other',
  ];

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your message');
      return;
    }
    
    Alert.alert(
      'Message Sent',
      'Thank you for contacting us! We\'ll get back to you within 24 hours.',
      [{ text: 'OK', onPress: () => setMessage('') }]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          Help & Support
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Contact */}
        <View style={styles.section}>
          <ThemedText size="base" weight="medium" style={styles.sectionTitle}>
            Contact Support
          </ThemedText>
          <View style={styles.contactContainer}>
            {contactOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.contactItem, { backgroundColor: theme.colors.background }]}
                onPress={option.action}
              >
                <View style={styles.contactIcon}>
                  {option.icon}
                </View>
                <View style={styles.contactContent}>
                  <ThemedText size="base" weight="medium">
                    {option.title}
                  </ThemedText>
                  <ThemedText variant="secondary" size="sm">
                    {option.description}
                  </ThemedText>
                </View>
                <ChevronRight size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Send Message */}
        <View style={styles.section}>
          <ThemedText size="base" weight="medium" style={styles.sectionTitle}>
            Send us a Message
          </ThemedText>
          
          <View style={[styles.messageCard, { backgroundColor: theme.colors.background }]}>
            <View style={styles.categoryContainer}>
              <ThemedText size="sm" weight="medium" style={styles.categoryLabel}>
                Category
              </ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: selectedCategory === category 
                          ? theme.colors.primary 
                          : theme.colors.surface,
                        borderColor: selectedCategory === category 
                          ? theme.colors.primary 
                          : theme.colors.border,
                      },
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <ThemedText
                      size="xs"
                      weight="medium"
                      style={{
                        color: selectedCategory === category 
                          ? theme.colors.accent 
                          : theme.colors.textSecondary,
                      }}
                    >
                      {category}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.messageContainer}>
              <ThemedText size="sm" weight="medium" style={styles.messageLabel}>
                Your Message
              </ThemedText>
              <TextInput
                style={[styles.messageInput, { 
                  color: theme.colors.text, 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border 
                }]}
                value={message}
                onChangeText={setMessage}
                placeholder="Describe your issue or question..."
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <Button
              title="Send Message"
              onPress={handleSendMessage}
              size="md"
              style={styles.sendButton}
            />
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <ThemedText size="base" weight="medium" style={styles.sectionTitle}>
            Frequently Asked Questions
          </ThemedText>
          
          <View style={styles.faqContainer}>
            {faqItems.map((item, index) => (
              <View key={index} style={[styles.faqItem, { backgroundColor: theme.colors.background }]}>
                <View style={styles.faqQuestion}>
                  <HelpCircle size={16} color={theme.colors.primary} />
                  <ThemedText size="sm" weight="medium" style={styles.questionText}>
                    {item.question}
                  </ThemedText>
                </View>
                <ThemedText variant="secondary" size="sm" style={styles.answerText}>
                  {item.answer}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <ThemedText size="sm" weight="medium" style={styles.infoTitle}>
            Need More Help?
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={styles.infoText}>
            Visit our website at ofside.in for detailed guides, video tutorials, and community forums.
          </ThemedText>
          <TouchableOpacity style={styles.linkButton}>
            <ThemedText size="xs" style={{ color: theme.colors.primary }}>
              Visit Help Center
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  contactContainer: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactIcon: {
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  messageCard: {
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryLabel: {
    marginBottom: 12,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  messageContainer: {
    marginBottom: 20,
  },
  messageLabel: {
    marginBottom: 8,
  },
  messageInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    minHeight: 100,
  },
  sendButton: {
    alignSelf: 'flex-end',
  },
  faqContainer: {
    gap: 12,
  },
  faqItem: {
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionText: {
    marginLeft: 8,
    flex: 1,
  },
  answerText: {
    lineHeight: 18,
    marginLeft: 24,
  },
  infoCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  infoTitle: {
    marginBottom: 8,
  },
  infoText: {
    lineHeight: 16,
    marginBottom: 8,
  },
  linkButton: {
    alignSelf: 'flex-start',
  },
});