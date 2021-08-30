import Joi from '../../joi.extensions';
import { LoginDto } from './login.dto';
import * as BaseJoi from 'joi';

export const loginFormData = BaseJoi.object<LoginDto>({
  nameOrEmail: Joi.string().required().messages({
    'string.empty': 'please provide a username or e-mail',
  }),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
    .messages({
      'string.empty': 'please provide a password',
    }),
});
