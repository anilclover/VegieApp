import React, {createContext, useContext, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  primary: string;
  statusBar: string;
}

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  background: '#ffffff',
  surface: '#f5f5f5',
  text: '#000000',
  primary: '#4CAF50',
  statusBar: '#4CAF50',
};

const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#2d2d2d',
  text: '#ffffff',
  primary: '#4CAF50',
  statusBar: '#1e1e1e',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => setIsDark(!isDark);
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{isDark, colors, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};