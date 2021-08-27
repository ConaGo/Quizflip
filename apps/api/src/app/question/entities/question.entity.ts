import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { classToPlain, Exclude, Expose } from 'class-transformer';
import { shuffle, merge } from 'lodash';
import { BaseEntity } from '../../typeorm/base.entity';
import { UserToQuestionStats } from './userToQuestionStats.entity';
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
@ObjectType({ description: 'Multiple choice and true/false Questions' })
export class Question extends BaseEntity {
  @Field({
    description: 'Type of the question | example: "boolean" ',
  })
  @Column()
  type: QuestionType;

  @Field(() => [String], {
    description: 'Main Tags ( no commas allowed ) | example: "Sports" ',
  })
  @Column({ type: 'simple-array', nullable: true })
  tags: QuestionTag[];

  @Field(() => [String], {
    description:
      'Optional subtags that can be more granular than tags and correspond to a particular tag ( no commas allowed ) | example: "Board Games" ',
  })
  @Column({ type: 'simple-array', nullable: true })
  subTags?: QuestionSubTag[];

  @Field()
  @Column()
  difficulty: QuestionDifficulty;

  @Field()
  @Column()
  question: string;

  @Field(() => [String])
  @Exclude()
  @Column({
    type: 'text',
    array: true,
  })
  correctAnswers: [string];

  @Field(() => [String])
  @Exclude()
  @Column({
    type: 'text',
    array: true,
  })
  incorrectAnswers: string[];

  @Field()
  @Column({ default: 'english' })
  language: Language;

  @Field(() => [String])
  @Expose()
  //Returns an array with all possible answers in random order
  get answers(): string[] {
    return shuffle(merge(this.correctAnswers, this.incorrectAnswers));
  }

  @OneToMany(
    () => UserToQuestionStats,
    (userToQuestionStats) => userToQuestionStats.question
  )
  userToQuestionStats: UserToQuestionStats;
  //This constructor is necessary for the Exclude decorator
  constructor(partial: Partial<Question>) {
    super();
    Object.assign(this, partial);
  }
}
