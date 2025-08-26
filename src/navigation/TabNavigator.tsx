import React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '../context/ThemeContext';

import VegEaseScreen from '../screens/VegEaseScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import FlashDealScreen from '../screens/FlashDealScreen';
import WalletScreen from '../screens/WalletScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const {colors} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          display: route.name === 'Search' ? 'none' : 'flex',
        },
      })}>
      <Tab.Screen
        name="VegEase"
        component={VegEaseScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 20, color}}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({color}) => <Text style={{fontSize: 20, color}}>⊞</Text>,
        }}
      />
      <Tab.Screen
        name="Flash Deal"
        component={FlashDealScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 20, color}}>⚡</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 20, color}}>💳</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 20, color}}>🛒</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
