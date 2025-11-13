// app/(tabs)/EditProfile.tsx
import { useTheme } from '@/hooks/useTheme';
import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { JSX, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AppDispatch } from '@/store';
import { updateProfile } from '@/store/slices/authSlice';
import * as ImagePicker from 'expo-image-picker';
import { Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sports } from '@/constants/theme';
import Constants from 'expo-constants';
import { ScrollableComponent } from 'react-native-keyboard-aware-scroll-view';
const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

// Floating Label Input component
const FloatingLabelInput = ({
  label,
  value,
  onPress,
  onChangeText,
  isPicker,
  icon,
  editable = true,        // <- added (default true)
  style,                  // <- added (accepts TextStyle or ViewStyle)
}: {
  label: string;
  value: string;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
  isPicker?: boolean;
  icon?: JSX.Element;
  editable?: boolean;
  style?: any;
}) => (
  <View className="mt-6" style={{ opacity: editable ? 1 : 0.6 }}>
    {/* Label */}
    <View className="absolute -top-2 left-4 bg-white px-1 z-10">
      <Text className="text-xs font-semibold">{label}</Text>
    </View>

    {/* Input / Picker style */}
    {isPicker ? (
      <TouchableOpacity
      onPress={editable ? onPress : undefined}               // prevent open when not editable
      activeOpacity={editable ? 0.7 : 1}
        className="border border-black rounded-2xl px-4 py-4 flex-row justify-between items-center"
      >
        <Text className="flex-1 text-center"
        
        style={[!editable ? { color: '#6b7280' } : {}, style]} // gray text when disabled + user style
        >{value}</Text>
        {icon}
      </TouchableOpacity>
    ) : (
      <View className="border border-black rounded-2xl px-4 py-1">
        <TextInput
          value={value}
          editable={editable} 
          onChangeText={editable ? onChangeText : undefined}     // ignore changes if not editable
          className="text-center"
          style={[{ textAlign: 'center' }, !editable ? { color: '#6b7280' } : {}, style]}
          caretHidden={!editable}                                // hide caret when read-only (UX nicety)
        />
      </View>
    )}
  </View>
);

export default function EditProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  console.log(
    '======================================================================================='
  );

  const theme = useTheme();
  const navigation = useNavigation();

  // local editable state (use user as initial values)
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [email, setEmail] = useState(user?.email || '');

  const [gender, setGender] = useState<string>(user?.gender || 'male');
  const [favSports, setFavSports] = useState<string[]>(user?.favSports ?? []);
  const [dob, setDob] = useState<Date>(
    user?.dateOfBirth ? new Date(user.dateOfBirth) : new Date()
  );
  const [profilePicture, setProfilePicture] = useState<string | null>(
    user?.profilePicture || null
  );
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showSportPicker, setShowSportPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
      // Optionally: upload to your backend here
    }
  };

  const handleUpdateProfile = async () => {
    const endpoint = API_URL + '/api/auth/update-profile';
    setLoading(true);

    try {
      const payload = {
        name,
        mobile,
        gender,
        favSports,
        dateOfBirth: dob,
      };

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // NOTE: capital 'Authorization'
          Authorization: `Bearer ${user?.accessToken ?? ''}`,
        },
        body: JSON.stringify(payload),
      });

      // Try parse JSON safely (server may send { success, message, data: { user } })
      let json: any = null;
      try {
        json = await res.json();
      } catch (e) {
        json = null;
      }

      // Handle common auth case: token expired
      if (res.status === 401 && json?.error === 'token_expired') {
        Alert.alert(
          'Session expired',
          'Your session expired. Please login again.'
        );
        // optionally: dispatch(logout()) or navigate to login
        return;
      }

      if (!res.ok) {
        const message =
          json?.message || json?.error || `Update failed (${res.status})`;
        Alert.alert('Error', message);
        return;
      }

      // Success — backend might return updated user at json.data.user
      const updatedUser = json?.data?.user ?? json?.user ?? json;
      console.log('Updated user returned by server:', updatedUser);

      if (updatedUser) {
        // updateProfile expects Partial<User> and will merge into existing state
        dispatch(updateProfile(updatedUser));
      }

      Alert.alert('Success', 'Profile updated successfully');
      router.replace({ pathname: '/(tabs)', params: { screen: 'Home' } });
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Toggle sport in favSports (add if not present, remove if present)
  const toggleSport = (value: string) => {
    setFavSports((prev) => {
      if (prev.includes(value)) {
        return prev.filter((s) => s !== value);
      }
      return [...prev, value];
    });
  };

  // Remove sport (for chips)
  const removeSport = (value: string) => {
    setFavSports((prev) => prev.filter((s) => s !== value));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient colors={['#FFF201', '#FFFFFF']}>
        <KeyboardAwareScrollView>
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full border-4 mx-2 mt-2">
              <Entypo
                onPress={() => navigation.goBack()}
                name="chevron-left"
                size={20}
                color="black"
              />
            </View>
            <Text className="ml-2 text-lg font-bold mt-2">Edit Profile</Text>
          </View>

          <View className="items-center">
            <View
              className="w-40 h-40 rounded-full items-center justify-center border border-gray-400 overflow-hidden"
              style={{ backgroundColor: theme.colors.accent }}
            >
              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  className="w-full h-full"
                  style={{ resizeMode: 'cover' }}
                />
              ) : (
                <FontAwesome name="user" size={90} color="white" />
              )}
            </View>

            <TouchableOpacity
              onPress={pickImage}
              className="absolute bottom-0 right-[35%] bg-white p-2 rounded-full border border-gray-400"
            >
              <FontAwesome name="pencil" size={14} color="black" />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>

      {/* Form */}
      <ScrollView className="px-6">
        <FloatingLabelInput
          label="Full name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <FloatingLabelInput
          label="Mobile number"
          value={mobile}
          onChangeText={(text) => setMobile(text)}
        />
        <FloatingLabelInput
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          editable={false}
          style={{ color: 'gray' }} 
        />

        {/* Gender Picker */}
        <FloatingLabelInput
          label="Gender"
          value={gender}
          isPicker
          onPress={() => setShowGenderPicker(true)}
          icon={<Ionicons name="chevron-down" size={18} color="black" />}
        />

        {/* DOB Picker */}
        <FloatingLabelInput
          label="Date of birth"
          value={formatDate(dob)}
          isPicker
          onPress={() => setShowDatePicker(true)}
          icon={<Ionicons name="calendar" size={18} color="black" />}
        />

        {/* Sport Picker */}
        <FloatingLabelInput
          label="Your favorite sport"
          value={favSports.length ? favSports.join(', ') : 'No favorite sports'}
          isPicker
          onPress={() => setShowSportPicker(true)}
          icon={<Ionicons name="chevron-down" size={18} color="black" />}
        />

        {/* chips to show selected sports with remove option */}
        <View className="flex-row flex-wrap mt-3">
          {favSports.map((s) => (
            <View key={s} className="mr-2 mb-2">
              <TouchableOpacity
                onPress={() => removeSport(s)}
                className="px-3 py-2 rounded-full border border-gray-300 flex-row items-center"
              >
                <Text className="mr-2">{s}</Text>
                <Text className="text-red-500">✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Update Button */}
      <TouchableOpacity
        className="mt-2 bg-transparent py-6"
        onPress={handleUpdateProfile}
      >
        <Text className="text-center font-extrabold text-xl bg-black text-white p-4 rounded-full">
          Update Profile
        </Text>
      </TouchableOpacity>

      {/* Gender Picker Modal */}
      <Modal visible={showGenderPicker} transparent animationType="slide">
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: 16,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => {
                const val = itemValue as string;
                setGender(val);
                setShowGenderPicker(false);
              }}
              // ensure picker text is visible
              style={{ color: '#000' }}
              itemStyle={{ color: '#000', fontSize: 18 }}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Male" value="male" color="#000" />
              <Picker.Item label="Female" value="female" color="#000" />
              <Picker.Item label="Other" value="other" color="#000" />
            </Picker>
          </View>
        </View>
      </Modal>

      {/* Sport Picker Modal */}
      <Modal visible={showSportPicker} transparent animationType="slide">
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: 0,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <Picker
              selectedValue={''}
              onValueChange={(itemValue) => {
                const value = itemValue as string;
                if (!value) return;
                toggleSport(value);
                setShowSportPicker(false);
              }}
              style={{ color: '#000' }}
              itemStyle={{ color: '#000', fontSize: 18 }}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Select a sport..." value="" color="#888" />
              {sports.map((sport) => (
                <Picker.Item
                  key={sport.id}
                  label={sport.name}
                  value={sport.name}
                  color="#000"
                />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal (platform-specific handling) */}
      <Modal visible={showDatePicker} transparent animationType="slide">
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: 8,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={dob}
                mode="date"
                display="spinner"
                // force iOS spinner text to black
                textColor="#000"
                onChange={(_, selectedDate) => {
                  if (selectedDate) setDob(selectedDate);
                }}
                style={{ backgroundColor: '#fff' }}
              />
            ) : (
              <DateTimePicker
                value={dob}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  if (selectedDate) setDob(selectedDate);
                  setShowDatePicker(false);
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowDatePicker(false)}
              style={{ padding: 12 }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  color: '#000',
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
