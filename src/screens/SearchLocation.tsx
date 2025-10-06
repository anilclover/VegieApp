import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {goBack} from '../utils/NavigationUtils';

interface PlacePrediction {
  place_id: string;
  description: string;
}

const {width: screenWidth} = Dimensions.get('window');

const SearchLocation = () => {
  const mapRef = useRef<MapView>(null);
  const widthAnim = useRef(new Animated.Value(45)).current;
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [location, setLocation] = useState({
    latitude: 22.0, // roughly center of India
    longitude: 78.0,
    latitudeDelta: 20, // larger delta to show whole country
    longitudeDelta: 20,
  });

  const GOOGLE_API_KEY = 'AIzaSyBkCIKQZ1ydCbRHBrXmC8hUh2dsrnCDEWI';

  // Expand/collapse search bar
  const expandSearch = () => {
    setExpanded(true);
    Animated.timing(widthAnim, {
      toValue: screenWidth - 20,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };
  const collapseSearch = () => {
    setExpanded(false);
    setQuery('');
    setSuggestions([]);
    Animated.timing(widthAnim, {
      toValue: 45,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  // Search places using Google Places API
  const searchPlaces = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_API_KEY}`,
        );
        const data = await response.json();

        if (data.predictions && data.predictions.length > 0) {
          setSuggestions(data.predictions);
        } else {
          setSuggestions([
            {place_id: `fallback_${text}`, description: `${text} (Search)`},
          ]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([
          {place_id: `fallback_${text}`, description: `${text} (Search)`},
        ]);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Select a place from suggestions
  const selectPlace = async (placeId: string, description: string) => {
    try {
      let lat = location.latitude;
      let lng = location.longitude;

      if (placeId.startsWith('fallback_')) {
        const searchTerm = placeId.replace('fallback_', '');
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            searchTerm,
          )}&key=${GOOGLE_API_KEY}`,
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          lat = data.results[0].geometry.location.lat;
          lng = data.results[0].geometry.location.lng;
        }
      } else {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`,
        );
        const data = await response.json();
        if (data.result && data.result.geometry) {
          lat = data.result.geometry.location.lat;
          lng = data.result.geometry.location.lng;
        }
      }

      const newLocation = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setLocation(newLocation);

      if (mapRef.current) {
        mapRef.current.animateToRegion(newLocation, 1000);
      }

      setQuery(description);
      setSuggestions([]);
      collapseSearch();
    } catch (error) {
      console.error('Place selection error:', error);
    }
  };

  // Map press event
  const onMapPress = (event: any) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setLocation({
      ...location,
      latitude,
      longitude,
    });
  };

  const handleConfirmLocation = () => {
    console.log('Selected location:', location);
    goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Location</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Animated.View style={[styles.searchBox, {width: widthAnim}]}>
          {expanded && (
            <TextInput
              style={styles.input}
              placeholder="Search here..."
              value={query}
              onChangeText={searchPlaces}
              autoFocus
            />
          )}
          <TouchableOpacity onPress={expanded ? collapseSearch : expandSearch}>
            <Text style={[styles.icon, {color: expanded ? '#FF3B30' : '#444'}]}>
              {expanded ? '❌' : '🔍'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
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
                <Text style={styles.suggestionText}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 22.0,
          longitude: 78.0,
          latitudeDelta: 20,
          longitudeDelta: 20,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomEnabled={true}
        scrollEnabled={true}>
        <Marker coordinate={location} title="Selected Location" />
      </MapView>

      {/* Location Info */}
      <View style={styles.locationInfo}>
        {/* <Text style={styles.locationText}>
          Lat: {location.latitude.toFixed(6)}
        </Text>
        <Text style={styles.locationText}>
          Lng: {location.longitude.toFixed(6)}
        </Text> */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmLocation}>
          <Text style={styles.confirmText}>Confirm Location</Text>
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
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  backArrow: {color: '#fff', fontSize: 20, fontWeight: 'bold'},
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },

  searchContainer: {paddingHorizontal: 10, paddingVertical: 10},
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  input: {flex: 1, fontSize: 16, paddingVertical: 0, marginRight: 8},
  icon: {fontSize: 18},

  map: {flex: 1},

  suggestionsContainer: {
    backgroundColor: '#fff',
    maxHeight: 200,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
  },
  suggestionText: {fontSize: 14, color: '#333'},

  locationInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E7E7E7',
  },
  locationText: {fontSize: 14, color: '#666', marginBottom: 5},
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});
