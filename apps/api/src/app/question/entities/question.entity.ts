import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
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
  @Column({ nullable: false })
  type: QuestionType;

  @Field(() => [String], {
    description: 'Category of the Question | example: "Sports" ',
  })
  @Column({ nullable: false })
  category: string;

  @Field(() => [String], {
    description:
      'Optional tags that can be more granular than tags and correspond to a particular tag ( no commas allowed ) | example: "Board Games" ',
  })
  @Column({ type: 'simple-array', nullable: true })
  tags?: QuestionSubTag[];

  @Field()
  @Column({ nullable: false })
  difficulty: QuestionDifficulty;

  @Field()
  @Column({ nullable: false })
  question: string;

  @Field()
  @Column({ nullable: false })
  correctAnswer: string;

  @Field(() => [String])
  @Column({
    type: 'text',
    array: true,
    nullable: false,
  })
  incorrectAnswers: string[];

  @Field()
  @Column({ default: 'english', nullable: false })
  language: Language;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  author: User;

  //this column gets set automatically by typorm for the ManyToOne user relationship
  //it is explicitly set in this entity to expose it for graphql-queries
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  authorId: number;

  //This many to Many relationships holds stats about how often the user interacted and answered a particular question
  @OneToMany(
    () => UserToQuestionStats,
    (userToQuestionStats) => userToQuestionStats.user
  )
  public userToQuestionStats!: UserToQuestionStats[];
}
