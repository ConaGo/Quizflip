import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { classToPlain, Exclude } from 'class-transformer';
type QuestionType = 'boolean' | 'multiple';
type QuestionDifficulty = 'easy' | 'medium' | 'hard';
type QuestionTag = 'Sports' | 'Entertainment' | 'Animals' | 'Geography';
type QuestionSubTagEntertainment = 'Board Games' | 'Video Games' | 'Film';
type QuestionSubTag = QuestionSubTagEntertainment;
type Language = 'english' | 'german';
export {
  QuestionType,
  QuestionDifficulty,
  QuestionTag,
  QuestionSubTagEntertainment,
  QuestionSubTag,
  Language,
};
@Entity('question')
export class Question {
  @ApiProperty({ example: 1, description: 'Unique Identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'boolean',
    description: 'Type of the question',
  })
  @Column()
  type: QuestionType;

  @ApiProperty({
    example: 'Sports',
    description: 'Type of the question',
  })
  @Column('simple-array')
  tags: QuestionTag[];

  @ApiProperty({
    example: 'Board Games',
    description:
      'Optional subtags that can be more granular than tags and correspond to a particular tag',
  })
  @Column({ type: 'simple-array', nullable: true })
  subTags: QuestionSubTag[];

  @Column()
  difficulty: QuestionDifficulty;

  @Column()
  question: string;

  @Exclude()
  @Column()
  correctAnswer: string;

  @Exclude()
  @Column({
    type: 'text',
    array: true,
  })
  incorrectAnswers: string[];

  @Column({ default: 'english' })
  language: Language;

  toJSON() {
    return;
  }
}
