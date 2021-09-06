import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { classToPlain, Exclude, Expose } from 'class-transformer';
import { shuffle, merge } from 'lodash';
import { BaseEntity } from '../../typeorm/base.entity';
import { UserToQuestionStats } from './userToQuestionStats.entity';
import { User } from '../../user/entities/user.entity';
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
export class Question extends BaseEntity {
  @Field({
    description: 'Type of the question | example: "boolean" ',
  })
  @Column({ nullable: false })
  type: QuestionType;

  @Field(() => String, {
    description: 'Category of the Question | example: "Sports" ',
  })
  @Column({ nullable: false })
  category: string;

  @Field(() => [String], {
    nullable: true,
    description:
      'Optional tags that can be more granular than tags and correspond to a particular tag ( no commas allowed ) | example: "Board Games" ',
  })
  @Column({ type: 'text', array: true, nullable: true })
  tags?: string[];

  @Field()
  @Column({ nullable: false })
  difficulty: QuestionDifficulty;

  @Field()
  @Column({ nullable: false })
  question: string;

  @Exclude()
  @Column({
    nullable: false,
    type: 'text',
    array: true,
  })
  correctAnswers: string[];

  @Exclude()
  @Column({
    nullable: false,
    type: 'text',
    array: true,
  })
  incorrectAnswers: string[];

  @Expose()
  //Returns an array with all possible answers in random order
  get answers(): string[] {
    return shuffle(merge(this.correctAnswers, this.incorrectAnswers));
  }

  @Field()
  @Column({ default: 'english', nullable: false })
  language: Language;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((_type) => User)
  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  author: User;

  //this column gets set automatically by typorm for the ManyToOne user relationship
  //it is explicitly set in this entity to expose it for graphql-queries
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  authorId: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //@Field((_type) => UserToQuestionStats)
  userToQuestionStats: UserToQuestionStats;

  //This constructor is necessary for the Exclude decorator
  constructor(partial: Partial<Question>) {
    super({});
    Object.assign(this, partial);
  }
}
