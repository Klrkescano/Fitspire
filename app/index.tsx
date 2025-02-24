import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View className="justify-center items-center flex-1">
      <Text className="text-[#3934DA] text-3xl">Welcome to Fitspire!</Text>
      <Link href="/(auth)/signIn"> Go to Sign-in Page</Link>
    </View>
  );
}
