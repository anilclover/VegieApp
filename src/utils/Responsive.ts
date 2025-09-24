import {Dimensions, Platform, PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// Base guideline (iPhone X)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const scaleWidth = SCREEN_WIDTH / BASE_WIDTH;
const scaleHeight = SCREEN_HEIGHT / BASE_HEIGHT;

// Detect tablet
export const isTablet = SCREEN_WIDTH >= 768 && SCREEN_HEIGHT >= 1024;

const ResponsiveUI = {
  // Font size
  textFontSize: (size: number) => {
    let newSize = size * scaleWidth;
    if (isTablet) newSize *= 1.5;
    return Platform.OS === 'ios'
      ? Math.round(PixelRatio.roundToNearestPixel(newSize))
      : Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  },

  // Width
  screenWidth: (size: number) => {
    let newSize = size * scaleWidth;
    if (isTablet) newSize *= 1.5;
    return newSize;
  },

  // Height
  screenHeight: (size: number) => {
    let newSize = size * scaleHeight;
    if (isTablet) newSize *= 1.5;
    return newSize;
  },

  // Spacing (generic)
  normalizeSpacing: (size: number) => {
    return scaleWidth * size * (isTablet ? 1.5 : 1);
  },

  // Padding helpers
  padding: {
    all: (size: number) => ResponsiveUI.normalizeSpacing(size),
    vertical: (size: number) => ResponsiveUI.normalizeSpacing(size),
    horizontal: (size: number) => ResponsiveUI.normalizeSpacing(size),
    top: (size: number) => ResponsiveUI.normalizeSpacing(size),
    bottom: (size: number) => ResponsiveUI.normalizeSpacing(size),
    left: (size: number) => ResponsiveUI.normalizeSpacing(size),
    right: (size: number) => ResponsiveUI.normalizeSpacing(size),
  },

  // Margin helpers
  margin: {
    all: (size: number) => ResponsiveUI.normalizeSpacing(size),
    vertical: (size: number) => ResponsiveUI.normalizeSpacing(size),
    horizontal: (size: number) => ResponsiveUI.normalizeSpacing(size),
    top: (size: number) => ResponsiveUI.normalizeSpacing(size),
    bottom: (size: number) => ResponsiveUI.normalizeSpacing(size),
    left: (size: number) => ResponsiveUI.normalizeSpacing(size),
    right: (size: number) => ResponsiveUI.normalizeSpacing(size),
  },

  // Card radius
  cardRadius: (size: number) => {
    let newSize = size * scaleWidth;
    if (isTablet) newSize *= 1.3; // slightly less aggressive scaling than font
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  },
};

export default ResponsiveUI;
