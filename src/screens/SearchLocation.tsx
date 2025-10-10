import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Platform,
  Image,
  PermissionsAndroid,
} from 'react-native';
import MapView, {Marker, Region} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import {goBack} from '../utils/NavigationUtils';
import Constants from '../constants/Constants';

interface PlacePrediction {
  place_id: string;
  description: string;
}

const {width: screenWidth} = Dimensions.get('window');

const SearchLocation = () => {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [location, setLocation] = useState<Region>({
    latitude: 14.5995,
    longitude: 120.9842,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showCurrentLocationButton, setShowCurrentLocationButton] =
    useState(true);

  useEffect(() => {
    getAddressFromCoordinates(location.latitude, location.longitude);
  }, [location]);

  const searchPlaces = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${Constants.GOOGLE_API_KEY}`,
        );
        const data = await response.json();
        setSuggestions(data.predictions || []);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const selectPlace = async (placeId: string, description: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${Constants.GOOGLE_API_KEY}`,
      );
      const data = await response.json();

      if (data.result?.geometry?.location) {
        const {lat, lng} = data.result.geometry.location;
        const newLocation: Region = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setLocation(newLocation);
        setQuery('');
        setSuggestions([]);

        mapRef.current?.animateToRegion(newLocation, 1000);
      }
    } catch (error) {
      console.error('Place selection error:', error);
    }
  };

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number,
  ) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Constants.GOOGLE_API_KEY}`,
      );
      const data = await response.json();
      if (data.results?.length > 0) {
        setSelectedAddress(data.results[0].formatted_address);
      } else {
        setSelectedAddress('Selected Location');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setSelectedAddress('Selected Location');
    }
  };

  const onMapPress = (event: any) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setLocation({...location, latitude, longitude});
  };

  const useCurrentLocation = async () => {
    try {
      let hasPermission = false;

      if (Platform.OS === 'ios') {
        const result = await Geolocation.requestAuthorization('whenInUse');
        hasPermission = result === 'granted';
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      if (!hasPermission) return;

      Geolocation.getCurrentPosition(
        position => {
          const newLocation: Region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setLocation(newLocation);
          mapRef.current?.animateToRegion(newLocation, 1000);
        },
        error => console.warn('Location error:', error),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (error) {
      console.warn('Permission error:', error);
    }
  };

  const handleContinue = () => {
    goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => goBack()}
          style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Location</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Location..."
            value={query}
            onChangeText={searchPlaces}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={item => item.place_id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => selectPlace(item.place_id, item.description)}>
                <Text style={styles.suggestionIcon}>📍</Text>
                <Text style={styles.suggestionText}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Map */}
      {/* <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={location}
          onPress={onMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}>
          <Marker coordinate={location}>
            <Image
              source={require('../assets/images/products/tomato.png')}
              style={{width: 40, height: 40}}
              resizeMode="contain"
            />
          </Marker>
        </MapView> */}

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={
            location || {
              latitude: 14.5995, // fallback
              longitude: 120.9842,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }
          }
          showsUserLocation={true}
          showsMyLocationButton={false}
          onPress={onMapPress}>
          {location && (
            <Marker coordinate={location}>
              <Image
                source={require('../assets/images/products/tomato.png')}
                style={{width: 40, height: 40}}
                resizeMode="contain"
              />
            </Marker>
          )}
        </MapView>

        {/* Selected Address */}
        <View style={styles.addressOverlay}>
          <View style={styles.addressRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <View style={styles.addressTextContainer}>
              <Text style={styles.addressText} numberOfLines={2}>
                {selectedAddress}
              </Text>
            </View>
            <TouchableOpacity style={styles.changeButton}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {showCurrentLocationButton && (
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={useCurrentLocation}>
            <Text style={styles.currentLocationIcon}>📍</Text>
            <Text style={styles.currentLocationText}>Use Current Location</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchLocation;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {width: 40, height: 40, justifyContent: 'center'},
  backArrow: {fontSize: 24, color: '#000'},
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 10,
  },
  searchContainer: {paddingHorizontal: 20, marginBottom: 10},
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#f2f2f2',
  },
  searchIcon: {fontSize: 16, marginRight: 10},
  searchInput: {flex: 1, fontSize: 14, color: '#000'},
  suggestionsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
    marginBottom: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionIcon: {fontSize: 16, marginRight: 12},
  suggestionText: {flex: 1, fontSize: 14, color: '#333'},
  mapContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {flex: 1},
  addressOverlay: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addressRow: {flexDirection: 'row', alignItems: 'center'},
  locationIcon: {fontSize: 18, marginRight: 8},
  addressTextContainer: {flex: 1},
  addressText: {fontSize: 16, color: '#333', fontWeight: '500'},
  changeButton: {paddingHorizontal: 6},
  changeText: {fontSize: 14, color: '#007AFF', fontWeight: '600'},
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 15,
  },
  currentLocationIcon: {fontSize: 18, marginRight: 8},
  currentLocationText: {fontSize: 16, color: '#333', fontWeight: '500'},
  continueButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});
