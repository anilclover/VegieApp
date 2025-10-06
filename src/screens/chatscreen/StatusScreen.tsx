import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import BottomAlertModal from '../../components/BottomAlertModal'; // 👈 import your modal
import { navigate } from '../../utils/NavigationUtils';

const StatusScreen = () => {
  const [visible, setVisible] = useState(false);
  const locationAlertImage = require('../../assets/images/icons/location_alert.png');


  const getAvailableTimeSlots = () => { 
    setVisible(false);
    navigate('SearchLocation');


  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.openBtn}
        onPress={() => setVisible(true)} // 👈 open modal
      >
        <Text style={styles.openText}>Show Custom Bottom Alert</Text>
      </TouchableOpacity>

      <BottomAlertModal
        isVisible={visible} // 👈 matches your modal prop
        onClose={() =>
          // navigate('SearchLocation')
           
        getAvailableTimeSlots()
        }
        onActionPress={() => {
          console.log('Delete pressed ✅');
          setVisible(false);
        }}
        imageSource={locationAlertImage} // Pass static require
        title="Location"
        description="Allow Bruno's Barbers to accessour location to help you find nearby branches."
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
