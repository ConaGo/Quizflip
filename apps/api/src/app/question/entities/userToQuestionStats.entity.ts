import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/user.entity';
import { Question } from './question.entity';

@Entity()
export class UserToQuestionStats {
  @PrimaryGeneratedColumn()
  public userToQuestionId!: number;

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
}
