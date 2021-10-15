import React, { Dispatch, SetStateAction, ChangeEvent } from 'react';

import { createStyles, makeStyles } from '@libs/mui/styles';
import {
  Button,
  Typography,
  DialogContent,
  DialogTitle,
  TextField,
} from '@libs/mui';

import { FormType, loginFormData } from '@libs/shared-types';
import { AuthButton } from '../button/AuthButton';
import { useFormHTTP } from '../../hooks/useFormHTTP';
import { useOAuthFlow } from '../../hooks/useOAuth';
const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      //overflow: 'hidden',
    },
    header: {
      marginBottom: 0,
    },
    unstyledButton: {
      textTransform: 'none',
    },
    passwordForgot: {
      alignSelf: 'right',
    },
    input: {
      '& p': {
        position: 'absolute',
        bottom: '-2em',
      },
      marginBottom: '2em',
    },
    dialog: {
      overflow: 'visible',
    },
    noWrap: {
      whiteSpace: 'nowrap',
    },
  })
);
export interface LoginProps {
  setFormType: Dispatch<SetStateAction<FormType>>;
}

export function Login({ setFormType }: LoginProps) {
  const {
    isSuccess,
    isFailed,
    isLoading,
    handlers,
    onSubmit,
    errors,
  } = useFormHTTP(
    {
      nameOrEmail: '',
      password: '',
    },
    loginFormData,
    'login',
    'web'
  );
  const classes = useStyles();
  const { openSignInWindow } = useOAuthFlow();
  return (
    <div className={classes.container}>
      <DialogContent className={classes.dialog}>
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
          className={classes.input}
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
          className={classes.input}
        />
        <Button
          onClick={() => setFormType('recovery')}
          className={classes.passwordForgot}
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
        <Typography variant="body2" align="center">
          Or
        </Typography>
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
        className={classes.unstyledButton}
        variant="text"
        size="small"
      >
        New here? Make an Account!
      </Button>
    </div>
  );
}

export default Login;
