// // src/auth/facebookSignIn.ts
// import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';


// export const signInWithFacebook = async () => {
//   try {
//     const result = await LoginManager.logInWithPermissions([
//       'public_profile',
//       'email',
//     ]);
//     if (result.isCancelled) throw new Error('User cancelled the login');

//     const data = await AccessToken.getCurrentAccessToken();
//     if (!data) throw new Error('Unable to get access token');

//     const userProfile = await Profile.getCurrentProfile();
//     return {
//       name: userProfile?.name,
//       userID: userProfile?.userID,
//       accessToken: data.accessToken.toString(),
//     };
//   } catch (error: any) {
//     console.error('❌ Facebook Login Error:', error);
//     throw error;
//   }
// };
