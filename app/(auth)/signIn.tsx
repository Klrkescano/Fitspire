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
  BackHandler,
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { auth } from '../../firebaseConfig';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const checkAuth = onAuthStateChanged(auth, (user) => {
        if (!user) {
          BackHandler.addEventListener('hardwareBackPress', () => true);
          return;
        }
      });

      return () => {
        checkAuth();
        BackHandler.removeEventListener('hardwareBackPress', () => true);
      };
    }, [])
  );

  const handleSignIn = useCallback(async () => {
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

      if (!user.emailVerified) {
        Alert.alert(
          'Email Not Verified',
          'Please verify your email address before logging in.'
        );
        setLoading(false);
        return;
      }

      Alert.alert('Success', 'Signed in successfully!');
      router.replace('/(tabs)/home');
    } catch (error) {
      const firebaseError = error as { code?: string; message?: string };

      const errorMessages: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-email': 'The email address is invalid.',
        'auth/network-request-failed':
          'Network error. Please check your connection.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
      };

      const errorMessage =
        firebaseError.code && errorMessages[firebaseError.code]
          ? errorMessages[firebaseError.code]
          : firebaseError.message || 'Failed to sign in';
      Alert.alert('Error', errorMessage);
    }
    setLoading(false);
  }, [form.email, form.password, router]);

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
                  onChangeText={(email) =>
                    setForm((prev) => ({ ...prev, email }))
                  }
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
                    onChangeText={(password) =>
                      setForm((prev) => ({ ...prev, password }))
                    }
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

              <TouchableOpacity
                onPress={() => router.push('/(auth)/forgotPassword')}
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
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
