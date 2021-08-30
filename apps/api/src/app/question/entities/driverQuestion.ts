import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { Question } from './question.entity';
type DriveQuestionType = 'image' | 'video' | 'simple';
@Entity('question')
@ObjectType({ description: 'Multiple choice and true/false Questions' })
export class DriverQuestion extends Question {
  @Field(() => String, {
    description: 'type of the question | example: image | video | simple ',
  })
  @Column({ nullable: true })
  driverQuestionType: DriveQuestionType;

  @Field(() => String, { description: 'path to the static file' })
  @Column({ nullable: true })
  mediaPath: string;
}
