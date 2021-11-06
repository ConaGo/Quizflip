import { Joi } from '../../joi.extensions';
import { passwordValidator } from './password.joi';

export interface SignupDto {
  readonly email: string;
  readonly name: string;
  readonly password: string;
}

export const signupFormValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message('please provide a valid e-mail')
    .required()
    .messages({
      'string.empty': 'please provide an e-mail',
    }),
  name: Joi.profanity()
    .pattern(new RegExp('^[a-zA-Z0-9_. ]{3,30}$'))
    .message('please use only numbers, letters and . or _ ')
    .min(3)
    .message('must be between 3 and 15 characters long')
    .max(30)
    .message('must be between 3 and 15 characters long')
    .required()
    .messages({
      'string.empty': 'please provide a username',
    }),
  password: passwordValidator,
  /*   repeat_password: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .messages({
      'any.only': 'passwords are not matching',
      'any.required': 'please type in your password again',
    }), */
});
