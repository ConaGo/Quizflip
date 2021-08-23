import { InputType, Int, Field } from '@nestjs/graphql';
import {
  Language,
  QuestionDifficulty,
  QuestionType,
} from '../entities/question.entity';

@InputType()
export class CreateQuestionInput {
  @Field(() => String, {
    description: 'Type of the question | examples: "boolean", "multiple" ',
  })
  readonly type: QuestionType;

  @Field({
    description: 'The category for this question | example: "Sports" ',
  })
  readonly category: string;

  @Field(() => [String], {
    nullable: true,
    description:
      'Optional tags that can be more granular than the category ( no commas allowed ) | example: "Board Games" ',
  })
  readonly tags?: string[];

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

  @Field(() => Int)
  readonly authorId: number;
}
