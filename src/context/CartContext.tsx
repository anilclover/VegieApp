import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  quantity: number;
}

interface CartContextType {
  cart: {[key: string]: number};
  cartItems: CartItem[];
  addToCart: (item: {id: string; name: string; price: number; emoji: string}) => void;
  removeFromCart: (id: string) => void;
  getTotalPrice: () => string;
  getTotalItems: () => number;
  getUniqueItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [items, setItems] = useState<{[key: string]: {name: string; price: number; emoji: string}}>({});

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      const itemsData = await AsyncStorage.getItem('cartItems');
      if (cartData) setCart(JSON.parse(cartData));
      if (itemsData) setItems(JSON.parse(itemsData));
    } catch (error) {
      console.log('Error loading cart data:', error);
    }
  };

  const saveCartData = async (newCart: {[key: string]: number}, newItems: {[key: string]: {name: string; price: number; emoji: string}}) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
      await AsyncStorage.setItem('cartItems', JSON.stringify(newItems));
    } catch (error) {
      console.log('Error saving cart data:', error);
    }
  };

  const addToCart = (item: {id: string; name: string; price: number; emoji: string}) => {
    const newCart = {...cart, [item.id]: (cart[item.id] || 0) + 1};
    const newItems = {...items, [item.id]: {name: item.name, price: item.price, emoji: item.emoji}};
    setCart(newCart);
    setItems(newItems);
    saveCartData(newCart, newItems);
  };

  const removeFromCart = (id: string) => {
    const newCart = {...cart};
    if (newCart[id] > 1) {
      newCart[id]--;
    } else {
      delete newCart[id];
    }
    setCart(newCart);
    saveCartData(newCart, items);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [id, quantity]) => {
      const item = items[id];
      return total + (item ? item.price * quantity : 0);
    }, 0).toFixed(2);
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const getUniqueItemsCount = () => {
    return Object.keys(cart).length;
  };

  const cartItems: CartItem[] = Object.entries(cart).map(([id, quantity]) => ({
    id,
    quantity,
    ...items[id],
  }));

  return (
    <CartContext.Provider value={{cart, cartItems, addToCart, removeFromCart, getTotalPrice, getTotalItems, getUniqueItemsCount}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};