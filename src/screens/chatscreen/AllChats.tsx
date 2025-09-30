import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import BottomTabs from '../../navigation/BottomTabs';

const AllChats = () => {
  return (
    <View style={styles.container}>
      <BottomTabs />
    </View>
  );
};

export default AllChats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
  },
});
