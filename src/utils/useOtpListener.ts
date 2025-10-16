import {useEffect, useRef} from 'react';
import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  EmitterSubscription,
} from 'react-native';

const {OTPModule} = NativeModules;

type OtpListenerCallback = (otp: string | null) => void;
type OtpErrorCallback = (error: any) => void;

export const useOtpListener = (
  onOtpReceived: OtpListenerCallback,
  onOtpError?: OtpErrorCallback,
) => {
  const emitterRef = useRef<NativeEventEmitter | null>(null);
  const otpSubscriptionRef = useRef<EmitterSubscription | null>(null);
  const errorSubscriptionRef = useRef<EmitterSubscription | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'android' || !OTPModule) return;

    const emitter = new NativeEventEmitter(OTPModule);
    emitterRef.current = emitter;

    OTPModule.startListeningForOTP();

    otpSubscriptionRef.current = emitter.addListener(
      'onOTPReceived',
      onOtpReceived,
    );

    if (onOtpError) {
      errorSubscriptionRef.current = emitter.addListener(
        'onOTPError',
        onOtpError,
      );
    }

    return () => {
      OTPModule.stopListeningForOTP();
      otpSubscriptionRef.current?.remove();
      errorSubscriptionRef.current?.remove();
      emitter.removeAllListeners('onOTPReceived');
      if (onOtpError) {
        emitter.removeAllListeners('onOTPError');
      }
    };
  }, [onOtpReceived, onOtpError]);
};
