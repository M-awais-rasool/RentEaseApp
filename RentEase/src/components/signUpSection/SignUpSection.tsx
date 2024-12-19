import {View, Text, ScrollView, Image} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {InputText} from '../customInputText';
import {CustomButton} from '../customButton';
import {Validations} from '../../constants';
import {isNetworkAvailable} from '../../api';
import {SignUp} from '../../services';
import Theme from '../../theme/Theme';
import {useToast} from 'react-native-toasty-toast';

const SignUpSection = ({onPress}: any) => {
  const {showToast} = useToast();
  // All States
  const [isSecure, setIsSecure] = useState<boolean>(false);
  // Main States
  const [textName, setTextName] = useState<string>('');
  const [textEmail, setTextEmail] = useState<string>('');
  const [textPassword, setTextPassword] = useState<string>('');

  // Error States
  const [errorEmail, setErrorEmail] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string>('');
  const [errorName, setErrorName] = useState<string>('');

  const isAllValid = () => {
    let isValid = true;

    setErrorEmail('');
    setErrorPassword('');
    setErrorName('');
    if (textName == '') {
      isValid = false;
      setErrorName('*Please enter Name!');
    } else if (!Validations.isValidEmail(textEmail)) {
      isValid = false;
      setErrorEmail('*Please enter valid email!');
    } else if (!Validations.isValidPassword(textPassword)) {
      isValid = false;
      setErrorPassword(
        '*Password must have 8 characters with 1 speacial character 1 capital 1 small and 1 number!',
      );
    }

    return isValid;
  };

  const doLogin = async () => {
    const isConnected: boolean = await isNetworkAvailable();
    if (isConnected) {
      try {
        let data = {
          name: textName,
          Email: textEmail,
          Password: textPassword,
        };
        const res = await SignUp(data);
        if (res.data.status == 'success') {
          showToast(res.data.message, 'success', 'top', 1000);
          onPress();
        }
      } catch (err: any) {
        showToast(err.response.data.message, 'error', 'bottom', 1000);
        console.log(err.response.data);
      }
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Image source={Theme.icons.logo} style={styles.logo} />
      <Text style={styles.loginHeading}>{'Create your account'}</Text>
      <InputText
        title="Name"
        placeholder="Enter name"
        onChangeText={setTextName}
        value={textName}
        error={errorName}
      />
      <View style={styles.marginV5} />
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
      <CustomButton
        title="Sign up"
        onClick={() => {
          if (isAllValid()) {
            doLogin();
          }
        }}
      />
      <View style={styles.marginV5} />
      <CustomButton
        title="Login"
        onClick={() => onPress()}
        bgStyle={{backgroundColor: Theme.colors.bgColor3}}
        textStyle={{color: Theme.colors.white}}
      />
    </ScrollView>
  );
};

export default SignUpSection;
