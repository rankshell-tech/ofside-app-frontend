import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Linking,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
const { width } = Dimensions.get('window');

export default function About() {
    const router = useRouter();

    const teamMembers = [
        { id: 1, name: 'Alex Johnson', role: 'Founder & CEO', emoji: '🚀' },
        { id: 2, name: 'Sarah Chen', role: 'Product Designer', emoji: '🎨' },
        { id: 3, name: 'Mike Rodriguez', role: 'Lead Developer', emoji: '💻' },
        { id: 4, name: 'Emily Davis', role: 'Community Manager', emoji: '👥' },
    ];

    const features = [
        { icon: '⚡', title: 'Instant Booking', description: 'Book venues in seconds with real-time availability' },
        { icon: '🎯', title: 'Smart Matching', description: 'Find players and opponents at your skill level' },
        { icon: '📊', title: 'Performance Tracking', description: 'Monitor your progress with detailed analytics' },
        { icon: '🤝', title: 'Community Building', description: 'Connect with local sports enthusiasts' },
    ];

   const stats = [
  {
    number: "⚡",
    label: "Performance Tracking",
    desc: "Track every game, score, and stat to improve your performance over time.",
  },
  {
    number: "📊",
    label: "Smart Scoring System",
    desc: "Automated match scoring and insights for players and venues.",
  },
  {
    number: "🏟️",
    label: "Seamless Venue Booking",
    desc: "Book sports venues in just a few taps — no calls, no confusion.",
  },
  {
    number: "🤝",
    label: "Player & Team Profiles",
    desc: "Build your identity, showcase achievements, and form teams effortlessly.",
  },
];


    const openSocialLink = (url: string) => {
        Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
    };

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
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoEmoji}>⚽</Text>
                        </View>
                        <Text style={styles.title}>About Ofside</Text>
                        <Text style={styles.subtitle}>
                            Revolutionizing the way sports enthusiasts connect, play, and grow together
                        </Text>
                    </View>

                    {/* Stats Section */}
                    <View style={styles.statsSection}>
                        <Text style={styles.sectionTitle}>Our Impact</Text>
                        <View style={styles.statsGrid}>
                            {stats.map((stat, index) => (
                                <View key={index} style={styles.statCard}>
                                    <Text style={styles.statNumber}>{stat.number}</Text>
                                    <Text style={styles.statLabel}>{stat.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Mission Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Our Mission</Text>
                        <View style={styles.missionContent}>
                            <Text style={styles.missionText}>
                                At <Text style={styles.highlight}>Ofside</Text>, we believe that sports have the power to bring people together, 
                                build communities, and create unforgettable experiences. Our mission is to make sports 
                                accessible to everyone by connecting players with venues and like-minded enthusiasts.
                            </Text>
                            <View style={styles.missionEmoji}>🏆</View>
                        </View>
                    </View>

                    {/* Features Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Why Choose Ofside?</Text>
                        <View style={styles.featuresGrid}>
                            {features.map((feature, index) => (
                                <View key={index} style={styles.featureCard}>
                                    <Text style={styles.featureIcon}>{feature.icon}</Text>
                                    <Text style={styles.featureTitle}>{feature.title}</Text>
                                    <Text style={styles.featureDescription}>{feature.description}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Story Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Our Story</Text>
                        <View style={styles.storyContent}>
                            <Text style={styles.storyText}>
                                Founded in 2024, Ofside started as a simple idea: what if finding a sports game 
                                was as easy as ordering food?{'\n\n'}
                                
                                Our team of sports enthusiasts and tech experts came together to solve the 
                                challenges we all faced - empty courts, mismatched skill levels, and the hassle 
                                of organizing games.{'\n\n'}
                                
                                Today, we're proud to serve a growing community of athletes who share our passion 
                                for making sports more accessible and enjoyable for everyone.
                            </Text>
                        </View>
                    </View>

                    {/* Team Section */}
                    {/* <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Meet The Team</Text>
                        <View style={styles.teamGrid}>
                            {teamMembers.map((member) => (
                                <View key={member.id} style={styles.teamCard}>
                                    <View style={styles.teamEmoji}>
                                        <Text style={styles.teamEmojiText}>{member.emoji}</Text>
                                    </View>
                                    <Text style={styles.teamName}>{member.name}</Text>
                                    <Text style={styles.teamRole}>{member.role}</Text>
                                </View>
                            ))}
                        </View>
                    </View> */}

                    {/* Values Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Our Values</Text>
                        <View style={styles.valuesList}>
                            <View style={styles.valueItem}>
                                <Text style={styles.valueEmoji}>❤️</Text>
                                <View style={styles.valueTextContainer}>
                                    <Text style={styles.valueTitle}>Passion for Sports</Text>
                                    <Text style={styles.valueDescription}>
                                        We live and breathe sports, and it shows in everything we build
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.valueItem}>
                                <Text style={styles.valueEmoji}>🤝</Text>
                                <View style={styles.valueTextContainer}>
                                    <Text style={styles.valueTitle}>Community First</Text>
                                    <Text style={styles.valueDescription}>
                                        Our users are at the heart of every decision we make
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.valueItem}>
                                <Text style={styles.valueEmoji}>🚀</Text>
                                <View style={styles.valueTextContainer}>
                                    <Text style={styles.valueTitle}>Innovation</Text>
                                    <Text style={styles.valueDescription}>
                                        Constantly pushing boundaries to enhance your sports experience
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Contact Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Get In Touch</Text>
                        <View style={styles.contactContent}>
                            <Text style={styles.contactText}>
                                Have questions, suggestions, or just want to say hello? We'd love to hear from you!
                            </Text>
                            <View style={styles.contactButtons}>
                                <TouchableOpacity 
                                    style={styles.contactButton}
                                    onPress={() => Linking.openURL('mailto:support@ofside.com')}
                                >
                                    <Text style={styles.contactButtonText}>📧 Email Us</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.contactButton}
                                    onPress={() => router.push('/staticPages/helpAndSupport')}
                                >
                                    <Text style={styles.contactButtonText}>💬 Help Center</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Social Links */}
                    
    <View style={styles.socialSection}>
      <Text style={styles.socialTitle}>Follow Our Journey</Text>

      <View style={styles.socialLinks}>
        {/* Twitter */}
        <TouchableOpacity
          style={[styles.socialLink, { backgroundColor: "#1DA1F2" }]}
          onPress={() => openSocialLink("https://twitter.com/ofside")}
          activeOpacity={0.8}
        >
          <FontAwesome name="twitter" size={22} color="#fff" />
      
        </TouchableOpacity>

        {/* Instagram */}
        <TouchableOpacity
          style={[styles.socialLink, { backgroundColor: "#E1306C" }]}
          onPress={() => openSocialLink("https://instagram.com/ofside")}
          activeOpacity={0.8}
        >
          <FontAwesome name="instagram" size={22} color="#fff" />
          
        </TouchableOpacity>

        {/* LinkedIn */}
        <TouchableOpacity
          style={[styles.socialLink, { backgroundColor: "#0077B5" }]}
          onPress={() => openSocialLink("https://linkedin.com/company/ofside")}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="linkedin-in" size={22} color="#fff" />
        
        </TouchableOpacity>
      </View>
    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Made with ❤️ for the sports community
                        </Text>
                        <Text style={styles.versionText}>
                            Version 2.1.0 • © {new Date().getFullYear()} Ofside
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
    missionContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
    },
    missionText: {
        flex: 1,
        fontSize: 16,
        color: '#4a5568',
        lineHeight: 24,
    },
    highlight: {
        fontWeight: '700',
        color: '#FFF201',
    },
    missionEmoji: {
        fontSize: 48,
        marginTop: -8,
    },
    featuresGrid: {
        gap: 16,
    },
    featureCard: {
        backgroundColor: '#f7fafc',
        padding: 20,
        borderRadius: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FFF201',
    },
    featureIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        color: '#718096',
        lineHeight: 20,
    },
    storyContent: {
        backgroundColor: '#f7fafc',
        padding: 20,
        borderRadius: 16,
    },
    storyText: {
        fontSize: 16,
        color: '#4a5568',
        lineHeight: 24,
    },
    teamGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    teamCard: {
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
    teamEmoji: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF201',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    teamEmojiText: {
        fontSize: 20,
    },
    teamName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: 4,
        textAlign: 'center',
    },
    teamRole: {
        fontSize: 12,
        color: '#718096',
        textAlign: 'center',
    },
    valuesList: {
        gap: 16,
    },
    valueItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
        backgroundColor: '#f7fafc',
        padding: 16,
        borderRadius: 12,
    },
    valueEmoji: {
        fontSize: 20,
        marginTop: 2,
    },
    valueTextContainer: {
        flex: 1,
    },
    valueTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: 4,
    },
    valueDescription: {
        fontSize: 14,
        color: '#718096',
        lineHeight: 20,
    },
    contactContent: {
        alignItems: 'center',
    },
    contactText: {
        fontSize: 16,
        color: '#4a5568',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    contactButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    contactButton: {
        backgroundColor: '#FFF201',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    contactButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a202c',
    },
    socialSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 25,
        borderRadius: 25,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    socialTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a202c',
        marginBottom: 16,
    },
    socialLinks: {
        flexDirection: 'row',
        gap: 16,
    },
    socialLink: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    socialText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4a5568',
    },
    footer: {
        alignItems: 'center',
        padding: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#718096',
        marginBottom: 8,
        textAlign: 'center',
    },
    versionText: {
        fontSize: 12,
        color: '#a0aec0',
        textAlign: 'center',
    },
});