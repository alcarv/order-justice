import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Process } from './process.entity';
import { User } from '../../users/entities/user.entity';

export enum ActivityType {
  NOTE = 'note',
  STATUS_CHANGE = 'status_change',
  DOCUMENT_ADDED = 'document_added',
  ASSIGNMENT_CHANGE = 'assignment_change'
}

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Process, process => process.activities)
  process: Process;

  @Column({
    type: 'enum',
    enum: ActivityType
  })
  type: ActivityType;

  @Column('text')
  description: string;

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;
}