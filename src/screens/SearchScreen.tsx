import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useCart} from '../context/CartContext';
import {vegetables, fruits, oils, flashDeals} from '../data/products';
import {useNavigation} from '@react-navigation/native';

const SearchScreen = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const {cart, addToCart, removeFromCart} = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  const categories = ['All', 'Vegetables', 'Fruits', 'Oils', 'Flash Deals'];
  const priceRanges = ['All', 'Under ₹50', '₹50-₹100', 'Above ₹100'];

  const allProducts = [...vegetables, ...fruits, ...oils, ...flashDeals];

  const filteredProducts = allProducts.filter(item => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Vegetables' && vegetables.includes(item)) ||
      (selectedCategory === 'Fruits' && fruits.includes(item)) ||
      (selectedCategory === 'Oils' && oils.includes(item)) ||
      (selectedCategory === 'Flash Deals' && flashDeals.includes(item));

    const matchesPrice =
      priceRange === 'All' ||
      (priceRange === 'Under ₹50' && item.price < 50) ||
      (priceRange === '₹50-₹100' && item.price >= 50 && item.price <= 100) ||
      (priceRange === 'Above ₹100' && item.price > 100);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const renderItem = ({item}: {item: any}) => {
    const quantity = cart[item.id] || 0;
    const discount = Math.round(
      ((item.originalPrice - item.price) / item.originalPrice) * 100,
    );

    return (
      <View style={[styles.card, {backgroundColor: colors.surface}]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={[styles.name, {color: colors.text}]}>{item.name}</Text>
        <Text style={[styles.price, {color: colors.primary}]}>
          ₹{item.price}
        </Text>
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
      <View style={[styles.header, {backgroundColor: colors.primary}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={[styles.backIcon, {color: '#fff'}]}>←</Text>
        </TouchableOpacity>
      </View>
      <View style={{padding: 10}}>
        <View
          style={[styles.searchContainer, {backgroundColor: colors.surface}]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, {color: colors.text}]}
            placeholder="Search products..."
            placeholderTextColor={colors.text + '60'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>

        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, {color: colors.text}]}>
            Filters
          </Text>

          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, {color: colors.text}]}>
              Category:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterOptions}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor:
                        selectedCategory === category
                          ? colors.primary
                          : colors.surface,
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => setSelectedCategory(category)}>
                  <Text
                    style={[
                      styles.filterChipText,
                      {
                        color:
                          selectedCategory === category ? '#fff' : colors.text,
                      },
                    ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, {color: colors.text}]}>
              Price:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterOptions}>
              {priceRanges.map(range => (
                <TouchableOpacity
                  key={range}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor:
                        priceRange === range ? colors.primary : colors.surface,
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => setPriceRange(range)}>
                  <Text
                    style={[
                      styles.filterChipText,
                      {color: priceRange === range ? '#fff' : colors.text},
                    ]}>
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  grid: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 12,
    marginBottom: 8,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 2,
  },
  quantityButton: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  quantityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SearchScreen;
