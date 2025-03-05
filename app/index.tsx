import React from 'react';
import { Redirect } from 'expo-router';

<<<<<<< HEAD
export default function Index() {
  return (
    <View className="justify-center items-center flex-1">
      <Text className="text-[#3934DA] text-3xl">Welcome to Fitspire!</Text>
      <Link href="/(auth)/signIn"> Go to Sign-in Page</Link>
      <Link href="/(tabs)/workout"> Go to Workout Page</Link>
    </View>
  );
}
=======
const index = () => {
  return <Redirect href="/(auth)/signIn" />;
};

export default index;
>>>>>>> ca25d62b82514546012b2c2b7bf49d0a288bcab4
