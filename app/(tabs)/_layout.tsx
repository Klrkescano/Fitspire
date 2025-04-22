import {
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import React, { useState } from 'react';
import icons from '../../constants/icons';
import { UserProvider } from '../context/UserContext';
import { Tabs } from 'expo-router';
import NewWorkoutModal from '../components/homeScreenComponents/NewWorkoutModal';

const TabsLayout = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <UserProvider>
      <View className="flex-1">
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: 'white',
              position: 'absolute',
              borderTopColor: '#0061FF1A',
              borderTopWidth: 1,
              minHeight: 70,
              elevation: 5,
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <Image
                  source={icons.home}
                  tintColor={focused ? '#0061ff' : '#666876'}
                  className="size-6"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <Image
                  source={icons.person}
                  tintColor={focused ? '#0061ff' : '#666876'}
                  className="size-6"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="calendar"
            options={{
              title: 'Calendar',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <Image
                  source={icons.calendar}
                  tintColor={focused ? '#0061ff' : '#666876'}
                  className="size-6"
                />
              ),
            }}
          />
        </Tabs>
      </View>
      <NewWorkoutModal
        isVisible={isModalVisible}
        onClose={toggleModal}
      />
    </UserProvider>
  );
};

export default TabsLayout;
