import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../context/ThemeContext';

const CategoriesScreen = () => {
  const {colors} = useTheme();
  
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.title, {color: colors.text}]}>Categories</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CategoriesScreen;