import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  PrimaryColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthType } from '../../auth/dto/user.social.data';
import { classToPlain, Exclude } from 'class-transformer';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserToQuestionStats } from '../../question/entities/userToQuestionStats.entity';
import { BaseEntity } from '../../typeorm/base.entity';
import { User } from './user.entity';

@Entity('refreshTokenHashes')
@ObjectType({ description: 'hashed refreshtokens' })
export class RefreshTokenHash {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  tokenHash: string;

  @CreateDateColumn()
  created: Date;

  @ManyToOne(() => User, (user) => user.userToQuestionStats, {
    orphanedRowAction: 'delete',
  })
  public user!: User;
}
