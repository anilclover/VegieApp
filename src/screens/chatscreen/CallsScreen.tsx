import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {navigate} from '../../utils/NavigationUtils';
import {Call, recents, favorites} from '../../data/products';

const CallsScreen = () => {
  const renderAvatar = (item: Call) => {
    if (item.avatar) {
      return <Image source={{uri: item.avatar}} style={styles.avatar} />;
    }
    const initials = item.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
    return (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
    );
  };

  const renderStatusIcon = (status: Call['status']) => {
    switch (status) {
      case 'incoming':
        return <Text style={[styles.statusIcon, {color: 'green'}]}>↙</Text>;
      case 'outgoing':
        return <Text style={[styles.statusIcon, {color: 'green'}]}>↗</Text>;
      case 'missed':
        return <Text style={[styles.statusIcon, {color: '#de4040'}]}>↙</Text>;
      default:
        return null;
    }
  };

  const renderActionIcon = (type: Call['type']) => {
    return type === 'voice' ? (
      <Text style={styles.callIcon}>📞</Text>
    ) : (
      <Text style={styles.callIcon}>🎥</Text>
    );
  };

  const renderCallItem = ({item}: {item: Call}) => (
    <TouchableOpacity
      style={styles.callItem}
      onPress={() => navigate('CallDetailsScreen', {item})}>
      {renderAvatar(item)}
      <View style={styles.callDetails}>
        <Text
          style={[
            styles.callName,
            item.status === 'missed' && {color: '#de4040'},
          ]}>
          {item.name}
        </Text>
        <View style={styles.callInfo}>
          {renderStatusIcon(item.status)}
          <Text style={styles.callTime}>{item.time}</Text>
        </View>
      </View>
      {renderActionIcon(item.type)}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Calls</Text>
        <View style={styles.headerIcons}>
          <Text style={styles.icon}>📷</Text>
          <Text style={[styles.icon, {marginLeft: 20}]}>⋮</Text>
        </View>
      </View>

      {/* Favorites */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favorites</Text>
          <TouchableOpacity>
            <Text style={styles.moreBtn}>More</Text>
          </TouchableOpacity>
        </View>
        {favorites.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigate('CallDetailsScreen', {item})}>
            <View style={styles.callItem}>
              {renderAvatar(item)}
              <Text style={styles.callName}>{item.name}</Text>
              <View style={{flexDirection: 'row', marginLeft: 'auto'}}>
                <Text style={styles.callIcon}>📞</Text>
                <Text style={[styles.callIcon, {marginLeft: 20}]}>🎥</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent header */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent</Text>
      </View>
    </>
  );

  return (
    <FlatList
      style={styles.container}
      data={recents}
      keyExtractor={item => item.id}
      renderItem={renderCallItem}
      ListHeaderComponent={renderHeader}
    />
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
  },
  headerTitle: {fontSize: 22, fontWeight: 'bold', color: '#000'},
  headerIcons: {flexDirection: 'row'},
  icon: {fontSize: 22, color: '#000'},

  section: {marginTop: 10},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sectionTitle: {fontSize: 16, fontWeight: '600', color: '#000'},
  moreBtn: {fontSize: 14, color: '#128C7E', fontWeight: '500'},

  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  avatar: {width: 48, height: 48, borderRadius: 24},
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {fontSize: 18, color: '#fff', fontWeight: 'bold'},
  callDetails: {flex: 1, marginLeft: 12},
  callName: {fontSize: 16, fontWeight: '500', color: '#000',marginStart:10},
  callInfo: {flexDirection: 'row', alignItems: 'center', marginTop: 3},
  statusIcon: {fontSize: 18, marginRight: 5, fontWeight: 'bold'},
  callTime: {fontSize: 13, color: '#555'},
  callIcon: {fontSize: 20, color: '#25D366'},
});

export default CallsScreen;
