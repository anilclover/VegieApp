import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { productsData } from '../../data/products';

const {width} = Dimensions.get('window');

const categories = ['All', 'Skincare', 'Haircare', 'Sun Care', 'Fragrances'];


export default function ProductsScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeCategory, setActiveCategory] = useState('All');

  // Group products by category
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] =
      cat === 'All'
        ? productsData
        : productsData.filter(p => p.category === cat);
    return acc;
  }, {} as Record<string, any[]>);

  // Handle tab press
  const handleCategoryPress = (cat: string) => setActiveCategory(cat);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* Header */}
      <View style={{paddingHorizontal: 16, paddingVertical: 10,flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={{fontSize: 22, fontWeight: '700'}}>Product </Text>
        <Text style={{color: '#777'}}>Ayala Mall Vertis</Text>
      </View>

      {/* Search bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 16,
          marginBottom: 10,
        }}>
        <TextInput
          placeholder="Search Products"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            paddingHorizontal: 12,
            height: 42,
          }}
        />
        <TouchableOpacity style={{marginLeft: 10}}>
          <Text style={{fontSize: 20}}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleCategoryPress(item)}>
            <Text
              style={{
                marginHorizontal: 12,
                fontSize: 16,
                fontWeight: activeCategory === item ? '700' : '500',
                borderBottomWidth: activeCategory === item ? 2 : 0,
                borderBottomColor:
                  activeCategory === item ? 'black' : 'transparent',
                paddingBottom: 6,
              }}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Products Grid */}
      <FlatList
        data={grouped[activeCategory]}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{paddingHorizontal: 8, paddingBottom: 80}}
        renderItem={({item}) => (
          <View
            style={{
              backgroundColor: '#fafafa',
              flex: 1,
              margin: 8,
              borderRadius: 12,
              padding: 10,
              borderWidth: 1,
              borderColor: '#eee',
            }}>
            <View
              style={{
                backgroundColor: '#f0f0f0',
                height: 120,
                borderRadius: 10,
                marginBottom: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text>🖼️</Text>
            </View>
            <Text numberOfLines={2} style={{fontWeight: '600'}}>
              {item.name}
            </Text>
            <Text style={{marginVertical: 6}}>₱{item.price}</Text>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                backgroundColor: '#000',
                borderRadius: 6,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}>
              <Text style={{color: '#fff', fontWeight: '600'}}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Bottom Bar */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderColor: '#eee',
        }}>
        <Text style={{fontWeight: '600'}}>0 Products Added</Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#ddd',
            borderRadius: 8,
            paddingHorizontal: 20,
            paddingVertical: 8,
          }}>
          <Text style={{fontWeight: '600'}}>View Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
