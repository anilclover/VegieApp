// socialLogin.ts
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

// Initialize Google Sign-In
export const configureGoogleSignIn = (webClientId: string) => {
  GoogleSignin.configure({
    webClientId,
    offlineAccess: true,
  });
};

// Reusable function for Google login
export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log('Google User Info:', userInfo);
    return {success: true, data: userInfo};
  } catch (error: any) {
    let message = '';
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      message = 'Login Cancelled';
    } else if (error.code === statusCodes.IN_PROGRESS) {
      message = 'Login in progress';
    } else {
      message = error.message;
    }
    console.log('Google Login Error:', message);
    return {success: false, error: message};
  }
};

// Reusable function for Google login
export const signInWithGoogleWithConfigure = async (webClientId: string) => {
  GoogleSignin.configure({
    webClientId,
    offlineAccess: true,
  });
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log('Google User Info:', userInfo);
    return {success: true, data: userInfo};
  } catch (error: any) {
    let message = '';
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      message = 'Login Cancelled';
    } else if (error.code === statusCodes.IN_PROGRESS) {
      message = 'Login in progress';
    } else {
      message = error.message;
    }
    console.log('Google Login Error:', message);
    return {success: false, error: message};
  }
};

export const signOutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    console.log('🔒 Signed out from Google');
  } catch (error) {
    console.error('❌ Google Sign-Out Error:', error);
  }
};
