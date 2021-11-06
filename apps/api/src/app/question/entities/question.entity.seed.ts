import * as fs from 'fs';

import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Question } from './question.entity';
import { CreateQuestionDto } from '@libs/shared-types';
import { User } from '../../user/entities/user.entity';
const formatQuestion = (e, id) => {
  const tags = e.category.split(': ');

  const ret: CreateQuestionDto & { authorId: number } = {
    type: e.type,
    category: tags[0],
    tags: tags[1] ? [tags[1]] : [],
    difficulty: e.difficulty,
    question: e.question,
    correctAnswers: [e.correct_answer],
    incorrectAnswers: e.incorrect_answers,
    language: 'english',
    authorId: id,
  };
  return ret;
};
export default class CreateQuestion implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const data = JSON.parse(
      fs.readFileSync('./app/question/entities/question.json').toString()
    );

    const user = await factory(User)({
      authType: 'local',
      name: 'schubi',
      password: 'schubi',
    }).create();

    data.forEach((element) => {
      factory(Question)({
        question: formatQuestion(element, user.id),
      }).create();
    });
  }
}
