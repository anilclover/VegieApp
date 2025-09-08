import {Platform, PermissionsAndroid, Alert, NativeModules} from 'react-native';

const {PermissionModule} = NativeModules;

const requestiOSPermissions = async () => {
  try {
    if (PermissionModule) {
      await PermissionModule.requestAllPermissions();
    }
  } catch (err) {
    console.warn('iOS permission request error:', err);
  }
};

export const requestAllPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      
      const allGranted = Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        Alert.alert(
          'Permissions Required',
          'Some permissions were denied. The app may not work properly.',
          [{text: 'OK'}]
        );
      }
    } catch (err) {
      console.warn('Android permission request error:', err);
    }
  } else if (Platform.OS === 'ios') {
    await requestiOSPermissions();
  }
};