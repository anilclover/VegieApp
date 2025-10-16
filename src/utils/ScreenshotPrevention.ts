import React, {useRef, useEffect} from 'react';
import {
  NativeModules,
  ToastAndroid,
  Animated,
  Pressable,
  StyleSheet,
  ViewStyle,
  Dimensions,
  StyleProp,
  GestureResponderEvent,
} from 'react-native';

import {PermissionsAndroid} from 'react-native';
// import {requestContactsPermission} from './permissions';
const {ScreenshotModule, ContactsModule} = NativeModules;

const windowWidth = Dimensions.get('window').width;
export const preventScreenshot = () => {
  try {
    if (ScreenshotModule && ScreenshotModule.preventScreenshot) {
      ScreenshotModule.preventScreenshot();
    }
  } catch (error) {
    console.log('Screenshot prevention not available');
  }
};

export const allowScreenshot = () => {
  try {
    if (ScreenshotModule && ScreenshotModule.allowScreenshot) {
      ScreenshotModule.allowScreenshot();
    }
  } catch (error) {
    console.log('Screenshot allowance not available');
  }
};

// Read All contact from Device

export async function loadContacts() {
  const granted = await requestContactsPermission();
  if (!granted) return;

  const contacts = await ContactsModule.getContacts();
  console.log('Device Contacts (JSON):', JSON.stringify(contacts, null, 2));
  // console.log('Device Contacts:', contacts);
  return contacts;
}

export async function requestContactsPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts Permission',
        message: 'This app needs access to your contacts',
        buttonPositive: 'Allow',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export const showToastWithGravity = (message: string) => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER,
  );
};

export const showToastWithGravityAndOffset = (message: string) => {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
};

export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  rangeOffset = 4,
) {
  let firstTouchX = 0;

  function onTouchStart(e: GestureResponderEvent) {
    firstTouchX = e.nativeEvent.pageX;
  }

  function onTouchEnd(e: GestureResponderEvent) {
    const releaseX = e.nativeEvent.pageX;
    const deltaX = releaseX - firstTouchX;
    const range = windowWidth / rangeOffset;

    // 👉 Swipe right (move finger from left to right)
    if (deltaX > range) {
      onSwipeRight?.();
    }

    // 👈 Swipe left (move finger from right to left)
    else if (deltaX < -range) {
      onSwipeLeft?.();
    }
  }

  return {onTouchStart, onTouchEnd};
}
