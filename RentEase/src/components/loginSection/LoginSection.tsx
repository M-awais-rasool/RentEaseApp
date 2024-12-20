import {View, Text, ScrollView, Image} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {InputText} from '../customInputText';
import {CustomButton} from '../customButton';
import {Constants, Validations} from '../../constants';
import {useMutation} from '@tanstack/react-query';
import {AxiosError, AxiosResponse} from 'axios';
import {SignIn} from '../../services';
import {saveToken} from '../../api/api';
import {saveDataToCachedWithKey} from '../../module/cacheData';
import {AppConstants} from '../../module';
import {useToast} from 'react-native-toasty-toast';
import Theme from '../../theme/Theme';
import {useNavigation} from '@react-navigation/native';

type SignInData = {Email: string; Password: string};
type SignInResponse = {
  token: string;
  userId: string;
  name: string;
  message: string;
};

const LoginSection = ({onPress}: any) => {
  const {showToast} = useToast();
  const nav: any = useNavigation();
  const [textEmail, setTextEmail] = useState<string>('');
  const [textPassword, setTextPassword] = useState<string>('');
  const [errorEmail, setErrorEmail] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string>('');
  const [isSecure, setIsSecure] = useState<boolean>(false);

  const isAllValid = () => {
    let isValid = true;
    setErrorEmail('');
    setErrorPassword('');

    if (!Validations.isValidEmail(textEmail)) {
      isValid = false;
      setErrorEmail('*Please enter a valid email!');
    } else if (!Validations.isValidPassword(textPassword)) {
      isValid = false;
      setErrorPassword(
        '*Password must have 8 characters with 1 special character, 1 capital, 1 small, and 1 number!',
      );
    }
    return isValid;
  };

  const loginMutation = useMutation<
    AxiosResponse<SignInResponse>,
    AxiosError,
    SignInData
  >({
    mutationFn: SignIn,
    onSuccess: async (response: any) => {
      const data = response.data;
      await saveToken(data.data.token);
      await saveDataToCachedWithKey(
        AppConstants.AsyncKeyLiterals.loginToken,
        data.data.token,
      );
      await saveDataToCachedWithKey(
        AppConstants.AsyncKeyLiterals.isLoggedIn,
        true,
      );
      await saveDataToCachedWithKey(
        AppConstants.AsyncKeyLiterals.userId,
        data.data.userId,
      );
      showToast(data.message, 'success', 'top', 1000);
      nav.navigate(Constants.BOTTOM_TABS);
    },
    onError: (error: any) => {
      showToast(error.response.data.message, 'error', 'bottom', 1000);
      console.error('Login failed:', error.response.data.message);
    },
  });

  const handleLogin = () => {
    if (isAllValid()) {
      loginMutation.mutate({Email: textEmail, Password: textPassword});
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Image source={Theme.icons.logo} style={styles.logo} />
      <Text style={styles.loginHeading}>{'Login your account'}</Text>
      <View style={styles.marginV10} />
      <InputText
        title="E-mail"
        placeholder="Enter email"
        onChangeText={setTextEmail}
        value={textEmail}
        error={errorEmail}
      />
      <View style={styles.marginV5} />
      <InputText
        title="Password"
        placeholder="Enter password"
        onChangeText={setTextPassword}
        value={textPassword}
        error={errorPassword}
      />
      <View style={styles.marginV10} />
      <View style={styles.marginV5} />
      <CustomButton title="Login" onClick={() => handleLogin()} />
      <View style={styles.marginV5} />
      <CustomButton
        title="Sign up"
        onClick={() => onPress()}
        bgStyle={{backgroundColor: Theme.colors.bgColor12}}
        textStyle={{color: Theme.colors.white}}
      />
    </ScrollView>
  );
};

export default LoginSection;
