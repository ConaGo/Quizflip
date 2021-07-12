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

import { LoginDto, SignupDto, DTO } from '@libs/shared-types';
import AuthButton from './AuthButton';

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
  //type,
  //setType,
  open,
}: {
  onClose: () => void;
  //type: string;
  //setType?: Dispatch<SetStateAction<string>>;
  open?: boolean;
}) {
  const [formType, setFormType] = useState<FormType>('login');
  return (
    <Dialog
      transitionDuration={1000}
      onClose={onClose}
      maxWidth="xs"
      open={open}
    >
      {formType === 'signup' && (
        <SignupForm formType={formType} setFormType={setFormType}></SignupForm>
      )}
      {formType === 'login' && (
        <LoginForm formType={formType} setFormType={setFormType}></LoginForm>
      )}
    </Dialog>
  );
}
type FormType = 'login' | 'signup';
interface RedirectButtonProps {
  message: string;
  setType: Dispatch<SetStateAction<FormType>>;
  type: FormType;
}
const AuthForm = (
  formType: FormType,
  handlers: Handler[],
  submitHandler: () => void,
  buttonMessage: string,
  redirect: RedirectButtonProps
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
        {handlers.map((v) => {
          return (
            <TextField
              key={v.name}
              onChange={v.handler}
              margin="normal"
              id={v.name}
              label={capitalize(v.name)}
              type={
                v.name === 'password' || v.name === 'email' ? v.name : 'text'
              }
              fullWidth
            />
          );
        })}
        <AuthButton onClick={submitHandler}>{buttonMessage}</AuthButton>
        <Typography variant="body2" align="center">
          Or
        </Typography>
        <AuthButton type="github">{formType} with GitHub</AuthButton>
        <AuthButton href="http://localhost:3070/auth/google" type="google">
          {formType} with Google
        </AuthButton>
      </DialogContent>
      <Button
        onClick={() => redirect.setType(redirect.type)}
        className={classes.unstyledButton}
        variant="text"
        size="small"
      >
        {redirect.message}
      </Button>
    </div>
  );
};
interface FormProps {
  formType: FormType;
  setFormType: Dispatch<SetStateAction<FormType>>;
}
const LoginForm = (props: FormProps) => {
  const [loginDto, setLoginDto] = useState<LoginDto>({
    nameOrEmail: '',
    password: '',
  });
  const handlers = getHandlers(loginDto, setLoginDto);
  handlers[0].name = 'username or email';
  const handleSubmit = () => {
    axios.post('http:localhost:3070/auth/login', loginDto);
  };

  const redirectButtonProps: RedirectButtonProps = {
    message: 'New here? Make an Account!',
    setType: props.setFormType,
    type: 'signup',
  };

  return AuthForm(
    props.formType,
    handlers,
    handleSubmit,
    'login',
    redirectButtonProps
  );
};

const SignupForm = (props: FormProps) => {
  const [signupDto, setSignupDto] = useState<SignupDto>({
    name: '',
    email: '',
    password: '',
  });
  const handlers = getHandlers(signupDto, setSignupDto);

  const handleSubmit = () => {
    axios.post('http:localhost:3070/auth/signup', signupDto);
  };

  const redirectButtonProps: RedirectButtonProps = {
    message: 'Already have an account?',
    setType: props.setFormType,
    type: 'login',
  };

  return AuthForm(
    props.formType,
    handlers,
    handleSubmit,
    'create account',
    redirectButtonProps
  );
};

interface Handler {
  handler: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
}
const getHandlers = (
  obj: DTO,
  setter: Dispatch<SetStateAction<DTO>>
): Handler[] => {
  const handlers = [];
  for (const [key, value] of Object.entries(obj)) {
    handlers.push({
      handler: getHandler(key, obj, setter),
      name: key,
    });
  }
  return handlers;
};
const getHandler = (
  name: string,
  obj: DTO,
  setter: Dispatch<SetStateAction<DTO>>
): ((e: ChangeEvent<HTMLInputElement>) => void) => {
  return (e) => setter({ ...obj, [name]: e.target.value });
};
const capitalize = (string: string): string => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};
