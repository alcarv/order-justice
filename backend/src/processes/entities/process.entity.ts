import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { User } from '../../users/entities/user.entity';

export enum ProcessStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  WAITING_CLIENT = 'waiting_client',
  WAITING_COURT = 'waiting_court',
  WAITING_DOCUMENT = 'waiting_document',
  CLOSED = 'closed',
  ARCHIVED = 'archived'
}

export enum ProcessPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

@Entity('processes')
export class Process {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ProcessStatus,
    default: ProcessStatus.PENDING
  })
  status: ProcessStatus;

  @Column({
    type: 'enum',
    enum: ProcessPriority,
    default: ProcessPriority.MEDIUM
  })
  priority: ProcessPriority;

  @ManyToOne(() => Client, client => client.processes)
  client: Client;

  @ManyToMany(() => User)
  @JoinTable({ name: 'process_assignees' })
  assignedTo: User[];

  @ManyToOne(() => User)
  createdBy: User;

  @Column({ nullable: true })
  dueDate?: Date;

  @Column({ nullable: true })
  court?: string;

  @Column({ nullable: true })
  caseNumber?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}