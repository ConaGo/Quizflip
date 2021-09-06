import * as Joi from 'joi';

export const passwordValidator = Joi.string()
  .pattern(new RegExp('^[a-zA-Z0-9_]{3,30}$'))
  .required()
  .messages({
    'string.empty': 'please provide a password',
  });
