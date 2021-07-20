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

import {
  LoginDto,
  SignupDto,
  DTO,
  NavButtonProps,
  FormType,
} from '@libs/shared-types';
import AuthButton from '../button/AuthButton';
import useForm from '../useForm';
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
  })
);
export interface SignupProps {
  setFormType: Dispatch<SetStateAction<FormType>>;
}

export function Signup({ setFormType }: SignupProps) {
  const { handlers, onSubmit, errors } = useForm(
    {
      email: '',
      name: '',
      password: '',
    },
    'signup',
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
        />
        <TextField
          key="name"
          onChange={handlers.name as (e: ChangeEvent<HTMLInputElement>) => void}
          margin="normal"
          id="name"
          label="Username"
          type="text"
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
        />
        <TextField
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
        <AuthButton onClick={onSubmit}>Register</AuthButton>
        <Typography variant="body2" align="center">
          Or
        </Typography>
        <AuthButton socialType="github">Register with GitHub</AuthButton>
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
        New here? Make an Account!
      </Button>
    </div>
  );
}

export default Signup;
