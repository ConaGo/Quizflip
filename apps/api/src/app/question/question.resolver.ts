import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { QuestionService } from './question.service';
import { Question } from './entities/question.entity';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Resolver(() => Question)
export class QuestionResolver {
  constructor(
    private readonly questionService: QuestionService,
    private readonly userService: UserService
  ) {}

  @Query(() => [Question], { name: 'questions' })
  findAll() {
    return this.questionService.findAll();
  }

  @Query(() => Question, { name: 'question' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.questionService.findOne(id);
  }

  @Query(() => [String], { name: 'categories', nullable: true })
  findAllCategories() {
    return this.questionService.findAllCategories();
  }

  @Mutation(() => Question)
  createQuestion(@Args('input') createQuestionInput: CreateQuestionInput) {
    return this.questionService.create(createQuestionInput);
  }

  @Mutation(() => Question)
  updateQuestion(@Args('input') updateQuestionInput: UpdateQuestionInput) {
    return this.questionService.update(
      updateQuestionInput.id,
      updateQuestionInput
    );
  }

  @Mutation(() => String)
  async removeQuestion(@Args('id', { type: () => Int }) id: number) {
    const result = await this.questionService.remove(id);
    return `deleted question with id:$ {id} with the following result: ${result}`;
  }

  @Mutation(() => String)
  async removeAllQuestions() {
    return this.questionService.removeAll();
  }
}
