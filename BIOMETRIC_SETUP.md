# Biometric Authentication Setup

## Features Implemented
- **Face ID/Touch ID** support for iOS
- **Fingerprint** authentication for Android
- **Biometric availability** checking
- **Secure key management**
- **Fallback to password** login

## Files Created
- `src/services/BiometricService.ts` - Core biometric service
- `src/screens/BiometricLoginScreen.tsx` - Biometric login screen
- `src/components/BiometricButton.tsx` - Reusable biometric button

## Usage

### Basic Authentication
```typescript
import BiometricService from '../services/BiometricService';

const authenticate = async () => {
  const result = await BiometricService.authenticate('Login to VegEase');
  if (result.success) {
    // Authentication successful
  }
};
```

### Check Availability
```typescript
const checkBiometric = async () => {
  const result = await BiometricService.isBiometricAvailable();
  if (result.success) {
    console.log('Biometric type:', result.biometryType);
  }
};
```

### Using BiometricButton Component
```tsx
<BiometricButton
  title="Login with Biometric"
  onSuccess={() => navigation.navigate('Main')}
  onError={(error) => console.log(error)}
/>
```

## Navigation
- Navigate to `BiometricLogin` screen for biometric authentication
- Falls back to regular `Login` screen if biometric fails

## Permissions Added
- Android: `USE_FINGERPRINT`, `USE_BIOMETRIC`
- iOS: Automatically handled by the library

## Testing
- iOS Simulator: Use Hardware > Face ID/Touch ID menu
- Android Emulator: Use extended controls for fingerprint simulation