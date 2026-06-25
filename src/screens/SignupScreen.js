import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {
  primaryColor,
  backgroundColor,
  textColor,
  placeholderColor,
  globalStyle,
} from '../utils/GlobalStyle';
import { postService } from '../utils/Api';
import Loading from '../components/Loading';

const SignupScreen = ({ navigation }) => {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const [data, setData] = useState(initialState);
  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (validate() === false) {
      setIsLoading(false);
      return;
    }

    try {
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];

      const existingUser = users.find(
        user => user.email.toLowerCase() === data.email.toLowerCase(),
      );

      if (existingUser) {
        setErrMsg('Email already exists');
        setIsLoading(false);
        return;
      }

      const newUser = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };

      users.push(newUser);

      await AsyncStorage.setItem('users', JSON.stringify(users));

      setData(initialState);
      setErrMsg('');
      setIsLoading(false);

      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              setData(initialState);
              navigation.goBack();
            },
          },
        ],
      );
    } catch (error) {
      console.log(error);
      setErrMsg('Something went wrong');
      setIsLoading(false);
    }
  };
  const validate = () => {
    if (
      data.firstName.trim().length === 0 ||
      data.lastName.trim().length === 0 ||
      data.email.trim().length === 0
    ) {
      setErrMsg('All the fields are mandatory');
      return false;
    }

    //Email
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(data.email) === false) {
      setErrMsg('Incorrect email address');
      return false;
    }

    if (data.password.length < 6) {
      setErrMsg('Password must be of atleast 6 characters');
      return false;
    }
    if (data.password !== data.confirmPassword) {
      setErrMsg('Passwords must match');
      return false;
    }

    return true;
  };

  return (
    <>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Loading />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <AntDesign name="adduser" size={25} color={primaryColor} />
            <Text style={styles.text}>Create an account</Text>
          </View>

          <FormInput
            onChangeText={text => handleChange('firstName', text)}
            placeholderText="First Name"
            iconType="form"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={placeholderColor}
          />

          <FormInput
            onChangeText={text => handleChange('lastName', text)}
            placeholderText="Last Name"
            iconType="form"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={placeholderColor}
          />

          <FormInput
            onChangeText={text => handleChange('email', text)}
            placeholderText="Email"
            iconType="mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={placeholderColor}
          />

          <FormInput
            // labelValue={password}
            onChangeText={text => handleChange('password', text)}
            placeholderText="Password"
            iconType="lock"
            secureTextEntry={true}
          />

          <FormInput
            // labelValue={confirmPassword}
            onChangeText={text => handleChange('confirmPassword', text)}
            placeholderText="Confirm Password"
            iconType="lock"
            secureTextEntry={true}
          />

          {errMsg.trim().length !== 0 && (
            <Text style={globalStyle.error}>{errMsg}</Text>
          )}

          <FormButton buttonTitle="Sign Up" onPress={() => handleSubmit()} />

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.navButtonText}>Have an account? Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundColor,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: backgroundColor,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 25,
    marginLeft: 5,
    color: '#E9FBFF',
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: primaryColor,
    fontFamily: 'Lato-Regular',
  },
});
