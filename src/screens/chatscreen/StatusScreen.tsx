import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import CustomBottomAlert from '../../components/CustomBottomAlert';

const StatusScreen = () => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.openBtn} onPress={() => setVisible(true)}>
        <Text style={styles.openText}>Show Custom Bottom Alert</Text>
      </TouchableOpacity>

      <CustomBottomAlert
        visible={visible}
        title="⚠️ Delete Item?"
        message="Are you sure you want to delete this item? This action cannot be undone."
        onClose={() => setVisible(false)}
        actions={[
          {
            label: 'Delete',
            type: 'destructive',
            onPress: () => console.log('Deleted ✅'),
          },
          {
            label: 'Cancel',
            type: 'cancel',
            onPress: () => console.log('Cancelled ❌'),
          },
          
        ]}
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
