import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsPrivacyScreen() {
    const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");
    const navigation = useNavigation();
    const renderTerms = () => (
    <>
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">
            I. ACCEPTANCE OF TERMS
        </Text>
        <Text className="font-normal text-[12px]">
          <Text className="font-semibold text-[14px]">Binding Agreement.</Text>
            These Terms of Use, Privacy Policy, Cancellation Policy, and Rescheduling Policy (collectively, "Policies") constitute a binding agreement between you and Ofside Technologies Private Limited ("Ofside", "we", "us").
        </Text>
        <Text className="font-normal text-[12px]">
          <Text className="font-semibold text-[14px]">Eligibility. </Text>
            You must be at least 18 years old and capable of entering into binding contracts. Use of the Services on behalf of an entity requires authority to bind that entity.
        </Text>
        <Text className="font-normal text-[12px]">
          <Text className="font-semibold text-[14px]">Amendments. </Text> We may modify these Terms at any time by posting updated Terms on the Platform. Continued use after changes indicates acceptance. We recommend reviewing regularly.
        </Text>
      </View>

      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">
            II. DEFINITIONS
        </Text>
        <Text className="font-normal text-[12px]">
          <Text className="font-semibold text-[14px]">User: </Text>
            An individual or entity accessing or using the Platform.
        </Text>
        <Text className="font-normal text-[12px]">
          <Text className="font-semibold text-[14px]">Venue Partner: </Text>
            A proprietor or manager listing sports venues on the Platform.
        </Text>
        <Text className="font-normal text-[12px]">
          <Text className="font-semibold text-[14px]">Booking: </Text>
            Reservation of one or more Slots at a Venue via the Platform.
        </Text><Text className="font-normal text-[12px]">
          <Text className="font-semibold text-[14px]">Slot: </Text>
            A specific date and time interval at a Venue.
        </Text>
        <Text className="font-normal text-[12px]">
          <Text className="font-semibold text-[14px]">Booking Fee: </Text>
            Total amount payable for a Booking, inclusive of venue charges and Ofside commission.
        </Text>
        <Text className="font-normal text-[12px]">
          <Text className="font-semibold text-[14px]">Handling Fee: </Text>
            Non-refundable fee charged by Ofside on cancellations and refunds.
        </Text>
      </View>
       {/* III. ACCOUNT REGISTRATION & SECURITY */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">
          III. ACCOUNT REGISTRATION & SECURITY
        </Text>
        <Text className="text-[12px]">
          <Text className="font-semibold text-[14px]">Account Creation. </Text>
          To book venues, you must register an account, providing accurate and
          complete information. You may link third-party accounts (e.g., Google,
          Facebook).
        </Text>
        <Text className="text-[12px]">
          <Text className="font-semibold text-[14px]">Credentials. </Text>
          You are responsible for maintaining your password privacy. Notify us
          immediately of unauthorized access.
        </Text>
        <Text className="text-[12px]">
          <Text className="font-semibold text-[14px]">Termination. </Text>
          We may suspend or terminate accounts for breach of these Terms or for
          illegal or harmful activities.
        </Text>
      </View>

      {/* IV. BOOKING PROCESS */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">IV. BOOKING PROCESS</Text>
        <Text className="text-[12px]">
          <Text className="font-semibold text-[14px]">Search & Selection. </Text>
          Users may search, filter, and sort Venues by sport, location, price,
          ratings, and availability.
        </Text>
        <Text className="text-[12px]">
          <Text className="font-semibold text-[14px]">Booking Request. </Text>
          Upon selecting a Slot, enter required details (name, contact, team size,
          special requests).
        </Text>
        <Text className="text-[12px]">
          <Text className="font-semibold text-[14px]">Payment. </Text>
          Full or partial payment options as offered. Ofside collects payments via
          secure gateways.
        </Text>
        <Text className="text-[12px]">
          <Text className="font-semibold text-[14px]">Booking Confirmation. </Text>
          A unique Booking ID is generated. Confirmation sent via in-app
          notification, email, and WhatsApp with details: Booking ID, Venue, Date,
          Time, Payment status.
        </Text>
      </View>
      {/* V. PAYMENT TERMS */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">V. PAYMENT TERMS</Text>
        <Text className="text-[12px]">Methods. Accepted methods include credit/debit cards, UPI, net banking, and supported wallets.</Text>
        <Text className="text-[12px]">Commission & Fees. Ofside charges a 10% commission. A 3% handling fee applies to refunds.</Text>
        <Text className="text-[12px]">Taxes. Applicable taxes are added at checkout and borne by the User.</Text>
        <Text className="text-[12px]">Split Payments. Refunds and rescheduling are calculated on the total slot price, not merely the amount paid.</Text>
      </View>

      {/* VI. REFUND POLICY */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">VI. REFUND POLICY</Text>
        <Text className="text-[12px]">Our Refund Policy is incorporated by reference and available here: Refund Policy.</Text>
      </View>

      {/* VII. RESCHEDULING POLICY */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">VII. RESCHEDULING POLICY</Text>
        <Text className="text-[12px]">Our Rescheduling Policy is incorporated by reference and available here: Rescheduling Policy.</Text>
      </View>

      {/* VIII. USER CONDUCT */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">VIII. USER CONDUCT</Text>
        <Text className="text-[12px]">Compliance. You must follow Venue Partner rules, safety guidelines, and all applicable laws.</Text>
        <Text className="text-[12px]">Prohibited Activities. Illegal, defamatory, harassing, or disruptive behavior; spamming; unauthorized data scraping; hacking; infringement of third-party rights.</Text>
        <Text className="text-[12px]">No-Shows. Late cancellations and no-shows may incur fees or affect future booking privileges.</Text>
      </View>

      {/* IX. VENUE PARTNER OBLIGATIONS */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">IX. VENUE PARTNER OBLIGATIONS</Text>
        <Text className="text-[12px]">Accuracy. Maintain up-to-date venue details, pricing, and slot availability.</Text>
        <Text className="text-[12px]">Confirmation. Promptly confirm or reject Bookings. Update Ofside of any changes.</Text>
        <Text className="text-[12px]">Venue Condition. Ensure safe, playable conditions. Offer rescheduling if unplayable due to weather or calamity.</Text>
      </View>

      {/* X. INTELLECTUAL PROPERTY */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">X. INTELLECTUAL PROPERTY</Text>
        <Text className="text-[12px]">All content, trademarks, logos, and software on the Platform are owned or licensed by Ofside. Unauthorized use is prohibited.</Text>
      </View>

      {/* XI. DISCLAIMERS & LIMITATION OF LIABILITY */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">XI. DISCLAIMERS & LIMITATION OF LIABILITY</Text>
        <Text className="text-[12px]">As Is Basis. Services provided without warranties. To the maximum extent permitted by law, Ofside disclaims all warranties.</Text>
        <Text className="text-[12px]">Liability Cap. Ofside’s maximum liability for any claim is limited to the Booking Fee paid for the disputed Booking.</Text>
      </View>

      {/* XII. INDEMNIFICATION */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">XII. INDEMNIFICATION</Text>
        <Text className="text-[12px]">You agree to indemnify and hold Ofside, its officers, directors, and employees harmless from claims arising from your breach of these Terms or your use of the Services.</Text>
      </View>

      {/* XIII. PRIVACY */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">XIII. PRIVACY</Text>
        <Text className="text-[12px]">Our Privacy Policy, available here: Privacy Policy, explains how we collect, use, and share your information.</Text>
      </View>

      {/* XIV. DISPUTE RESOLUTION */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">XIV. DISPUTE RESOLUTION</Text>
        <Text className="text-[12px]">Governing Law. These Terms are governed by the laws of India.</Text>
        <Text className="text-[12px]">Arbitration. Disputes shall be resolved by arbitration under the Arbitration and Conciliation Act, 1996, in Delhi, India.</Text>
      </View>

      {/* XV. MISCELLANEOUS */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">XV. MISCELLANEOUS</Text>
        <Text className="text-[12px]">Assignment. Ofside may assign rights or delegate obligations under these Terms. Users may not assign without Ofside’s consent.</Text>
        <Text className="text-[12px]">Severability. If any provision is held invalid, the remainder will remain in effect.</Text>
        <Text className="text-[12px]">Entire Agreement. These Terms and incorporated Policies constitute the entire agreement between you and Ofside regarding the Services.</Text>
      </View>

      {/* XVI. CONTACT US */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm mb-6">
        <Text className="font-bold mb-2">XVI. CONTACT US</Text>
        <Text className="text-[12px]">Email: Partnercare@ofside.in</Text>
        <Text className="text-[12px]">Phone: +91-9811785330</Text>
        <Text className="text-[12px]">Address: Metro 55, Lane 2, Westend Marg, Saidulajab, Saiyad Ul Ajaib Extension, Saket, New Delhi, Delhi 110030</Text>
      </View>
    </>
  );

  const renderPrivacy = () => (
     <>
      {/* INTRO */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="text-[12px]">
          Ofside Technologies Private Limited ("Ofside", "we", "us", "our") is
          committed to protecting the privacy of our users ("you", "your"). This
          Privacy Policy explains how we collect, use, disclose, and safeguard
          your personal and non-personal information when you access or use our
          sports venue booking Platform, mobile applications, and related
          services (collectively, the "Services"). By using the Services, you
          consent to the practices described in this Policy.
        </Text>
      </View>

      {/* I. Definitions */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">I. DEFINITIONS</Text>
        <Text className="text-[12px]">
          <Text className="font-semibold">Account: </Text>The password-protected
          user profile you create on the Platform.
        </Text>
        <Text className="text-[12px]">
          <Text className="font-semibold">Personal Information: </Text>Data that
          identifies or can identify an individual, such as name, email, phone,
          and address.
        </Text>
        <Text className="text-[12px]">
          <Text className="font-semibold">Payment Information: </Text>Financial
          details used to process transactions, including card or UPI data.
        </Text>
        <Text className="text-[12px]">
          <Text className="font-semibold">Device Information: </Text>Technical
          data about your device and connection (e.g., operating system, browser
          type, IP address).
        </Text>
        <Text className="text-[12px]">
          <Text className="font-semibold">Location Information: </Text>GPS or
          other positioning data from your device.
        </Text>
        <Text className="text-[12px]">
          <Text className="font-semibold">Non-Personal Information: </Text>
          Aggregated or anonymized data that cannot identify you.
        </Text>
        <Text className="text-[12px]">
          <Text className="font-semibold">Third Party: </Text>Any entity other
          than you or Ofside.
        </Text>
      </View>

      {/* II. Information Collection */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">II. INFORMATION COLLECTION</Text>
        <Text className="text-[12px]">Account Registration: We collect your name, email, phone number, and address.</Text>
        <Text className="text-[12px]">Payment Processing: Payment handled by secure, PCI-compliant gateways. We do not store payment details.</Text>
        <Text className="text-[12px]">Device & Usage Data: Automatically collected (pages viewed, clicks, OS, IP).</Text>
        <Text className="text-[12px]">Location Services: With consent, to show nearby venues and availability.</Text>
        <Text className="text-[12px]">Contacts Access: If granted, temporarily used to connect with friends.</Text>
        <Text className="text-[12px]">Cookies & Tracking: Used for sessions, personalization, and promotions. Can be disabled, but may limit features.</Text>
      </View>

      {/* III. Use of Information */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">III. USE OF INFORMATION</Text>
        <Text className="text-[12px]">• Provide, operate, and maintain the Services.</Text>
        <Text className="text-[12px]">• Process Bookings and payments.</Text>
        <Text className="text-[12px]">• Send confirmations and important notices.</Text>
        <Text className="text-[12px]">• Personalize user experience and promotions.</Text>
        <Text className="text-[12px]">• Conduct analytics and improve Platform.</Text>
        <Text className="text-[12px]">• Enforce Terms and Policies.</Text>
        <Text className="text-[12px]">• Communicate updates, offers, and support.</Text>
      </View>

      {/* IV. Information Sharing */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">IV. INFORMATION SHARING</Text>
        <Text className="text-[12px]">• Venue Partners: Share Booking details.</Text>
        <Text className="text-[12px]">• Service Providers: Hosting, analytics, support.</Text>
        <Text className="text-[12px]">• Legal & Safety: As required by law.</Text>
        <Text className="text-[12px]">• Business Transfers: In case of merger/acquisition.</Text>
        <Text className="text-[12px]">• With Consent: When you agree explicitly.</Text>
        <Text className="text-[12px]">❌ We do not sell or rent Personal Information to unaffiliated Third Parties.</Text>
      </View>

      {/* V. Data Security */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">V. DATA SECURITY</Text>
        <Text className="text-[12px]">We use SSL/TLS encryption, access controls, and regular security assessments. No system is 100% secure.</Text>
      </View>

      {/* VI. Data Retention & Your Rights */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">VI. DATA RETENTION & YOUR RIGHTS</Text>
        <Text className="text-[12px]">Retention: As long as necessary for Services and legal obligations.</Text>
        <Text className="text-[12px]">Access & Correction: Update info in app or contact support.</Text>
        <Text className="text-[12px]">Deletion: Request deletion, subject to legal/operational needs.</Text>
        <Text className="text-[12px]">Opt-Out: From promotions via unsubscribe or settings.</Text>
      </View>

      {/* VII. Children */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">VII. CHILDREN</Text>
        <Text className="text-[12px]">Services intended for users 18+. We do not knowingly collect data from minors.</Text>
      </View>

      {/* VIII. Third-Party Links */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">VIII. THIRD-PARTY LINKS</Text>
        <Text className="text-[12px]">We are not responsible for external websites' policies. Review their privacy statements.</Text>
      </View>

      {/* IX. Policy Changes */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-4 shadow-sm">
        <Text className="font-bold mb-2">IX. POLICY CHANGES</Text>
        <Text className="text-[12px]">We may update this Privacy Policy with a new "Last updated" date. Continued use = acceptance.</Text>
      </View>

      {/* X. Contact Us */}
      <View className="bg-white border border-gray-300 rounded-2xl p-2 mb-6 shadow-sm">
        <Text className="font-bold mb-2">X. CONTACT US</Text>
        <Text className="text-[12px]">Email: Partnercare@ofside.in</Text>
        <Text className="text-[12px]">Phone: +91-9811785330</Text>
        <Text className="text-[12px]">Address: Metro 55, Lane 2, Westend Marg, Saidulajab, Saiyad Ul Ajaib Extension, Saket, New Delhi, Delhi 110030</Text>
      </View>
    </>
  );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="w-8 h-8 bg-white rounded-full border-4 mx-2 mt-2" >
              <Entypo onPress={()=> navigation.goBack()} name="chevron-left" size={20} color="black" />
            </View>
            <View className="flex-row items-center pb-2 border-b ">
                <View className="flex-1 items-center">
                    <Image
                        source={require("../../assets/images/logo.png")} // Replace with your logo
                        style={{ width: 250, height: 60, resizeMode: "contain" }}
                    />
                </View>
            </View>

            {/* Tabs */}
            <View className="flex-row border-b">
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
                <View className="border-l"/>
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
        </SafeAreaView>
    )
}