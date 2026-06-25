import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {
  primaryColor,
  backgroundColor,
  cardBackground,
  textColor,
  placeholderColor,
  globalStyle,
} from '../utils/GlobalStyle';
import { postService } from '../utils/Api';
import Loading from '../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation, handleToken }) => {
  let initialState = { email: '', password: '' };
  const [data, setData] = useState(initialState);
  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (data.email.trim() === '' || data.password.trim() === '') {
      setErrMsg('All the fields are mandatory');
      setIsLoading(false);
      return;
    }

    try {
      const usersData = await AsyncStorage.getItem('users');

      if (!usersData) {
        setErrMsg('No user found. Please sign up first.');
        setIsLoading(false);
        return;
      }

      const users = JSON.parse(usersData);

      const user = users.find(
        item =>
          item.email.toLowerCase() === data.email.toLowerCase() &&
          item.password === data.password,
      );

      if (!user) {
        setErrMsg('Invalid credentials');
        setIsLoading(false);
        return;
      }

      // Save current logged in user
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));

      setData(initialState);
      setErrMsg('');
      setIsLoading(false);

      // Fake token for existing app flow
      handleToken('LOCAL_USER');
    } catch (error) {
      console.log(error);
      setErrMsg('Login failed');
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Loading />
        </View>
      ) : (
        <View style={styles.container}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.text}>Expense Tracker</Text>
          <Text style={styles.subtitle}>
            Secure payments, get instant insights
          </Text>

          <FormInput
            // labelValue={email}
            onChangeText={text => handleChange('email', text)}
            placeholderText="Email"
            iconType="user"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormInput
            // labelValue={password}
            onChangeText={text => handleChange('password', text)}
            placeholderText="Password"
            iconType="lock"
            secureTextEntry={true}
          />

          {errMsg.trim().length !== 0 && (
            <Text style={globalStyle.error}>{errMsg}</Text>
          )}

          <FormButton buttonTitle="Sign In" onPress={() => handleSubmit()} />

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => navigation.navigate('Sign-up')}
          >
            <Text style={styles.navButtonText}>
              Don't have an acount? Create here
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: backgroundColor,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: backgroundColor,
  },
  logo: {
    height: 120,
    width: 120,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 30,
    marginBottom: 6,
    color: '#F8FDFE',
  },
  subtitle: {
    color: '#A0C4D4',
    fontSize: 14,
    marginBottom: 18,
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: primaryColor,
    fontFamily: 'Lato-Regular',
  },
});
