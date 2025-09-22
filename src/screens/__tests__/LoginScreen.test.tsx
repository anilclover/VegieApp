import React from 'react';
import {render, screen} from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

describe('LoginScreen', () => {
  it('renders correctly', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Luxury You Aspire')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter Mobile Number')).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();
  });

  it('displays phone number prefix', () => {
    render(<LoginScreen />);
    expect(screen.getByText('+91')).toBeTruthy();
  });

  it('displays terms and privacy policy links', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Terms of Service')).toBeTruthy();
    expect(screen.getByText('Privacy Policy')).toBeTruthy();
  });

  it('displays support contact link', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Contact Support')).toBeTruthy();
  });

  it('has correct keyboard type for phone input', () => {
    render(<LoginScreen />);
    const input = screen.getByPlaceholderText('Enter Mobile Number');
    expect(input.props.keyboardType).toBe('phone-pad');
  });
});
