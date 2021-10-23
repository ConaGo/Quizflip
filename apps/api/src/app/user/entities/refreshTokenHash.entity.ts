import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from './user.entity';

@Entity('refreshTokenHashes')
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
