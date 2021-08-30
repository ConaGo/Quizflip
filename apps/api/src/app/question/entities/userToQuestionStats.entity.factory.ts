import { Question } from './question.entity';
import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { UserToQuestionStats } from './userToQuestionStats.entity';
import { User } from '../../user/entities/user.entity';

define(UserToQuestionStats, (
  faker: typeof Faker,
  context: { question: Question; user: User }
) => {
  const stats = {
    userId: context.user.id,
    questionId: context.question.id,
    answeredCorrect: getRandomInt(3),
    answeredIncorrect: getRandomInt(10),
    question: context.question,
    user: context.user,
  };

  return new UserToQuestionStats(stats);
});

function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}
