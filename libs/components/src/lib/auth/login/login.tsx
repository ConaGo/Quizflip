import React, { Dispatch, SetStateAction, useState, ChangeEvent } from 'react';
import axios from 'axios';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Modal from '@material-ui/core/Modal';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';

import { FormType, loginFormData } from '@libs/shared-types';
import { AuthButton } from '../button/AuthButton';
import useForm from '../../hooks/useForm';
import { blue } from '@material-ui/core/colors';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      borderRadius: 20,
    },
    img: {
      maxHeight: 240,
      maxWidth: 520,
      alignSelf: 'center',
      overflow: 'hidden',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden',
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
  } = useForm(
    {
      nameOrEmail: '',
      password: '',
    },
    loginFormData,
    'login',
    'web'
  );
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <img alt={'books'} className={classes.img} src="book-small.jpg"></img>
      <DialogTitle id="form-dialog-title">
        <div>
          <Typography variant="h4" align="center">
            Welcome to LearnIt
          </Typography>
          <Typography variant="subtitle1" align="center">
            Learn and test your knowledge
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent>
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
          href="http://localhost:3070/auth/github"
          socialType="github"
        >
          Login with GitHub
        </AuthButton>
        <AuthButton
          href="http://localhost:3070/auth/google"
          socialType="google"
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
