import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    StyleSheet,
    Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HelpAndSupport() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);
    const router = useRouter();

    const handleSubmit = () => {
        if (!name || !email || !message) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        Alert.alert(
            "Message Sent!",
            `Thank you for contacting us, ${name}! We'll get back to you soon.`,
            [{ text: "OK" }]
        );
        setName("");
        setEmail("");
        setMessage("");
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    const faqData = [
      
        {
            question: "Where can I find my match history?",
            answer: "Your match history is available in the 'Performance' tab of your profile section."
        },
        {
            question: "How do I create a new match?",
            answer: "Go to the 'Matches' tab and tap the '+' button to create a new match with your preferred sport and settings."
        },
        {
            question: "Can I invite friends to join?",
            answer: "Yes! Use the 'Invite Friends' feature from your profile to share referral codes."
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#FFF201', '#FFFFFF', '#FFF8DC']}
                style={styles.gradient}
            >
                <ScrollView 
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Help & Support</Text>
                        <Text style={styles.subtitle}>
                            We're here to help! Find answers to common questions or contact our support team.
                        </Text>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.quickActions}>
                        <Text style={styles.sectionTitle}>Quick Help</Text>
                        <View style={styles.actionGrid}>
                            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)')}>
                                <View style={[styles.actionIcon, { backgroundColor: '#FF6B6B' }]}>
                                    <Text style={styles.actionEmoji}>🏠</Text>
                                </View>
                                <Text style={styles.actionText}>Home</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/settings/profileScreen')}>
                                <View style={[styles.actionIcon, { backgroundColor: '#4ECDC4' }]}>
                                    <Text style={styles.actionEmoji}>👤</Text>
                                </View>
                                <Text style={styles.actionText}>Profile</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/myGame/myGame')}>
                                <View style={[styles.actionIcon, { backgroundColor: '#45B7D1' }]}>
                                    <Text style={styles.actionEmoji}>⚽</Text>
                                </View>
                                <Text style={styles.actionText}>Matches</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/myPerformance/performance')}>
                                <View style={[styles.actionIcon, { backgroundColor: '#96CEB4' }]}>
                                    <Text style={styles.actionEmoji}>📊</Text>
                                </View>
                                <Text style={styles.actionText}>Stats</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* FAQ Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                        {faqData.map((faq, index) => (
                            <TouchableOpacity key={index} style={styles.faqItem}>
                                <View style={styles.faqHeader}>
                                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                                    <Text style={styles.faqIcon}>⌄</Text>
                                </View>
                                <Text style={styles.faqAnswer}>{faq.answer}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Contact Form Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact Support</Text>
                        <Text style={styles.formDescription}>
                            Can't find what you're looking for? Send us a message and we'll help you out.
                        </Text>
                        
                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email Address</Text>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="your.email@example.com"
                                    placeholderTextColor="#94a3b8"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Message</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={message}
                                    onChangeText={setMessage}
                                    placeholder="Describe your issue or question in detail..."
                                    placeholderTextColor="#94a3b8"
                                    multiline
                                    numberOfLines={5}
                                    textAlignVertical="top"
                                />
                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity 
                                    style={[
                                        styles.button,
                                        (!name || !email || !message) && styles.buttonDisabled
                                    ]} 
                                    onPress={handleSubmit}
                                    disabled={!name || !email || !message}
                                >
                                    <LinearGradient
                                        colors={['#FFF201', '#FFD700']}
                                        style={styles.buttonGradient}
                                    >
                                        <Text style={styles.buttonText}>
                                            {sent ? "✓ Message Sent!" : "Send Message"}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Support Info */}
                    <View style={styles.supportInfo}>
                        <Text style={styles.supportTitle}>Other Ways to Reach Us</Text>
                        <View style={styles.supportMethods}>
                            <View style={styles.supportMethod}>
                                <Text style={styles.supportEmoji}>📧</Text>
                                <Text style={styles.supportText}>support@ofside.com</Text>
                            </View>
                            <View style={styles.supportMethod}>
                                <Text style={styles.supportEmoji}>🕒</Text>
                                <Text style={styles.supportText}>24/7 Support</Text>
                            </View>
                            <View style={styles.supportMethod}>
                                <Text style={styles.supportEmoji}>📱</Text>
                                <Text style={styles.supportText}>In-App Chat</Text>
                            </View>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            © {new Date().getFullYear()} Ofside • Made with ❤️ for sports lovers
                        </Text>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 30,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    title: {
        fontSize: 36,
        fontWeight: "800",
        color: "#1a202c",
        marginBottom: 8,
        textAlign: "center",
        fontFamily: 'Inter-Bold',
    },
    subtitle: {
        fontSize: 16,
        color: "#4a5568",
        lineHeight: 22,
        textAlign: "center",
        fontFamily: 'Inter-Regular',
    },
    quickActions: {
        marginBottom: 25,
    },
    section: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1a202c",
        marginBottom: 16,
        fontFamily: 'Inter-Bold',
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    actionCard: {
        width: (width - 80) / 2,
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    actionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionEmoji: {
        fontSize: 20,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2d3748',
        textAlign: 'center',
    },
    faqItem: {
        backgroundColor: '#f7fafc',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#FFF201',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2d3748",
        flex: 1,
        marginRight: 8,
        fontFamily: 'Inter-SemiBold',
    },
    faqIcon: {
        fontSize: 18,
        color: "#718096",
    },
    faqAnswer: {
        fontSize: 14,
        color: "#4a5568",
        lineHeight: 20,
        marginTop: 8,
        fontFamily: 'Inter-Regular',
    },
    formDescription: {
        fontSize: 14,
        color: "#718096",
        lineHeight: 20,
        marginBottom: 20,
        fontFamily: 'Inter-Regular',
    },
    form: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2d3748",
        fontFamily: 'Inter-SemiBold',
    },
    input: {
        borderWidth: 2,
        borderColor: "#e2e8f0",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        backgroundColor: "white",
        fontFamily: 'Inter-Regular',
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: "top",
    },
    buttonContainer: {
        marginTop: 10,
    },
    button: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonGradient: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderRadius: 12,
    },
    buttonText: {
        color: "#1a202c",
        fontSize: 18,
        fontWeight: "700",
        fontFamily: 'Inter-Bold',
    },
    supportInfo: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    supportTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a202c",
        marginBottom: 16,
        textAlign: 'center',
        fontFamily: 'Inter-Bold',
    },
    supportMethods: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    supportMethod: {
        alignItems: 'center',
    },
    supportEmoji: {
        fontSize: 24,
        marginBottom: 8,
    },
    supportText: {
        fontSize: 12,
        color: "#4a5568",
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
    },
    footer: {
        marginTop: 10,
        padding: 16,
        alignItems: "center",
    },
    footerText: {
        fontSize: 12,
        color: "#718096",
        textAlign: "center",
        fontFamily: 'Inter-Regular',
    },
});