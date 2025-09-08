import { NativeModules } from 'react-native';

const { ScreenshotModule } = NativeModules;

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