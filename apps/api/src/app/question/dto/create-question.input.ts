import { IsOptional, Length, MaxLength } from 'class-validator';
import { InputType, Int, Field } from '@nestjs/graphql';
import {
  Language,
  QuestionDifficulty,
  QuestionSubTag,
  QuestionTag,
  QuestionType,
} from '../entities/question.entity';

@InputType()
export class CreateQuestionInput {
  @Field(() => Int, { description: 'Unique Identifier | example: 1' })
  id: number;

  @Field(() => String, {
    description: 'Type of the question | examples: "boolean", "multiple" ',
  })
  readonly type: QuestionType;

  @Field(() => [String], {
    description:
      'At least one tag is needed to categorize the question ( no commas allowed ) | example: "Sports" ',
  })
  readonly tags: QuestionTag[];

  @IsOptional()
  @Field(() => [String], {
    nullable: true,
    description:
      'Optional subtags that can be more granular than tags and correspond to a particular tag ( no commas allowed ) | example: "Board Games" ',
  })
  readonly subTags?: QuestionSubTag[];

  @Field(() => String, {
    description: 'The percieved difficulty of this question',
  })
  readonly difficulty: QuestionDifficulty;

  @Field({
    description:
      'The question to be solved | examples: "How many times did Martina Navratilova win the Wimbledon Singles Champ...", "Snakes and Ladders was originally created in India?"',
  })
  readonly question: string;

  @Field({ description: 'examples: "Nine", "True"' })
  readonly correctAnswer: string;

  @Field(() => [String], {
    description:
      'An array of wrong answers | examples "[ "Ten", "Seven", "Eight ]", "[ "False" ]"',
  })
  readonly incorrectAnswers: string[];

  @Field(() => String, {
    description:
      'Language of the question. Defaults to "english" | example "german"',
  })
  readonly language: Language;
}
