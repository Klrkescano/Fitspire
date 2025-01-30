import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { auth } from '../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Handle Password Reset
  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent! Check your inbox.');
      router.replace('/signIn'); // Redirect to Sign In
    } catch (error: any) {
      const errorMessages: { [key: string]: string } = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/network-request-failed': 'Network error. Try again later.',
      };

      const errorMessage =
        errorMessages[error.code] ||
        error?.message ||
        'Failed to send reset email';
      Alert.alert('Error', errorMessage);
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
              <Image
                source={require('../../assets/images/Ficon.png')}
                className="w-[110px] h-[100px] self-center mb-6"
              />
              <Text className="text-center text-[#1e1e1e] text-3xl font-bold mb-2">
                Forgot Password?
              </Text>
              <Text className="text-center text-[#6b7280] text-lg">
                Enter your email, and we'll send you a link to reset your
                password.
              </Text>
            </View>
            <View className="mb-6 flex-1">
              <View className="mb-4">
                <Text className="text-[#222] text-lg font-semibold mb-2 mt-2">
                  Email Address
                </Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  className="h-[44px] bg-white py-2 px-4 rounded-[12px] text-sm font-medium text-[#222]"
                  placeholder="JohnDoe@gmail.com"
                  placeholderTextColor="#6b7280"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View className="my-6">
                <TouchableOpacity
                  onPress={handlePasswordReset}
                  disabled={loading}
                >
                  <View className="bg-[#2B8FFC] rounded-lg border border-[#2B8FFC] flex-row items-center justify-center py-2 px-5">
                    <Text className="text-white text-lg font-semibold">
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => router.replace('/signIn')}>
                <Text className="text-[#222] text-lg font-semibold text-center tracking-[0.1]">
                  Back to{' '}
                  <Text className="underline text-[#2B8FFC]">Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
