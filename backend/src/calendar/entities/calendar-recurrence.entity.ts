import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { CalendarEvent } from './calendar-event.entity';

export enum CalendarRecurrenceType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

@Entity('calendar_recurrence')
export class CalendarRecurrence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CalendarEvent, event => event.recurrence)
  event: CalendarEvent;

  @Column({
    type: 'enum',
    enum: CalendarRecurrenceType
  })
  type: CalendarRecurrenceType;

  @Column({ default: 1 })
  intervalValue: number;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ nullable: true })
  count?: number;

  @Column('int', { array: true, nullable: true })
  daysOfWeek?: number[];

  @Column({ nullable: true })
  dayOfMonth?: number;

  @CreateDateColumn()
  createdAt: Date;
}