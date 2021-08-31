import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Question } from './question.entity';
import { User } from '../../user/entities/user.entity';
import { getRepository } from 'typeorm';
import { UserToQuestionStats } from './userToQuestionStats.entity';

export default class CreateStats implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const user = await factory(User)({ authType: 'local' }).create();
    const questionRepo = getRepository(Question);

    const questions = await questionRepo.find();
    questions.forEach((question) => {
      factory(UserToQuestionStats)({
        question: question,
        user: user,
      }).create();
    });
  }
}
