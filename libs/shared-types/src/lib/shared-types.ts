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
} from './dto/question/question.dto';
export * from './dto/question/question.dto';
export { SignupDto, signupFormValidator } from './dto/auth/signup.dto';
export { LoginDto, loginFormValidator } from './dto/auth/login.dto';
export { RecoveryDto, recoveryFormValidator } from './dto/auth/recovery.dto';

import { QuestionDtos } from './dto/question/question.dto';
import { SignupDto } from './dto/auth/signup.dto';
import { LoginDto } from './dto/auth/login.dto';
import { RecoveryDto } from './dto/auth/recovery.dto';
export type DTO = LoginDto | SignupDto | RecoveryDto | QuestionDtos;

export type Navigation = {
  navigate: (scene: string) => void;
};

export type AuthFormType = 'login' | 'signup' | 'recovery';

export interface NavButtonProps<T> {
  message: string;
  setType: Dispatch<SetStateAction<T>>;
  type: T;
}
