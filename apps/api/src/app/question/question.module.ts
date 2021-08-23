import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionResolver } from './question.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { UserToQuestionStats } from './entities/userToQuestionStats.entity';
import { UserModule } from '../user/user.module';
import { LoggingPlugin } from '../graphql/logging.plugin';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, UserToQuestionStats]),
    UserModule,
  ],
  providers: [QuestionResolver, QuestionService, LoggingPlugin],
})
export class QuestionModule {}
