import React, {useState, useRef, useEffect} from 'react';
import {Animated, ImageBackground} from 'react-native';
import styles from './styles';
import Theme from '../../../theme/Theme';
import {LoginSection, SignUpSection} from '../../../components';

const LoginScreen = () => {
  const [flag, setFlag] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleToggle = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setFlag(!flag);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <ImageBackground source={Theme.icons.landingImg} style={styles.container}>
      <Animated.View style={[styles.sectionContainer, {opacity}]}>
        {!flag ? (
          <LoginSection onPress={handleToggle} />
        ) : (
          <SignUpSection onPress={handleToggle} />
        )}
      </Animated.View>
    </ImageBackground>
  );
};

export default LoginScreen;
