export * from './dto/signup.dto';
export * from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

export type DTO = LoginDto | SignupDto;

export type Navigation = {
  navigate: (scene: string) => void;
};
