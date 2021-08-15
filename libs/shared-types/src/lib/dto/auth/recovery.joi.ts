import Joi from '../../joi.extensions';

export const recoveryFormData = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message('please provide a valid e-mail')
    .required()
    .messages({
      'string.empty': 'please provide an e-mail',
    }),
});
