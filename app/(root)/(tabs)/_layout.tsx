import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          position: 'absolute',
          borderTopColor: '#0061FF1A',
          minHeight: 70,
          borderWidth: 1,
        },
      }}
    ></Tabs>
  );
};

export default Tabs;
