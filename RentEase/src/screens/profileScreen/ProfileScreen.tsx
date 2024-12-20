import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  useEffect(() => {
    AsyncStorage.clear();
  }, []);
  return (
    <View>
      <Text>ProfileScreen</Text>
    </View>
  );
};

export default ProfileScreen;
