import { Joi } from '../../joi.extensions';
import { LoginDto } from './login.dto';
import * as BaseJoi from 'joi';
import { passwordValidator } from './password.joi';
export const loginFormData = BaseJoi.object<LoginDto>({
  nameOrEmail: Joi.string().required().messages({
    'string.empty': 'please provide a username or e-mail',
  }),
  password: passwordValidator,
});
