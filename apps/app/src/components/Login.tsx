import React, { Dispatch, SetStateAction, ChangeEvent } from 'react';

import { createStyles, makeStyles } from '@mui/styles';
import { Button, DialogContent, TextField } from '@mui/material';

import { FormType, loginFormData } from '@libs/shared-types';
import { AuthButton } from './AuthButton';
import { useFormAuth } from '../hooks/useFormAuth';
//import { useOAuthFlow } from '../../hooks/useOAuth';

interface LoginProps {
  setFormType: Dispatch<SetStateAction<FormType>>;
}

const Login = ({ setFormType }: LoginProps) => {
  const {
    isSuccess,
    isFailed,
    isLoading,
    handlers,
    onSubmit,
    errors,
  } = useFormAuth(
    {
      nameOrEmail: '',
      password: '',
    },
    loginFormData,
    'login'
  );
  //const { openSignInWindow } = useOAuthFlow();
  const openSignInWindow = (s: string) => console.log(s);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <DialogContent sx={{ overflow: 'hidden' }}>
        <TextField
          variant="outlined"
          label="Username or E-mail"
          onChange={
            handlers.nameOrEmail as (e: ChangeEvent<HTMLInputElement>) => void
          }
          id="nameOrEmail"
          type="text"
          error={!!errors.nameOrEmail}
          helperText={errors.nameOrEmail}
          fullWidth
          margin="normal"
        />
        <TextField
          variant="outlined"
          key="password"
          onChange={
            handlers.password as (e: ChangeEvent<HTMLInputElement>) => void
          }
          margin="normal"
          id="password"
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
        />
        <Button
          sx={{ alignSelf: 'right' }}
          onClick={() => setFormType('recovery')}
          variant="text"
          size="small"
        >
          Fogot password?
        </Button>
        <AuthButton
          isLoading={isLoading}
          isSuccess={isSuccess}
          isFailed={isFailed}
          onClick={onSubmit}
        >
          Login
        </AuthButton>
        <AuthButton
          socialType="github"
          onClick={() => openSignInWindow('http://localhost:3070/auth/github')}
        >
          Login with GitHub
        </AuthButton>
        <AuthButton
          socialType="google"
          onClick={() => openSignInWindow('http://localhost:3070/auth/google')}
        >
          Login with Google
        </AuthButton>
      </DialogContent>

      <Button
        onClick={() => setFormType('signup')}
        sx={{ textTransform: 'none' }}
        variant="text"
        size="small"
      >
        New here? Make an Account!
      </Button>
    </div>
  );
};

export default Login;
