import * as BaseJoi from 'joi';
import * as Filter from 'bad-words';

const filter = new Filter();
export const Joi = BaseJoi.extend(profanity);
function profanity(joi) {
  return {
    type: 'profanity',
    base: joi.string(),
    messages: {
      'profanity.base': 'The profanity filter did not like that',
    },

    validate(value, helpers) {
      if (value !== filter.clean(value)) {
        return { value, errors: helpers.error('profanity.base') };
      }
    },
  };
}
