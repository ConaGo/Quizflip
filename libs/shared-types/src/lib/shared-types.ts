import { Dispatch, SetStateAction } from 'react';

export { signupFormData } from './dto/signup.joi';
export { loginFormData } from './dto/login.joi';
export { recoveryFormData } from './dto/recovery.joi';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RecoveryDto } from './dto/recovery.dto';
export { RecoveryDto, LoginDto, SignupDto };
export type DTO = LoginDto | SignupDto | RecoveryDto;

export type Navigation = {
  navigate: (scene: string) => void;
};

export type FormType = 'login' | 'signup' | 'recovery';
export interface NavButtonProps<T> {
  message: string;
  setType: Dispatch<SetStateAction<T>>;
  type: T;
}
