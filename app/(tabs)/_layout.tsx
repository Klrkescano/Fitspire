import {
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import React, { useState } from 'react';
import icons from '../../constants/icons';
import { UserProvider } from '../context/UserContext';
import { Tabs } from 'expo-router';
import NewWorkoutModal from '../components/NewWorkoutModal';

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
            name="workoutScreen"
            options={{
              headerShown: false,
              tabBarButton: () => (
                <TouchableOpacity
                  onPress={toggleModal}
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    backgroundColor: '#0061ff',
                    width: 70,
                    height: 70,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#0061ff',
                    shadowOpacity: 0.4,
                    shadowRadius: 5,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 10,
                  }}
                >
                  <Image
                    source={icons.plus}
                    style={{ width: 30, height: 30, tintColor: 'white' }}
                  />
                </TouchableOpacity>
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
