import React, { Dispatch, SetStateAction, memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Background from '../../core.native/Background';
import Logo from '../../core.native/Logo';
import Header from '../../core.native/Header';
import Button from '../../core.native/Button';
import TextInput from '../../core.native/TextInput';
import BackButton from '../../core.native/BackButton';
import { theme } from '../../styles/theme';
import { Navigation, FormType, recoveryFormData } from '@libs/shared-types';
import useForm from '../../hooks/useForm';

interface ForgotPasswordProps {
  navigation: Navigation;
  setFormType: Dispatch<SetStateAction<FormType>>;
}

const ForgotPassword = ({ navigation }: ForgotPasswordProps) => {
  const { handlers, onSubmit, errors } = useForm(
    {
      email: '',
    },
    recoveryFormData,
    'recovery',
    'native'
  );

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('Login')} />

      <Logo />

      <Header>Restore Password</Header>

      <TextInput
        label="Email"
        returnKeyType="next"
        onChangeText={handlers.email as (text: string) => void}
        error={!!errors.email}
        errorText={errors.email}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <Button mode="contained" onPress={onSubmit} style={styles.button}>
        Send Reset Instructions
      </Button>

      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.label}>← Back to login</Text>
      </TouchableOpacity>
    </Background>
  );
};

const styles = StyleSheet.create({
  back: {
    width: '100%',
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
  label: {
    color: theme.colors.secondary,
    width: '100%',
  },
});

export default memo(ForgotPassword);
