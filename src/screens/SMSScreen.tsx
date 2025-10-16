import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  StyleSheet,
  Alert,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {NativeModules, NativeEventEmitter} from 'react-native';
import {navigate} from '../utils/NavigationUtils';

const {DirectSms, SMSRetrived} = NativeModules;

type RootStackParamList = {
  SMSScreen: {mobile: string | number};
};

type SMSScreenRouteProp = RouteProp<RootStackParamList, 'SMSScreen'>;

const SMSScreen = () => {
  const route = useRoute<SMSScreenRouteProp>();
  const {mobile} = route.params;

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (!SMSRetrived) {
      console.log(
        '❌ SMSRetrived native module not found. Check native linking.',
      );
      Alert.alert('Error', 'SMS auto-read feature is not available.');
      return;
    }

    SMSRetrived.startSmsListener();
    console.log('🚀 Starting SMS listener...');

    const eventEmitter = new NativeEventEmitter(SMSRetrived);
    const otpListener = eventEmitter.addListener(
      'onOtpReceived',
      (message: string) => {
        console.log('📱 Raw SMS message received:', message);
        const code = message.match(/\b\d{4}\b/);
        console.log('🔍 Extracted OTP code:', code);
        if (code) {
          const digits = code[0].split('');
          console.log('📋 Setting OTP digits:', digits);
          setOtp(digits);
          inputs.current[3]?.blur();
        } else {
          console.log('❌ No 4-digit code found in message');
        }
      },
    );

    const timeoutListener = eventEmitter.addListener('onOtpTimeout', () => {
      console.log('⏳ OTP listener timed out');
    });

    return () => {
      console.log('🧹 Cleaning up SMS listeners');
      otpListener.remove();
      timeoutListener.remove();
    };
  }, []);

  const handleChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next box automatically
      if (text && index < otp.length - 1) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];

      // ✅ Case 1: If the current box has value — just clear it
      if (newOtp[index] !== '') {
        newOtp[index] = '';
        setOtp(newOtp);
        return; // stop here — don’t go back yet
      }

      // ✅ Case 2: If already empty, move focus to previous and clear it
      if (index > 0) {
        inputs.current[index - 1]?.focus();
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const sendDirectSms = async () => {
    const pin = otp.join('');
    if (pin.length !== 4) {
      console.warn('Please enter a 4-digit OTP');
      return;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          title: 'VegieApp SMS Permission',
          message: 'VegieApp needs access to send SMS messages.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        DirectSms.sendDirectSms(mobile.toString(), `Your OTP is ${pin}`);
        console.log('✅ SMS sent to:', mobile);
        navigate('Dashboard');
      } else {
        console.log('🚫 SMS permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mobileText}>Mobile: {mobile}</Text>
      <Text style={{marginRight: 5}}>{'●'}</Text>

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
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={sendDirectSms}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SMSScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  mobileText: {fontSize: 18, marginBottom: 20, fontWeight: 'bold'},
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 30,
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
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  submitButtonText: {color: '#fff', fontSize: 16},
});
