import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useNavigation} from '@react-navigation/native';

const ProfileScreen = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.header, {backgroundColor: colors.primary}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={[styles.backIcon, {color: '#fff'}]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: '#fff'}]}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.userSection, {backgroundColor: colors.primary}]}>
          <View style={styles.userHeader}>
            <View style={[styles.avatar, {backgroundColor: '#fff'}]}>
              <Text style={[styles.avatarText, {color: colors.primary}]}>
                👤
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, {color: '#fff'}]}>
                Nilesh Jadhav (8999851307)
              </Text>
              <Text style={[styles.editProfile, {color: '#fff'}]}>
                Edit Profile
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardsSection}>
          <View style={[styles.card, {backgroundColor: colors.surface}]}>
            <Text style={[styles.cardTitle, {color: colors.text}]}>
              VePoints
            </Text>
            <View style={styles.cardContent}>
              <Text style={[styles.cardValue, {color: '#4CAF50'}]}>0</Text>
              <Text style={styles.cardIcon}>🍎</Text>
            </View>
          </View>
          <View style={[styles.card, {backgroundColor: colors.surface}]}>
            <Text style={[styles.cardTitle, {color: colors.text}]}>VeCash</Text>
            <View style={styles.cardContent}>
              <Text style={[styles.cardValue, {color: '#4CAF50'}]}>₹ {0}</Text>
              <Text style={styles.cardIcon}>💰</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.surface}]}>
            <Text style={styles.menuIcon}>📦</Text>
            <Text style={[styles.menuText, {color: colors.text}]}>
              My Orders
            </Text>
            <Text style={[styles.menuArrow, {color: colors.text}]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.surface}]}>
            <Text style={styles.menuIcon}>↩️</Text>
            <Text style={[styles.menuText, {color: colors.text}]}>
              Return Requests
            </Text>
            <Text style={[styles.menuArrow, {color: colors.text}]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.surface}]}>
            <Text style={styles.menuIcon}>📍</Text>
            <Text style={[styles.menuText, {color: colors.text}]}>
              Address Book
            </Text>
            <Text style={[styles.menuArrow, {color: colors.text}]}>›</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.sectionTitle,
            {color: colors.text, marginHorizontal: 16},
          ]}>
          Money & Cash Back
        </Text>
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.surface}]}>
            <Text style={styles.menuIcon}>💳</Text>
            <Text style={[styles.menuText, {color: colors.text}]}>
              Wallet Recharge
            </Text>
            <Text style={[styles.menuArrow, {color: colors.text}]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.surface}]}>
            <Text style={styles.menuIcon}>🔗</Text>
            <Text style={[styles.menuText, {color: colors.text}]}>
              Refer & Earn
            </Text>
            <Text style={[styles.menuArrow, {color: colors.text}]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.surface}]}>
            <Text style={styles.menuIcon}>💬</Text>
            <Text style={[styles.menuText, {color: colors.text}]}>
              Loyalty Program
            </Text>
            <Text style={[styles.menuArrow, {color: colors.text}]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.surface}]}>
            <Text style={styles.menuIcon}>🏆</Text>
            <Text style={[styles.menuText, {color: colors.text}]}>
              My Rewards
            </Text>
            <Text style={[styles.menuArrow, {color: colors.text}]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.surface}]}>
            <Text style={styles.menuIcon}>🎫</Text>
            <Text style={[styles.menuText, {color: colors.text}]}>
              My Coupons
            </Text>
            <Text style={[styles.menuArrow, {color: colors.text}]}>›</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.sectionTitle,
            {color: colors.text, marginHorizontal: 16},
          ]}>
          More
        </Text>
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.surface}]}>
            <Text style={styles.menuIcon}>💬</Text>
            <Text style={[styles.menuText, {color: colors.text}]}>
              Customer Support
            </Text>
            <Text style={[styles.menuArrow, {color: colors.text}]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.surface}]}>
            <Text style={styles.menuIcon}>📱</Text>
            <Text style={[styles.menuText, {color: colors.text}]}>
              About Us
            </Text>
            <Text style={[styles.menuArrow, {color: colors.text}]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.surface}]}>
            <Text style={styles.menuIcon}>📄</Text>
            <Text style={[styles.menuText, {color: colors.text}]}>
              Terms of Use
            </Text>
            <Text style={[styles.menuArrow, {color: colors.text}]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.surface}]}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={[styles.menuText, {color: colors.text}]}>
              Notification
            </Text>
            <Text style={[styles.menuArrow, {color: colors.text}]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: colors.surface}]}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={[styles.menuText, {color: colors.text}]}>
              Settings
            </Text>
            <Text style={[styles.menuArrow, {color: colors.text}]}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, {color: colors.text}]}>
          Version No: 1.9.98
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 5,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    marginBottom: 20,
  },
  userSection: {
    paddingHorizontal: 16,
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  editProfile: {
    fontSize: 14,
    opacity: 0.9,
  },
  cardsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 6,
  },
  card: {
    flex: 1,
    padding: 16,
    marginHorizontal: 6,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  menuSection: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    marginHorizontal: 10,
    borderRadius: 6,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 8,
    width: 24,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 18,
    opacity: 0.5,
  },
  version: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 30,
    marginHorizontal: 16,
    textAlign: 'left',
  },
});
export default ProfileScreen;
