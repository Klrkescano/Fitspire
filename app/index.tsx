import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View className="justify-center items-center flex-1">
      <Text className="text-cyan-600 text-3xl">Welcome to Fitspre</Text>
      <Link href="/(auth)/signIn"> Go to Sign-in Page</Link>
      <Link href="/(tabs)/workout"> Go to Workout Page</Link>
    </View>
  );
}
