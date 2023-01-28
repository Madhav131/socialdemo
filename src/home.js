import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import messaging from '@react-native-firebase/messaging';
import {
  LoginButton,
  AccessToken,
  Profile,
  LoginManager,
} from 'react-native-fbsdk-next';

const Home = props => {
  const [fcmToken, setFCMToken] = useState('');

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    console.log('Authorization enabled:', enabled);

    if (enabled == 1 || enabled == 2) {
      getFcmToken();
    } else {
      requestUserPermission();
    }
  };

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('----fcm token ----', fcmToken);
      setFCMToken(fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  const [googledata, setgoogledata] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      // webClientId:
      //   Platform.OS === 'ios'
      //     ? '1039730284274-70f8mrd9d73p9qa3otkum4ughrst67a0.apps.googleusercontent.com'
      //     : '292691400107-p269upjair6l8ld271dt3pu3dqts575t.apps.googleusercontent.com',
      androidClientId:
        '581425840773-vhib26l3h0f0ti40e0vf207dap7jcp84.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      setgoogledata(userInfo);
      console.log('googledetails', userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  const fbLogin = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      login => {
        console.log('login-=-=>', login);
        if (login.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            console.log('---fb ', data);
            const accessToken = data.accessToken.toString();
            // getInfoFromToken(accessToken);
          });
        }
      },
      error => {
        console.log('Login fail with error: ', error);
      },
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => {
          signIn();
        }}
        style={{
          width: '90%',
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
          borderWidth: 1,
          backgroundColor: 'blue',
          marginTop: 30,
        }}>
        <Text style={{color: 'white'}}>Google Signin</Text>
      </TouchableOpacity>
      <View style={{marginTop: 20}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>
          {googledata == 0 ? '' : googledata.user.email}
        </Text>
      </View>
      <View style={{marginTop: 20}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>
          {googledata == 0 ? '' : googledata.user.familyName}
        </Text>
      </View>
      <View style={{marginTop: 20}}>
        {googledata == 0 ? null : (
          <Image
            style={{width: 100, height: 100, borderRadius: 100}}
            resizeMode="contain"
            source={{
              uri: googledata.user.photo == 'null' ? '' : googledata.user.photo,
            }}
          />
        )}
      </View>
      {/* <LoginButton
        onLoginFinished={(error, result) => {
          if (error) {
            console.log(
              'login has error: ' + JSON.stringify(result.error, null, 2),
            );
          } else if (result.isCancelled) {
            console.log('login is cancelled.');
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              console.log(data.accessToken.toString());
            });
            const currentProfile = Profile.getCurrentProfile().then(function (
              currentProfile,
            ) {
              if (currentProfile) {
                console.log(
                  'The current logged user is: ' +
                    currentProfile.name +
                    '. His profile id is: ' +
                    currentProfile.userID,
                );
              }
            });
          }
        }}
        onLogoutFinished={() => console.log('logout.')}
      /> */}
      <TouchableOpacity
        onPress={() => {
          fbLogin();
        }}>
        <Text style={{color: 'blue'}}>Facebook</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
