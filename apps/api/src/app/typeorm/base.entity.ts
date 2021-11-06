import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Exclude, Expose } from 'class-transformer';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Exclude()
@ObjectType({ description: 'BaseEntity' })
export abstract class BaseEntity {
  @Expose({ groups: ['author'] })
  @Field(() => Int, {
    description: 'Unique Identifier | example: 1',
    nullable: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @CreateDateColumn()
  created: Date;

  @Expose({ groups: ['author'] })
  @UpdateDateColumn()
  updated: Date;

  @Exclude()
  @DeleteDateColumn()
  deleted: Date;

  constructor(partial: Partial<BaseEntity>) {
    Object.assign(this, partial);
  }
}
