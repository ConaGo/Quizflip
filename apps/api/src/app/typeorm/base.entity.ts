import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
} from 'typeorm';

import * as t from '@nestjs/typeorm';
/**
 * Core fields of entity
 *
 * @export
 * @abstract
 * @class Core
 */
//TODO set as abstract class and inherit with all entities
export abstract class CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
