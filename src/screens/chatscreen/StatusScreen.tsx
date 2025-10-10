import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import BottomAlertModal from '../../components/BottomAlertModal'; // 👈 import your modal
import {navigate} from '../../utils/NavigationUtils';
import Geolocation from 'react-native-geolocation-service';

const StatusScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const notificationImage = require('../../assets/images/icons/location_alert.png');
  const locationAlertImage = require('../../assets/images/icons/location_alert.png');

  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }
      // For iOS, notification permission is handled automatically by the system
      setShowNotification(false);
    } catch (error) {
      console.warn('Notification permission error:', error);
      setShowNotification(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Geolocation.requestAuthorization('whenInUse');
      } else {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
      }
      setModalVisible(false);
    } catch (error) {
      console.warn('Location permission error:', error);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.openBtn}
        onPress={() => setModalVisible(true)} // 👈 open modal
      >
        <Text style={styles.openText}>Show Custom Bottom Alert</Text>
      </TouchableOpacity>

      <BottomAlertModal
        isVisible={modalVisible}
        onClose={() => {
          if (showNotification) {
            setShowNotification(false);
          } else {
            setModalVisible(false);
            navigate('SearchLocation');
          }
        }}
        onActionPress={
          showNotification
            ? requestNotificationPermission
            : requestLocationPermission
        }
        imageSource={showNotification ? notificationImage : locationAlertImage}
        title={showNotification ? 'Notification' : 'Location'}
        description={
          showNotification
            ? 'Please enable notifications to receive updates on your orders and offers.'
            : "Allow Bruno's Barbers to access your location to help you find nearby branches."
        }
        skipButtonText="Skip for now"
        actionButtonText="Allow"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  openBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  openText: {color: '#fff', fontSize: 16},
});

export default StatusScreen;
