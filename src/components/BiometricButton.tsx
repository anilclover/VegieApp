import React, {useState} from 'react';
import {TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';
import BiometricService from '../services/BiometricService';

interface BiometricButtonProps {
  onSuccess: () => void;
  onError?: (error: string) => void;
  title?: string;
  style?: any;
}

const BiometricButton: React.FC<BiometricButtonProps> = ({
  onSuccess,
  onError,
  title = 'Use Biometric',
  style,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    
    // Check availability first
    const availability = await BiometricService.isBiometricAvailable();
    if (!availability.success) {
      setLoading(false);
      const error = 'Biometric authentication not available';
      onError?.(error);
      Alert.alert('Error', error);
      return;
    }

    // Authenticate
    const result = await BiometricService.authenticate();
    setLoading(false);

    if (result.success) {
      onSuccess();
    } else {
      const error = result.error || 'Authentication failed';
      onError?.(error);
      Alert.alert('Authentication Failed', error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      disabled={loading}>
      <Text style={styles.buttonText}>
        {loading ? 'Authenticating...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BiometricButton;