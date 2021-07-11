import React, { Dispatch, SetStateAction, useState } from 'react';
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

import { ILoginDto } from '@libs/shared-types';
import AuthButton from '@/components/auth/AuthButton';

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
export default function AuthModal({
  onClose,
  type,
  setType,
  open,
}: {
  onClose: () => void;
  type: string;
  setType?: Dispatch<SetStateAction<string>>;
  open?: boolean;
}) {
  const classes = useStyles();
  return (
    <div>
      <Dialog
        transitionDuration={1000}
        onClose={onClose}
        maxWidth="xs"
        open={open}
      >
        <LoginForm></LoginForm>
      </Dialog>
    </div>
  );
}
const AuthForm = (
  firstInputName,
  firstInputHandler,
  secondInputHandler,
  submitHandler
) => {
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
          onChange={firstInputHandler}
          margin="normal"
          id="email"
          label={firstInputName}
          type="email"
          fullWidth
        />
        <TextField
          onChange={secondInputHandler}
          margin="normal"
          id="password"
          label="Password"
          type="password"
          fullWidth
        />
        <AuthButton onClick={submitHandler}>Create Account</AuthButton>
        <Typography variant="body2" align="center">
          Or
        </Typography>
        <AuthButton type="github">Login with GitHub</AuthButton>
        <AuthButton href="http://localhost:3070/auth/google" type="google">
          Login with Google
        </AuthButton>
      </DialogContent>
      <Button className={classes.unstyledButton} variant="text" size="small">
        Already have an account?
      </Button>
    </div>
  );
};
const LoginForm = () => {
  const [loginDto, setLoginDto] = useState<ILoginDto>({
    nameOrEmail: '',
    password: '',
  });
  const handleNameOrEmailChange = (e) =>
    setLoginDto({ ...loginDto, nameOrEmail: e.target.value });
  const handlePasswordChange = (e) =>
    setLoginDto({ ...loginDto, password: e.target.value });
  const handleSubmit = () => {
    axios.post('http:localhost:3070/auth/login', loginDto);
  };
  return AuthForm(
    'Email or Username',
    handleNameOrEmailChange,
    handlePasswordChange,
    handleSubmit
  );
};
