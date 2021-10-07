import React, { Dispatch, SetStateAction, useState, ChangeEvent } from 'react';
import axios from 'axios';

import { createStyles, makeStyles } from '@libs/mui/styles';
import {
  Button,
  Typography,
  DialogContent,
  DialogTitle,
  TextField,
} from '@libs/mui';

import {
  LoginDto,
  SignupDto,
  DTO,
  NavButtonProps,
  FormType,
  signupFormData,
} from '@libs/shared-types';
import { AuthButton } from '../button/AuthButton';

import { useForm } from '../../hooks/useForm';
const useStyles = makeStyles((theme) =>
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
    //position error field
    input: {
      '& p': {
        position: 'absolute',
        bottom: '-1.3em',
      },
      marginBottom: '1.2em',
    },
  })
);
export interface SignupProps {
  setFormType: Dispatch<SetStateAction<FormType>>;
}

export function Signup({ setFormType }: SignupProps) {
  const {
    isFailed,
    isSuccess,
    isLoading,
    handlers,
    onSubmit,
    errors,
  } = useForm(
    {
      email: '',
      name: '',
      password: '',
    },
    signupFormData,
    'auth/signup',
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
          key="email"
          onChange={
            handlers.email as (e: ChangeEvent<HTMLInputElement>) => void
          }
          margin="normal"
          id="email"
          label="E-mail"
          type="text"
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          className={classes.input}
        />
        <TextField
          variant="outlined"
          key="name"
          onChange={handlers.name as (e: ChangeEvent<HTMLInputElement>) => void}
          margin="normal"
          id="name"
          label="Username"
          type="text"
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
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
        <AuthButton
          isLoading={isLoading}
          isSuccess={isSuccess}
          isFailed={isFailed}
          onClick={onSubmit}
        >
          Register
        </AuthButton>
        <Typography variant="body2" align="center">
          Or
        </Typography>
        <AuthButton
          href="http://localhost:3070/auth/github"
          socialType="github"
        >
          Register with GitHub
        </AuthButton>
        <AuthButton
          href="http://localhost:3070/auth/google"
          socialType="google"
        >
          Register with Google
        </AuthButton>
      </DialogContent>
      <Button
        onClick={() => setFormType('login')}
        className={classes.unstyledButton}
        variant="text"
        size="small"
      >
        Already have an account?
      </Button>
    </div>
  );
}

export default Signup;
