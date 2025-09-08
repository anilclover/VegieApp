// Mock Razorpay implementation
const RazorpayCheckout = {
  open: async (options: any) => {
    return {
      razorpay_payment_id: `pay_${Date.now()}`,
      razorpay_order_id: `order_${Date.now()}`,
      razorpay_signature: `sig_${Date.now()}`
    };
  }
};

export interface PaymentOptions {
  amount: number;
  currency?: string;
  orderId?: string;
  name: string;
  description: string;
  email?: string;
  contact?: string;
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

class PaymentService {
  private static readonly RAZORPAY_KEY = 'rzp_test_1DP5mmOlF5G5ag';

  static async initiatePayment(options: PaymentOptions): Promise<PaymentResponse> {
    const paymentOptions = {
      description: options.description,
      currency: 'INR',
      key: this.RAZORPAY_KEY,
      amount: Math.round(options.amount * 100),
      name: options.name,
      prefill: {
        email: options.email || 'test@example.com',
        contact: options.contact || '9999999999',
        name: options.name || 'Customer',
      },
      theme: {color: '#4A90E2'},
    };

    try {
      const data = await RazorpayCheckout.open(paymentOptions);
      return data as PaymentResponse;
    } catch (error: any) {
      if (error.code === 'payment_cancelled') {
        throw new Error('Payment was cancelled by user');
      }
      throw new Error(error.description || 'Payment failed');
    }
  }

  static async createOrder(amount: number): Promise<string> {
    return `order_${Date.now()}`;
  }

  static async verifyPayment(
    paymentId: string,
    orderId: string,
    signature: string
  ): Promise<boolean> {
    console.log('Verifying payment:', {paymentId, orderId, signature});
    return true;
  }
}

export default PaymentService;