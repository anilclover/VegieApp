import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../context/ThemeContext';

const {height} = Dimensions.get('window');

const BottomSheetContent = ({sheetStack, openBottomSheet, closeBottomSheet}: {
  sheetStack: string[];
  openBottomSheet: (sheet: string) => void;
  closeBottomSheet: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const currentSheet = sheetStack[sheetStack.length - 1];
  
  const renderContent = () => {
    switch (currentSheet) {
      case 'main':
        return (
          <>
            <Text style={[styles.sheetTitle, {color: colors.text}]}>Main Sheet</Text>
            <TouchableOpacity style={[styles.sheetButton, {backgroundColor: colors.primary}]} onPress={() => openBottomSheet('details')}>
              <Text style={styles.buttonText}>Open Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sheetButton, {backgroundColor: colors.primary}]} onPress={closeBottomSheet}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </>
        );
      case 'details':
        return (
          <>
            <Text style={[styles.sheetTitle, {color: colors.text}]}>Details Sheet</Text>
            <TouchableOpacity style={[styles.sheetButton, {backgroundColor: colors.primary}]} onPress={() => openBottomSheet('more')}>
              <Text style={styles.buttonText}>More Info</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sheetButton, {backgroundColor: colors.primary}]} onPress={closeBottomSheet}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </>
        );
      case 'more':
        return (
          <>
            <Text style={[styles.sheetTitle, {color: colors.text}]}>More Info Sheet</Text>
            <TouchableOpacity style={[styles.sheetButton, {backgroundColor: colors.primary}]} onPress={closeBottomSheet}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.bottomSheet, {paddingBottom: insets.bottom + 20, backgroundColor: colors.surface}]}>
      <View style={styles.sheetContent}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: height * 0.5,
  },
  sheetContent: {
    padding: 20,
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sheetButton: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BottomSheetContent;