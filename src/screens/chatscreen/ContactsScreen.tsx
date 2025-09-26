import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Platform, StyleSheet, Image} from 'react-native';
import {loadContacts} from '../../utils/ScreenshotPrevention';
import {Contact, Phone} from '../../data/products';
import CustomBottomAlert from '../../components/CustomBottomAlert';
const ContactsScreen: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const data: Contact[] = await loadContacts();
        console.log('Number of contacts:', data.length);
        if (data) setContacts(data);
      }
    })();
  }, []);

  const renderItem = ({item}: {item: Contact}) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>
        Phones: {item.phones.map((p: Phone) => p.number).join(', ') || 'N/A'}
      </Text>
      <Text>Emails: {item.emails.join(', ') || 'N/A'}</Text>
      <Text>Addresses: {item.addresses.join(', ') || 'N/A'}</Text>
      <Text>Note: {item.note || 'N/A'}</Text>
      {item.photo && (
        <Image
          source={{uri: item.photo}}
          style={{width: 50, height: 50, borderRadius: 25, marginTop: 5}}
        />
      )}
    </View>
  );

  return ( 
     
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      /> 
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
