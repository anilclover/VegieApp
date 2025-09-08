import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { RazorpayService } from '../services/RazorpayService';

const PaymentTest = () => {
  const testPayment = async () => {
    try {
      const orderId = RazorpayService.generateOrderId();
      const response = await RazorpayService.processPayment(
        100, // ₹100
        orderId,
        {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        }
      );
      
      Alert.alert(
        'Payment Success!',
        `Payment ID: ${response.razorpay_payment_id}\nOrder ID: ${response.razorpay_order_id}`
      );
    } catch (error: any) {
      Alert.alert('Payment Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Razorpay Integration Test</Text>
      <TouchableOpacity style={styles.button} onPress={testPayment}>
        <Text style={styles.buttonText}>Test Payment (₹100)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentTest;