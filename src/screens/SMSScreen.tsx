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
} from 'react-native';
import {navigate} from '../utils/NavigationUtils';

const {OtpModule} = NativeModules;

const SMSScreen = () => {
  const inputs = useRef<TextInput[]>([]);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30); // 30 seconds countdown
  const [loading, setLoading] = useState(false);

  const length = 4;

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
        console.log('Received OTP:', receivedOtp);
        const otpArray = receivedOtp.slice(0, length).split('');
        setOtp(otpArray);
      },
    );

    requestSmsPermission();

    if (OtpModule) {
      OtpModule.startListening();
    }

    return () => subscription.remove();
  }, []);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer === 0) return;

    const timer = setInterval(() => {
      setResendTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleResendOtp = () => {
    setOtp(['', '', '', '']); // reset OTP
    setResendTimer(30); // reset timer
    // Call your OTP sending function here
    console.log('Resend OTP triggered');
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
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
              textContentType="oneTimeCode" // This is the key for iOS OTP autofill
              autoComplete="sms-otp"
              maxLength={1}
              value={digit}
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          {resendTimer > 0 ? (
            <Text style={styles.resendText}>
              Resend OTP in {resendTimer} sec
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={[styles.resendText, {color: '#4CAF50'}]}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.bottomButton}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigate('Dashboard')}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SMSScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {fontSize: 22, fontWeight: '600', marginBottom: 20},
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 15,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#aaa',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  resendText: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
  },
  bottomButton: {
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    width: '70%',
    alignItems: 'flex-end', // aligns the text/button to the right
  },
});
