import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@ObjectType({ description: 'BaseEntity' })
export abstract class BaseEntity {
  @Field(() => Int, { description: 'Unique Identifier | example: 1' })
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @CreateDateColumn()
  created: Date;

  @Exclude()
  @UpdateDateColumn()
  updated: Date;

  @Exclude()
  @DeleteDateColumn()
  deleted: Date;

  constructor(partial: Partial<BaseEntity>) {
    Object.assign(this, partial);
  }
}
