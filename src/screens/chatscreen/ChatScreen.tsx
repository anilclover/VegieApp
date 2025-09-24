// ChatScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
} from 'react-native';
import io from 'socket.io-client';
import {useRoute, useNavigation} from '@react-navigation/native';
import ResponsiveUI from '../../utils/Responsive';
import {menuOptions} from '../../data/products';
import CustomMenuModal from '../../components/CustomMenuModal';

const socket = io('http://your-server-url:3000'); // Replace with your server address

type Message = {
  id: string;
  text: string;
  sender: 'self' | 'other';
  time: string;
};

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {name, avatar}: any = route.params || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    socket.on('message', msg => {
      const receivedMessage: Message = {
        ...msg,
        sender: 'other',
        time: formatTime(new Date()),
      };
      setMessages(prev => [...prev, receivedMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: input,
        sender: 'self',
        time: formatTime(new Date()),
      };
      socket.emit('message', newMessage);
      setMessages(prev => [...prev, newMessage]);
      setInput('');
    }
  };

  const renderItem = ({item}: {item: Message}) => {
    const isSelf = item.sender === 'self';
    return (
      <View
        style={[
          styles.messageBubble,
          isSelf ? styles.selfBubble : styles.otherBubble,
        ]}>
        <View style={styles.messageContent}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    );
  };

  const handleSelect = (option: string) => {
    console.log('Selected:', option);
    setMenuVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      {/* Header */}
      <View style={styles.header}>
        {/* Left: back + avatar + name */}
        <View style={styles.leftHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Image source={{uri: avatar}} style={styles.avatar} />
          <Text style={styles.name}>{name}</Text>
        </View>
        {/* Right: call, video call, more */}
        <View style={styles.rightHeader}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>🎥</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setMenuVisible(true);
            }}>
            <Text style={styles.iconText}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* 
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            {menuOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  console.log(option); // handle action
                  setMenuVisible(false);
                }}>
                <Text style={styles.menuText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal> */}

      <CustomMenuModal
        visible={menuVisible}
        options={menuOptions}
        onSelect={handleSelect}
        onClose={() => setMenuVisible(false)}
      />

      {/* Chat messages */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingVertical: 10}}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      {/* Input + Icons */}
      <View style={styles.inputWrapperContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message"
            placeholderTextColor="#777"
          />

          <TouchableOpacity>
            <Text style={styles.sendText}>📎</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rupeeeBack}>
            <Text style={styles.sendText}>₹</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <View style={styles.sendButtonContent}>
            <Text style={styles.sendTextButton}>➤</Text>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#ECE5DD'},

  // Chat bubbles
  messageBubble: {
    marginVertical: 5,
    marginHorizontal: 10,
    maxWidth: '85%',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  selfBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  otherBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  messageContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end', // keeps time at bottom of last line
  },
  messageText: {
    fontSize: 14,
    color: '#000',
    flexShrink: 1, // prevent time from going to next line
  },
  timeText: {
    fontSize: 11,
    color: '#555',
    marginLeft: 6,
  },

  inputWrapperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ECE5DD',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // take available space
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 2,
  },

  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },

  iconButtonSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECE5DD',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  rupeeeBack: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'lightgray',
    borderWidth: 1,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#25D366',
    marginLeft: 6,
    justifyContent: 'center', // center inner view
    alignItems: 'center',
    padding: 0,
  },

  sendButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  sendText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    includeFontPadding: false, // fixes Android vertical alignment
    lineHeight: 18, // match fontSize to prevent offset
  },
  sendTextButton: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    includeFontPadding: false, // fixes Android vertical alignment
    lineHeight: 18, // match fontSize to prevent offset
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // WhatsApp green
    paddingHorizontal: ResponsiveUI.padding.horizontal(10),
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: ResponsiveUI.padding.bottom(10),
  },
  avatar: {width: 42, height: 42, borderRadius: 100, marginRight: 12},
  name: {color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10},
  backArrow: {color: '#fff', fontSize: 20, fontWeight: 'bold'},
  rightHeader: {flexDirection: 'row', alignItems: 'center'},
  iconButton: {
    marginLeft: ResponsiveUI.margin.left(10),
    marginEnd: ResponsiveUI.margin.right(10),
  },
  iconText: {color: '#fff', fontSize: 20},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 50,
    paddingRight: 10,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 5,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
});

export default ChatScreen;
