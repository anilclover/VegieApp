import React from 'react';
import {Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '../context/ThemeContext';

import VegEaseScreen from '../screens/VegEaseScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import FlashDealScreen from '../screens/FlashDealScreen';
import WalletScreen from '../screens/WalletScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import {useCart} from '../context/CartContext';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const {colors} = useTheme();
  const {
    cart,

    getUniqueItemsCount,
  } = useCart();

  const cartCount = getUniqueItemsCount();

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
            <React.Fragment>
              <Text style={{fontSize: 20, color}}>🛒</Text>
              {cartCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -12,
                    backgroundColor: 'red',
                    borderRadius: 10, // half of width/height
                    minWidth: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 3, // so "10+" fits
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}>
                    {cartCount > 9 ? '10+' : cartCount}
                  </Text>
                </View>
              )}
            </React.Fragment>
          ),
        }}
      />

      {/* <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 20, color}}>🛒</Text>
          ),

          tabBarBadge:
            cartCount > 0 ? (cartCount < 10 ? cartCount : '10+') : undefined,
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default TabNavigator;
