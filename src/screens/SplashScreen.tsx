import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import { requestAllPermissions } from '../utils/PermissionManager';

const SplashScreen = ({ navigation }: any) => {
  
  useEffect(() => {

    initApp;
    const timer = setTimeout(() => {
      navigation.replace('Login'); // move to Login after 2s
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);


    const initApp = async () => {
      const hasPermissions = await requestAllPermissions();
      if (hasPermissions) {
        console.log('All permissions granted');
      } else {
        console.log('Some permissions denied');
      }
    };
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>VegEase</Text>
      <ActivityIndicator size="large" color="#fff" style={{marginTop: 20}} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green', // your brand color
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
});
