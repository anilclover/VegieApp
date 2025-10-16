import React, {useEffect} from 'react';

import {StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import {CartProvider} from './src/context/CartContext';
import { checkPlayStoreVersion } from './src/utils/UpdateCheck';

const AppContent = () => {
  const {colors, isDark} = useTheme();
  useEffect(() => {
    checkPlayStoreVersion();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor={colors.statusBar}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      {/* Wrap your app in SafeAreaView */}
      <SafeAreaView
        style={[styles.safeArea, {backgroundColor: colors.statusBar}]}
        edges={['top', 'left', 'right']}>
        <AppNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

// import React from 'react';
// import {StatusBar} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
// import AppNavigator from './src/navigation/AppNavigator';
// import {ThemeProvider, useTheme} from './src/context/ThemeContext';
// import {CartProvider} from './src/context/CartContext';

// const AppContent = () => {
//   const {colors, isDark} = useTheme();

//   return (
//     <SafeAreaProvider>
//       <StatusBar
//         backgroundColor={colors.statusBar}
//         barStyle={isDark ? 'light-content' : 'dark-content'}
//       />
//       <AppNavigator />
//     </SafeAreaProvider>
//   );
// };

// function App(): React.JSX.Element {
//   return (
//     <ThemeProvider>
//       <CartProvider>
//         <AppContent />
//       </CartProvider>
//     </ThemeProvider>
//   );
// }

// export default App;
