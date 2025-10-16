// checkUpdate.ts
import {Alert, Linking, Platform} from 'react-native'; 
import { CURRENT_VERSION, PACKAGE_NAME } from '../data/products';

export const checkPlayStoreVersion = async () => {
  if (Platform.OS !== 'android') return; // Only Android for Play Store

  try {
    // Fetch Play Store HTML page
    const response = await fetch(
      `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}&hl=en`,
    );
    const html = await response.text();

    // Regex to extract latest version from HTML
    const match = html.match(/Current Version.*?>([\d.]+)<\//i);
    const latestVersion = match ? match[1].trim() : null;

    console.log('Installed Version:', CURRENT_VERSION);
    console.log('Latest Version:', latestVersion);

    // Compare versions
    if (latestVersion && CURRENT_VERSION !== latestVersion) {
      Alert.alert(
        'Update Available',
        `A new version (${latestVersion}) is available. Please update to continue.`,
        [
          {
            text: 'Update Now',
            onPress: () =>
              Linking.openURL(`market://details?id=${PACKAGE_NAME}`),
          },
          {text: 'Later', style: 'cancel'},
        ],
        {cancelable: false},
      );
    }
  } catch (error) {
    console.log('Failed to check Play Store version', error);
  }
};
