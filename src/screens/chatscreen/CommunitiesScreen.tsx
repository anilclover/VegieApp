import {View, Text, Button} from 'react-native';
import React from 'react';
import {navigate} from '../../utils/NavigationUtils';

const CommunitiesScreen = () => {
  return (
    <View>
      <Text>CommunitiesScreen</Text>
      <Button
        title="Clicl"
        onPress={() => navigate('AppointmentBookingScreen')}></Button>
      <Button
        title="Product"
        // onPress={() => navigate('ProductsScreen')}>
        onPress={() => navigate('NotifeeDemo')}></Button>
      <Button
        title="RegistrationScreenResponsive"
        onPress={() => navigate('Signup')}></Button>
    </View>
  );
};

export default CommunitiesScreen;
