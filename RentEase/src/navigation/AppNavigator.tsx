import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Constants} from '../constants';
import {SplashScreen, LoginScreen, LandingScreen, SearchData} from '../screens';
import {SafeAreaView} from 'react-native';
import BottomTabs from './BottomTab';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName={Constants.SPLASH_SCREEN}
        screenOptions={({navigation, route}) => ({})}>
        <Stack.Screen
          name={Constants.LANDING_SCREEN}
          component={LandingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.SPLASH_SCREEN}
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.LOGIN_SCREEN}
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.SEARCH_DATA_SCREEN}
          component={SearchData}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={Constants.BOTTOM_TABS}
          component={BottomTabs}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default AppNavigator;
