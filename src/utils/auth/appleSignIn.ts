import { appleAuth } from '@invertase/react-native-apple-authentication'; 

export const signInWithApple = async () => {
  try {
    // Start Apple Sign-In request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Get identity token and user info
    const {identityToken, email, fullName, user} = appleAuthRequestResponse;

    if (!identityToken) {
      throw new Error('Apple Sign-In failed - no identity token returned');
    }

    // You can send identityToken to your backend for authentication
    console.log('✅ Apple User ID:', user);
    console.log('✅ Email:', email);
    console.log('✅ Full Name:', fullName);
    console.log('✅ Identity Token:', identityToken);

    return {
      userId: user,
      email,
      fullName,
      identityToken,
    };
  } catch (error) {
    console.error('❌ Apple Sign-In Error:', error);
    throw error;
  }
};

// // src/auth/appleSignIn.ts
// import {appleAuth} from '@invertase/react-native-apple-authentication';

// export const signInWithApple = async () => {
//   try {
//     const appleAuthRequestResponse = await appleAuth.performRequest({
//       requestedOperation: appleAuth.Operation.LOGIN,
//       requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
//     });

//     const {user, email, fullName, identityToken} = appleAuthRequestResponse;
//     return {
//       user,
//       email,
//       fullName,
//       identityToken,
//     };
//   } catch (error: any) {
//     console.error('❌ Apple Sign-In Error:', error);
//     throw error;
//   }
// };
