import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Image} from 'react-native';
import {requestAllPermissions} from '../utils/PermissionManager';
import {replace} from '../utils/NavigationUtils';

const SplashScreen = () => {
  useEffect(() => {
    initApp;
    const timer = setTimeout(() => {
      replace('Onboarding'); // move to Login after 2s
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
      {/* <Text style={styles.logo}>VegEase</Text> */}
      {/* <ActivityIndicator size="large" color="#fff" style={{marginTop: 20}} /> */}
      {/* <Image
        source={{
          uri: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
        }}
        style={styles.gif}
      /> */}
      {/* diwali-1258_512.gif */}
      <Image
        source={require('../assets/images/banners/diwali-1258_512.gif')} // Local GIF
        // source={{
        //   uri: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
        // }}
        style={StyleSheet.absoluteFill} // Fills the entire screen
        resizeMode="cover" // "cover" keeps aspect ratio, fills screen
      />
      <Text style={styles.textSyle}>Clover Infotech Pvt. Ltd. </Text>
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
  textSyle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
});
