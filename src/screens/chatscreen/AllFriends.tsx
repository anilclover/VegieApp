// AllFriends.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import ResponsiveUI from '../../utils/Responsive';
import {menuOptionsDashBoard, userData} from '../../data/products';
import CustomMenuModal from '../../components/CustomMenuModal';

const categories = ['All', 'Unread', 'Favourite', 'Groups', 'Communities'];
const AllFriends = () => {
  const {colors} = useTheme();
  // const navigation = useNavigation();
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState('All');
  const [menuVisible, setMenuVisible] = useState(false);

  const ChatItem = ({item}: any) => {
    // Check if avatar exists
    const hasAvatar = item.avatar && item.avatar.trim() !== '';

    // Function to get initials from name
    const getInitials = (name: string) => {
      if (!name) return '';
      const parts = name.split(' ');
      const firstInitial = parts[0] ? parts[0][0].toUpperCase() : '';
      const lastInitial = parts[1] ? parts[1][0].toUpperCase() : '';
      return firstInitial + lastInitial;
    };

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => {
          navigation.navigate('ChatScreen', {
            item,
          });
        }}>
        {hasAvatar ? (
          <Image source={{uri: item.avatar}} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.fallbackAvatar]}>
            <Text style={styles.initials}>{getInitials(item.name)}</Text>
          </View>
        )}
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.chatTime}>{item.time}</Text>
          </View>
          <Text style={styles.chatMessage} numberOfLines={1}>
            {item.message}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSelect = (option: string) => {
    console.log('Selected:', option);
    setMenuVisible(false);
  };
  const renderItemButton = ({item}: {item: string}) => (
    <TouchableOpacity
      style={[styles.button, selected === item && styles.selectedButton]}
      onPress={() => setSelected(item)}>
      <Text
        style={[
          styles.buttonText,
          selected === item && styles.selectedButtonText,
        ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WhatsApp</Text>
        <View style={styles.headerIcons}>
          <Text style={styles.icon}>🔍︎</Text>
          <Text style={styles.icon}>📷</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setMenuVisible(true);
            }}>
            <Text style={styles.iconText}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.containerB}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          renderItem={renderItemButton}
          contentContainerStyle={{paddingHorizontal: 10}}
        />
      </View>

      <CustomMenuModal
        visible={menuVisible}
        options={menuOptionsDashBoard}
        onSelect={handleSelect}
        onClose={() => setMenuVisible(false)}
      />

      {/* Chat List */}
      <FlatList
        data={userData}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ChatItem item={item} />}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // WhatsApp green
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  backArrow: {color: '#fff', fontSize: 20, fontWeight: 'bold'},
  headerTitle: {color: '#fff', fontSize: 20, fontWeight: 'bold'},
  headerIcons: {flexDirection: 'row'},
  icon: {color: '#fff', fontSize: 18, marginLeft: 20},

  // Chat Item
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    // borderBottomWidth: 0.2,
    borderBottomColor: '#ddd',
  },
  avatar: {width: 60, height: 60, borderRadius: 50, marginRight: 12},
  chatContent: {flex: 1},
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  chatName: {fontSize: 16, fontWeight: '600', color: '#000'},
  chatTime: {fontSize: 12, color: 'gray'},
  chatMessage: {fontSize: 14, color: 'gray'},
  containerB: {
    marginVertical: 10,
  },
  button: {
    paddingVertical: ResponsiveUI.padding.vertical(5),
    paddingHorizontal: ResponsiveUI.padding.horizontal(14),
    borderRadius: ResponsiveUI.cardRadius(40),
    backgroundColor: '#f8f8ff',
    marginRight: ResponsiveUI.margin.right(6),
    borderWidth: 0.5,
    borderColor: 'grey',
  },
  selectedButton: {
    backgroundColor: '#90ee90',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  selectedButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  fallbackAvatar: {
    backgroundColor: '#ccc', // fallback color
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  rightHeader: {flexDirection: 'row', alignItems: 'center'},
  iconButton: {
    marginLeft: ResponsiveUI.margin.left(20),
    marginEnd: ResponsiveUI.margin.right(10),
  },
  iconText: {color: '#fff', fontSize: 20},
});

export default AllFriends;
