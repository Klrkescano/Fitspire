import {
  View,
  Text,
  SafeAreaView,
  Image,
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
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native'; // Icons for password visibility

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for show password toggle
  const router = useRouter();

  // Handle Email/Password Sign In
  const handleSignIn = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      // Check if the email is verified
      if (!user.emailVerified) {
        Alert.alert(
          'Email Not Verified',
          'Please verify your email address before logging in.'
        );
        setLoading(false);
        return;
      }

      Alert.alert('Success', 'Signed in successfully!');
      router.replace('/(tabs)/home'); // Redirect to Home
    } catch (error) {
      const errorMessages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-email': 'The email address is invalid.',
        'auth/network-request-failed':
          'Network error. Please check your connection.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
      };

      const errorMessage =
        errorMessages[error.code] || error?.message || 'Failed to sign in';
      Alert.alert('Error', errorMessage);
    }
    setLoading(false);
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      Alert.alert('Success', 'Signed in with Google!');
      router.push('/(tabs)/home'); // Redirect to Home
    } catch (error) {
      const errorMessages = {
        'auth/popup-closed-by-user':
          'Sign-in popup was closed. Please try again.',
        'auth/cancelled-popup-request': 'Sign-in popup request was canceled.',
      };

      const errorMessage =
        errorMessages[error.code] ||
        error?.message ||
        'Failed to sign in with Google';
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
                Sign in to Fitspire
              </Text>
            </View>
            <View className="mb-6 flex-1">
              <View className="mb-4">
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
                <View className="flex-row items-center bg-white rounded-[12px] px-4 py-2">
                  <TextInput
                    secureTextEntry={!isPasswordVisible}
                    className="flex-1 text-sm font-medium text-[#222]"
                    placeholder="**********"
                    placeholderTextColor="#6b7280"
                    value={form.password}
                    onChangeText={(password) => setForm({ ...form, password })}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="ml-2"
                  >
                    {isPasswordVisible ? (
                      <EyeOffIcon size={22} color="#222" />
                    ) : (
                      <EyeIcon size={22} color="#222" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password Option */}
              <TouchableOpacity
                onPress={() => router.push('/forgot-password')}
                className="mt-2 mb-6"
              >
                <Text className="text-[#2B8FFC] text-lg font-semibold text-right">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <View className="my-6">
                <TouchableOpacity onPress={handleSignIn} disabled={loading}>
                  <View className="bg-[#2B8FFC] rounded-lg border border-[#2B8FFC] flex-row items-center justify-center py-2 px-5">
                    <Text className="text-white text-lg font-semibold">
                      {loading ? 'Signing in...' : 'Sign in'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => router.push('/signUp')}>
                <Text className="text-[#222] text-lg font-semibold text-center tracking-[0.1]">
                  Don't have an account?{' '}
                  <Text className="underline">Sign up</Text>
                </Text>
              </TouchableOpacity>
            </View>
            <View className="border-t border-[#929292] my-5"></View>
            <View>
              <Text className="text-[#222] text-lg font-semibold text-center tracking-[0.1] mb-5">
                or
              </Text>
              <TouchableOpacity onPress={handleGoogleSignIn}>
                <View className="bg-white rounded-lg w-full shadow-zinc-200 shadow-md flex-row items-center justify-center py-2 px-5">
                  <Image
                    source={require('../../assets/icons/google.png')}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                  <Text className="text-[#222] text-lg ml-2 font-semibold">
                    Continue with Google
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
