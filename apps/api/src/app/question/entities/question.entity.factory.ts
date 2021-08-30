import { Question } from './question.entity';
import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { CreateQuestionDto } from '@libs/shared-types';

define(Question, (
  faker: typeof Faker,
  context: { question: CreateQuestionDto }
) => {
  return new Question(context.question);
});
