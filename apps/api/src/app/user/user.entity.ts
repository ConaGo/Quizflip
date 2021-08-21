import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthType } from '../auth/dto/user.social.data';
import { classToPlain, Exclude } from 'class-transformer';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserToQuestionStats } from '../question/entities/userToQuestionStats.entity';

@Entity('user')
@ObjectType({ description: 'Multiple choice and true/false Questions' })
export class User {
  @ApiProperty({ example: 1, description: 'Entity-Unique Identifier' })
  @Field(() => Int, { description: 'Entity-Unique Identifier | example: 1' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'name@provider.com',
    description: 'Unique user-email',
  })
  @IsEmail()
  @Field({ description: 'Unique e-mail | example: nest@js.com' })
  @Column({ unique: true })
  email: string;

  @Length(3, 15)
  @Field()
  @Column()
  name: string;

  @Exclude()
  @Column({ default: '' })
  passwordHash: string;

  @Exclude()
  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  refreshTokenHashes: string[];

  @Exclude()
  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @Column({ type: 'varchar', default: 'local' })
  authType: AuthType;

  @Exclude()
  @Column({ default: '' })
  socialId: string;

  @OneToMany(
    () => UserToQuestionStats,
    (userToQuestionStats) => userToQuestionStats.user
  )
  public userToQuestionStats!: UserToQuestionStats;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return classToPlain(this);
  }
}
