// BottomTabs.tsx
import React from 'react';
import {View, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChatScreen from '../screens/chatscreen/ChatScreen';
import StatusScreen from '../screens/chatscreen/StatusScreen';
import CommunitiesScreen from '../screens/chatscreen/CommunitiesScreen';
import CallsScreen from '../screens/chatscreen/CallsScreen';
import AllFriends from '../screens/chatscreen/AllFriends';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#25D366',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          marginBottom: 4, // add little spacing so text sits above the edge
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0.5,
          borderTopColor: '#ccc',
          paddingBottom: 4, // give extra padding for bottom safe area
          height: 60, // slightly taller bar for spacing
        },
      }}>
      <Tab.Screen name="Chats" component={AllFriends} />
      <Tab.Screen name="Updates" component={StatusScreen} />
      <Tab.Screen name="Communities" component={CommunitiesScreen} />
      <Tab.Screen name="Calls" component={CallsScreen} />
    </Tab.Navigator>
  );
}
