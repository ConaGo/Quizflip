import Joi from '../joi.extensions';

export const signupFormData = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message('please provide a valid e-mail')
    .required()
    .messages({
      'string.empty': 'please provide an e-mail',
    }),
  name: Joi.profanity()
    .alphanum()
    .message('please use only numbers, letters and no whitspace')
    .min(3)
    .message('must be between 3 and 15 characters long')
    .max(30)
    .message('must be between 3 and 15 characters long')
    .required()
    .messages({
      'string.empty': 'please provide an username',
    }),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
    .messages({
      'string.empty': 'please provide an password',
    }),
  repeat_password: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .messages({
      'any.only': 'passwords are not matching',
      'any.required': 'please type in your password again',
    }),
});
