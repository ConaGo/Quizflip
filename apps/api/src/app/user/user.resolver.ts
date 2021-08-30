import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { QuestionService } from '../question/question.service';
import { Question } from '../question/entities/question.entity';

import { User } from '../user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/graphQL-jwt-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  findAllUsers() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findUserById(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOneById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async removeUserById(@Args('id', { type: () => Int }) id: number) {
    const result = await this.userService.remove(id);
    return `deleted user with id:${id} with the following result: ${result}`;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async removeUserByEmail(@Args('email') email: string) {
    const result = await this.userService.removeOneByEmail(email);
    return `deleted user with email:${email} with the following result: ${result}`;
  }
}
