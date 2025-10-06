import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
} from 'react-native';
import {goBack, navigate} from '../utils/NavigationUtils';
import CustomSwitch from '../components/CustomSwitch';

type SettingItemProps = {
  icon: string;
  title: string;
  hasArrow?: boolean;
  hasSwitch?: boolean;
  value?: boolean; // for Switch
  onValueChange?: (val: boolean) => void; // for Switch
  onPress?: () => void;
};

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);

  const SettingItem: React.FC<SettingItemProps> = ({
    icon,
    title,
    hasArrow = true,
    hasSwitch = false,
    value = false,
    onValueChange = () => {},
    onPress = () => {},
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={hasSwitch} // disable press if it's a switch row
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {hasSwitch ? (
        <CustomSwitch
          value={isEnabled}
          onValueChange={setIsEnabled}
          trackOnColor="#4CAF50"
          trackOffColor="#e0e0e0"
          thumbColor="#fff"
          style={{marginTop: 20}}
        />
      ) : hasArrow ? (
        <Text style={styles.arrow}>›</Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Section 1 */}
        <View style={styles.section}>
          <SettingItem
            icon="🔔"
            title="Notifications"
            hasArrow={false}
            hasSwitch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <SettingItem
            icon="📋"
            title="Privacy policy"
            onPress={() => console.log('Privacy policy')}
          />
          <SettingItem
            icon="📋"
            title="Terms and conditions"
            onPress={() => console.log('Terms')}
          />
        </View>

        {/* Section 2 */}
        <View style={styles.section}>
          <SettingItem
            icon="🎧"
            title="Help Center"
            onPress={() => console.log('Help Center')}
          />
          <SettingItem
            icon="💬"
            title="Chat with us"
            onPress={() => console.log('Chat')}
          />
          <SettingItem
            icon="❓"
            title="FAQs"
            onPress={() => console.log('FAQs')}
          />
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
          <SettingItem
            icon="🗑️"
            title="Delete Account"
            hasArrow={false}
            onPress={() => console.log('Delete Account')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  backArrow: {
    fontSize: 24,
    color: '#333',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#f5f5f5',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  arrow: {
    fontSize: 20,
    color: '#ccc',
  },
});
