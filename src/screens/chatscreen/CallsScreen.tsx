// CallScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import ResponsiveUI from '../../utils/Responsive';
import {useNavigation} from '@react-navigation/native';
import {navigate} from '../../utils/NavigationUtils';

type Call = {
  id: string;
  name: string;
  avatar?: string | null;
  type: 'voice' | 'video';
  status: 'incoming' | 'outgoing' | 'missed';
  time: string;
};

const calls: Call[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: null,
    type: 'voice',
    status: 'incoming',
    time: '10:45 AM',
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: null,
    type: 'video',
    status: 'outgoing',
    time: 'Yesterday',
  },
  {
    id: '3',
    name: 'Alice Brown',
    avatar: null,
    type: 'voice',
    status: 'missed',
    time: '20 September',
  },
];

const CallsScreen = () => {
  const renderAvatar = (item: Call) => {
    if (item.avatar) {
      return <Image source={{uri: item.avatar}} style={styles.avatar} />;
    }
    // Show initials if no avatar
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

  const renderTypeIcon = (type: Call['type']) => {
    return type === 'voice' ? (
      <Text style={styles.callIcon}>📞</Text>
    ) : (
      <Text style={styles.callIcon}>🎥</Text>
    );
  };

  const renderItem = ({item}: {item: Call}) => (
    <TouchableOpacity
      style={styles.callItem}
      onPress={() => navigate('CallDetailsScreen')}>
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
          <Text style={[styles.callTime]}>{item.time}</Text>
        </View>
      </View>
      {renderTypeIcon(item.type)}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={calls}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingVertical: 10}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ResponsiveUI.padding.vertical(12),
    paddingHorizontal: ResponsiveUI.padding.horizontal(15),
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  callDetails: {
    flex: 1,
    marginLeft: 12,
  },
  callName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 5,
    fontWeight: 'bold',
  },
  callTime: {
    fontSize: 13,
    color: '#555',
  },
  callIcon: {
    fontSize: 20,
    color: '#25D366', // WhatsApp green
  },
});

export default CallsScreen;
