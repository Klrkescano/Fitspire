import { View, Text, Image } from 'react-native';
import React from 'react';
import icons from '../../constants/icons';
import { UserProvider } from '../context/UserContext'; // Import the UserProvider
import { Tabs } from 'expo-router';

const TabsLayout = () => {
  const TabIcon = ({
    focused,
    icon,
    title,
  }: {
    focused: boolean;
    icon: any;
    title: string;
  }) => {
    return (
      <View className="flex-1 mt-3 flex flex-col items-center">
        <Image
          source={icon}
          tintColor={focused ? '#0061ff' : '#666876'}
          resizeMode="contain"
          className="size-6"
        />
        <Text
          className={`${
            focused ? 'text-[#0061ff] font-rubik-medium' : 'font-rubik'
          } text-xs w-full text-center mt-1`}
        >
          {title}
        </Text>
      </View>
    );
  };

  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: 'white',
            position: 'absolute',
            borderTopColor: '#0061FF1A',
            borderTopWidth: 1,
            minHeight: 70,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon icon={icons.home} focused={focused} title="Home" />
            ),
          }}
        />
        <Tabs.Screen
          name="workout"
          options={{
            title: 'Workout',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon icon={icons.dumbell} focused={focused} title="Workout" />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon icon={icons.person} focused={focused} title="Profile" />
            ),
          }}
        />
      </Tabs>
    </UserProvider>
  );
};

export default TabsLayout;
