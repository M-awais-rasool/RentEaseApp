import {View, Text, ImageBackground} from 'react-native';
import React from 'react';
import Theme from '../../../theme/Theme';
import styles from './styles';
import {CustomButton} from '../../../components';
import {Constants} from '../../../constants';

const LandingScreen = (props: any) => {
  return (
    <ImageBackground source={Theme.icons.landingImg} style={styles.container}>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>{'Unlock More Together'}</Text>
        <Text style={styles.subtitle}>
          {
            ' Discover a world where everything is shared! Rent and lend anything you need or want—from tools to tech—right in your community. Save money, earn extra, and reduce waste. Start sharing, start thriving!'
          }
        </Text>
        <CustomButton
          title="Get Started"
          onClick={() => props.navigation.navigate(Constants.LOGIN_SCREEN)}
        />
      </View>
    </ImageBackground>
  );
};

export default LandingScreen;
