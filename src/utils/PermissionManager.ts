import {PermissionsAndroid, Platform, Alert} from 'react-native';

/**
 * Request multiple Android permissions at runtime.
 * Returns true if all permissions are granted, false otherwise.
 */
export const requestAllPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    ];

    const results = await PermissionsAndroid.requestMultiple(permissions);

    const allGranted = Object.values(results).every(
      result => result === PermissionsAndroid.RESULTS.GRANTED,
    );

    if (!allGranted) {
      Alert.alert(
        'Permissions Required',
        'Some permissions were denied. The app may not work properly.',
        [{text: 'OK'}],
      );
    }

    return allGranted;
  } catch (error) {
    console.error('Permission request error:', error);
    return false;
  }
};
