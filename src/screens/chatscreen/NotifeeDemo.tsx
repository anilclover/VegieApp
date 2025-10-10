import {View, Text, Touchable} from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import notifee from '@notifee/react-native';

const NotifeeDemo = () => {
  const displayMessage = async () => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        onPress={displayMessage}
        style={{
          width: '50%',
          height: 50,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>Display Message</Text>
        </TouchableOpacity>
    </View>
  );
};

export default NotifeeDemo;
