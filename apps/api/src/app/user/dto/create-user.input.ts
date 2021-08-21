import { IsOptional, Length, MaxLength } from 'class-validator';
import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {

  @Field({ description: 'Unique e-mail | example: nest@js.com' })
  email: string;

}
