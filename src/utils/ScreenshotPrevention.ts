import {NativeModules} from 'react-native';

// import {requestContactsPermission} from './permissions';
const {ScreenshotModule, ContactsModule} = NativeModules;

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

import {PermissionsAndroid} from 'react-native';

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
