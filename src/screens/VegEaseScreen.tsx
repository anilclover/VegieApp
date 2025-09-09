import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useTheme} from '../context/ThemeContext';
import {useCart} from '../context/CartContext';
import {useNavigation} from '@react-navigation/native';
import {vegetables, fruits, oils, flashDeals} from '../data/products';

import Geolocation from '@react-native-community/geolocation';
import Constants from '../constants/Constants';
// import Geolocation from 'react-native-geolocation-service';

const VegEaseScreen = () => {
  const {colors} = useTheme();
  const {cart, addToCart, removeFromCart, getTotalPrice, getUniqueItemsCount} =
    useCart();
  const navigation = useNavigation();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  /**
   * 🔹 Request location permission (Android only)
   */
  const requestLocationPermission = async () => {
    setLoading(true);
    setAddress('');

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          setAddress('📍 Location access denied');
          setLoading(false);
        }
      } catch (err) {
        console.warn(err);
        setAddress('📍 Permission error');
        setLoading(false);
      }
    } else {
      getCurrentLocation(); // iOS handles its own permission prompt
    }
  };

  /**
   * 🔹 Get current latitude & longitude
   */
  const getCurrentLocation = () => {
    setLoading(true);
    setAddress('📍 Getting location...');

    Geolocation.getCurrentPosition(
      position => {
        console.log('✅ Location success:', position);
        let {latitude, longitude} = position.coords;
        latitude = 19.157934;
        longitude = 72.99205;
        getAddressFromCoordinates(latitude, longitude);
      },
      error => {
        console.log('❌ Location error:', error);
        let errorMessage = '📍 Unable to get location';
        switch (error.code) {
          case 1:
            errorMessage = '📍 Location access denied';
            break;
          case 2:
            errorMessage = '📍 Location service unavailable';
            break;
          case 3:
            errorMessage = '📍 Location request timed out';
            break;
        }
        setAddress(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 60000, // allow 60s for GPS
        maximumAge: 10000,
      },
    );
  };

  /**
   * 🔹 Convert latitude/longitude → Human-readable address
   */
  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number,
  ) => {
    const roundedLat = Math.round(latitude * 10000) / 10000;
    const roundedLng = Math.round(longitude * 10000) / 10000;

    console.log(
      `${Platform.OS.toUpperCase()} - Rounded:`,
      roundedLat,
      roundedLng,
    );

    try {
      const url = `${Constants.CURRENT_LOCATION}${roundedLat},${roundedLng}&key=${Constants.GOOGLE_MAPS_KEY}`;
      console.log('COMPLETE URL OF CURRENT LOCATION' + url);
      const response = await fetch(url);
      const data = await response.json();
      console.log('📍 Address response:', data);

      if (data.results && data.results.length > 0) {
        const fullAddress = data.results[0].formatted_address;
        setAddress(fullAddress);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.log('Geocoding error:', error);
      setAddress('Unable to get address');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔹 Render product cards
   */
  const renderItem = ({item}: {item: any}) => {
    const quantity = cart[item.id] || 0;
    const discount = Math.round(
      ((item.originalPrice - item.price) / item.originalPrice) * 100,
    );

    return (
      <View style={[styles.card, {backgroundColor: colors.surface}]}>
        <View style={styles.cardContent}>
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={[styles.vegName, {color: colors.text}]}>
            {item.name}
          </Text>
          <Text style={[styles.unit, {color: colors.text}]}>{item.unit}</Text>
          {discount > 0 && (
            <Text style={[styles.originalPrice, {color: colors.text}]}>
              ₹{item.originalPrice}
            </Text>
          )}
          <Text style={[styles.price, {color: colors.primary}]}>
            ₹{item.price}
          </Text>
        </View>
        {quantity === 0 ? (
          <TouchableOpacity
            style={[styles.addButton, {backgroundColor: colors.primary}]}
            onPress={() =>
              addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                emoji: item.emoji,
              })
            }>
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.quantityContainer,
              {backgroundColor: colors.primary},
            ]}>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Text style={styles.quantityButton}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              onPress={() =>
                addToCart({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  emoji: item.emoji,
                })
              }>
              <Text style={styles.quantityButton}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Show loader full screen when loading */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[{color: colors.primary}, styles.textLoading]}>
            Loading...
          </Text>
        </View>
      ) : (
        <>
          {/* Top Section */}
          <View style={styles.topSection}>
            <View style={styles.headerRow}>
              {/* Avatar */}
              <TouchableOpacity
                style={[styles.avatar, {backgroundColor: colors.primary}]}
                onPress={() => navigation.navigate('Profile' as never)}>
                <Text style={styles.avatarText}>JD</Text>
              </TouchableOpacity>

              {/* Address */}
              <View style={styles.addressContainer}>
                <Text
                  style={[styles.address, {color: colors.text}]}
                  numberOfLines={2}>
                  {address}
                </Text>
              </View>

              {/* Search */}
              <TouchableOpacity
                style={[styles.searchButton, {backgroundColor: colors.surface}]}
                onPress={() => navigation.navigate('SearchScreen' as never)}>
                <Text style={styles.searchIcon}>🔍</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Products */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{
              paddingBottom: Object.keys(cart).length > 0 ? 100 : 20,
            }}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, {color: colors.text}]}>
                Vegetables
              </Text>
              <FlatList
                data={vegetables}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.grid}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, {color: colors.text}]}>
                Fruits
              </Text>
              <FlatList
                data={fruits}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.grid}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, {color: colors.text}]}>
                Oils
              </Text>
              <FlatList
                data={oils}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.grid}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, {color: colors.text}]}>
                Flash Deals ⚡
              </Text>
              <FlatList
                data={flashDeals}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.grid}
              />
            </View>
          </ScrollView>

          {/* Floating Cart Summary */}
          {Object.keys(cart).length > 0 && (
            <TouchableOpacity
              style={[styles.cartSummary, {backgroundColor: colors.primary}]}
              onPress={() => navigation.navigate('Cart' as never)}>
              <View style={styles.cartInfo}>
                <Text style={styles.cartCount}>
                  {getUniqueItemsCount()} items
                </Text>
                <Text style={styles.cartTotal}>₹{getTotalPrice()}</Text>
              </View>
              <Text style={styles.viewCart}>View Cart</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default VegEaseScreen;

/**
 * 🔹 Styles
 */
const styles = StyleSheet.create({
  container: {flex: 1, padding: 12},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {marginBottom: 20, marginTop: 10},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  addressContainer: {flex: 1, marginHorizontal: 16},
  address: {fontSize: 14, opacity: 0.8},
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {fontSize: 18},
  scrollView: {flex: 1},
  section: {marginBottom: 24},
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 16,
  },
  grid: {paddingHorizontal: 8},
  card: {
    width: 160,
    height: 240,
    marginRight: 8,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cardContent: {padding: 12, alignItems: 'center', position: 'relative'},
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomEndRadius: 10,
    borderTopLeftRadius: 10,
    zIndex: 1,
  },
  discountText: {color: '#fff', fontSize: 10, fontWeight: 'bold'},
  emoji: {fontSize: 40, marginBottom: 8, marginTop: 30},
  vegName: {fontSize: 16, fontWeight: 'bold', marginBottom: 2},
  unit: {fontSize: 12, opacity: 0.7, marginBottom: 4},
  price: {fontSize: 14, fontWeight: '600', marginBottom: 4},
  textLoading: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: 'green',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    opacity: 0.6,
    marginBottom: 2,
  },
  addButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: 'auto',
  },
  addButtonText: {color: '#fff', fontWeight: 'bold', fontSize: 14},
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 6,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: 'auto',
  },
  quantityButton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  quantityText: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cartSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    elevation: 8,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cartInfo: {flex: 1},
  cartCount: {color: '#fff', fontSize: 14, fontWeight: 'bold'},
  cartTotal: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  viewCart: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});
