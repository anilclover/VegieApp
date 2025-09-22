import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import VegEaseScreen from '../VegEaseScreen';

// Mock dependencies
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#fff',
      surface: '#f5f5f5',
      text: '#000',
      primary: '#007bff',
    },
  }),
}));

jest.mock('../../context/CartContext', () => ({
  useCart: () => ({
    cart: {},
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    getTotalPrice: jest.fn(() => 0),
    getUniqueItemsCount: jest.fn(() => 0),
  }),
}));

jest.mock('../../data/products', () => ({
  vegetables: [
    {id: '1', name: 'Tomato', price: 30, originalPrice: 35, emoji: '🍅', unit: '1 kg'},
  ],
  fruits: [
    {id: '2', name: 'Apple', price: 120, originalPrice: 150, emoji: '🍎', unit: '1 kg'},
  ],
  oils: [],
  flashDeals: [],
}));

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
}));

jest.mock('../../constants/Constants', () => ({
  CURRENT_LOCATION: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=',
  GOOGLE_MAPS_KEY: 'test-key',
}));

describe('VegEaseScreen', () => {
  it('renders correctly', () => {
    render(<VegEaseScreen />);
    expect(screen.getByText('Vegetables')).toBeTruthy();
    expect(screen.getByText('Fruits')).toBeTruthy();
  });

  it('displays avatar with initials', () => {
    render(<VegEaseScreen />);
    expect(screen.getByText('JD')).toBeTruthy();
  });

  it('shows search icon', () => {
    render(<VegEaseScreen />);
    expect(screen.getByText('🔍')).toBeTruthy();
  });

  it('displays product items', () => {
    render(<VegEaseScreen />);
    expect(screen.getByText('Tomato')).toBeTruthy();
    expect(screen.getByText('Apple')).toBeTruthy();
  });

  it('shows ADD button for products', () => {
    render(<VegEaseScreen />);
    const addButtons = screen.getAllByText('ADD');
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it('displays product prices', () => {
    render(<VegEaseScreen />);
    expect(screen.getByText('₹30')).toBeTruthy();
    expect(screen.getByText('₹120')).toBeTruthy();
  });

  it('shows discount badges', () => {
    render(<VegEaseScreen />);
    expect(screen.getByText('14% OFF')).toBeTruthy(); // (35-30)/35 * 100
    expect(screen.getByText('20% OFF')).toBeTruthy(); // (150-120)/150 * 100
  });
});