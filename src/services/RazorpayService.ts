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
  private static readonly RAZORPAY_KEY = 'rzp_test_11Hg5CO4Hz3bhk';

  static async initiatePayment(options: {
    amount: number;
    currency: string;
    order_id: string;
    name: string;
    description: string;
    prefill: {
      email: string;
      contact: string;
    };
  }): Promise<PaymentResponse> {
    const razorpayOptions = {
      description: options.description,
      currency: options.currency,
      key: this.RAZORPAY_KEY,
      amount: options.amount,
      name: options.name,
      order_id: options.order_id,
      prefill: {
        email: options.prefill.email,
        contact: options.prefill.contact,
        name: 'Customer',
      },
      theme: { color: '#528FF0' },
    };

    try {
      const data = await RazorpayCheckout.open(razorpayOptions);
      return {
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_order_id: data.razorpay_order_id || options.order_id,
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

  static async processPayment(
    amount: number,
    orderId: string,
    customerDetails: {
      name: string;
      email: string;
      contact: string;
    }
  ): Promise<PaymentResponse> {
    return this.initiatePayment({
      amount: amount * 100,
      currency: 'INR',
      order_id: orderId,
      name: 'VegieApp',
      description: 'Grocery Order Payment',
      prefill: {
        email: customerDetails.email,
        contact: customerDetails.contact,
      },
    });
  }

  static async mockPayment(
    amount: number,
    orderId: string
  ): Promise<PaymentResponse> {
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