import React from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import {OnboardingItemProps} from '../data/products';

const {width} = Dimensions.get('window');

const OnboardingItem: React.FC<OnboardingItemProps> = ({
  image,
  title,
  description,
  color,
}) => {
  return (
    <View style={styles.container}>
      {/* Illustration/Image Area */}
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>

      {/* Text Content Area */}
      <View style={styles.contentContainer}>
        <Text style={[styles.title]}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default OnboardingItem;
