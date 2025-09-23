import ReactNativeBiometrics from 'react-native-biometrics';

export interface BiometricResult {
  success: boolean;
  error?: string;
  biometryType?: string;
}

class BiometricService {
  private rnBiometrics = new ReactNativeBiometrics();

  async isBiometricAvailable(): Promise<BiometricResult> {
    try {
      const {available, biometryType} = await this.rnBiometrics.isSensorAvailable();
      
      if (available) {
        return {
          success: true,
          biometryType: biometryType || 'Unknown',
        };
      } else {
        return {
          success: false,
          error: 'Biometric authentication not available',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to check biometric availability',
      };
    }
  }

  async authenticate(reason: string = 'Authenticate to continue'): Promise<BiometricResult> {
    try {
      const {success} = await this.rnBiometrics.simplePrompt({
        promptMessage: reason,
        cancelButtonText: 'Cancel',
      });

      if (success) {
        return {success: true};
      } else {
        return {
          success: false,
          error: 'Authentication cancelled or failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Biometric authentication error',
      };
    }
  }

  async createKeys(): Promise<BiometricResult> {
    try {
      const {publicKey} = await this.rnBiometrics.createKeys();
      return {
        success: true,
        biometryType: publicKey,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create biometric keys',
      };
    }
  }

  async deleteKeys(): Promise<BiometricResult> {
    try {
      const {keysDeleted} = await this.rnBiometrics.deleteKeys();
      return {success: keysDeleted};
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete biometric keys',
      };
    }
  }
}

export default new BiometricService();