import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Process } from '../../processes/entities/process.entity';
import { Contract } from '../../contracts/entities/contract.entity';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../companies/entities/company.entity';
import { CalendarReminder } from './calendar-reminder.entity';
import { CalendarRecurrence } from './calendar-recurrence.entity';

export enum CalendarEventType {
  DEADLINE = 'deadline',
  MEETING = 'meeting',
  COURT_HEARING = 'court_hearing',
  REMINDER = 'reminder',
  APPOINTMENT = 'appointment',
  OTHER = 'other'
}

export enum CalendarEventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

@Entity('calendar_events')
export class CalendarEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: CalendarEventType,
    default: CalendarEventType.REMINDER
  })
  type: CalendarEventType;

  @Column({
    type: 'enum',
    enum: CalendarEventPriority,
    default: CalendarEventPriority.MEDIUM
  })
  priority: CalendarEventPriority;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ default: false })
  allDay: boolean;

  @Column({ nullable: true })
  location?: string;

  @ManyToOne(() => Client, { nullable: true })
  client?: Client;

  @ManyToOne(() => Process, { nullable: true })
  process?: Process;

  @ManyToOne(() => Contract, { nullable: true })
  contract?: Contract;

  @ManyToOne(() => Company, company => company.id)
  company: Company;

  @ManyToOne(() => User)
  createdBy: User;

  @Column('text', { array: true, default: [] })
  attendees: string[];

  @Column({ default: '#3B82F6' })
  color: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @OneToMany(() => CalendarReminder, reminder => reminder.event)
  reminders: CalendarReminder[];

  @OneToMany(() => CalendarRecurrence, recurrence => recurrence.event)
  recurrence: CalendarRecurrence[];

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}