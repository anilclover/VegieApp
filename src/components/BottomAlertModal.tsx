import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';

const {width} = Dimensions.get('window');

type BottomAlertModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onActionPress: () => void;
  title: string;
  description: string;
  imageSource?: ImageSourcePropType; // React Native type for images
  skipButtonText?: string;
  actionButtonText?: string;
};

/**
 * A reusable bottom-aligned modal component.
 */
const BottomAlertModal: React.FC<BottomAlertModalProps> = ({
  isVisible,
  onClose,
  onActionPress,
  title,
  description,
  imageSource,
  skipButtonText = 'Skip for now',
  actionButtonText = 'Allow',
}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose} // Handles Android back button press
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              backgroundColor: '#A9A9A9',
              width: '25%',
              height: 6,
              borderRadius: 10,
              marginVertical: 10,
            }}></View>
          {/* Illustration/Image */}
          {imageSource && (
            <Image
              source={require('../assets/images/icons/location_alert.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
          )}

          {/* Title and Description */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.skipButton]}
              onPress={onClose}>
              <Text style={styles.skipButtonText}>{skipButtonText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.actionButton]}
              onPress={onActionPress}>
              <Text style={styles.actionButtonText}>{actionButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 25,
    paddingBottom: 30,
    paddingTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  illustration: {
    width: width * 0.45,
    height: width * 0.45,
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    textAlign: 'center',
    marginBottom: 25,
    color: '#666',
    fontSize: 15,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',  
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: '#fff',
    borderColor: '#EAEAEA',
    borderWidth: 1,
    borderRadius: 100,
  },
  actionButton: {
    backgroundColor: '#D3D3D3',
    borderRadius: 100,
  },
  skipButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  actionButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BottomAlertModal;
