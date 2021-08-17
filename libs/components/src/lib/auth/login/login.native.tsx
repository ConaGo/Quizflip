import React, { Dispatch, SetStateAction, memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Background from '../../core.native/Background';
import Logo from '../../core.native/Logo';
import Header from '../../core.native/Header';
import Button from '../../core.native/Button';
import TextInput from '../../core.native/TextInput';
import BackButton from '../../core.native/BackButton';
import { theme } from '../../styles/theme';
import { Navigation, FormType, loginFormData } from '@libs/shared-types';
import { useForm } from '../../hooks/useForm';
import useTry from '../../hooks/useTry';
import axios from 'axios';

interface LoginProps {
  navigation: Navigation;
  setFormType: Dispatch<SetStateAction<FormType>>;
}

export const LoginNative = ({ navigation }: LoginProps) => {
  const { handlers, onSubmit, errors, validator } = useForm(
    {
      nameOrEmail: '',
      password: '',
    },
    loginFormData,
    'login',
    'native'
  );
  const { submittter, i } = useTry();

  const onSubmit2 = async () => {
    try {
      const response3 = await axios({
        method: 'post',
        url: '/auth/',
        data: { f: 'd' },
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        baseURL: 'http://10.0.2.2:3070',
      });
    } catch (err) {
      console.log(err);
    }
  };
  const useTry2 = async () => {
    const response3 = await axios({
      method: 'post',
      url: '/auth/',
      data: { f: 'd' },
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      baseURL: 'http://10.0.2.2:3070',
    });
    console.log(response3);
  };
  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('Home')} />

      <Logo />

      <Header>Welcome back.</Header>

      <TextInput
        label="Username or E-mail"
        onChangeText={handlers.nameOrEmail as (text: string) => void}
        error={!!errors.nameOrEmail}
        errorText={errors.nameOrEmail}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        returnKeyType="next"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        onChangeText={handlers.password as (text: string) => void}
        error={!!errors.password}
        errorText={errors.password}
        secureTextEntry
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={submittter}>
        Login
      </Button>

      <Button mode="contained" onPress={validator}>
        Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});
export default memo(LoginNative);
