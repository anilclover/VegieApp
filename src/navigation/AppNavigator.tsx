import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import SearchScreen from '../screens/SearchScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import SplashScreen from '../screens/SplashScreen';
import BiometricLoginScreen from '../screens/BiometricLoginScreen';
import ChatScreen from '../screens/chatscreen/ChatScreen';
import AllChats from '../screens/chatscreen/AllChats';
import CallDetailsScreen from '../screens/chatscreen/CallDetailsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '../utils/NavigationUtils';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="BiometricLogin" component={BiometricLoginScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="Signup" component={RegistrationScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="AllChats" component={AllChats} />
        <Stack.Screen name="CallDetailsScreen" component={CallDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
