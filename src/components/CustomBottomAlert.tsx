import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

type Action = {
  label: string;
  onPress: () => void;
  type?: 'default' | 'cancel' | 'destructive';
};

interface CustomBottomAlertProps {
  visible: boolean;
  title?: string;
  message?: string;
  actions?: Action[];
  onClose: () => void;
}

const CustomBottomAlert: React.FC<CustomBottomAlertProps> = ({
  visible,
  title,
  message,
  actions = [],
  onClose,
}) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}

          {/* Render Action Buttons in a Row */}
          <View style={styles.buttonRow}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  action.type === 'cancel' && styles.cancelBtn,
                  action.type === 'destructive' && styles.destructiveBtn,
                  {flex: 1, marginHorizontal: 5}, // Equal width & spacing
                ]}
                onPress={() => {
                  action.onPress();
                  onClose();
                }}>
                <Text
                  style={[
                    styles.buttonText,
                    action.type === 'cancel' && styles.cancelText,
                    action.type === 'destructive' && styles.destructiveText,
                  ]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {fontSize: 18, fontWeight: 'bold', marginBottom: 8},
  message: {fontSize: 15, color: '#444', marginBottom: 16},
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  buttonText: {color: '#fff', fontSize: 16},
  cancelBtn: {backgroundColor: '#E5E5EA'},
  cancelText: {color: '#000'},
  destructiveBtn: {backgroundColor: '#FF3B30'},
  destructiveText: {color: '#fff'},
});

export default CustomBottomAlert;
