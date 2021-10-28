import * as BaseJoi from 'joi';
import { CustomHelpers } from 'joi';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Filter = require('bad-words');
//import { Filter } from 'bad-words';

const filter = new Filter();
export const Joi = BaseJoi.extend(profanity);
function profanity(joi: typeof BaseJoi) {
  return {
    type: 'profanity',
    base: joi.string(),
    messages: {
      'profanity.base': 'The profanity filter did not like that',
    },

    validate(value: string, helpers: CustomHelpers) {
      if (value !== filter.clean(value)) {
        return { value, errors: helpers.error('profanity.base') };
      } else return null;
    },
  };
}
