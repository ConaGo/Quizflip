import { Dispatch, SetStateAction } from 'react';

export * from './dto/signup.dto';
export { signupFormData } from './dto/signup';
export * from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

export type DTO = LoginDto | SignupDto;

export type Navigation = {
  navigate: (scene: string) => void;
};

export type FormType = 'login' | 'signup';
export interface NavButtonProps<T> {
  message: string;
  setType: Dispatch<SetStateAction<T>>;
  type: T;
}
