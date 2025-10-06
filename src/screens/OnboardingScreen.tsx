import React, {useRef, useState} from 'react';
import {
  FlatList,
  View,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import OnboardingItem from '../components/OnboardingItem';
import {SLIDES, SlideData} from '../data/products';
import {replace} from '../utils/NavigationUtils';

const {width} = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList<SlideData>>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  const scrollToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      console.log('Onboarding Complete!');
      replace('Login');
    }
  };

  const renderItem = ({item}: {item: SlideData}) => (
    <OnboardingItem {...item} />
  );

  const Pagination: React.FC = () => (
    <View style={styles.paginationContainer}>
      {SLIDES.map((_, index) => (
        <View
          key={index.toString()}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
        backgroundColor="#fff" // Sets the status bar background color (Android)
        barStyle="dark-content" // Dark icons for light background
      />

      {/* //Skip Button */}
      {currentIndex < SLIDES.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => replace('Login')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        ref={slidesRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Bottom Row: Pagination (Left) + Next/Done (Right) */}
      <View style={styles.bottomRow}>
        <Pagination />
        <TouchableOpacity onPress={scrollToNext} style={styles.nextButton}>
          <Text style={styles.nextText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  // Pagination Dots
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#505050',
    width: 20,
  },
  inactiveDot: {
    backgroundColor: '#B0B0B0',
  },
  // Next Button
  nextButton: {
    backgroundColor: '#D3D3D3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  nextText: {
    color: '#303030',
    fontWeight: 'bold',
  },
  skipButton: {
    position: 'absolute',
    top: 20, // adjust for status bar / notch
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black', // change color if needed
  },
});

export default OnboardingScreen;

// Light Gray: #D3D3D3 or #F0F0F0

// Dark Gray: #A9A9A9 or #505050
