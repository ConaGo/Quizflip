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
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { merge, shuffle } from 'lodash';
import { SerializeOptions, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/graphQL-jwt-auth.guard';
import { CurrentUser } from '../decorators/graphQL-GetUser';

@Resolver(() => Question)
export class QuestionResolver {
  constructor(
    private readonly questionService: QuestionService,
    private readonly userService: UserService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ResolveField('answers', (_type) => [String])
  getAnswers(@Parent() question: Question): string[] {
    return shuffle(merge(question.correctAnswers, question.incorrectAnswers));
  }

  @Query(() => [Question], { name: 'questions' })
  findAll() {
    return this.questionService.findAll();
  }

  @Query(() => Boolean, { name: 'answerQuestion' })
  answerQuestion(
    @Args('id', { type: () => Int }) id: number,
    @Args('answers', { type: () => [String] }) answers: string[]
  ) {
    return this.questionService.check(id, answers);
  }

  @Query(() => Question, { name: 'question' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.questionService.findOne(id);
  }

  @Query(() => [String], { name: 'categories', nullable: true })
  findAllCategories() {
    return this.questionService.findAllCategories();
  }

  @UseGuards(GqlAuthGuard)
  @SerializeOptions({ groups: ['author'] })
  @Query(() => [Question], { name: 'userQuestions', nullable: true })
  getUserQuestions(@CurrentUser() user: User) {
    return this.questionService.findAllFromUser(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Question], { name: 'randomQuestions', nullable: true })
  getRandomQuestions(
    @Args('count', { type: () => Int }) count: number,
    @CurrentUser() user: User
  ) {
    return this.questionService.getRandomBatch(count);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Question)
  createQuestion(
    @CurrentUser() user: User,
    @Args('input') createQuestionInput: CreateQuestionInput
  ) {
    return this.questionService.create(createQuestionInput, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => [Question])
  createQuestions(
    @CurrentUser() user: User,
    @Args('input', { type: () => [CreateQuestionInput] })
    createQuestionInput: CreateQuestionInput[]
  ) {
    return this.questionService.createMany(createQuestionInput, user.id);
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
