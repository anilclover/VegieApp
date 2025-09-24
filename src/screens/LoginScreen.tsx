import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {requestAllPermissions} from '../utils/PermissionManager';
import BiometricButton from '../components/BiometricButton';
import ResponsiveUI from '../utils/Responsive';
const {height} = Dimensions.get('window');

const logos = [
  require('../assets/images/banners/flash-deal-banner.png'),
  require('../assets/images/banners/fruits-banner.png'),
  require('../assets/images/banners/vegetables-banner.png'),
];

const LoginScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollY, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      }),
      {iterations: -1},
    ).start();
  }, [scrollY]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}>
      <View style={styles.container}>
        {/* Animated scrolling background */}
        <Animated.View
          style={[
            styles.backgroundWrapper,
            {
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -height],
                  }),
                },
              ],
            },
          ]}>
          <View style={styles.grid}>
            {Array(130)
              .fill(logos)
              .flat()
              .map((logo, index) => (
                <View key={index} style={styles.logoBox}>
                  <Image
                    source={logo}
                    style={styles.logoImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
          </View>
        </Animated.View>

        {/* Foreground form */}
        <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
          keyboardShouldPersistTaps="handled">
          <View style={styles.overlay}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>🥬</Text>
              <Text style={styles.appName}>VegEase</Text>
            </View>
            <Text style={styles.title}>Luxury You Aspire</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.prefix}>+91</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Mobile Number"
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                console.log('📱 Regular login button pressed');
                navigation.navigate('Main' as never);
              }}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <BiometricButton
              title="🔐 Use Biometric"
              onSuccess={() => {
                console.log('✅ Biometric login successful from LoginScreen');
                navigation.navigate('Main' as never);
              }}
              onError={error =>
                console.log('❌ Biometric login failed:', error)
              }
              style={styles.biometricButton}
            />

            <Text style={styles.terms}>
              By continuing you agree to our{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>

            <Text style={styles.support}>
              Having issues signing up?{' '}
              <Text style={styles.link}>Contact Support</Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  backgroundWrapper: {
    ...StyleSheet.absoluteFillObject,
    height: height * 2,
  },
  grid: {flexDirection: 'row', flexWrap: 'wrap'},
  logoBox: {
    width: '33.3%',
    height: height / 4.5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  logoImage: {width: '100%', height: '100%', borderRadius: 16},
  overlay: {
    padding: 20,
    // backgroundColor: 'rgba(255,255,255,0.85)', // Transprant color
    backgroundColor: 'rgba(255,255,255,1)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    fontSize: 40,
    marginBottom: 5,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    letterSpacing: 1,
  },
  title: {
    fontSize: ResponsiveUI.textFontSize(18),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: ResponsiveUI.margin.bottom(20),
    paddingHorizontal: ResponsiveUI.padding.horizontal(10),
    backgroundColor: '#fff',
  },
  prefix: {
    fontSize: 16,
    marginRight: ResponsiveUI.margin.right(6),
    color: '#444',
  },
  input: {
    flex: 1,
    fontSize: ResponsiveUI.textFontSize(16),
    paddingVertical: ResponsiveUI.padding.vertical(12),
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: ResponsiveUI.padding.vertical(12),
    borderRadius: 8,
    marginBottom: ResponsiveUI.margin.bottom(20),
  },
  buttonText: {color: '#fff', fontWeight: '600', textAlign: 'center'},
  biometricButton: {
    backgroundColor: '#28a745',
    marginBottom: 20,
  },
  terms: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    marginBottom: ResponsiveUI.margin.bottom(12),
  },
  support: {fontSize: 13, textAlign: 'center', color: '#333'},
  link: {color: '#4a90e2', fontWeight: '600'},
});

export default LoginScreen;
