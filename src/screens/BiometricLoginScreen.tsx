import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BiometricService from '../services/BiometricService';

const BiometricLoginScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const result = await BiometricService.isBiometricAvailable();
    console.log('🔍 Biometric Availability Check:', result);
    if (result.success) {
      setIsAvailable(true);
      setBiometricType(result.biometryType || 'Biometric');
      console.log('✅ Biometric Available:', result.biometryType);
    } else {
      setIsAvailable(false);
      console.log('❌ Biometric Not Available:', result.error);
      Alert.alert('Biometric Not Available', result.error || 'Unknown error');
    }
  };

  const handleBiometricLogin = async () => {
    if (!isAvailable) {
      Alert.alert('Error', 'Biometric authentication not available');
      return;
    }

    setLoading(true);
    console.log('🔐 Starting biometric authentication...');
    const result = await BiometricService.authenticate(
      'Use your biometric to access VegEase'
    );
    setLoading(false);
    console.log('🔐 Authentication Result:', result);

    if (result.success) {
      console.log('✅ Authentication Successful!');
      Alert.alert('Success', 'Authentication successful!', [
        {text: 'OK', onPress: () => navigation.navigate('Main' as never)},
      ]);
    } else {
      console.log('❌ Authentication Failed:', result.error);
      Alert.alert('Authentication Failed', result.error || 'Please try again');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🥬</Text>
          <Text style={styles.appName}>VegEase</Text>
        </View>
        <Text style={styles.title}>Secure Login</Text>
        <Text style={styles.subtitle}>
          Use {biometricType} to quickly and securely access your account
        </Text>

        {isAvailable ? (
          <TouchableOpacity
            style={[styles.button, styles.biometricButton]}
            onPress={handleBiometricLogin}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonIcon}>
                  {biometricType === 'FaceID' ? '👤' : '👆'}
                </Text>
                <Text style={styles.buttonText}>
                  Use {biometricType}
                </Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.unavailableContainer}>
            <Text style={styles.unavailableText}>
              Biometric authentication not available
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Use Password Instead</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 80,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    minWidth: 200,
  },
  biometricButton: {
    backgroundColor: '#007bff',
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipText: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  unavailableContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 20,
  },
  unavailableText: {
    color: '#666',
    textAlign: 'center',
  },
});

export default BiometricLoginScreen;