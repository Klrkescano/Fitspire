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
} from 'react-native';

import React, { useState } from 'react';
import { Link } from 'expo-router';

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

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
                source={require('../../../assets/images/Ficon.png')}
                className="w-[110px] h-[100px] self-center mb-6"
              />
              <Text className="text-center text-[#1e1e1e] text-3xl font-bold mb-2">
                Sign in to Fitspire
              </Text>
              <Text className="text-center text-[#929292] text-base font-medium mb-2">
                Get fit with Fitpire
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
                <TextInput
                  secureTextEntry
                  className="h-[44px] bg-white py-2 px-4 rounded-[12px] text-sm font-medium text-[#222]"
                  placeholder="**********"
                  placeholderTextColor="#6b7280"
                  value={form.password}
                  onChangeText={(password) => setForm({ ...form, password })}
                />
              </View>
              <View className="my-6">
                <Link href="/home" asChild>
                  <TouchableOpacity>
                    <View className="bg-[#2B8FFC] rounded-lg border border-[#2B8FFC] flex-row items-center justify-center py-2 px-5">
                      <Text className="text-white text-lg font-semibold">
                        Sign in
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              </View>
              <TouchableOpacity>
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
              <TouchableOpacity>
                <View className="bg-white rounded-lg w-full shadow-zinc-200 shadow-md flex-row items-center justify-center py-2 px-5">
                  <Image
                    source={require('../../../assets/icons/google.png')}
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
