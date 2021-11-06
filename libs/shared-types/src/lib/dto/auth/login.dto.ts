export interface LoginDto {
  readonly nameOrEmail: string;
  readonly password: string;
}
import { Joi } from '../../joi.extensions';
import * as BaseJoi from 'joi';
import { passwordValidator } from './password.joi';

export const loginFormValidator = BaseJoi.object<LoginDto>({
  nameOrEmail: Joi.string().required().messages({
    'string.empty': 'please provide a username or e-mail',
  }),
  password: passwordValidator,
});
