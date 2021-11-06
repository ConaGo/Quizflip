import { Joi } from '../../joi.extensions';

export interface RecoveryDto {
  readonly email: string;
}

export const recoveryFormValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message('please provide a valid e-mail')
    .required()
    .messages({
      'string.empty': 'please provide an e-mail',
    }),
});
