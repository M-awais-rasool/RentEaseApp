import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Constants} from '../constants';
import {
  SplashScreen,
  LoginScreen,
} from '../screens';
import SignUpScreen from '../screens/auth/signupScreen';
import {SafeAreaView} from 'react-native';
import {BottomTabs} from './BottomTab';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName={Constants.SPLASH_SCREEN}
        screenOptions={({navigation, route}) => ({})}>
        <Stack.Screen
          name={Constants.SPLASH_SCREEN}
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.SIGNUP_SCREEN}
          component={SignUpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.LOGIN_SCREEN}
          component={LoginScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default AppNavigator;
