import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  QuestionType,
  QuestionDifficulty,
  QuestionTag,
  QuestionSubTagEntertainment,
  QuestionSubTag,
  Language,
} from '../entities/question.entity';
export class CreateQuestionDto {
  @ApiProperty({
    example: 'boolean, multiple',
    description: 'Type of the question',
    required: true,
  })
  readonly type: QuestionType;

  @ApiProperty({
    example: 'Sports',
    description: 'At least one tag is needed to categorize the question',
    required: true,
  })
  readonly tags: QuestionTag[];

  @ApiProperty({
    example: 'Board Games',
    description:
      'Optional subtags that can be more granular than tags and correspond to a particular tag',
  })
  readonly subTags: QuestionSubTag[];

  @ApiProperty({
    example: 'easy',
    description: 'The percieved difficulty of this question',
    required: true,
  })
  readonly difficulty: QuestionDifficulty;

  @ApiProperty({
    example: [
      'How many times did Martina Navratilova win the Wimbledon Singles Champ...',
      'Snakes and Ladders was originally created in India?',
    ],
    description: 'The question to be solved',
    required: true,
  })
  readonly question: string;

  @ApiProperty({
    example: ['Nine', 'True'],
    required: true,
  })
  readonly correctAnswer: string;

  @ApiProperty({
    example: ['[ "Ten", "Seven", "Eight ]', '[ "False" ]'],
    required: true,
  })
  readonly incorrectAnswers: string[];

  @ApiProperty({
    example: 'german',
    description: 'Language of the question. Defaults to "english"',
  })
  readonly language: Language;
}
