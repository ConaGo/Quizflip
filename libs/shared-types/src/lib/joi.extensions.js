import * as BaseJoi from 'joi';
import Filter from 'bad-words';

const filter = new Filter();
const Joi = BaseJoi.extend(profanity);
export default Joi;
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
