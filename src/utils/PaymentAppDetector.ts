import { Linking } from 'react-native';

export interface PaymentApp {
  name: string;
  packageName: string;
  scheme: string;
  isInstalled: boolean;
}

const PAYMENT_APPS = [
  { name: 'Google Pay', packageName: 'com.google.android.apps.nfc.payment', scheme: 'tez://' },
  { name: 'PhonePe', packageName: 'com.phonepe.app', scheme: 'phonepe://' },
  { name: 'Paytm', packageName: 'net.one97.paytm', scheme: 'paytmmp://' },
  { name: 'Amazon Pay', packageName: 'in.amazon.mShop.android.shopping', scheme: 'amazonpay://' },
  { name: 'MobiKwik', packageName: 'com.mobikwik_new', scheme: 'mobikwik://' },
  { name: 'FreeCharge', packageName: 'com.freecharge.android', scheme: 'freecharge://' },
  { name: 'BHIM', packageName: 'in.org.npci.upiapp', scheme: 'bhim://' },
  { name: 'SBI Pay', packageName: 'com.sbi.upi', scheme: 'sbi://' },
  { name: 'HDFC PayZapp', packageName: 'com.hdfc.payzapp', scheme: 'payzapp://' },
  { name: 'ICICI Pockets', packageName: 'com.icici.pockets', scheme: 'pockets://' },
  { name: 'Axis Pay', packageName: 'com.axis.mobile', scheme: 'axismobile://' },
];

export class PaymentAppDetector {
  static async getInstalledPaymentApps(): Promise<PaymentApp[]> {
    const installedApps: PaymentApp[] = [];

    for (const app of PAYMENT_APPS) {
      try {
        const canOpen = await Linking.canOpenURL(app.scheme);
        installedApps.push({
          ...app,
          isInstalled: canOpen,
        });
      } catch (error) {
        installedApps.push({
          ...app,
          isInstalled: false,
        });
      }
    }

    return installedApps.filter(app => app.isInstalled);
  }

  static async openPaymentApp(scheme: string, fallbackUrl?: string): Promise<boolean> {
    try {
      const canOpen = await Linking.canOpenURL(scheme);
      if (canOpen) {
        await Linking.openURL(scheme);
        return true;
      } else if (fallbackUrl) {
        await Linking.openURL(fallbackUrl);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error opening payment app:', error);
      return false;
    }
  }
}