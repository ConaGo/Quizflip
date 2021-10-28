import { Dispatch, SetStateAction, ChangeEvent } from 'react';

import { createStyles, makeStyles } from '@mui/styles';
import { Button, DialogContent, TextField } from '@mui/material';

import { FormType, signupFormData } from '@libs/shared-types';
import { AuthButton } from './AuthButton';
import { useFormAuth } from '../hooks/useFormAuth';

const useStyles = makeStyles((theme) =>
  createStyles({
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
    dialog: {
      overflow: 'visible',
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
  } = useFormAuth(
    {
      email: '',
      name: '',
      password: '',
    },
    signupFormData,
    'signup'
  );
  const classes = useStyles();
  return (
    <div className={classes.container}>
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
        <AuthButton
          isLoading={isLoading}
          isSuccess={isSuccess}
          isFailed={isFailed}
          onClick={onSubmit}
        >
          Register
        </AuthButton>
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
