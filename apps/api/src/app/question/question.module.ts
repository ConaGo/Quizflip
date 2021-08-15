import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionResolver } from './question.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { UserToQuestionStats } from './entities/userToQuestionStats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, UserToQuestionStats])],
  providers: [QuestionResolver, QuestionService],
})
export class QuestionModule {}
