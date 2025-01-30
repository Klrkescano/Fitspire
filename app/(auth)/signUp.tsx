import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { auth } from '../../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';

const SignUp = () => {
  const [form, setForm] = useState({ email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle Sign Up
  const handleSignUp = async () => {
    if (!form.email || !form.password || !form.phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      Alert.alert(
        'Success',
        'Account created! A verification email has been sent to your email address. Please verify your email before logging in.'
      );

      router.replace('/(auth)/signIn'); // Redirect to Home
    } catch (error: any) {
      // Handle Firebase error codes
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          'Error',
          'The email address is already in use by another account.'
        );
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'The email address is not valid.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert(
          'Error',
          'The password is too weak. Please use a stronger password.'
        );
      } else {
        Alert.alert('Error', error.message || 'Failed to sign up');
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F4F8]">
      <ScrollView className="p-4">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="p-6 flex-1">
            <View className="my-9">
              <Text className="text-center text-[#1e1e1e] text-3xl font-bold mb-2">
                Create an Account
              </Text>
            </View>
            <View className="mb-6 flex-1">
              <Text className="text-[#222] text-lg font-semibold mb-2 mt-2">
                Email address
              </Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                className="h-[44px] bg-white py-2 px-4 rounded-[12px] text-sm font-medium text-[#222]"
                placeholder="JohnDoe@gmail.com"
                placeholderTextColor="#6b7280"
                value={form.email}
                onChangeText={(email) => setForm({ ...form, email })}
              />

              <Text className="text-[#222] text-lg font-semibold mb-2 mt-6">
                Password
              </Text>
              <TextInput
                secureTextEntry
                className="h-[44px] bg-white py-2 px-4 rounded-[12px] text-sm font-medium text-[#222]"
                placeholder="**********"
                placeholderTextColor="#6b7280"
                value={form.password}
                onChangeText={(password) => setForm({ ...form, password })}
              />
              <Text className="text-[#222] text-lg font-semibold mb-2 mt-6">
                Phone Number
              </Text>
              <TextInput
                keyboardType="phone-pad"
                className="h-[44px] bg-white py-2 px-4 rounded-[12px] text-sm font-medium text-[#222]"
                placeholder="+1234567890"
                placeholderTextColor="#6b7280"
                value={form.phone}
                onChangeText={(phone) => setForm({ ...form, phone })}
              />

              <View className="my-6">
                <TouchableOpacity onPress={handleSignUp} disabled={loading}>
                  <View className="bg-[#2B8FFC] rounded-lg border border-[#2B8FFC] flex-row items-center justify-center py-2 px-5">
                    <Text className="text-white text-lg font-semibold">
                      {loading ? 'Creating...' : 'Sign Up'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
