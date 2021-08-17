import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { classToPlain, Exclude } from 'class-transformer';
import { UserToQuestionStats } from './userToQuestionStats.entity';
import { User } from '../../user/user.entity';
type QuestionType = 'boolean' | 'multiple';
type QuestionDifficulty = 'easy' | 'medium' | 'hard';
type QuestionTag =
  | 'Sports'
  | 'Entertainment'
  | 'Animals'
  | 'Geography'
  | string;
type QuestionSubTagEntertainment =
  | 'Board Games'
  | 'Video Games'
  | 'Film'
  | string;
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
export class Question {
  @Field(() => Int, { description: 'Unique Identifier | example: 1' })
  @PrimaryGeneratedColumn()
  id: number;

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

  @Field()
  @Column()
  correctAnswer: string;

  @Field(() => [String])
  @Column({
    type: 'text',
    array: true,
  })
  incorrectAnswers: string[];

  @Field()
  @Column({ default: 'english' })
  language: Language;

  @Field((type) => Int)
  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  author: User;

  //This many to Many relationships holds stats about how often the user interacted and answered a particular question
  @OneToMany(
    () => UserToQuestionStats,
    (userToQuestionStats) => userToQuestionStats.user
  )
  public userToQuestionStats!: UserToQuestionStats[];
}
