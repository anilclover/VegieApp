import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import {CartProvider} from './src/context/CartContext';

const AppContent = () => {
  const {colors, isDark} = useTheme();

  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor={colors.statusBar}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
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