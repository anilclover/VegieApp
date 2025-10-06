import React, {useRef, useEffect} from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  trackOnColor?: string;
  trackOffColor?: string;
  thumbColor?: string;
  style?: StyleProp<ViewStyle>; // ✅ Correct typing for style
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  trackOnColor = '#4CAF50',
  trackOffColor = '#e0e0e0',
  thumbColor = '#fff',
  style,
}) => {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 5000,
      useNativeDriver: false, // we animate layout, so can't use native driver
    }).start();
  }, [value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 28], // move from left to right fully inside track
  });

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [trackOffColor, trackOnColor],
  });

  return (
    <Pressable onPress={() => onValueChange(!value)} style={style}>
      <Animated.View style={[styles.track, {backgroundColor: trackColor}]}>
        <Animated.View
          style={[
            styles.thumb,
            {backgroundColor: thumbColor, transform: [{translateX}]},
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    left: 0, // 👈 keep thumb aligned with track padding
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},
  },
});

export default CustomSwitch;
