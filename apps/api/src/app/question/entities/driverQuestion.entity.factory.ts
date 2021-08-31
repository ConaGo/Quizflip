import { Question } from './question.entity';
import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { DriverQuestion } from './driverQuestion.entity';

define(DriverQuestion, (faker: typeof Faker, context: { question }) => {
  return new DriverQuestion(context.question);
});
