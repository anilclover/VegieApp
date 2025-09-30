// CallInfoScreen.tsx
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {goBack, navigate} from '../../utils/NavigationUtils';
import {CallItem} from '../../data/products';

const CallDetailsScreen = () => {
  const route = useRoute();
  const {item} = route.params as {item: CallItem};

  // Avatar or initials
  const renderAvatar = () => {
    if (item.avatar) {
      return <Image source={{uri: item.avatar}} style={styles.avatar} />;
    }
    const initials = item.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
    return (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backBtnWrap}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Call Info</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Avatar & Info */}
      <View style={styles.centerSection}>
        {renderAvatar()}
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>

      {/* Action buttons row */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigate('ChatScreen', {item})}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>📞</Text>
          <Text style={styles.actionText}>Audio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>🎥</Text>
          <Text style={styles.actionText}>Video</Text>
        </TouchableOpacity>
      </View>

      {/* Section title */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Calls</Text>
        {/* Map your call logs here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  backBtnWrap: {width: 40, alignItems: 'flex-start'},
  backBtn: {fontSize: 22, color: '#128C7E', marginRight: 20},

  headerTitle: {fontSize: 18, fontWeight: 'bold', color: '#000'},
  headerRight: {width: 40},

  // Center user info
  centerSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  avatar: {width: 100, height: 100, borderRadius: 50},
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {fontSize: 32, color: '#fff', fontWeight: 'bold'},
  name: {fontSize: 20, fontWeight: '600', marginTop: 10, color: '#000'},
  phone: {fontSize: 14, color: '#555', marginTop: 4},

  // Action row
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  actionIcon: {fontSize: 26, marginBottom: 4, color: '#25D366'},
  actionText: {fontSize: 13, color: '#000'},

  // Section
  section: {
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sectionTitle: {fontSize: 16, fontWeight: '600', color: '#000'},
});

export default CallDetailsScreen;
