import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

type CustomMenuModalProps = {
  visible: boolean;
  options: string[];
  onSelect: (option: string) => void;
  onClose: () => void;
};

const CustomMenuModal = ({
  visible,
  options,
  onSelect,
  onClose,
}: CustomMenuModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose}>
        <View style={styles.menuContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => onSelect(option)}>
              <Text style={styles.menuText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 50,
    paddingRight: 0,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingEnd: 40,
    paddingStart:15
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
});

export default CustomMenuModal;
