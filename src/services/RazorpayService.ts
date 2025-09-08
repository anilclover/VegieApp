import RazorpayCheckout from 'react-native-razorpay';

export interface RazorpayOptions {
  description: string;
  image: string;
  currency: string;
  key: string;
  amount: number;
  name: string;
  order_id?: string;
  prefill: {
    email: string;
    contact: string;
    name: string;
  };
  theme: {
    color: string;
  };
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export class RazorpayService {
  private static readonly RAZORPAY_KEY = 'rzp_test_11Hg5CO4Hz3bhk'; // Valid test key

  static async processPayment(
    amount: number,
    orderId: string,
    customerDetails: {
      name: string;
      email: string;
      contact: string;
    }
  ): Promise<PaymentResponse> {
    const options: RazorpayOptions = {
      description: 'VegieApp Order Payment',
      currency: 'INR',
      key: this.RAZORPAY_KEY,
      amount: amount * 100, // Convert to paise
      name: 'VegieApp',
      prefill: {
        email: customerDetails.email,
        contact: customerDetails.contact,
        name: customerDetails.name,
      },
      theme: { color: '#4CAF50' },
    };

    try {
      const data = await RazorpayCheckout.open(options);
      return {
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_order_id: data.razorpay_order_id || orderId,
        razorpay_signature: data.razorpay_signature,
      };
    } catch (error: any) {
      console.log('Razorpay Error:', error);
      if (error.code === 'PAYMENT_CANCELLED') {
        throw new Error('Payment was cancelled by user');
      }
      throw new Error(error.description || error.message || 'Payment failed');
    }
  }

  static generateOrderId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static async mockPayment(
    amount: number,
    orderId: string
  ): Promise<PaymentResponse> {
    // Fallback mock payment for testing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          razorpay_payment_id: `pay_${Date.now()}`,
          razorpay_order_id: orderId,
          razorpay_signature: `sig_${Date.now()}`,
        });
      }, 1000);
    });
  }
}