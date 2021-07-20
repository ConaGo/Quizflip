import Joi from '../joi.extensions';

export const loginFormData = Joi.object({
  nameOrEmail: [
    Joi.string()
      .email({ tlds: { allow: false } })
      .message('please provide a valid e-mail'),
    Joi.string()
      .alphanum()
      .message('please use only numbers, letters and no whitspace')
      .min(3)
      .message('must be between 3 and 15 characters long')
      .max(30)
      .message('must be between 3 and 15 characters long'),
  ].message('try again'),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
    .messages({
      'string.empty': 'please provide a password',
    }),
});
