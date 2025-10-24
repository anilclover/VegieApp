import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const {width} = Dimensions.get('window');

const DATA = [
  {
    id: '1',
    name: 'Lettie Campbell',
    subtitle: 'Why Re Invent The Light Bulb',
    time: '03:39',
    date: '22.06.2022',
    avatar: require('../assets/images/banners/fruits-banner.png'),
    colors: ['#ff6f91', '#ff9ff3'],
  },
  {
    id: '2',
    name: 'Joel Cook',
    subtitle: 'Inner Power',
    time: '10:06',
    date: '19.06.2022',
    avatar: require('../assets/images/banners/fruits-banner.png'),
    colors: ['#00b894', '#00cec9'],
  },
  {
    id: '3',
    name: 'Ida George',
    subtitle: 'Are You Struggling In Life',
    time: '01:04',
    date: '10.06.2022',
    avatar: require('../assets/images/banners/fruits-banner.png'),
    colors: ['#0984e3', '#6c5ce7'],
  },
  {
    id: '4',
    name: 'Rose Montgomery',
    subtitle: 'Effective Ways',
    time: '04:45',
    date: '09.06.2022',
    avatar: require('../assets/images/banners/fruits-banner.png'),
    colors: ['#a55eea', '#8854d0'],
  },
];

const GradientListScreen = () => {
  const renderItem = ({item}: any) => (
    <View style={[styles.card, {backgroundColor: item.colors[0]}]}>
      {/* Simulated gradient overlays */}
      <View
        style={[
          styles.gradientTop,
          {backgroundColor: item.colors[1] + '60'}, // semi-transparent overlay
        ]}
      />
      <View
        style={[
          styles.gradientBottom,
          {backgroundColor: item.colors[0] + '40'},
        ]}
      />

      <View style={styles.row}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={{flex: 1}}>
          <View style={styles.rowBetween}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.starBtn}>
          <Text style={styles.star}>⭐</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group</Text>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 30}}
      />
    </View>
  );
};

export default GradientListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 22,
  },
  card: {
    borderRadius: 8,
    marginBottom: 18,
    padding: 16,
    width: width - 32,
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 6},
    elevation: 8,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  subtitle: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.9,
    marginTop: 3,
  },
  date: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 3,
  },
  time: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.85,
  },
  starBtn: {
    marginLeft: 8,
  },
  star: {
    fontSize: 18,
    color: '#fff',
  },
});
