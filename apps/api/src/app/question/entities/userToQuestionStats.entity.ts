import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../typeorm/base.entity';
import { User } from '../../user/entities/user.entity';
import { Question } from './question.entity';

@Entity()
export class UserToQuestionStats extends BaseEntity {
  @Column()
  public questionId!: number;

  @Column()
  public userId!: number;

  @Column({ default: 0 })
  public answeredCorrect!: number;

  @Column({ default: 0 })
  public answeredIncorrect!: number;

  @ManyToOne(() => Question, (question) => question.userToQuestionStats)
  public question!: Question;

  @ManyToOne(() => User, (user) => user.userToQuestionStats)
  public user!: User;

  //This constructor is necessary for the Exclude decorator
  constructor(partial: Partial<UserToQuestionStats>) {
    super({});
    Object.assign(this, partial);
  }
}
