import { Dispatch, SetStateAction } from 'react';
export { Joi } from './joi.extensions';
export {
  createQuestionFormData,
  CreateQuestionDto,
  //QuestionType,
  AQuestionType,
  //QuestionDifficulty,
  AQuestionDifficulty,
  //Language,
  ALanguage,
} from './dto/question/create-question.dto';
export * from './dto/question/create-question.dto';
export { signupFormData } from './dto/auth/signup.joi';
export { loginFormData } from './dto/auth/login.joi';
export { recoveryFormData } from './dto/auth/recovery.joi';

import { CreateQuestionDto } from '..';
import { SignupDto } from './dto/auth/signup.dto';
import { LoginDto } from './dto/auth/login.dto';
import { RecoveryDto } from './dto/auth/recovery.dto';
export { RecoveryDto, LoginDto, SignupDto };
export type DTO = LoginDto | SignupDto | RecoveryDto | CreateQuestionDto;

export type Navigation = {
  navigate: (scene: string) => void;
};

export type FormType = 'login' | 'signup' | 'recovery';
export interface NavButtonProps<T> {
  message: string;
  setType: Dispatch<SetStateAction<T>>;
  type: T;
}
