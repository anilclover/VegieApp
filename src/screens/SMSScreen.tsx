import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  NativeModules,
  DeviceEventEmitter,
  Platform,
  PermissionsAndroid,
  Button,
} from 'react-native';
import {useOtpListener} from '../utils/useOtpListener';
import {navigate} from '../utils/NavigationUtils';

const {OtpModule} = NativeModules;
const SMSScreen = () => {
  const inputs = useRef<TextInput[]>([]);

  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<TextInput[]>([]);

  const length = 4;
  const indexBox = length - 1;

  useEffect(() => {
    const requestSmsPermission = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        );
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
        );
      }
    };

    const subscription = DeviceEventEmitter.addListener(
      'OtpReceived',
      (receivedOtp: string) => {
        const otpArray = receivedOtp.split('');
        setOtp(otpArray);
        if (receivedOtp.length === length) {
        }
      },
    );

    requestSmsPermission();
    if (OtpModule) {
      OtpModule.startListening();
    }

    return () => subscription.remove();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => {
              inputs.current[index] = ref!;
            }}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            // onChangeText={text => handleChange(text, index)}
            // onKeyPress={e => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <Button title="Continue" onPress={() => navigate('Dashboard')}></Button>
    </View>
  );
};

export default SMSScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 20, marginBottom: 20},
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#aaa',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 8,
    backgroundColor: 'white',
  },
});
