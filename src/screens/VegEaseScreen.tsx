import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../context/ThemeContext';
import {useCart} from '../context/CartContext';
import {useNavigation} from '@react-navigation/native';
import {vegetables, fruits, oils, flashDeals} from '../data/products';

const VegEaseScreen = () => {
  const {colors, isDark, toggleTheme} = useTheme();
  const {cart, addToCart, removeFromCart, getTotalPrice, getUniqueItemsCount} =
    useCart();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

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
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.avatar, {backgroundColor: colors.primary}]}
            onPress={() => navigation.navigate('Profile' as never)}>
            <Text style={styles.avatarText}>JD</Text>
          </TouchableOpacity>

          <View style={styles.addressContainer}>
            <Text style={[styles.address, {color: colors.text}]}>
              123 Main St, City
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.searchButton, {backgroundColor: colors.surface}]}
            onPress={() => navigation.navigate('SearchScreen' as never)}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>
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
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Oils</Text>
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
      {Object.keys(cart).length > 0 && (
        <TouchableOpacity
          style={[styles.cartSummary, {backgroundColor: colors.primary}]}
          onPress={() => navigation.navigate('Cart' as never)}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartCount}>{getUniqueItemsCount()} items</Text>
            <Text style={styles.cartTotal}>₹{getTotalPrice()}</Text>
          </View>
          <Text style={styles.viewCart}>View Cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VegEaseScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  topSection: {
    marginBottom: 20,
    marginTop: 10,
  },
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
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addressContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  address: {
    fontSize: 14,
    opacity: 0.8,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 16,
  },
  grid: {
    paddingHorizontal: 8,
  },
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
  cardContent: {
    padding: 12,
    alignItems: 'center',
    position: 'relative',
  },
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
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
    marginTop: 30,
  },
  vegName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  unit: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
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
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
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
  cartInfo: {
    flex: 1,
  },
  cartCount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cartTotal: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewCart: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
